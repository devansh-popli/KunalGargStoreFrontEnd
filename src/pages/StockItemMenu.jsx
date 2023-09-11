import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isUserLoggedIn } from "../auth/HelperAuth";
import { UserContext } from "../context/UserContext";
import { privateAxios } from "../services/AxiosService";
import {
  deleteStockItemMenuById,
  getStockItemMenuByAccountId,
  getStockItemMenuByAction,
  saveStockItemMenu,
} from "../services/StockItemMenuService";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const StockItemMenu = () => {
  const [nextAccountCode, setNextAccountCode] = useState("");

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getStockItemMenuByAccountId(id)
        .then((data) => {
          // toast.success(" data fetched")
          setFormData(data);
        })
        .catch((error) => {
          toast.error("error occurred");
        });
      scrollToTop();
    } else {
      fetchLastAccountCode();
    }
  }, [id]);
  const handleEvent = (action) => {
    getStockItemMenuByAction(action, formData.accountCode)
      .then((data) => {
        toast.success(action + " data fetched");
        setFormData(data);
      })
      .catch((error) => {
        if (error.response.data.message == "source cannot be null") {
          toast.error("No data present");
        } else {
          toast.error("error occurred");
        }
      });
    scrollToTop();
  };
  const addNewData = async () => {
    await fetchLastAccountCode();
    setFormData((prevData) => ({
      ...prevData,
      stockItemId: "",
      name: "",
      openingStockQty: "",
      openingStockRs: "",
      groupName: "",
      purchaseRate: "",
      mrp: "",
      saleRate: "",
      totalGST: "",
      cgst: "",
      sgst: "",
      purchaseAccount: "",
      saleAccount: "",
      size: "",
      hsnCode: "",
      scheme: "",
      rateCalculate: "",
      clsStockIn: "",
      qtyInUnits: "",
      portalUOM: "",
      stockCalculate: "",
      typeOfGoods: "",
      stockValuation: "",
      qtyPerPcCase: "",
      minStockLevel: "",
      taxType: "206C(1H)/194Q",
      gstType: "",
    }));
    scrollToTop();
  };
  const deleteData = () => {
    deleteStockItemMenuById(formData.stockItemId)
      .then(async (data) => {
        toast.success("Stock Item Deleted Successfully");
        await fetchLastAccountCode();
        setFormData((prevData) => ({
          ...prevData,
          stockItemId: "",
          name: "",
          openingStockQty: "",
          openingStockRs: "",
          groupName: "",
          purchaseRate: "",
          mrp: "",
          saleRate: "",
          totalGST: "",
          cgst: "",
          sgst: "",
          purchaseAccount: "",
          saleAccount: "",
          size: "",
          hsnCode: "",
          scheme: "",
          rateCalculate: "",
          clsStockIn: "",
          qtyInUnits: "",
          portalUOM: "",
          stockCalculate: "",
          typeOfGoods: "",
          stockValuation: "",
          qtyPerPcCase: "",
          minStockLevel: "",
          taxType: "206C(1H)/194Q",
          gstType: "",
        }));
      })
      .catch((error) => {
        toast.error("error occured successfully");
      });
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Add smooth scrolling behavior for a nicer user experience
    });
  };
  const fetchLastAccountCode = async () => {
    await privateAxios
      .get("/api/v1/lastAccountCode")
      .then((response) => {
        const lastAccountCode = response.data;
        // Generate the next account code
        const nextNumericPart = parseInt(lastAccountCode.split("-")[1]) + 1;
        setNextAccountCode(`abc-${String(nextNumericPart).padStart(3, "0")}`);
        setFormData({
          ...formData,
          accountCode: `abc-${String(nextNumericPart).padStart(3, "0")}`,
        });
      })
      .catch((error) => {
        console.error("Error fetching last account code:", error);
      });
  };
  // useEffect(() => {
  //   // Fetch the last account code from the backend

  // }, []);
  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    openingStockQty: "",
    openingStockRs: "",
    groupName: "",
    purchaseRate: "",
    mrp: "",
    saleRate: "",
    totalGST: "",
    cgst: "",
    sgst: "",
    purchaseAccount: "",
    saleAccount: "",
    size: "",
    hsnCode: "",
    scheme: "",
    rateCalculate: "",
    clsStockIn: "",
    qtyInUnits: "",
    portalUOM: "",
    stockCalculate: "",
    typeOfGoods: "",
    stockValuation: "",
    qtyPerPcCase: "",
    minStockLevel: "",
    taxType: "206C(1H)/194Q",
    gstType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveStockItemMenu(formData)
      .then(async (data) => {
        console.log(data);
        toast.success("data saved successfully");
        await fetchLastAccountCode();
        setFormData((prevData) => ({
          ...prevData,
          name: "",
          openingStockQty: "",
          openingStockRs: "",
          groupName: "",
          purchaseRate: "",
          mrp: "",
          saleRate: "",
          totalGST: "",
          cgst: "",
          sgst: "",
          purchaseAccount: "",
          saleAccount: "",
          size: "",
          hsnCode: "",
          scheme: "",
          rateCalculate: "",
          clsStockIn: "",
          qtyInUnits: "",
          portalUOM: "",
          stockCalculate: "",
          typeOfGoods: "",
          stockValuation: "",
          qtyPerPcCase: "",
          minStockLevel: "",
          taxType: "206C(1H)/194Q",
          gstType: "",
        }));
        scrollToTop();
      })
      .catch((error) => {
        toast.error("error occured");
        console.log(error);
      });
  };

  const userContext = useContext(UserContext);
  const rateCalculateOptions = ["None", "Option 2", "Option 3"]; // Add your dropdown options here

  const taxTypeOptions = ["206C(1H)/194Q", "Option 1", "Option 2"]; // Add your dropdown options here

  return isUserLoggedIn() ? (
    <Container>
      <h2 className="my-3 text-center fw-bold">Stock Item Menu</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Left side of the form */}
            <TextField
              fullWidth
              margin="normal"
              label="A/c Code"
              id="standard-basic"
              variant="standard"
              type="text"
              name="accountCode"
              value={formData.accountCode}
              disabled
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              id="standard-basic"
              variant="standard"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Op. Stock in Qty"
              id="standard-basic"
              variant="standard"
              type="number"
              name="openingStockQty"
              value={formData.openingStockQty}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Op. Stock in Rs"
              id="standard-basic"
              variant="standard"
              type="number"
              name="openingStockRs"
              value={formData.openingStockRs}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Group Name"
              id="standard-basic"
              variant="standard"
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Purchase Rate"
              id="standard-basic"
              variant="standard"
              type="number"
              name="purchaseRate"
              value={formData.purchaseRate}
              onChange={handleChange}
            />
            <Row>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="MRP"
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Sale Rate"
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  name="saleRate"
                  value={formData.saleRate}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Total GST @"
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  name="totalGST"
                  value={formData.totalGST}
                  onChange={(e)=>{
                    // handleChange(e)
                    setFormData({...formData,totalGST:e.target.value,"cgst":e.target.value/2,"sgst":e.target.value/2})
                  }}
                />
              </Col>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="CGST @"
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  name="cgst"
                  value={formData.cgst}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="S.GST @"
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  name="sgst"
                  value={formData.sgst}
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <TextField
              fullWidth
              margin="normal"
              label="Purchase A/C"
              id="standard-basic"
              variant="standard"
              type="text"
              name="purchaseAccount"
              value={formData.purchaseAccount}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Sale A/C"
              id="standard-basic"
              variant="standard"
              type="text"
              name="saleAccount"
              value={formData.saleAccount}
              onChange={handleChange}
            />
            <Row>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Size"
                  id="standard-basic"
                  variant="standard"
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <TextField
                  fullWidth
                  margin="normal"
                  label="HSN Code"
                  id="standard-basic"
                  variant="standard"
                  type="text"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            {/* 
              <TextField fullWidth  margin="normal" label="Scheme @" id="standard-basic" variant="standard"
                type="text"
                name="scheme"
                value={formData.scheme}
                onChange={handleChange}
              />*/}
          </Col>

          <Col md={6}>
            {/* Right side of the form */}
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="rateCalculate">Rate Calculate</InputLabel>
              <Select
                label="Rate Calculate"
                name="rateCalculate"
                value={formData.rateCalculate}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="clsStockIn">CLS Stock In</InputLabel>
              <Select
                label="CLS Stock In"
                name="clsStockIn"
                value={formData.clsStockIn}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="qtyInUnits">Qty. in UNITS</InputLabel>
              <Select
                label="Qty. in UNITS"
                name="qtyInUnits"
                value={formData.qtyInUnits}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="portalUOM">Portal UOM (Units of Measurement)</InputLabel>
              <Select
                label="Portal UOM (Units of Measurement)"
                name="portalUOM"
                value={formData.portalUOM}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="stockCalculate">Stock Calculate</InputLabel>
              <Select
                label="Stock Calculate"
                name="stockCalculate"
                value={formData.stockCalculate}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="typeOfGoods">Type of Goods</InputLabel>
              <Select
                label="Type of Goods"
                name="typeOfGoods"
                value={formData.typeOfGoods}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="stockValuation">Stk Valuation</InputLabel>
              <Select
                label="Stk Valuation"
                name="stockValuation"
                value={formData.stockValuation}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Qty Per PC/Case"
              id="standard-basic"
              variant="standard"
              type="text"
              name="qtyPerPcCase"
              value={formData.qtyPerPcCase}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Min Stock Level"
              id="standard-basic"
              variant="standard"
              type="text"
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
            />
            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel htmlFor="gstType">GST Type</InputLabel>
              <Select
                label="GST Type"
                name="gstType"
                value={formData.gstType}
                onChange={handleChange}
              >
                {rateCalculateOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            

            <Row className="mt-4">
              <Col>
                <Button variant="secondary my-2" onClick={() => addNewData()}>
                  Add New Data
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEvent("previous")}
                  className="m-2"
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEvent("next")}
                  className="m-2"
                >
                  Next
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEvent("first")}
                  className="m-2"
                >
                  First
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleEvent("last")}
                  className="m-2"
                >
                  Last
                </Button>
                <Button
                  variant="danger"
                  onClick={deleteData}
                  className="float-right my-2"
                >
                  Delete
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  className="float-right m-2"
                >
                  Save
                </Button>
                {/* <Button variant="primary" className="float-right m-2">Search</Button> */}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Buttons */}
      </Form>
    </Container>
  ) : (
    <Navigate to="/" />
  );
};

export default StockItemMenu;
