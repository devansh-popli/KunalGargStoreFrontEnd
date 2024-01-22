import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  getVehicle2Entry,
  getVehicleEntry,
  getVehicleImageByNameURl,
  saveVehicleEntry,
  saveVehicleEntry2,
} from "../services/VehicleEntryService";
import { error } from "highcharts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { AccessTime, Cancel, Visibility } from "@mui/icons-material";
import { Carousel } from "react-bootstrap";

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
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState([]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth:400,
    maxWidth: 700,
    maxHeight: 650,
    overflowX:"hidden",
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: 10,
    borderRadius: 10,
    p: 4,
  };
  useEffect(() => {
    getVehicle2Entry()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        toast.error("Internal Server Error");
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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

  const handleSelect = (selectedIndex, e) => {
    setSelectedImageIndex(selectedIndex);
  };
  const handleImageLoad = () => {
    setImgLoading(false); // Set loading state to false when the image is loaded
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
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
  const excludedFields = [
    "documentNo",
    "vehicleDocument",
    "id",
    "driverDocument",
    "tuuAbo",
  ];
  const navigate = useNavigate();
  return (
    <Paper className="m-3">
      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <TextField label="Search" variant="outlined" onChange={handleSearch} />
        <Button
          variant="contained"
          color="primary"
          style={{backgroundColor:"#78C2AD"}}
          onClick={() => {
            navigate("/vehicle-entry-form");
          }}
        >
          Add New
        </Button>
      </Stack>
      <TableContainer className="position-relative">
        <Table
        aria-label="a dense table"
          size="small"
          style={filteredRows.length == 0 ? { minHeight: "380px" } : {}}
        >
          <TableHead style={{backgroundColor:"#205072",color:"white"}}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                align="start"
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{ cursor: "pointer",minWidth:"150px",color:"white"}}
                >
                  {column.label}
                  
                </TableCell>
              ))}
              <TableCell   style={{minWidth:"150px",color:"white"}} className="px-5">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredRows
            ).map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell  key={column.id}>{row[column.id]}</TableCell>
                ))}
                <TableCell className="w-100">
                  <Tooltip title="View" className="">
                    <Button onClick={() => handleOpen(row)}>
                      <Visibility />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Time Out" className="">
                    <Button size="small" onClick={() => timeOut(row)}>
                      <small>
                        <AccessTime />
                      </small>
                    </Button>
                  </Tooltip>
                </TableCell>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Paper style={style}>
                    <div className="d-flex justify-content-between">
                      <DialogTitle className="fw-bold">
                        Vehicle Details
                      </DialogTitle>
                      <Cancel
                        onClick={handleClose}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <DialogContentText>
                      <strong>Vehicle Document:</strong>
                    </DialogContentText>
                    <Carousel
                      data-bs-theme="dark"
                      indicators={false}
                      activeIndex={selectedImageIndex}
                      onSelect={handleSelect}
                      interval={null} // Disable automatic sliding
                    >
                      {imgLoading && (
                        <Skeleton variant="rect" width="100%" height={200} />
                      )}
                      {driverData?.vehicleDocument?.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            style={{ height: "150px", objectFit: "contain" }}
                            className={`w-100  d-block ${
                              imgLoading ? "d-none" : ""
                            }`}
                            src={getVehicleImageByNameURl(image)}
                            alt={`Vehicle Document ${index + 1}`}
                            onLoad={handleImageLoad}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>

                    {/* Driver Document Image Slider */}
                    <DialogContentText>
                      <strong>Driver Document:</strong>
                    </DialogContentText>
                    <Carousel
                      data-bs-theme="dark"
                      indicators={false}
                      activeIndex={selectedImageIndex}
                      onSelect={handleSelect}
                      interval={null} // Disable automatic sliding
                    >
                      {imgLoading && (
                        <Skeleton variant="rect" width="100%" height={200} />
                      )}
                      {driverData?.driverDocument?.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            style={{ height: "150px", objectFit: "contain" }}
                            className={`w-100 d-block ${
                              imgLoading ? "d-none" : ""
                            }`}
                            src={getVehicleImageByNameURl(image)}
                            alt={`Driver Document ${index + 1}`}
                            onLoad={handleImageLoad}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                    <DialogContent>
                      <div className="d-flex flex-wrap">
                        <div style={{ flex: 1, marginRight: "20px" }}>
                          {Object.entries(driverData)
                            .slice(0, 9)
                            .filter(([key]) => !excludedFields.includes(key))
                            .map(([key, value], index) => (
                              <div key={index} style={{ marginBottom: "10px" }}>
                                <strong>{key}:</strong>{" "}
                                {typeof value === "string"
                                  ? value
                                  : JSON.stringify(value)}
                              </div>
                            ))}
                        </div>
                        <div style={{ flex: 1 }}>
                          {Object.entries(driverData)
                            .slice(9, 15)
                            .filter(([key]) => !excludedFields.includes(key))
                            .map(([key, value], index) => (
                              <div key={index} style={{ marginBottom: "10px" }}>
                                <strong>{key}:</strong>{" "}
                                {typeof value === "string"
                                  ? value
                                  : JSON.stringify(value)}
                              </div>
                            ))}
                        </div>
                        <div style={{ flex: 1 }}>
                          {Object.entries(driverData)
                            .slice(15)
                            .filter(([key]) => !excludedFields.includes(key))
                            .map(([key, value], index) => (
                              <div key={index} style={{ marginBottom: "10px" }}>
                                <strong>{key}:</strong>{" "}
                                {typeof value === "string"
                                  ? value
                                  : JSON.stringify(value)}
                              </div>
                            ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Paper>
                </Modal>
              </TableRow>
            ))}
            {filteredRows.length <= 0 && (
              <Container>
                <img
                  src="../../noData.svg"
                  width={250}
                  height={250}
                  alt=""
                  className="position-absolute"
                  style={{
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </Container>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default VehicleEntryRecords;
