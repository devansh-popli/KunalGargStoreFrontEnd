import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Menu,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  styled,
  tableCellClasses,
  Container,
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
const AttendanceTableOfToday = ({ employeeList }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
  const [oldAttendance, setOldAttendance] = useState();
  useEffect(() => {
    if (selectedEmployee == "" && selectedMonth == "") {
      getAttendanceDataOfTodayFromBackend(currentIndianDate)
        .then((data) => {
          setShowTotalHrs(false);
          setAttendanceData(data.content);
          setOldAttendance(data.content);
          userContext.setDailyData(data);
          userContext.setMonthlyAttendance(null);
        })
        .catch((error) => {
          toast.error("Internal Server Error While fetching todays record");
        });
    } else {
      setSelectedEmployee("");
      setSelectedMonth("");
      getAttendanceDataOfTodayFromBackend(currentIndianDate)
        .then((data) => {
          setShowTotalHrs(false);
          setAttendanceData(data.content);
          setOldAttendance(data.content);
          userContext.setDailyData(data);
          userContext.setMonthlyAttendance(null);
        })
        .catch((error) => {
          toast.error("Internal Server Error While fetching todays record");
        });
    }
  }, [userContext.updatedAttendance]);
  const [searchResults, setSearchResults] = useState([]);
  const handleEmployeeChange = (searchTermN) => {
    // Perform your employee search logic here and update the searchResults state
    // For example, you can filter employees based on the search term
    // Replace this with your actual employee data and search logic
    if (searchTermN != "") {
      let filteredEmployees = [];
      let filteredAttendanceData = [];

      if (searchTermN.toLowerCase().includes("emp") || !isNaN(searchTermN) || searchTermN.includes("EMP")) {
        // If the searchTerm starts with "EMP"
        filteredEmployees = employeeList.filter((employee) =>
          employee.empCode.toLowerCase().includes(searchTermN.toLowerCase())
        );
        console.log(filteredEmployees);
        // Filter attendanceData based on empCode from filteredEmployees
        filteredAttendanceData = oldAttendance.filter((data) =>
          filteredEmployees.some((employee) =>
            data.employeeName
              .toLowerCase()
              .includes(
                employee.firstName.toLowerCase() +
                  " " +
                  employee.lastName.toLowerCase()
              )
          )
        );
      } else {
        // If the searchTerm doesn't start with "EMP"
        console.log(searchTermN);
        filteredAttendanceData = oldAttendance.filter((data) =>
          data.employeeName.toLowerCase().includes(searchTermN.toLowerCase())
        );
      }
      setAttendanceData(filteredAttendanceData);
    } else {
      setSearchResults([]);
      getAttendanceDataOfTodayFromBackend(currentIndianDate)
        .then((data) => {
          setShowTotalHrs(false);
          setAttendanceData(data.content);
          setOldAttendance(data.content);
          userContext.setDailyData(data);
          userContext.setMonthlyAttendance(null);
        })
        .catch((error) => {
          toast.error("Internal Server Error While fetching todays record");
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

  const handleChangePage = (event, newPage) => {
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
    console.log("search ress");
    setSearchResults([]);
  }, [selectedEmployeeName]);
  const selectEmployee = (e, employee) => {
    try {
      e.preventDefault();
      console.log(employee);
      setSelectedEmployeeName(employee.firstName + " " + employee.lastName);
      setSelectedEmployee(employee.empCode);
    } catch (e) {
      console.log(e);
    }
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#205072",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  return (
    <Paper
      elevation={3}
      style={{ padding: "10px", borderRadius: "10px" }}
      className="mt-1"
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
                      outHours * 60 + outMinutes - (inHours * 60 + inMinutes)
                    )
                  );
                }, 0) / 60
              )}
            </small>
          </h6>
        )}
      </div>

      <TableContainer className="position-relative" style={attendanceData?.length<=0?{minHeight:'380px'}:{}}>
        <Table size="small" aria-label="a dense table" style={attendanceData?.length<=0?{minHeight:"360px"}:{}}>
          <TableHead  className="position-relative" >
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Time In</StyledTableCell>
              <StyledTableCell>Time Out</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry?.attendanceDate}</TableCell>
                  <TableCell>{entry?.employeeName}</TableCell>
                  <TableCell>{entry?.inTime}</TableCell>
                  <TableCell>{entry?.outTime}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          deleteAttendanceDataByDateFromBackend(entry.id).then(res=>{
                            setAttendanceData(
                              attendanceData.filter((data) => data.id != entry.id)
                            );
                            setOldAttendance(
                              attendanceData.filter((data) => data.id != entry.id)
                            );
                          }).catch(error=>{
                            toast.error("Access Denied or Internal Server error")
                          });
                        
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
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
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={attendanceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AttendanceTableOfToday;
