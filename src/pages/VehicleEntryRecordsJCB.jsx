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
  getVehicleImageByTypeURl,
  saveVehicleEntry,
} from "../services/VehicleEntryService";
import { error } from "highcharts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Container,
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

const VehicleEntryRecordsJCB = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState([]);
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
  useEffect(() => {
    getVehicleEntry()
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
          onClick={() => {
            navigate("/vehicle-entry");
          }}
          style={{backgroundColor:"#78C2AD"}}
        >
          Add New
        </Button>
      </Stack>
      <TableContainer
        className="position-relative"
        style={filteredRows.length == 0 ? { minHeight: "380px" } : {}}
      >
        <Table size="small">
          <TableHead style={{ backgroundColor: "#205072", color: "white" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  align="center"
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell style={{ color: "white" }} align="center">
                Actions
              </TableCell>
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
                  <TableCell key={column.id}>{row[column.id]}</TableCell>
                ))}
                <TableCell className="">
                  <Tooltip title="View">
                    <Button onClick={() => handleOpen(row)}>
                      <Visibility />
                    </Button>
                  </Tooltip>

                  {/* Tooltip for AccessTime button */}
                  <Tooltip title="Time Out">
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
                        JCB or HYDRA Details
                      </DialogTitle>
                      <Cancel
                        onClick={handleClose}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <DialogContent>
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
                      <DialogContentText>
                        <strong>Gate Pass No:</strong> {driverData.gatePassNo}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Site:</strong> {driverData.site}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Out Time:</strong> {driverData.outTime}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Out Date:</strong> {driverData.outDate}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Selected Option:</strong>{" "}
                        {driverData.selectedOption}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Hydra Capacity:</strong>{" "}
                        {driverData.hydraCapacity}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Owner Bank Account:</strong>{" "}
                        {driverData.ownerBankAccount}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Owner Phone:</strong> {driverData.ownerPhone}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Justification:</strong>{" "}
                        {driverData.justification}
                      </DialogContentText>
                      <DialogContentText>
                        <strong>Entered By:</strong> {driverData.enteredBy}
                      </DialogContentText>

                      {/* React Bootstrap Carousel */}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Close
                      </Button>
                    </DialogActions>
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

export default VehicleEntryRecordsJCB;
