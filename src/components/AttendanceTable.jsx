import React, { useContext, useEffect, useState } from "react";
import {
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  deleteAttendanceDataByDateFromBackend,
  getAttendanceDataFromBackend,
  getAttendanceDataOfTodayFromBackend,
} from "../services/EmployeeDataService";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Delete, TrySharp } from "@mui/icons-material";
import EmployeeSearchBar from "./EmployeeSearchBar";
import { Card, Container, Pagination, Table } from "react-bootstrap";
import { checkAccess } from "../auth/HelperAuth";
const AttendanceTable = React.memo(({ employeeList }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const currmonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currmonth + 1);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showTotalHrs, setShowTotalHrs] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const indianTimeZone = "Asia/Kolkata";

  const currentIndianDate = new Date()
    .toLocaleDateString("en-IN", { timeZone: indianTimeZone })
    .split("/")
    .reverse()
    .join("-");
  const userContext = useContext(UserContext);
  useEffect(() => {
    if (selectedEmployee == null && selectedMonth == "") {
      // getAttendanceDataOfTodayFromBackend(currentIndianDate)
      //   .then((data) => {
      //     setShowTotalHrs(false);
      //     setAttendanceData(data.content);
      //     userContext.setDailyData(data);
      //     userContext.setMonthlyAttendance(null);
      //   })
      //   .catch((error) => {
      //     toast.error("Internal Server Error While fetching todays record");
      //   });
    } else {
      setSelectedEmployee(null);
      setSelectedMonth(currmonth + 1);
      // getAttendanceDataOfTodayFromBackend(currentIndianDate)
      //   .then((data) => {
      //     setShowTotalHrs(false);
      //     setAttendanceData(data.content);
      //     userContext.setDailyData(data);
      //     userContext.setMonthlyAttendance(null);
      //   })
      //   .catch((error) => {
      //     toast.error("Internal Server Error While fetching todays record");
      //   });
    }
  }, [userContext.updatedAttendance]);
  const [searchResults, setSearchResults] = useState([]);
  const handleEmployeeChange = (searchTermN) => {
    // Perform your employee search logic here and update the searchResults state
    // For example, you can filter employees based on the search term
    // Replace this with your actual employee data and search logic
    if (searchTermN != "") {
      let filteredEmployees = "";
      if (
        searchTermN.includes("EMP") ||
        !isNaN(searchTermN) ||
        searchTermN.includes("emp")
      ) {
        filteredEmployees = employeeList.filter((employee) =>
          employee.empCode.toLowerCase().includes(searchTermN.toLowerCase())
        );
      } else {
        filteredEmployees = employeeList.filter((employee) =>
          employee.firstName.toLowerCase().includes(searchTermN.toLowerCase())
        );
      }
      setSearchResults(
        filteredEmployees.length >= 5
          ? filteredEmployees.slice(0, 5)
          : filteredEmployees
      );
    } else {
      setSearchResults([]);
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
    if (selectedMonth != "" && selectedEmployee) {
      let year = new Date().getFullYear();
      getAttendanceDataFromBackend(
        selectedMonth,
        year,
        selectedEmployee.empCode
      ).then((data) => {
        userContext.setMonthlyAttendance(data);
        userContext.setDailyData(null);
        setShowTotalHrs(true);
        setAttendanceData(data.content);
      });
    } else {
      toast.warn("Please select month and employee name!");
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
  const filterOptions = (options, { inputValue }) => {
    // Customize this function based on your search logic
    return options.filter(
      (option) =>
        option.empCode.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.firstName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  return (
    <Card
      // elevation={3}
      style={{ padding: "7px", borderRadius: "10px" }}
      className="mt-1 border-0 shadow"
    >
      <h5 className="fw-bold">Attendance Records</h5>
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
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
          {/* <EmployeeSearchBar
            onSearch={handleEmployeeChange}
            selectedEmployeeName={selectedEmployeeName}
            setSelectedEmployeeName={setSelectedEmployeeName}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          /> */}
          {/* Render your search results or other components based on the search */}

          {/* <List
            class={"bg-white border-1 shadow p-0"}
            style={{
              width: "216px",
              position: "absolute",
              borderRadius: "5px",
              top: "160px",
              zIndex: "100",
            }}
          >
            {searchResults.map((employee) => (
              <ListItem
                key={employee.id}
                style={{ cursor: "pointer", borderBottom: "1px solid #dcdcdc" }}
                onClick={(e) => selectEmployee(e, employee)}
              >
                <ListItemText
                  primary={employee.firstName + " " + employee.lastName}
                />
              </ListItem>
            ))}
          </List> */}
        </div>
        <Autocomplete
          options={employeeList}
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
          style={{ width: "230px" }}
          className="mx-2"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employees"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <FormControl style={{ marginRight: "20px" }} className="w-25">
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
        </FormControl>

        <Button
          className="mx-2"
          size="small"
          variant="outlined"
          onClick={searchAttendanceData}
        >
          {" "}
          <SearchIcon /> Search
        </Button>
        <Button
          size="small"
          onClick={() => {
            setSelectedEmployee(null);
            setSelectedMonth(currmonth + 1);
            setShowTotalHrs(false);
            setSearchTerm("");
            userContext.setMonthlyAttendance(null);
            // getAttendanceDataOfTodayFromBackend(currentIndianDate)
            //   .then((data) => {
            //     setShowTotalHrs(false);
            //     setAttendanceData(data.content);
            //     setSearchTerm("")
            //     userContext.setDailyData(data);
            //     userContext.setMonthlyAttendance(null);
            //   })
            //   .catch((error) => {
            //     toast.error(
            //       "Internal Server Error While fetching todays record"
            //     );
            //   });
          }}
          startIcon={<RestartAltIcon />}
          variant="outlined"
        >
          Reset
        </Button>
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
                      outHours * 60 + outMinutes - (inHours * 60 + inMinutes)
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
        <Table responsive 
          size="small"
          aria-label="a dense table"
          style={attendanceData?.length <= 0 ? { minHeight: "380px" } : {}}
        >
          <thead className="position-relative">
            <tr>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry, index) => (
                <tr key={index}>
                  <td>{entry?.attendanceDate}</td>
                  <td>{entry?.employeeName}</td>
                  <td>{entry?.inTime}</td>
                  <td>{entry?.outTime}</td>
                  <td>
                    {checkAccess("Attendance Records", "canDelete") && (
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            deleteAttendanceDataByDateFromBackend(entry.id);
                            setAttendanceData(
                              attendanceData.filter(
                                (data) => data.id != entry.id
                              )
                            );
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
          {attendanceData.length <= 0 && (
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
          length: Math.ceil(attendanceData.length / rowsPerPage),
        }).map((_, index) => (
          <Pagination.Item
            key={index}
            active={page === index + 1}
            onClick={() => handleChangePage(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => handleChangePage(page + 1)}
          disabled={
            page === Math.floor(attendanceData.length / rowsPerPage) ||
            attendanceData.length <= rowsPerPage
          }
        />
      </Pagination>
    </Card>
  );
});

export default React.memo(AttendanceTable);
