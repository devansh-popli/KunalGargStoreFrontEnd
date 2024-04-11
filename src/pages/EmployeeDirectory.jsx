import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Preview } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  Button,
  Card,
  Container,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import useJwtChecker from "../helper/useJwtChecker";
import {
  getEmployeeDataFromBackend,
  getEmployeeImageByTypeURl,
} from "../services/EmployeeDataService";
import EmployeeEnrollmentForm from "./EmployeeEnrollmentForm";
import { checkAccess } from "../auth/HelperAuth";
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

  const handleChangePage = (newPage) => {
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
    console.error("Error loading image for employee with ID:" + id);

    // Set a default/static image when there's an error
    if (imageRef.current) {
      imageRef.current.src = "../../user.jpg";
    }
  };
  const [imageSrc, setImageSrc] = useState(null);
  const userContext = useContext(UserContext);
  const imageRef = useRef(null);
  const jetChecker = useJwtChecker();
  return userContext.isLogin ? (
    <Container className="mt-3">
      <h4 className="fw-bold">Employee Directory</h4>
      <Card className="" style={{ borderRadius: "10px" }}>
        <div className="d-flex justify-content-between align-items-center p-2">
          <TextField
            inputProps={{ style: { textTransform: "uppercase" } }}
            label="Search"
            className=""
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
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
          {checkAccess("Employee Directory", "canWrite") && (
            <Button
              as={Link}
              to="/employee-form"
              style={{
                backgroundColor: "#78C2AD",
                textDecoration: "none",
                fontSize: "11px",
                width: "90px",
                color: "white",
              }}
              size="small"
              variant="contained"
            >
              Add New
            </Button>
          )}
        </div>
        <div className="position-relative" style={{ borderRadius: "10px" }}>
          <Table responsive 
            size="small"
            aria-label="a dense table"
            style={sortedEmployees()?.length <= 0 ? { minHeight: "380px" } : {}}
          >
            <thead>
              <tr>
                <th style={{ width: "12%" }} className="text-center ">
                  Profile Image
                </th>
                <th
                  onClick={() => handleSort("empCode")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Emp Code {getSortIcon("empCode")}
                </th>
                <th
                  onClick={() => handleSort("firstName")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Emp Name {getSortIcon("firstName")}
                </th>
                <th
                  onClick={() => handleSort("department")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Department {getSortIcon("department")}
                </th>
                <th
                  onClick={() => handleSort("designation")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Designation {getSortIcon("designation")}
                </th>
                <th
                  onClick={() => handleSort("phoneNumber")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Mobile No {getSortIcon("phoneNumber")}
                </th>
                <th
                  onClick={() => handleSort("cityTehsil")}
                  style={{ width: "15%", cursor: "pointer" }}
                >
                  Location {getSortIcon("cityTehsil")}
                </th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee, index) => (
                  <tr key={employee.id}>
                    <td className="text-center">
                      <img
                        height={30}
                        width={30}
                        className="rounded-circle"
                        style={{ backgroundPosition: "contain" }}
                        src={
                          imageSrc && imageSrc[employee.id]
                            ? imageSrc[employee.id]
                            : getEmployeeImageByTypeURl(
                                employee?.id,
                                "profileImage"
                              )
                        }
                        onError={() => {
                          setImageSrc((prevMap) => ({
                            ...prevMap,
                            [employee.id]: "../../user.jpg",
                          }));
                        }}
                        alt=""
                      />
                    </td>
                    <td>{employee.empCode}</td>
                    <td>{employee.firstName + " " + employee.lastName}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.phoneNumber}</td>
                    <td>{employee.cityTehsil}</td>
                    <td>
                      <div className="d-flex">
                        {checkAccess("Employee Directory", "canUpdate") && (
                          <Tooltip title="Edit employee">
                            <Button
                              onClick={() => handleOpen(employee)}
                              variant="outlined"
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                        )}
                        {checkAccess("Employee Directory", "canDelete") && (
                          <Tooltip title="View">
                            <Button
                              onClick={() => handleOpen(employee, true)}
                              variant="outlined"
                              data-tooltip-id="my-tooltip2"
                              data-tooltip-content="View Employee"
                            >
                              <Preview />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
            {sortedEmployees().length <= 0 && (
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
          </Table>

          <Pagination>
            <Pagination.Prev
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
            />

            {/* Assuming employees is an array and rowsPerPage is the number of items per page */}
            {Array.from({
              length: Math.ceil(employees.length / rowsPerPage),
            }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={page === index + 1}
                onClick={() => handleChangePage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handleChangePage(page + 1)}
              disabled={page === Math.floor(employees.length / rowsPerPage)}
            />
          </Pagination>
        </div>
        <Modal
          show={open}
          onHide={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="p-0 m-0"
        >
          <Card
            className="container-fluid"
            // style={{
            //   position: "absolute",
            //   top: "50%",
            //   left: "50%",
            //   transform: "translate(-50%, -50%)",
            //   width: 500,
            //   height: "70%",
            //   bgcolor: "background.paper",
            //   overflowY: "auto",
            //   borderRadius: "5px",
            //   padding: 0,
            // }}
          >
            <EmployeeEnrollmentForm
              readOnly={readOnly}
              handleClose={handleClose}
              setSelectedEmployee={setSelectedEmployee}
              selectedEmployee={selectedEmployee}
              paper={false}
            />
          </Card>
        </Modal>
      </Card>
    </Container>
  ) : (
    <Navigate to={"/login"} />
  );
});

export default React.memo(EmployeeDirectory);
