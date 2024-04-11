import { AccessTime, Cancel, Visibility } from "@mui/icons-material";
import { Skeleton, TextField, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import {
  Card,
  Carousel,
  Container,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getVehicleEntry,
  getVehicleImageByTypeURl,
  saveVehicleEntry,
} from "../services/VehicleEntryService";
import { checkAccess } from "../auth/HelperAuth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: 10,
  borderRadius: 10,
  p: 4,
};

const columns = [
  { id: "gatePassNo", label: "Gate Pass No" },
  { id: "site", label: "Site" },
  { id: "vehicleNumber", label: "Vehicle Number" },
  { id: "inTime", label: "In Time" },
  { id: "outTime", label: "Out Time" },
  { id: "inDate", label: "In Date" },
  { id: "outDate", label: "Out Date" },
  { id: "selectedOption", label: "Selected Option" },
  // { id: "hydraCapacity", label: "Hydra Capacity" },
  // { id: "ownerBankAccount", label: "Owner Bank Account" },
  // { id: "ownerPhone", label: "Owner Phone" },
  // { id: "justification", label: "Justification" },
  // { id: "enteredBy", label: "Entered By" },
];

const VehicleEntryRecordsJCB = ({searchTerm,setSearchTerm,filteredRows,sortColumn,setSortColumn,setSortDirection,sortDirection}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  


  const [driverData, setDriverData] = useState([]);
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
    formData.outTime = formattedTime;
    formData.outDate = formattedDate;
    saveVehicleEntry(formData)
      .then((res) => {
        toast.success("outtime updated");
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };


  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === "asc";
    setSortColumn(columnId);
    setSortDirection(isAsc ? "desc" : "asc");
  };


  const [open, setOpen] = React.useState(false);
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
  const navigate = useNavigate();
  return (
    <Card className="m-3">
      <div className="d-flex justify-content-between align-items-center p-2">
        <TextField
          inputProps={{ style: { textTransform: "uppercase" } }}
          label="Search"
          variant="outlined"
          onChange={handleSearch}
        />
        {checkAccess("JCB or HYDRA", "canWrite") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/vehicle-entry");
            }}
            style={{ backgroundColor: "#78C2AD" }}
          >
            Add New
          </Button>
        )}
      </div>
      <div
        className="position-relative"
        style={filteredRows.length == 0 ? { minHeight: "380px" } : {}}
      >
        <Table responsive  size="small">
          <thead style={{ backgroundColor: "#205072", color: "white" }}>
            <tr>
              {columns.map((column) => (
                <th
                  align="center"
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{ cursor: "pointer" }}
                >
                  {column.label}
                </th>
              ))}
              <th style={{}} align="center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredRows
            ).map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.id}>{row[column.id]}</td>
                ))}
                <td className="">
                  <Tooltip title="View">
                    <Button onClick={() => handleOpen(row)}>
                      <Visibility />
                    </Button>
                  </Tooltip>

                  {/* Tooltip for AccessTime button */}
                  {checkAccess("JCB or HYDRA", "canUpdate") && !row.outDate  &&(
                    <Tooltip title="Time Out">
                      <Button size="small" onClick={() => timeOut(row)}>
                        <small>
                          <AccessTime />
                        </small>
                      </Button>
                    </Tooltip>
                  )}
                </td>
                <Modal
                  show={open}
                  onHide={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Card className="p-2">
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-bold">JCB or HYDRA Details</h5>
                      <Cancel
                        onClick={handleClose}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <h6>
                      <Carousel
                        activeIndex={selectedImageIndex}
                        onSelect={handleSelect}
                        interval={null} // Disable automatic sliding
                      >
                        {imgLoading && (
                          <Carousel.Item>
                            <Skeleton
                              variant="rect"
                              width="100%"
                              height={200}
                              className="rounded"
                            />
                          </Carousel.Item>
                        )}
                        {driverData.photoUrl && (
                          <Carousel.Item>
                            <img
                              className="d-block w-100 rounded"
                              src={getVehicleImageByTypeURl(driverData.id)}
                              alt="Driver Document"
                              onLoad={handleImageLoad}
                            />
                          </Carousel.Item>
                        )}

                        {/* Add more items as needed */}
                      </Carousel>
                      <h6>
                        <strong>Gate Pass No:</strong> {driverData.gatePassNo}
                      </h6>
                      <h6>
                        <strong>Site:</strong> {driverData.site}
                      </h6>
                      <h6>
                        <strong>Out Time:</strong> {driverData.outTime}
                      </h6>
                      <h6>
                        <strong>Out Date:</strong> {driverData.outDate}
                      </h6>
                      <h6>
                        <strong>Selected Option:</strong>{" "}
                        {driverData.selectedOption}
                      </h6>
                      <h6>
                        <strong>Hydra Capacity:</strong>{" "}
                        {driverData.hydraCapacity}
                      </h6>
                      <h6>
                        <strong>Owner Bank Account:</strong>{" "}
                        {driverData.ownerBankAccount}
                      </h6>
                      <h6>
                        <strong>Owner Phone:</strong> {driverData.ownerPhone}
                      </h6>
                      <h6>
                        <strong>Justification:</strong>{" "}
                        {driverData.justification}
                      </h6>
                      <h6>
                        <strong>Entered By:</strong> {driverData.enteredBy}
                      </h6>

                      {/* React Bootstrap Carousel */}
                    </h6>
                    <div>
                      <Button onClick={handleClose} color="primary">
                        Close
                      </Button>
                    </div>
                  </Card>
                </Modal>
              </tr>
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
          </tbody>
        </Table>
      </div>
      <Pagination>
        <Pagination.Prev
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
        />

        {/* Assuming filteredRows is an array and rowsPerPage is the number of items per page */}
        {Array.from({
          length: Math.ceil(filteredRows.length / rowsPerPage),
        }).map((_, index) => (
          <Pagination.Item
            key={index}
            active={page === index}
            onClick={() => handleChangePage(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handleChangePage(page + 1)}
          disabled={
            page === Math.floor(filteredRows.length / rowsPerPage) ||
            filteredRows.length <= rowsPerPage
          }
        />
      </Pagination>
    </Card>
  );
};

export default React.memo(VehicleEntryRecordsJCB);
