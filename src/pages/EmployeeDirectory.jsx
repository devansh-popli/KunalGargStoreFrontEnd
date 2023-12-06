import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import SearchIcon from "@mui/icons-material/Search";
import {
  getEmployeeDataFromBackend,
  getEmployeeImageByTypeURl,
} from "../services/EmployeeDataService";
import { toast } from "react-toastify";
import { Preview } from "@mui/icons-material";
import { Button } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import EmployeeEnrollmentForm from "./EmployeeEnrollmentForm";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort";
const EmployeeDirectory = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [oldemployees, setOldEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [readOnly, setReadOnly] = React.useState(false);

  const handleOpen = (employee, readOnly = false) => {
    if (readOnly) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    getEmployeeDataFromBackend(page, rowsPerPage)
      .then((data) => {
        setEmployees(data.content);
        setOldEmployees(data.content);
      })
      .catch((error) => {
        toast.error("Internal Server Error");
      });
  };
  useEffect(() => {
    getEmployeeDataFromBackend(page, rowsPerPage)
      .then((data) => {
        setEmployees(data.content);
        setOldEmployees(data.content);
      })
      .catch((error) => {
        toast.error("Internal Server Error");
      });
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const getSortIcon = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    }
    return <SortIcon />;
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = () => {
    if (!sortColumn) return employees;

    return [...employees].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortOrder === "asc") {
        return aValue
          ? aValue.localeCompare(bValue || "")
          : "".localeCompare(bValue || "");
      } else {
        return bValue
          ? bValue.localeCompare(aValue || "")
          : "".localeCompare(aValue || "");
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value !== "") {
      const filteredEmployees = oldemployees.filter((employee) =>
        Object.values(employee).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
      setEmployees(filteredEmployees);
    } else {
      setEmployees(oldemployees);
    }
  };
  const handleImageError = (id) => {
    console.error(
      "Error loading image for employee with ID:"+id
    );

    // Set a default/static image when there's an error
    if (imageRef.current) {
      imageRef.current.src = "../../user.jpg";
    }
  };
  const [imageSrc, setImageSrc] = useState(null);
  const userContext = useContext(UserContext);
  const imageRef = useRef(null);
  return userContext.isLogin ? (
    <Container className="mt-3">
      <h4 className="fw-bold">Employee Directory</h4>
      <TableContainer component={Paper}>
        <Table  size="small" aria-label="a dense table">
          <TableHead>
            <TextField
              label="Search"
              className="mx-4 w-100"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TableRow>
              <TableCell style={{ width: "8%" }} className="text-center">Profile Image</TableCell>
              <TableCell
                onClick={() => handleSort("empCode")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Emp Code {getSortIcon("empCode")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("firstName")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Emp Name {getSortIcon("firstName")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("department")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Department {getSortIcon("department")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("designation")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Designation {getSortIcon("designation")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("phoneNumber")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Mobile No {getSortIcon("phoneNumber")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("cityTehsil")}
                style={{ width: "15%", cursor: "pointer" }}
              >
                Location {getSortIcon("cityTehsil")}
              </TableCell>
              <TableCell style={{ width: "15%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmployees()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell className="text-center">
                    <img
                      height={30}
                      width={30}
                      className="rounded-circle"
                      style={{ backgroundPosition: "contain" }}
                      src={imageSrc && imageSrc[employee.id]? imageSrc[employee.id] : getEmployeeImageByTypeURl(
                        employee?.id,
                        "profileImage"
                      )}
                      onError={() => {
                        setImageSrc((prevMap) => ({
                          ...prevMap,
                          [employee.id]: '../../user.jpg',
                        }));
                      }}
                      alt=""
                    />
                  </TableCell>
                  <TableCell>{employee.empCode}</TableCell>
                  <TableCell>
                    {employee.firstName + " " + employee.lastName}
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.cityTehsil}</TableCell>
                  <TableCell>
                    <div className="d-flex">
                      <Button
                        onClick={() => handleOpen(employee)}
                        variant="outlined"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit Employee"
                      >
                        <EditIcon />
                      </Button>
                      <Tooltip
                        id="my-tooltip"
                        place="bottom"
                        type="info"
                        effect="solid"
                      />
                      <Button
                        onClick={() => handleOpen(employee, true)}
                        variant="outlined"
                        data-tooltip-id="my-tooltip2"
                        data-tooltip-content="View Employee"
                      >
                        <Preview />
                      </Button>
                      <Tooltip
                        id="my-tooltip2"
                        place="bottom"
                        type="info"
                        effect="solid"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="p-0 m-0"
      >
        <Paper
          className="container-fluid"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: "70%",
            bgcolor: "background.paper",
            overflowY: "auto",
            borderRadius: "5px",
            padding: 0,
          }}
        >
          <EmployeeEnrollmentForm
            readOnly={readOnly}
            handleClose={handleClose}
            setSelectedEmployee={setSelectedEmployee}
            selectedEmployee={selectedEmployee}
            paper={false}
          />
        </Paper>
      </Modal>
    </Container>
  ) : (
    <Navigate to={"/"} />
  );
});

export default EmployeeDirectory;
