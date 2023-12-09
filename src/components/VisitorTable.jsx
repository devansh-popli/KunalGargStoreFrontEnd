import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Container } from "react-bootstrap";

const VisitorTable = ({ visitors, handleTimeout }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.aadharNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVisitors = filteredVisitors.sort((a, b) => {
    const isAsc = order === "asc";
    return isAsc
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  const slicedVisitors = sortedVisitors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className="mt-3 me-2" >
      <TextField
        label="Search"
        variant="outlined"
        className="w-30 ms-2"
        margin="normal"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer>
        <Table style={{minHeight:"380px"}} className="position-relative">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              {/* <TableCell>
                <TableSortLabel
                  active={orderBy === 'fatherName'}
                  direction={orderBy === 'fatherName' ? order : 'asc'}
                  onClick={() => handleSort('fatherName')}
                >
                  Father's Name
                </TableSortLabel>
              </TableCell> */}
              <TableCell>
                <TableSortLabel
                  active={orderBy === "phone"}
                  direction={orderBy === "phone" ? order : "asc"}
                  onClick={() => handleSort("phone")}
                >
                  Phone Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "address"}
                  direction={orderBy === "address" ? order : "asc"}
                  onClick={() => handleSort("address")}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "purpose"}
                  direction={orderBy === "purpose" ? order : "asc"}
                  onClick={() => handleSort("purpose")}
                >
                  Purpose
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "timeIn"}
                  direction={orderBy === "timeIn" ? order : "asc"}
                  onClick={() => handleSort("timeIn")}
                >
                  Time In
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "timeOut"}
                  direction={orderBy === "timeOut" ? order : "asc"}
                  onClick={() => handleSort("timeOut")}
                >
                  Time Out
                </TableSortLabel>
              </TableCell>
              {/* <TableCell>
                <TableSortLabel
                  active={orderBy === 'aadharNumber'}
                  direction={orderBy === 'aadharNumber' ? order : 'asc'}
                  onClick={() => handleSort('aadharNumber')}
                >
                  Aadhar Card Number
                </TableSortLabel>
              </TableCell> */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedVisitors.map((visitor) => (
              <TableRow key={visitor.name}>
                <TableCell>
                  {/* Display the photo or a placeholder */}
                  {visitor.photo ? (
                    <img
                      src={URL.createObjectURL(visitor.photo)}
                      alt="Visitor"
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </TableCell>

                <TableCell>{visitor.name}</TableCell>
                <TableCell>{visitor.fatherName}</TableCell>
                <TableCell>{visitor.phone}</TableCell>
                <TableCell>{visitor.address}</TableCell>
                <TableCell>{visitor.purpose}</TableCell>
                <TableCell>{visitor.timeIn}</TableCell>
                <TableCell>{visitor.timeOut}</TableCell>
                <TableCell>{visitor.aadharNumber}</TableCell>
                <TableCell>
                  {!visitor.timeOut && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleTimeout(visitor.name)}
                    >
                      Timeout
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {slicedVisitors.length <= 0 && (
                <Container >
                <img src="../../noData.svg" width={250} height={250} alt="" className="position-absolute" style={{ top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Container>
            )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedVisitors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default VisitorTable;
