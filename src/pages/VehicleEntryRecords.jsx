import { AccessTime, Cancel, Visibility } from "@mui/icons-material";
import { Skeleton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Carousel,
  Container,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import {
  getVehicle2Entry,
  getVehicleImageByNameURl,
  saveVehicleEntry2,
} from "../services/VehicleEntryService";
import { checkAccess } from "../auth/HelperAuth";
import VehicleEntryTable from "../components/VehicleEntryTable";

const columns = [
  { id: "purpose", label: "Purpose" },
  // { id: "dated", label: "Dated" },
  { id: "documentType", label: "Document Type" },
  { id: "vehicleNumber", label: "Vehicle Number" },
  { id: "vendorName", label: "Vendor Name" },
  { id: "vehicleType", label: "Vehicle Type" },
  { id: "dateOfEntry", label: "Date of Entry" },
  // { id: "dayOfEntry", label: "Day of Entry" },
  // { id: "timeOfEntry", label: "Time of Entry" },
  { id: "dateOfExit", label: "Date of Exit" },
  // { id: "dayOfExit", label: "Day of Exit" },
  // { id: "timeOfExit", label: "Time of Exit" },
];

const VehicleEntryRecords = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState([]);
  useEffect(() => {
    getVehicle2Entry()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        toast.error("Internal Server Error");
      });
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [open, setOpen] = React.useState(false);
  const [driverData, setDriverData] = useState([]);
  const handleOpen = (ddata) => {
    setDriverData(ddata);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImgLoading(true);
    setSelectedImageIndex(0);
  };
  const [imgLoading, setImgLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageIndex1, setSelectedImageIndex1] = useState(0);
  const [selectedImageIndex2, setSelectedImageIndex2] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setSelectedImageIndex(selectedIndex);
  };
  const handleSelect1 = (selectedIndex, e) => {
    setSelectedImageIndex1(selectedIndex);
  };
  const handleSelect2 = (selectedIndex, e) => {
    setSelectedImageIndex2(selectedIndex);
  };
  const handleImageLoad = () => {
    setImgLoading(false); // Set loading state to false when the image is loaded
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const handleSearch1 = (e) => {
    setSearchTerm1(e.target.value.toLowerCase());
  };

  const handleSort = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === "asc";
    setSortColumn(columnId);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const sortedRows = [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return (sortDirection === "asc" ? 1 : -1) * aValue?.localeCompare(bValue);
  });

  const filteredRows = sortedRows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString()?.toLowerCase()?.includes(searchTerm)
    )
  );
  const filteredRows1 = sortedRows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString()?.toLowerCase()?.includes(searchTerm1)
    )
  );
  const timeOut = (formData) => {
    const currentDate = new Date();
    // Format the time as "00:31:31"
    const formattedTime = currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    // Format the date as "YYYY-MM-DD"
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Set formData.outTime and formData.outDate
    formData.timeOfExit = formattedTime;
    formData.dateOfExit = formattedDate;
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    formData.dayOfExit = days[currentDate.getDay()];
    saveVehicleEntry2(formData)
      .then((res) => {
        toast.success("outtime updated");
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };

  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  return userContext.isLogin ? (
    <>
      <Card className="m-3">
        <h5 className="ms-4 mt-1 fw-bold">Live Vehicle</h5>
        <div className="d-flex justify-content-between align-items-center p-2">
          <TextField
            inputProps={{ style: { textTransform: "uppercase" } }}
            label="Search"
            variant="outlined"
            onChange={handleSearch1}
          />
          {checkAccess("Vehicle Entry Records", "canWrite") && (
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#78C2AD" }}
              onClick={() => {
                navigate("/vehicle-entry-form");
              }}
            >
              Add New
            </Button>
          )}
        </div>
        <div
          className="position-relative"
          style={filteredRows.length == 0 ? { minHeight: "380px" } : {}}
        >
          <div>
            <VehicleEntryTable
              columns={columns}
              filteredRows={filteredRows1.filter((data) => {
                if (!data.dateOfExit) {
                  return data;
                }
              })}
              rowsPerPage={rowsPerPage}
              handleClose={handleClose}
              selectedImageIndex={selectedImageIndex}
              handleSelect={handleSelect}
              imgLoading={imgLoading}
              driverData={driverData}
              open={open}
              handleOpen={handleOpen}
              timeOut={timeOut}
              handleImageLoad={handleImageLoad}
              handleSort={handleSort}
              setData={setData}
            />
          </div>
        </div>
      </Card>
      <Card className="m-3">
        <h5 className="ms-4 mt-1 fw-bold">Past Vehicle</h5>
        <div className="d-flex justify-content-between align-items-center p-2">
          <TextField
            inputProps={{ style: { textTransform: "uppercase" } }}
            label="Search"
            variant="outlined"
            onChange={handleSearch}
          />
          {checkAccess("Vehicle Entry Records", "canWrite") && (
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#78C2AD" }}
              onClick={() => {
                navigate("/vehicle-entry-form");
              }}
            >
              Add New
            </Button>
          )}
        </div>
        <div
          className="position-relative mt-5"
          style={filteredRows.length == 0 ? { minHeight: "380px" } : {}}
        >
          <div>
            <VehicleEntryTable
              columns={columns}
              filteredRows={filteredRows.filter((data) => {
                if (data.dateOfExit) {
                  return data;
                }
              })}
              rowsPerPage={rowsPerPage}
              handleClose={handleClose}
              selectedImageIndex={selectedImageIndex}
              handleSelect={handleSelect}
              imgLoading={imgLoading}
              driverData={driverData}
              open={open}
              handleOpen={handleOpen}
              timeOut={timeOut}
              handleImageLoad={handleImageLoad}
              handleSort={handleSort}
              setData={setData}
            />
          </div>
        </div>
        
      </Card>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default React.memo(VehicleEntryRecords);
