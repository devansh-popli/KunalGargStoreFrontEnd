import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isUserLoggedIn } from '../auth/HelperAuth';
import { UserContext } from '../context/UserContext';
import { privateAxios } from '../services/AxiosService';
import { deleteStockItemMenuById, getStockItemMenuByAccountId, getStockItemMenuByAction, saveStockItemMenu } from '../services/StockItemMenuService';

const StockItemMenu = () => {
  const [nextAccountCode, setNextAccountCode] = useState('');

 const {id} =useParams()
 useEffect(()=>{
  if(id)
  {
    getStockItemMenuByAccountId(id).then(data => {
      // toast.success(" data fetched")
      setFormData(data)
    }).catch(error => {
      toast.error("error occurred")
    })
    scrollToTop()
  }
 },[id])
  const handleEvent = (action) => {
    getStockItemMenuByAction(action, formData.accountCode).then(data => {
      toast.success(action + " data fetched")
      setFormData(data)
    }).catch(error => {
      if (error.response.data.message == 'source cannot be null') {
        toast.error("No data present")
      }
      else{
        toast.error("error occurred")
      }
    })
    scrollToTop()
  }
  const addNewData=async ()=>{
    await fetchLastAccountCode()
    setFormData((prevData) => ({
      ...prevData,
      stockItemId:'',
      name: '',
      openingStockQty: '',
      openingStockRs: '',
      groupName: '',
      purchaseRate: '',
      mrp: '',
      saleRate: '',
      totalGST: '',
      cgst: '',
      sgst: '',
      purchaseAccount: '',
      saleAccount: '',
      size: '',
      hsnCode: '',
      scheme: '',
      rateCalculate: '',
      clsStockIn: '',
      qtyInUnits: '',
      portalUOM: '',
      stockCalculate: '',
      typeOfGoods: '',
      stockValuation: '',
      qtyPerPcCase: '',
      minStockLevel: '',
      taxType: '206C(1H)/194Q',
      gstType: '',
    }))
    scrollToTop()
  }
  const deleteData=()=>{
    deleteStockItemMenuById(formData.stockItemId).then(async (data)=>{
       toast.success("Stock Item Deleted Successfully")
       await fetchLastAccountCode()
       setFormData((prevData) => ({
         ...prevData,
         stockItemId:'',
         name: '',
         openingStockQty: '',
         openingStockRs: '',
         groupName: '',
         purchaseRate: '',
         mrp: '',
         saleRate: '',
         totalGST: '',
         cgst: '',
         sgst: '',
         purchaseAccount: '',
         saleAccount: '',
         size: '',
         hsnCode: '',
         scheme: '',
         rateCalculate: '',
         clsStockIn: '',
         qtyInUnits: '',
         portalUOM: '',
         stockCalculate: '',
         typeOfGoods: '',
         stockValuation: '',
         qtyPerPcCase: '',
         minStockLevel: '',
         taxType: '206C(1H)/194Q',
         gstType: '',
       }))
    }).catch(error=>{
      toast.error("error occured successfully")
    })
    scrollToTop()
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth scrolling behavior for a nicer user experience
    });
  };
  const fetchLastAccountCode = async () => {
    await privateAxios.get('/api/v1/lastAccountCode')
      .then((response) => {
        const lastAccountCode = response.data;
        // Generate the next account code
        const nextNumericPart = parseInt(lastAccountCode.split('-')[1]) + 1;
        setNextAccountCode(`abc-${String(nextNumericPart).padStart(3, '0')}`);
        setFormData({ ...formData, accountCode: `abc-${String(nextNumericPart).padStart(3, '0')}` })
      })
      .catch((error) => {
        console.error('Error fetching last account code:', error);
      });
  }
  useEffect(() => {
    // Fetch the last account code from the backend
    fetchLastAccountCode()
  }, []);
  const [formData, setFormData] = useState({
    accountCode: '',
    name: '',
    openingStockQty: '',
    openingStockRs: '',
    groupName: '',
    purchaseRate: '',
    mrp: '',
    saleRate: '',
    totalGST: '',
    cgst: '',
    sgst: '',
    purchaseAccount: '',
    saleAccount: '',
    size: '',
    hsnCode: '',
    scheme: '',
    rateCalculate: '',
    clsStockIn: '',
    qtyInUnits: '',
    portalUOM: '',
    stockCalculate: '',
    typeOfGoods: '',
    stockValuation: '',
    qtyPerPcCase: '',
    minStockLevel: '',
    taxType: '206C(1H)/194Q',
    gstType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveStockItemMenu(formData).then(async (data) => {
      console.log(data)
      toast.success("data saved successfully")
      await fetchLastAccountCode()
      setFormData((prevData) => ({
        ...prevData,
        name: '',
        openingStockQty: '',
        openingStockRs: '',
        groupName: '',
        purchaseRate: '',
        mrp: '',
        saleRate: '',
        totalGST: '',
        cgst: '',
        sgst: '',
        purchaseAccount: '',
        saleAccount: '',
        size: '',
        hsnCode: '',
        scheme: '',
        rateCalculate: '',
        clsStockIn: '',
        qtyInUnits: '',
        portalUOM: '',
        stockCalculate: '',
        typeOfGoods: '',
        stockValuation: '',
        qtyPerPcCase: '',
        minStockLevel: '',
        taxType: '206C(1H)/194Q',
        gstType: '',
      }))
      scrollToTop()
    }).catch(error => {
      toast.error("error occured")
      console.log(error)
    })
   
  };

  const userContext=useContext(UserContext)
  const rateCalculateOptions = ['None', 'Option 2', 'Option 3']; // Add your dropdown options here

  const taxTypeOptions = ['206C(1H)/194Q', 'Option 1', 'Option 2']; // Add your dropdown options here

  return isUserLoggedIn() ? (
    <Container>
      <h2 className='my-3 text-center fw-bold'>Stock Item Menu</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Left side of the form */}
            <Form.Group controlId="accountCode">
              <Form.Label>A/c Code</Form.Label>
              <Form.Control
                type="text"
                name="accountCode"
                value={formData.accountCode}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="openingStockQty">
              <Form.Label>Op. Stock in Qty</Form.Label>
              <Form.Control
                type="text"
                name="openingStockQty"
                value={formData.openingStockQty}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="openingStockRs">
              <Form.Label>Op. Stock in Rs</Form.Label>
              <Form.Control
                type="text"
                name="openingStockRs"
                value={formData.openingStockRs}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="groupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="purchaseRate">
              <Form.Label>Purchase Rate</Form.Label>
              <Form.Control
                type="text"
                name="purchaseRate"
                value={formData.purchaseRate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="mrp">
              <Form.Label>MRP</Form.Label>
              <Form.Control
                type="text"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="saleRate">
              <Form.Label>Sale Rate</Form.Label>
              <Form.Control
                type="text"
                name="saleRate"
                value={formData.saleRate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="totalGST">
              <Form.Label>Total GST @</Form.Label>
              <Form.Control
                type="text"
                name="totalGST"
                value={formData.totalGST}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="cgst">
              <Form.Label>CGST @</Form.Label>
              <Form.Control
                type="text"
                name="cgst"
                value={formData.cgst}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="sgst">
              <Form.Label>S.GST @</Form.Label>
              <Form.Control
                type="text"
                name="sgst"
                value={formData.sgst}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="purchaseAccount">
              <Form.Label>Purchase A/C</Form.Label>
              <Form.Control
                type="text"
                name="purchaseAccount"
                value={formData.purchaseAccount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="saleAccount">
              <Form.Label>Sale A/C</Form.Label>
              <Form.Control
                type="text"
                name="saleAccount"
                value={formData.saleAccount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="size">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="hsnCode">
              <Form.Label>HSN Code</Form.Label>
              <Form.Control
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="scheme">
              <Form.Label>Scheme @</Form.Label>
              <Form.Control
                type="text"
                name="scheme"
                value={formData.scheme}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Right side of the form */}
            <Form.Group controlId="rateCalculate">
              <Form.Label>Rate Calculate</Form.Label>
              <Form.Control
                as="select"
                name="rateCalculate"
                value={formData.rateCalculate}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="clsStockIn">
              <Form.Label>CLS Stock In</Form.Label>
              <Form.Control
                as="select"
                name="clsStockIn"
                value={formData.clsStockIn}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="qtyInUnits">
              <Form.Label>Qty. in UNITS</Form.Label>
              <Form.Control
                as="select"
                name="qtyInUnits"
                value={formData.qtyInUnits}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="portalUOM">
              <Form.Label>Portal UOM</Form.Label>
              <Form.Control
                as="select"
                name="portalUOM"
                value={formData.portalUOM}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="stockCalculate">
              <Form.Label>Stock Calculate</Form.Label>
              <Form.Control
                as="select"
                name="stockCalculate"
                value={formData.stockCalculate}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="typeOfGoods">
              <Form.Label>Type of Goods</Form.Label>
              <Form.Control
                as="select"
                name="typeOfGoods"
                value={formData.typeOfGoods}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="stockValuation">
              <Form.Label>Stk Valuation</Form.Label>
              <Form.Control
                as="select"
                name="stockValuation"
                value={formData.stockValuation}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="qtyPerPcCase">
              <Form.Label>Qty Per PC/Case</Form.Label>
              <Form.Control
                type="text"
                name="qtyPerPcCase"
                value={formData.qtyPerPcCase}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="minStockLevel">
              <Form.Label>Min Stock Level</Form.Label>
              <Form.Control
                type="text"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="gstType">
              <Form.Label>GST Type</Form.Label>
              <Form.Control
                as="select"
                name="gstType"
                value={formData.gstType}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Row className="mt-4">
              <Col>
                <Button variant="secondary my-2" onClick={()=>addNewData()}>Add New Data</Button>
                <Button variant="secondary" onClick={() => handleEvent('previous')} className="m-2">Previous</Button>
                <Button variant="secondary" onClick={() => handleEvent('next')} className="m-2">Next</Button>
                <Button variant="secondary" onClick={() => handleEvent('first')} className="m-2">First</Button>
                <Button variant="secondary" onClick={() => handleEvent('last')} className="m-2">Last</Button>
                <Button variant="danger" onClick={deleteData} className="float-right my-2">Delete</Button>
                <Button variant="success" type='submit' className="float-right m-2">Save</Button>
                {/* <Button variant="primary" className="float-right m-2">Search</Button> */}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Buttons */}

      </Form>
    </Container>
  ):
  <Navigate to="/"/>
};



export default StockItemMenu