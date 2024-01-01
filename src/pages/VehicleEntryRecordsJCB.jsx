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
  saveVehicleEntry,
} from "../services/VehicleEntryService";
import { error } from "highcharts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

const columns = [
  { id: "gatePassNo", label: "Gate Pass No" },
  { id: "site", label: "Site" },
  { id: "inTime", label: "In Time" },
  { id: "outTime", label: "Out Time" },
  { id: "inDate", label: "In Date" },
  { id: "outDate", label: "Out Date" },
  { id: "selectedOption", label: "Selected Option" },
  { id: "hydraCapacity", label: "Hydra Capacity" },
  { id: "ownerBankAccount", label: "Owner Bank Account" },
  { id: "ownerPhone", label: "Owner Phone" },
  { id: "justification", label: "Justification" },
  { id: "enteredBy", label: "Entered By" },
];

const VehicleEntryRecordsJCB = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState([]);
  const timeOut=(formData)=>{
    const currentDate = new Date();
    // Format the time as "00:31:31"
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    // Format the date as "YYYY-MM-DD"
    const year = currentDate.getUTCFullYear();
const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
const day = String(currentDate.getUTCDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
    
    // Set formData.outTime and formData.outDate
    formData.outTime = formattedTime;
    formData.outDate = formattedDate;
    saveVehicleEntry(formData)
    .then((res) => {
      toast.success("outtime updated")
    }).catch(error=>{
      toast.error("Internal Server Error While Saving")
    })
  }
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
        >
          Add New
        </Button>
      </Stack>
      <TableContainer className="position-relative" style={filteredRows.length==0?{minHeight:"380px"}:{}}> 
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{ cursor: "pointer" }}
                >
                  {column.label}
                </TableCell>
              ))}
          
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
                    <TableCell>
                <Button size="small" onClick={()=>timeOut(row)} variant="outlined"><small>Timeout</small></Button>
              </TableCell>
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
