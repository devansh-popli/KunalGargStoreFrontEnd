// import * as React from 'react';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useState, useEffect, useContext } from "react";
import { privateAxios } from "../services/AxiosService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
// import { Container } from "react-bootstrap";
import {
  Button,
  Container,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { deleteStockItemMenuById } from "../services/StockItemMenuService";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import useJwtChecker from "../helper/useJwtChecker";
const columns = [
  {
    id: "accountCode",
    label: "Account Code",
    minWidth: 130,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "name",
    label: "Name",
    minWidth: 100,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "openingStockQty",
    label: "Op. Stock in Qty",
    minWidth: 140,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "openingStockRs",
    label: "Op. Stock in Rs",
    minWidth: 140,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "groupName",
    label: "Group Name",
    minWidth: 130,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "purchaseRate",
    label: "Purchase Rate",
    minWidth: 130,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "mrp",
    label: "MRP",
    minWidth: 70,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "saleRate",
    label: "Sale Rate",
    minWidth: 95,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "totalGST",
    label: "Total GST @",
    minWidth: 115,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 70,
    align: "left",
    // format: (value) => value.toFixed(2),
  },
  // {
  //   id: 'cgst',
  //   label: 'CGST @',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'sgst',
  //   label: 'S.GST @',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'purchaseAccount',
  //   label: 'Purchase A/C',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'saleAccount',
  //   label: 'Sale A/C',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'size',
  //   label: 'Size',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'hsnCode',
  //   label: 'HSN Code',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'scheme',
  //   label: 'Scheme',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'rateCalculate',
  //   label: 'Rate Calculate',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'clsStockIn',
  //   label: 'CLS Stock In',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'qtyInUnits',
  //   label: 'Qty. in UNITS',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'portalUOM',
  //   label: 'Portal UOM',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'stockCalculate',
  //   label: 'Stock Calculate',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'typeOfGoods',
  //   label: 'Type of Goods',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'stockValuation',
  //   label: 'Stock Valuation',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'qtyPerPcCase',
  //   label: 'Qty Per PC/Case',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'minStockLevel',
  //   label: 'Min Stock Level',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'taxType',
  //   label: '206C(1H)/194Q',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
  // {
  //   id: 'gstType',
  //   label: 'GST Type',
  //   minWidth: 100,
  //   align: 'right',
  //   format: (value) => value.toFixed(2),
  // },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263, 1),
  createData("China", "CN", 1403500365, 9596961, 2),
  createData("Italy", "IT", 60483973, 301340, 3),
  createData("United States", "US", 327167434, 9833520, 4),
  createData("Canada", "CA", 37602103, 9984670, 5),
  createData("Australia", "AU", 25475400, 7692024, 6),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126310000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 10098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];

const ViewStockItemMenu = React.memo(() => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [stockItems, setStockItems] = useState([]);
  const [oldStockItems, setOldStockItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    // Fetch data from your backend API
    privateAxios
      .get(
        `/api/v1/stock-item-menu/all?pageNumber=${page}&pageSize=${rowsPerPage}`
      )
      .then((response) => {
        setStockItems(response.data);
        setOldStockItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
  }, [page]);
  const navigate = useNavigate();
  const navigateToEdit = (accountId) => {
    navigate(`/stock-item-menu/${accountId}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const searchStockItem = () => {
    privateAxios
      .get(
        `/api/v1/stock-item-menu/all/${search}?pageNumber=${currentPage}&pageSize=10`
      )
      .then((response) => {
        setStockItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
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
  const jetChecker = useJwtChecker();
  const userContext = React.useContext(UserContext);
  return userContext.isLogin ? (
    <Container className="mt-3">
      <h4 className="fw-bold">View Stock Item Menu Details</h4>
      <Paper className="w-100" style={{ borderRadius: "10px" }}>
      <Stack 
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingTop={2}
          paddingLeft={2}
          paddingRight={2}
        >
          <TextField inputProps={{ style: { textTransform: 'uppercase' } }} 
            style={{ width: "300px" }}
            className=""
            label={
              <>
                <SearchIcon />
                <span className="ms-4">Search</span>
              </>
            }
            variant="outlined"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            as={Link}
            to="/stock-item-menu"
            style={{
              backgroundColor: "#78C2AD",
              textDecoration: "none",
              fontSize:"11px",
              width:"90px"
            }}
            size="small"
            variant="contained"
          >
            Add New
          </Button>
        </Stack>
        <TableContainer sx={{ maxHeight: 440 }} className="position-relative" style={stockItems?.content?.length<=0?{minHeight:'380px'}:{}}>
       <div className="mt-2"></div>
          <Table stickyHeader size="small" aria-label="a dense table"  style={stockItems?.content?.length <= 0 ?{minHeight:"340px"}:{}}>
            <TableHead className="position-relative">
              {/* <TableRow>
              <TableCell align="center" colSpan={3}>
                
              </TableCell>
              <TableCell align="center" colSpan={3}>
              Stock Item Menu
              </TableCell>
              <TableCell align="center" colSpan={3}>
                
              </TableCell>
            </TableRow> */}
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{  minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stockItems?.content
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.accountCode}
                    >
                      {columns.map((column, index) => {
                        const value = row[column.id];
                        return index == columns.length - 1 ? (
                          <>
                            <TableCell key={column.id} align={column.align}>
                              <Tooltip title="Delete" color="dark">
                                <IconButton
                                  onClick={() => {
                                    deleteStockItemMenuById(row.stockItemId)
                                      .then((data) => {
                                        toast.success(
                                          "Record Deleted Successfully!!"
                                        );
                                        let newStockItems =
                                          stockItems.content.filter(
                                            (item) =>
                                              item.stockItemId !=
                                              row.stockItemId
                                          );
                                        setStockItems({
                                          ...stockItems,
                                          content: newStockItems,
                                          totalElements:
                                            stockItems.totalElements - 1,
                                        });
                                      })
                                      .catch((error) => {
                                        toast.error(
                                          "Error while deleted Record"
                                        );
                                      });
                                  }}
                                >
                                  <Delete color="error" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </>
                        ) : (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigateToEdit(row.accountCode)}
                          >
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
            {stockItems?.content?.length <= 0 && (
              <Container>
                <img
                  src="../../noData.svg"
                  width={220}
                  height={220}
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={stockItems?.content?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  ) : (
    <Navigate to={"/"} />
  );
});

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { privateAxios } from '../services/AxiosService';
// import { Button, Container, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { isUserLoggedIn } from '../auth/HelperAuth';
// import { UserContext } from '../context/UserContext';

// const ViewStockItemMenu = () => {
//     const [stockItems, setStockItems] = useState([]);
//     const [oldStockItems, setOldStockItems] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [search, setSearch] = useState("");
//     useEffect(() => {
//         // Fetch data from your backend API
//         privateAxios.get(`/api/v1/stock-item-menu/all?pageNumber=${currentPage}&pageSize=4`)
//             .then(response => {
//                 setStockItems(response.data);
//                 setOldStockItems(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching stock items:', error);
//             });
//     }, [currentPage]);
//     const navigate = useNavigate()
//     const navigateToEdit = (accountId) => {
//         navigate(`/stock-item-menu/${accountId}`)
//     }
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };
//     const searchStockItem=()=>{
//         privateAxios.get(`/api/v1/stock-item-menu/all/${search}?pageNumber=${currentPage}&pageSize=10`)
//             .then(response => {
//                 setStockItems(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching stock items:', error);
//             });
//     }
//     const userContext=useContext(UserContext)
//     return userContext.isLogin ? (
//         <Container fluid>

//             <h3 className='m-2'>Stock Items</h3>
//             <InputGroup className="mb-3" style={{width:"300px"}}>
//                 <Form.Control
//                     name="search"
//                     placeholder="Enter Account Code here"
//                     aria-label="Recipient's username"
//                     aria-describedby="basic-addon2"
//                     onChange={(e)=>{
//                         if(e.target.value=='')
//                         {
//                             setStockItems(oldStockItems)
//                         }
//                         else
//                         setSearch(e.target.value)}}
//                 />
//                 <Button onClick={searchStockItem} variant="secondary" id="button-addon2">
//                     Search
//                 </Button>
//             </InputGroup>
//             <Table striped responsive bordered hover size='sm'>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Account Code</th>
//                         <th>Name</th>
//                         <th>Op. Stock in Qty</th>
//                         <th>Op. Stock in Rs</th>
//                         <th>Group Name</th>
//                         <th>Purchase Rate</th>
//                         <th>MRP</th>
//                         <th>Sale Rate</th>
//                         <th>Total GST @</th>
//                         <th>CGST @</th>
//                         <th>S.GST @</th>
//                         <th>Purchase A/C</th>
//                         <th>Sale A/C</th>
//                         <th>Size</th>
//                         <th>HSN Code</th>
//                         <th>Scheme</th>
//                         <th>Rate Calculate</th>
//                         <th>CLS Stock In</th>
//                         <th>Qty. in UNITS</th>
//                         <th>Portal UOM</th>
//                         <th>Stock Calculate</th>
//                         <th>Type of Goods</th>
//                         <th>Stock Valuation</th>
//                         <th>Qty Per PC/Case</th>
//                         <th>Min Stock Level</th>
//                         <th>206C(1H)/194Q</th>
//                         <th>GST Type</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {stockItems?.content?.map(stockItem => (
//                         <tr style={{ cursor: "pointer" }} key={stockItem.stockItemId} onClick={() => navigateToEdit(stockItem.accountCode)}>
//                             <td>{stockItem.stockItemId}</td>
//                             <td>{stockItem.accountCode}</td>
//                             <td>{stockItem.name}</td>
//                             <td>{stockItem.openingStockQty}</td>
//                             <td>{stockItem.openingStockRs}</td>
//                             <td>{stockItem.groupName}</td>
//                             <td>{stockItem.purchaseRate}</td>
//                             <td>{stockItem.mrp}</td>
//                             <td>{stockItem.saleRate}</td>
//                             <td>{stockItem.totalGST}</td>
//                             <td>{stockItem.cgst}</td>
//                             <td>{stockItem.sgst}</td>
//                             <td>{stockItem.purchaseAccount}</td>
//                             <td>{stockItem.saleAccount}</td>
//                             <td>{stockItem.size}</td>
//                             <td>{stockItem.hsnCode}</td>
//                             <td>{stockItem.scheme}</td>
//                             <td>{stockItem.rateCalculate}</td>
//                             <td>{stockItem.clsStockIn}</td>
//                             <td>{stockItem.qtyInUnits}</td>
//                             <td>{stockItem.portalUOM}</td>
//                             <td>{stockItem.stockCalculate}</td>
//                             <td>{stockItem.typeOfGoods}</td>
//                             <td>{stockItem.stockValuation}</td>
//                             <td>{stockItem.qtyPerPcCase}</td>
//                             <td>{stockItem.minStockLevel}</td>
//                             <td>{stockItem.taxType}</td>
//                             <td>{stockItem.gstType}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//             <Pagination className='m-3'>
//                 <Pagination.Prev
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 0}
//                 />
//                 <Pagination.Item>{currentPage}</Pagination.Item>
//                 <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={stockItems.lastPage} />
//             </Pagination>
//         </Container>
//     ):<Navigate to="/"/>
// };

export default ViewStockItemMenu;
