import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { privateAxios } from '../services/AxiosService';
import { Button, Container, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ViewStockItemMenu = () => {
    const [stockItems, setStockItems] = useState([]);
    const [oldStockItems, setOldStockItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState("");
    useEffect(() => {
        // Fetch data from your backend API
        privateAxios.get(`/api/v1/stock-item-menu/all?pageNumber=${currentPage}&pageSize=4`)
            .then(response => {
                setStockItems(response.data);
                setOldStockItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching stock items:', error);
            });
    }, [currentPage]);
    const navigate = useNavigate()
    const navigateToEdit = (accountId) => {
        navigate(`/stock-item-menu/${accountId}`)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const searchStockItem=()=>{
        privateAxios.get(`/api/v1/stock-item-menu/all/${search}?pageNumber=${currentPage}&pageSize=10`)
            .then(response => {
                setStockItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching stock items:', error);
            });
    }
    return (
        <Container fluid>

            <h3 className='m-2'>Stock Items</h3>
            <InputGroup className="mb-3" style={{width:"300px"}}>
                <Form.Control
                    name="search"
                    placeholder="Enter Account Code here"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={(e)=>{
                        if(e.target.value=='')
                        {
                            setStockItems(oldStockItems)
                        }
                        else
                        setSearch(e.target.value)}}
                />
                <Button onClick={searchStockItem} variant="secondary" id="button-addon2">
                    Search
                </Button>
            </InputGroup>
            <Table striped responsive bordered hover size='sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account Code</th>
                        <th>Name</th>
                        <th>Op. Stock in Qty</th>
                        <th>Op. Stock in Rs</th>
                        <th>Group Name</th>
                        <th>Purchase Rate</th>
                        <th>MRP</th>
                        <th>Sale Rate</th>
                        <th>Total GST @</th>
                        <th>CGST @</th>
                        <th>S.GST @</th>
                        <th>Purchase A/C</th>
                        <th>Sale A/C</th>
                        <th>Size</th>
                        <th>HSN Code</th>
                        <th>Scheme</th>
                        <th>Rate Calculate</th>
                        <th>CLS Stock In</th>
                        <th>Qty. in UNITS</th>
                        <th>Portal UOM</th>
                        <th>Stock Calculate</th>
                        <th>Type of Goods</th>
                        <th>Stock Valuation</th>
                        <th>Qty Per PC/Case</th>
                        <th>Min Stock Level</th>
                        <th>206C(1H)/194Q</th>
                        <th>GST Type</th>
                    </tr>
                </thead>
                <tbody>
                    {stockItems?.content?.map(stockItem => (
                        <tr style={{ cursor: "pointer" }} key={stockItem.stockItemId} onClick={() => navigateToEdit(stockItem.accountCode)}>
                            <td>{stockItem.stockItemId}</td>
                            <td>{stockItem.accountCode}</td>
                            <td>{stockItem.name}</td>
                            <td>{stockItem.opStockInQty}</td>
                            <td>{stockItem.opStockInRs}</td>
                            <td>{stockItem.groupName}</td>
                            <td>{stockItem.purchaseRate}</td>
                            <td>{stockItem.mrp}</td>
                            <td>{stockItem.saleRate}</td>
                            <td>{stockItem.totalGst}</td>
                            <td>{stockItem.cgst}</td>
                            <td>{stockItem.sgst}</td>
                            <td>{stockItem.purchaseAccount}</td>
                            <td>{stockItem.saleAccount}</td>
                            <td>{stockItem.size}</td>
                            <td>{stockItem.hsnCode}</td>
                            <td>{stockItem.scheme}</td>
                            <td>{stockItem.rateCalculate}</td>
                            <td>{stockItem.clsStockIn}</td>
                            <td>{stockItem.qtyInUnits}</td>
                            <td>{stockItem.portalUOM}</td>
                            <td>{stockItem.stockCalculate}</td>
                            <td>{stockItem.typeOfGoods}</td>
                            <td>{stockItem.stockValuation}</td>
                            <td>{stockItem.qtyPerPcCase}</td>
                            <td>{stockItem.minStockLevel}</td>
                            <td>{stockItem.taxType}</td>
                            <td>{stockItem.gstType}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className='m-3'>
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                />
                <Pagination.Item>{currentPage}</Pagination.Item>
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={stockItems.lastPage} />
            </Pagination>
        </Container>
    );
};


export default ViewStockItemMenu