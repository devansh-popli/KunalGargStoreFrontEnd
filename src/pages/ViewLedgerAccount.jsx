import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Button,
  Table,
  FormControl,
  InputGroup,
  Pagination,
  Card,
} from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { privateAxios } from "../services/AxiosService";
import { deleteLedgerAccountById } from "../services/LedgerAccountService";
import { toast } from "react-toastify";
import { Delete, Edit } from "@mui/icons-material";
import { checkAccess, getJwtToken } from "../auth/HelperAuth";
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
    id: "accountName",
    label: "Account Name",
    minWidth: 200,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "address",
    label: "Address",
    minWidth: 340,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "openingBalance",
    label: "Opening Balance",
    minWidth: 150,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "contactNo",
    label: "Contact No",
    minWidth: 120,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "pan",
    label: "PAN",
    minWidth: 120,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 120,
    align: "left",
  },
];

const ViewLedgerAccount = React.memo(() => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stockItems, setStockItems] = useState([]);
  const [oldStockItems, setOldStockItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = React.useState("");
  const jetChecker = useJwtChecker();
  const navigate = useNavigate();

  useEffect(() => {
    privateAxios
      .get(
        `/api/ledger-accounts/stock-item-menu/all?pageNumber=${page}&pageSize=${rowsPerPage}&sortBy=${"accountName"}`
      )
      .then((response) => {
        setStockItems(response.data);
        setOldStockItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
  }, [page]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigateToEdit = (accountId) => {
    navigate(`/new-ledger-account-form/${accountId}`);
  };

  const deleteRecord = (row) => {
    deleteLedgerAccountById(row.id)
      .then((data) => {
        toast.success("Record Deleted Successfully!!");
        let newStockItems = stockItems.content.filter(
          (item) => item.id !== row.id
        );
        setStockItems({
          ...stockItems,
          content: newStockItems,
          totalElements: stockItems.totalElements - 1,
        });
      })
      .catch((error) => {
        toast.error("Error while deleting Record");
      });
  };
  const userContext = useContext(UserContext);
  return userContext.isLogin ? (
    checkAccess("Ledger Directory", "canRead") ? (
      <Container className="mt-3">
        <h4 className="fw-bold">Ledger Directory</h4>
        <Card className="p-0 border-0 shadow rounded p-2">
          <Card.Body className="p-0">
            <div className="d-flex justify-content-between">
              <InputGroup className="mb-3 m-3" style={{ width: "300px" }}>
                <FormControl
                  name="search"
                  placeholder="Enter Account Code here"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setStockItems(oldStockItems);
                    } else setSearch(e.target.value);
                  }}
                />
                <Button
                  onClick={() => {
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
                  }}
                  variant="secondary"
                  id="button-addon2"
                >
                  Search
                </Button>
              </InputGroup>
              {checkAccess("Ledger Directory", "canWrite") && (
                <Button
                  as={Link}
                  to="/new-ledger-account-form"
                  style={{
                    backgroundColor: "#78C2AD",
                    textDecoration: "none",
                    fontSize: "11px",
                    // width: "90px",
                  }}
                  className="mx-2 text-white my-3 d-flex align-align-items-center"
                >
                  Add New
                </Button>
              )}
            </div>

            <Table responsive 
              hover
              className="position-relative"
              style={
                stockItems?.content?.length == 0 ? { minHeight: "380px" } : {}
              }
            >
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.id}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              {stockItems?.content?.length > 0 ? (
                <tbody>
                  {stockItems?.content
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <tr key={row.accountCode}>
                        {columns.map((column, index) => (
                          <React.Fragment key={column.id}>
                            {index === columns.length - 1 ? (
                              <td className="d-flex">
                                <div style={{marginTop:"50px"}}></div>
                                {checkAccess(
                                  "Ledger Directory",
                                  "canUpdate"
                                ) && (
                                  <Button
                                    variant="primary"
                                    className="mx-1"
                                    onClick={() =>
                                      navigateToEdit(row.accountCode)
                                    }
                                  >
                                    <Edit />
                                  </Button>
                                )}
                                {checkAccess(
                                  "Ledger Directory",
                                  "canDelete"
                                ) && (
                                  <Button
                                    variant="danger"
                                    onClick={() => deleteRecord(row)}
                                  >
                                    <Delete />
                                  </Button>
                                )}
                              </td>
                            ) : (
                              <td>
                                {column.format &&
                                typeof row[column.id] === "number"
                                  ? column.format(row[column.id])
                                  : row[column.id]}
                              </td>
                            )}
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                </tbody>
              ) : (
                <div className="text-center">
                  <img
                    src="../../noData.svg"
                    alt="No Data"
                    width={"250"}
                    height={250}
                    className="position-absolute"
                    style={{
                      top: "53%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundPosition: "contain",
                    }}
                  />
                </div>
              )}
            </Table>
            <Pagination className="mt-3">
              <Pagination.Prev
                onClick={(e) => handleChangePage(page - 1)}
                disabled={page === 0}
              />
              <Pagination.Item>{page + 1}</Pagination.Item>
              <Pagination.Next
                onClick={(e) => handleChangePage(page + 1)}
                disabled={stockItems.lastPage}
              />
            </Pagination>
          </Card.Body>
        </Card>
      </Container>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <Navigate to="/login" />
  );
});

export default React.memo(ViewLedgerAccount);
