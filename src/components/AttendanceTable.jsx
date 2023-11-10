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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAttendanceDataFromBackend } from "../services/EmployeeDataService";
import { UserContext } from "../context/UserContext";

const AttendanceTable = ({ employeeList }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const userContext = useContext(UserContext);
  useEffect(() => {
   let list= attendanceData.map((data) => {
      if (data.id === userContext.updatedAttendance.id) {
        data.inTime = userContext.updatedAttendance.inTime;
        data.outTime = userContext.updatedAttendance.outTime;
        return data
      }
    });
    setAttendanceData(list)
  }, [userContext.updatedAttendance]);
  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
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
    getAttendanceDataFromBackend(selectedMonth, selectedEmployee).then(
      (data) => {
        setAttendanceData(data.content);
      }
    );
  };
  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "0px 20px" }}>
      <h5 className="fw-bold">Attendance Records</h5>
      <div
        style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}
      >
        <FormControl style={{ marginRight: "20px" }} className="w-25">
          <InputLabel id="employee-filter-label">Filter by Employee</InputLabel>
          <Select
            labelId="employee-filter-label"
            id="employee-filter"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            {/* <MenuItem value="">All Employees</MenuItem> */}
            {employeeList.map((employee, index) => (
              <MenuItem key={index} value={employee.empCode}>
                {employee.firstName + " " + employee.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          variant="outlined"
          onClick={searchAttendanceData}
        >
          {" "}
          <SearchIcon /> Search
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Time In</TableCell>
              <TableCell>Time Out</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.attendanceDate}</TableCell>
                  <TableCell>{entry.employeeName}</TableCell>
                  <TableCell>{entry.inTime}</TableCell>
                  <TableCell>{entry.outTime}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-controls={`actions-menu-${index}`}
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`actions-menu-${index}`}
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {/* <MenuItem onClick={handleEdit}>Edit</MenuItem> */}
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={attendanceData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AttendanceTable;
