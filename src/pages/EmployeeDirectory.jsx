import React, { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";
import { toast } from "react-toastify";

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [oldemployees, setOldEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
console.log(event.target.value)
    if (event.target.value != "") {
        const filteredEmployees = oldemployees.filter((employee) =>
        Object.values(employee).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
      console.log(filteredEmployees)
      setEmployees(filteredEmployees);
      // setPage(0); // Reset page when searching
    } else {
      setEmployees(oldemployees);
    }
  };

  return (
    <Container className="mt-3">
      <h5>Employee Directory</h5>
      <TableContainer component={Paper}>
        <Table>
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
              <TableCell style={{ width: "15%" }}>Emp Code</TableCell>
              <TableCell style={{ width: "15%" }}>Emp Name</TableCell>
              <TableCell style={{ width: "15%" }}>Email</TableCell>
              <TableCell style={{ width: "15%" }}>Designation</TableCell>
              <TableCell style={{ width: "15%" }}>Mobile No</TableCell>
              <TableCell style={{ width: "15%" }}>Location</TableCell>
              <TableCell style={{ width: "15%" }}>Blood Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.empCode}</TableCell>
                  <TableCell>
                    {employee.firstName + " " + employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.cityTehsil}</TableCell>
                  <TableCell>{employee.bloodGroup}</TableCell>
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
    </Container>
  );
};

export default EmployeeDirectory;
