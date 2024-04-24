import React, { useEffect, useState } from "react";
import { TextField, Button, Autocomplete, TableSortLabel } from "@mui/material";
import { privateAxios } from "../services/AxiosService";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import { toast } from "react-toastify";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";

import { Delete, Edit, Watch } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  deleteAttendanceDataByDateFromBackend,
  getAttendanceDataOfTodayFromBackend,
} from "../services/EmployeeDataService";
import EmployeeSearchBar from "../components/EmployeeSearchBar";
import { Table, Pagination, Row, Col } from "react-bootstrap";
import { checkAccess } from "../auth/HelperAuth";
const GatePassForm = ({ onResult }) => {
  const [gatePass, setGatePass] = useState({
    name: "",
    edin: "",
    dateIn: new Date().toISOString().slice(0, 10),
    dateOut: "",
    timeIn: new Date().toTimeString().slice(0, 5),
    timeOut: "",
    reason: "",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const filterOptions = (options, { inputValue }) => {
    // Customize this function based on your search logic
    return options.filter(
      (option) =>
        option.empCode.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.firstName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const handleChange = (e) => {
    setGatePass({ ...gatePass, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    getEmployeeDataFromBackend()
      .then((data) => {
        setEmployees(data.content);
      })
      .catch((error) => {
        //        console.log("Internal Server Error while getting employees");
      });
  }, []);
  const isValidGatePass = (gatePass) => {
    const { name, edin, dateOut, timeOut, reason, dateIn, timeIn } = gatePass;
    const errors = {};

    if (selectedEmployee == null) errors.name = "Name is required";
    if (!edin.trim()) errors.edin = "EDIN is required";
    // if (!dateOut.trim()) errors.dateOut = "Date Out is required";
    // if (!timeOut.trim()) errors.timeOut = "Time Out is required";
    if (!reason.trim()) errors.reason = "Reason is required";

    // if (new Date(dateOut) < new Date(dateIn)) {
    //     errors.dateOut = "Date Out cannot be before Date In";
    // }

    // if (dateOut === dateIn && timeOut <= timeIn) {
    //     errors.timeOut = "Time Out should be later than Time In on the same day";
    // }

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = isValidGatePass(gatePass);
    if (Object.keys(errors).length > 0) {
      // Handle the display of error messages to the user
      Object.values(errors).map((error) => {
        toast.error(error);
      });
      // Optionally, set errors in state to display in the UI
      return;
    }
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const updatedGatePass = {
      ...gatePass,
      timeIn: currentTime,
      name: selectedEmployee.empCode,
    };
    try {
      await privateAxios
        .post("/api/gatepasses", updatedGatePass)
        .then((data) => {
          setAttendanceData((prev) => {
            prev.push(data.data);
            return prev;
          });
          toast.success("Saved successfully");
          setGatePass({
            name: "",
            edin: "",
            dateIn: new Date().toISOString().slice(0, 10),
            dateOut: "",
            timeIn: new Date().toTimeString().slice(0, 5),
            timeOut: "",
            reason: "",
          });
          setSelectedEmployee(null);
        });
    } catch (error) {
      onResult("Error saving the gate pass", "error");
    }
  };

  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showTotalHrs, setShowTotalHrs] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const indianTimeZone = "Asia/Kolkata";
  const [orderBy, setOrderBy] = useState("dateIn");
  const [order, setOrder] = useState("desc");
  const currentIndianDate = new Date()
    .toLocaleDateString("en-IN", { timeZone: indianTimeZone })
    .split("/")
    .reverse()
    .join("-");
  const userContext = useContext(UserContext);
  const [oldAttendance, setOldAttendance] = useState([]);
  useEffect(() => {
    try {
      privateAxios.get("/api/gatepasses").then((res) => {
        setAttendanceData(res.data);
        setOldAttendance(res.data);
      });
    } catch (error) {
      onResult("Error saving the gate pass", "error");
    }
  }, []);
  const [searchResults, setSearchResults] = useState([]);
  const handleEmployeeChange = async (searchTermN) => {
    // Perform your employee search logic here and update the searchResults state
    // For example, you can filter employees based on the search term
    // Replace this with your actual employee data and search logic
    if (searchTermN != "") {
      let filteredEmployees = [];
      let filteredAttendanceData = [];

      if (
        searchTermN.toLowerCase().includes("emp") ||
        !isNaN(searchTermN) ||
        searchTermN.includes("EMP")
      ) {
        // If the searchTerm starts with "EMP"
        filteredEmployees = employees.filter((employee) =>
          employee.empCode.toLowerCase().includes(searchTermN.toLowerCase())
        );
        //        console.log(filteredEmployees);
        // Filter attendanceData based on empCode from filteredEmployees
        filteredAttendanceData = oldAttendance.filter((data) =>
          filteredEmployees.some((employee) =>
            data.name.toLowerCase().includes(employee.empCode.toLowerCase())
          )
        );
      } else {
        // If the searchTerm doesn't start with "EMP"
        //        console.log(searchTermN);
        let filteredEmployees = await employees.filter((employee) =>
          (employee.firstName + " " + employee.lastName)
            .toLowerCase()
            .includes(searchTermN.toLowerCase())
        );
        filteredAttendanceData = oldAttendance.filter((data) =>
          filteredEmployees.some((employee) =>
            data.name.toLowerCase().includes(employee.empCode.toLowerCase())
          )
        );
      }
      setAttendanceData(filteredAttendanceData);
    } else {
      setSearchResults([]);
      privateAxios
        .get("/api/gatepasses")
        .then((res) => {
          setAttendanceData(res.data);
          setOldAttendance(res.data);
        })
        .catch((error) => {
          toast.error("error while fetching gatepasses");
        });
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Handle the logic for editing
    handleMenuClose();
  };

  const handleDelete = () => {
    // Handle the logic for deleting
    handleMenuClose();
  };

  // Dummy data for the table, replace it with your actual data
  const [attendanceData, setAttendanceData] = useState([]);

  // Dummy employee list, replace it with your actual list
  // const employeeList = ['Employee 1', 'Employee 2', 'Employee 3'];

  const monthList = [
    { name: "January", number: 1 },
    { name: "February", number: 2 },
    { name: "March", number: 3 },
    { name: "April", number: 4 },
    { name: "May", number: 5 },
    { name: "June", number: 6 },
    { name: "July", number: 7 },
    { name: "August", number: 8 },
    { name: "September", number: 9 },
    { name: "October", number: 10 },
    { name: "November", number: 11 },
    { name: "December", number: 12 },
  ];

  // const filteredData = attendanceData.filter((entry) => {
  //   const employeeMatch = selectedEmployee ? entry.employee === selectedEmployee : true;
  //   const monthMatch = selectedMonth ? entry.date.includes(selectedMonth) : true;
  //   const searchMatch = searchTerm
  //     ? Object.values(entry).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  //     : true;

  //   return employeeMatch && monthMatch && searchMatch;
  // });

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const searchAttendanceData = () => {
    if (selectedEmployee != "") {
      let aData = attendanceData.filter((data) => {
        return data.empCode === selectedEmployee;
      });
      setAttendanceData(aData);
    } else {
      toast.warn("Please select employee name!");
    }
  };
  function convertDecimalToHoursAndMinutes(decimalHours) {
    // Extract the whole number part (hours)
    const hours = Math.floor(decimalHours);

    // Calculate the decimal part as minutes
    const minutes = Math.round((decimalHours - hours) * 60);

    return hours + "hrs :" + minutes + " mins";
  }
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  useEffect(() => {
    //    console.log("search ress");
    setSearchResults([]);
  }, [selectedEmployeeName]);
  const selectEmployee = (e, employee) => {
    try {
      e.preventDefault();
      //      console.log(employee);
      setSelectedEmployeeName(employee.firstName + " " + employee.lastName);
      setSelectedEmployee(employee.empCode);
    } catch (e) {
      //      console.log(e);
    }
  };
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const sortedVisitors = attendanceData.sort((a, b) => {
    const isAsc = order === "asc";
    if (orderBy === "dateIn") {
      const dateTimeA = new Date(a.dateIn + " " + a.timeIn);
      const dateTimeB = new Date(b.dateIn + " " + b.timeIn);

      // Compare the DateTime objects
      return isAsc ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
    } else {
      // Default comparison for other columns
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
  });

  const slicedVisitors = sortedVisitors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Container fluid>
      <Row>
        <Col md={4} sm={6} xs={12}>
          {" "}
          <Container fluid>
            <Card className="my-3 w-100 border-0 shadow">
              <Card.Body>
                <Card.Title className="mx-2">Gate Pass Form</Card.Title>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-6">
                      {" "}
                      {/* <TextField
                className="mb-3 mx-2 w-100"
                label="Name"
                variant="outlined"
                name="name"
                value={gatePass.name}
                onChange={handleChange}
              /> */}
                      <Autocomplete
                        className="mb-3 mx-2 w-100"
                        options={employees}
                        getOptionLabel={(employee) =>
                          employee.empCode +
                          " " +
                          employee.firstName +
                          " " +
                          employee.lastName
                        }
                        filterOptions={filterOptions}
                        onChange={(e, val) => setSelectedEmployee(val)}
                        value={selectedEmployee}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search Employees"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-6">
                      {" "}
                      <TextField
                        className="mb-3 mx-2 w-100"
                        label="EDIN"
                        variant="outlined"
                        name="edin"
                        value={gatePass.edin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      {" "}
                      <TextField
                        className="mb-3 mx-2 w-100"
                        label="Date In"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name="dateIn"
                        value={gatePass.dateIn}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <TextField
                        className="mb-3 mx-2 w-100"
                        label="Time In"
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                        name="timeIn"
                        value={gatePass.timeIn}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="mx-2">Reason</label>
                    <textarea
                      style={{ borderColor: "#d0d0d0", borderRadius: "6px" }}
                      className="mb-3 mx-2 w-100 textareaCustom"
                      multiline
                      rows={4}
                      name="reason"
                      value={gatePass.reason}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ m: 1 }}
                >
                  Save
                </Button>
              </Card.Body>
            </Card>
          </Container>
        </Col>
        <Col md={8} sm={6} xs={12}>
          {" "}
          <Card
            style={{ padding: "10px", borderRadius: "10px" }}
            className="mt-1 border-0 shadow"
          >
            <h5 className="fw-bold">Employee Gate Pass</h5>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <FormControl style={{ marginRight: "20px" }} className="w-25">
          <InputLabel id="employee-filter-label">Filter by Employee</InputLabel>
          <Select
            labelId="employee-filter-label"
            id="employee-filter"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
             <MenuItem value="">All Employees</MenuItem> 
                         {employeeList.map((employee, index) => (
              <MenuItem key={index} value={employee.empCode}>
                {employee.firstName + " " + employee.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
              <div className="d-flex flex-column me-2">
                <EmployeeSearchBar
                  onSearch={handleEmployeeChange}
                  selectedEmployeeName={selectedEmployeeName}
                  setSelectedEmployeeName={setSelectedEmployeeName}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                {/* Render your search results or other components based on the search */}

                <List
                  class={"bg-white border-1 shadow p-0"}
                  style={{
                    width: "216px",
                    position: "absolute",
                    borderRadius: "5px",
                    top: "160px",
                  }}
                >
                  {searchResults.map((employee) => (
                    <ListItem
                      key={employee.id}
                      style={{ cursor: "pointer", border: "0.5px solid grey" }}
                      onClick={(e) => selectEmployee(e, employee)}
                    >
                      <ListItemText
                        primary={employee.firstName + " " + employee.lastName}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
              {/* <FormControl style={{ marginRight: "20px" }} className="w-25">
          <InputLabel id="month-filter-label">Filter by Month</InputLabel>
          <Select
            labelId="month-filter-label"
            id="month-filter"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <MenuItem value="">All Months</MenuItem>
            {monthList.map((month, index) => (
              <MenuItem key={index} value={month.number}>
                {month.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
              {/* 
        <Button
          className="mx-2"
          variant="outlined"
          onClick={searchAttendanceData}
        >
          {" "}
          <SearchIcon /> Search
        </Button> */}
              {/* <Button
          onClick={() => {
            setSelectedEmployee("");
            setSelectedMonth("");
            getAttendanceDataOfTodayFromBackend(currentIndianDate)
              .then((data) => {
                setShowTotalHrs(false);
                setAttendanceData(data.content);
                setSearchTerm("")
                userContext.setDailyData(data);
                userContext.setMonthlyAttendance(null);
              })
              .catch((error) => {
                toast.error(
                  "Internal Server Error While fetching todays record"
                );
              });
          }}
          startIcon={<RestartAltIcon />}
          variant="outlined"
        >
          Reset
        </Button> */}
              {showTotalHrs && (
                <h6 className="ms-2" style={{ width: "30%" }}>
                  <small>
                    Total Hrs:{" "}
                    {convertDecimalToHoursAndMinutes(
                      attendanceData.reduce((accumulator, currentTime) => {
                        const now = new Date(); // Get the current time

                        const [inHours, inMinutes] = currentTime?.inTime
                          ? currentTime.inTime.split(":").map(Number)
                          : [0, 0];

                        let [outHours, outMinutes] = currentTime?.outTime
                          ? currentTime.outTime.split(":").map(Number)
                          : [now.getHours(), now.getMinutes()]; // Use current time if outTime is not available

                        // Calculate the duration in minutes and add it to the accumulator
                        return (
                          accumulator +
                          Math.abs(
                            outHours * 60 +
                              outMinutes -
                              (inHours * 60 + inMinutes)
                          )
                        );
                      }, 0) / 60
                    )}
                  </small>
                </h6>
              )}
            </div>

            <div
              className="position-relative"
              style={attendanceData?.length <= 0 ? { minHeight: "380px" } : {}}
            >
              <Table
                responsive
                size="small"
                aria-label="a dense table"
                style={
                  attendanceData?.length <= 0 ? { minHeight: "360px" } : {}
                }
              >
                <thead className="position-relative">
                  <tr>
                    <th>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleSort("name")}
                        style={{ width: "100px" }}
                      >
                        Employee Name
                      </TableSortLabel>
                    </th>
                    <th>
                      <TableSortLabel
                        active={orderBy === "dateIn"}
                        direction={orderBy === "dateIn" ? order : "asc"}
                        onClick={() => handleSort("dateIn")}
                        style={{ width: "100px" }}
                      >
                        Date In
                      </TableSortLabel>
                    </th>
                    <th>Date Out</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slicedVisitors.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        {/* The syntax (() => { ... })() */}
                        {(() => {
                          const filteredEmployees = employees.filter(
                            (emp) => emp.empCode === entry?.name
                          );

                          return filteredEmployees.length > 0
                            ? filteredEmployees[0].firstName +
                                " " +
                                filteredEmployees[0].lastName
                            : "";
                        })()}
                      </td>
                      <td>{entry?.dateIn}</td>
                      <td>{entry?.dateOut}</td>

                      <td>{entry?.timeIn}</td>
                      <td>{entry?.timeOut}</td>
                      <Tooltip
                        title={entry?.reason}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{entry?.reason.slice(0, 15) + "..."}</td>
                      </Tooltip>

                      <td>
                        {checkAccess("Employee Gate Pass", "canUpdate") && (
                          <Tooltip title="Time Out">
                            <IconButton
                              onClick={() => {
                                entry.dateOut = new Date()
                                  .toISOString()
                                  .slice(0, 10);
                                entry.timeOut = new Date()
                                  .toTimeString()
                                  .slice(0, 5);
                                privateAxios
                                  .put(`/api/gatepasses/${entry.id}`, entry)
                                  .then((res) => {
                                    setAttendanceData(
                                      attendanceData.map((data) => {
                                        if (data.id == res.id) {
                                          data = res;
                                        }
                                        return data;
                                      })
                                    );
                                    setOldAttendance(
                                      attendanceData.map((data) => {
                                        if (data.id == res.id) {
                                          data = res;
                                        }
                                        return data;
                                      })
                                    );
                                  })
                                  .catch((error) => {
                                    toast.error(
                                      "Access Denied or Internal Server error"
                                    );
                                  });
                              }}
                            >
                              <Watch color="success" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {checkAccess("Employee Gate Pass", "canDelete") && (
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                privateAxios
                                  .delete(`/api/gatepasses/${entry.id}`)
                                  .then((res) => {
                                    setAttendanceData(
                                      attendanceData.filter(
                                        (data) => data.id != entry.id
                                      )
                                    );
                                    setOldAttendance(
                                      attendanceData.filter(
                                        (data) => data.id != entry.id
                                      )
                                    );
                                  })
                                  .catch((error) => {
                                    toast.error(
                                      "Access Denied or Internal Server error"
                                    );
                                  });
                              }}
                            >
                              <Delete color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {attendanceData?.length <= 0 && (
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
            </div>

            <Pagination>
              <Pagination.Prev
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              />

              {/* Assuming attendanceData is an array and rowsPerPage is the number of items per page */}
              {Array.from({
                length: Math.ceil(attendanceData?.length / rowsPerPage),
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
                  page === Math.floor(attendanceData?.length / rowsPerPage) ||
                  attendanceData?.length <= rowsPerPage
                }
              />
            </Pagination>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GatePassForm;
