import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Dropdown } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isUserLoggedIn, uomList } from "../auth/HelperAuth";
import { UserContext } from "../context/UserContext";
import { privateAxios } from "../services/AxiosService";
import {
  deleteStockItemMenuById,
  getStockItemMenuByAccountId,
  getStockItemMenuByAction,
  getUOMList,
  saveStockItemMenu,
} from "../services/StockItemMenuService";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  // makeStyles,
  // makeStyles,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material";
// const useStyles = makeStyles((theme) => ({
//   activeStepLabel: {
//     color: '#78C2AD', // Set the desired color for active step label
//   },
// }));

const StockItemMenu = React.memo(() => {
  // const useStyles = makeStyles(() => ({
  //   root: {
  //     "& .MuiStepIcon-active": { color: "red" },
  //     "& .MuiStepIcon-completed": { color: "green" },
  //     "& .Mui-disabled .MuiStepIcon-root": { color: "cyan" }
  //   }
  // }));
  const ActiveStepLabel = styled(StepLabel)(({ theme }) => ({
    "& .MuiStepIcon-active": { color: "red" },
    "& .MuiStepIcon-completed": { color: "green" },
    "& .Mui-disabled .MuiStepIcon-root": { color: "cyan" },
  }));
  // const c = useStyles();
  const [nextAccountCode, setNextAccountCode] = useState("");
  const [uomList, setUomList] = useState([]);
  // const classes = useStyles();
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
      getUOMList()
        .then((data) => {
          // toast.success(" data fetched")
          setUomList(data);
        })
        .catch((error) => {
          toast.error("error occurred");
        });
      scrollToTop();
    } else {
      fetchLastAccountCode();
      getUOMList()
        .then((data) => {
          // toast.success(" data fetched")
          setUomList(data);
        })
        .catch((error) => {
          toast.error("error occurred");
        });
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
      maxStockLevel: "",
      materialType: "",
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
    maxStockLevel: "",
    materialType: "",
    minStockLevel: "",
    taxType: "206C(1H)/194Q",
    gstType: "",
  });
  const validateAccountCode = (value) => {
    return value.trim() !== "" ? null : "A/c Code is required";
  };

  const validateName = (value) => {
    return value.trim() !== "" ? null : "Name is required";
  };

  const validateTotalGst = (value) => {
    return value + "".trim() !== "" ? null : "Total Gst is required";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = null;
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "accountCode":
        error = validateAccountCode(value);
        break;
      case "totalGST":
        error = validateTotalGst(value);
        break;
    }
    setFormData({ ...formData, [name]: value, [`${name}Error`]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveStockItemMenu(formData)
      .then(async (data) => {
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
          maxStockLevel: "",
          materialType: "",
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

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep == 0) {
      console.log("here");
      const nameError = validateName(formData?.name || "");
      const accountCodeError = validateAccountCode(formData?.accountCode || "");
      const totalGstError = validateTotalGst(formData?.totalGST || "");

      // Check if there are any validation errors
      if (nameError || accountCodeError || totalGstError) {
        // If there are errors, update the state to display them
        setFormData({
          ...formData,
          nameError: nameError,
          accountCodeError: accountCodeError,
          totalGstError: totalGstError,
        });
        toast.error("Fill All Required Fields");
        return; // Exit the function if there are errors
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ["Step 1", "Step 2", "Step 3"]; // Add your step labels here
  const theme = createTheme({
    overrides: {
      MuiStepIcon: {
        root: {
          "&$active": {
            color: "#78C2AD", // Set the desired color for active steps
          },
        },
      },
    },
  });

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Container fluid>
            <h5 className="fw-bold">Inventory Details </h5>
            <TextField
              className="mb-2"
              label="A/c Code"
              variant="standard"
              type="text"
              name="accountCode"
              value={formData.accountCode}
              disabled
              fullWidth
              error={Boolean(formData.accountCodeError)}
            />
            <TextField
              className="mb-2"
              label="Name"
              variant="standard"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={Boolean(formData.nameError)}
            />
            {formData.nameError && (
              <p className="error-message">{formData.nameError}</p>
            )}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  className="mb-2"
                  label="Op. Stock in Qty"
                  variant="standard"
                  type="number"
                  name="openingStockQty"
                  value={formData.openingStockQty}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="mb-2"
                  label="Op. Stock in Rs"
                  variant="standard"
                  type="number"
                  name="openingStockRs"
                  value={formData.openingStockRs}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend" className="m-0 p-0 mt-3">Item Category</FormLabel>
              <RadioGroup
                aria-label="groupName"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="Asset"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD;",
                        "&.Mui-checked": {
                          color: "#78C2AD;",
                        },
                      }}
                      size="small"
                      color="primary"
                    />
                  }
                  label="Asset"
                />
                <FormControlLabel
                  value="Non-Asset"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD;",
                        "&.Mui-checked": {
                          color: "#78C2AD;",
                        },
                      }}
                      size="small"
                      color="primary"
                    />
                  }
                  label="Non-Asset"
                />
              </RadioGroup>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  className="mb-2"
                  label="Purchase Rate"
                  variant="standard"
                  type="number"
                  name="purchaseRate"
                  value={formData.purchaseRate}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className="mb-2"
                  label="MRP"
                  variant="standard"
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className="mb-2"
                  label="Margin %"
                  variant="standard"
                  type="number"
                  name="saleRate"
                  value={formData.saleRate}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={12}>
                <FormControl
                  component="fieldset"
                  error={formData.totalGstError}
                >
                  <FormLabel component="legend">Total GST @</FormLabel>
                  <RadioGroup
                    aria-label="totalGST"
                    name="totalGST"
                    value={formData.totalGST.toString()}
                    onChange={(e) => {
                      let error = validateTotalGst(e.target.value);
                      const gstValue = parseFloat(e.target.value);
                      setFormData({
                        ...formData,
                        totalGST: gstValue,
                        totalGstError: error,
                        cgst: gstValue / 2,
                        sgst: gstValue / 2,
                      });
                    }}
                    row
                  >
                    <FormControlLabel
                      value="0"
                      control={
                        <Radio
                          size="small"
                          color="primary"
                          sx={{
                            color: "#78C2AD;",
                            "&.Mui-checked": {
                              color: "#78C2AD;",
                            },
                          }}
                        />
                      }
                      label="0"
                    />
                    <FormControlLabel
                      value="5"
                      control={
                        <Radio
                          sx={{
                            color: "#78C2AD;",
                            "&.Mui-checked": {
                              color: "#78C2AD;",
                            },
                          }}
                          size="small"
                          color="primary"
                        />
                      }
                      label="5"
                    />
                    <FormControlLabel
                      value="12"
                      control={
                        <Radio
                          sx={{
                            color: "#78C2AD;",
                            "&.Mui-checked": {
                              color: "#78C2AD;",
                            },
                          }}
                          size="small"
                          color="primary"
                        />
                      }
                      label="12"
                    />
                    <FormControlLabel
                      value="18"
                      control={
                        <Radio
                          sx={{
                            color: "#78C2AD;",
                            "&.Mui-checked": {
                              color: "#78C2AD;",
                            },
                          }}
                          size="small"
                          color="primary"
                        />
                      }
                      label="18"
                    />
                    <FormControlLabel
                      value="28"
                      control={
                        <Radio
                          sx={{
                            color: "#78C2AD;",
                            "&.Mui-checked": {
                              color: "#78C2AD;",
                            },
                          }}
                          size="small"
                          color="primary"
                        />
                      }
                      label="28"
                    />
                  </RadioGroup>
                  <FormHelperText>{formData.totalGstError}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={6}>
                <TextField
                  className="mb-2"
                  label="CGST @"
                  variant="standard"
                  type="number"
                  name="cgst"
                  value={formData.cgst}
                  onChange={handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={4} sm={6}>
                <TextField
                  className="mb-2"
                  label="S.GST @"
                  variant="standard"
                  type="number"
                  name="sgst"
                  value={formData.sgst}
                  onChange={handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
          </Container>
        );
      case 1:
        return (
          <Container fluid>
            <h5 className="fw-bold">Product Details</h5>
            <Grid container spacing={2} className="">
              <Grid item xs={6} className="mt-0">
                <TextField
                  className="mb-2 mt-0"
                  label="Purchase A/C"
                  variant="standard"
                  type="text"
                  name="purchaseAccount"
                  value={formData.purchaseAccount}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="mb-2"
                  label="Sale A/C"
                  variant="standard"
                  type="text"
                  name="saleAccount"
                  value={formData.saleAccount}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  className="mb-2"
                  label="Size"
                  variant="standard"
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className="mb-2"
                  label="HSN Code"
                  variant="standard"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
            </Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend">Material Type</FormLabel>
              <RadioGroup
                aria-label="materialType"
                name="materialType"
                value={formData.materialType}
                onChange={handleChange}
                row
              >
                <FormControlLabel
                  value="Consumables"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD",
                        "&.Mui-checked": { color: "#78C2AD" },
                        size: "small",
                      }}
                    />
                  }
                  label="Consumables"
                />
                <FormControlLabel
                  value="Machinery"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD",
                        "&.Mui-checked": { color: "#78C2AD" },
                        size: "small",
                      }}
                    />
                  }
                  label="Machinery"
                />
                <FormControlLabel
                  value="Equipment"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD",
                        "&.Mui-checked": { color: "#78C2AD" },
                        size: "small",
                      }}
                    />
                  }
                  label="Equipment"
                />
                <FormControlLabel
                  value="Raw Material"
                  control={
                    <Radio
                      sx={{
                        color: "#78C2AD",
                        "&.Mui-checked": { color: "#78C2AD" },
                        size: "small",
                      }}
                    />
                  }
                  label="Raw Material"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth variant="standard">
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
            <FormControl fullWidth variant="standard">
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
            {/* <FormControl fullWidth variant="standard" >
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
            </FormControl> */}
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="portalUOM">
                Portal UOM (Units of Measurement)
              </InputLabel>
              <Select
                label="Portal UOM (Units of Measurement)"
                name="portalUOM"
                value={formData.portalUOM}
                onChange={handleChange}
              >
                {uomList.map((option, index) => (
                  <MenuItem key={index} value={option.quantity}>
                    {option.quantity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard">
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
          </Container>
        );
      case 2:
        return (
          <Container fluid>
            <h5 className="fw-bold">Inventory Classification </h5>
            <FormControl fullWidth variant="standard">
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
            <FormControl fullWidth variant="standard">
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
              className="mb-2"
              label="Qty Per PC/Case"
              variant="standard"
              type="text"
              name="qtyPerPcCase"
              value={formData.qtyPerPcCase}
              onChange={handleChange}
              fullWidth
            />
            <Grid container>
              <Grid item sm={6}>
                <TextField
                  className="mb-2 me-2"
                  label="Min Stock Level"
                  variant="standard"
                  type="text"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  className="mb-2 ms-2"
                  label="Max Stock Level"
                  variant="standard"
                  type="text"
                  name="maxStockLevel"
                  value={formData.maxStockLevel}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            {/* <FormControl fullWidth variant="standard">
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
            </FormControl> */}
          </Container>
        );
      default:
        return "Unknown step";
    }
  };
  return isUserLoggedIn() ? (
    <Container className="mt-3">
      <h4 className={`fw-bold`}>Stock Item Menu</h4>
      <div>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step
              key={label}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#78C2AD", // circle color (COMPLETED)
                },
                "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500", // Just text label (COMPLETED)
                  },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#78C2AD", // circle color (ACTIVE)
                },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500", // Just text label (ACTIVE)
                  },
                "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                  fill: "white", // circle's number (ACTIVE)
                },
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="d-flex justify-content-center mt-3">
          <Paper elevation={3} style={{ padding: "20px" }} className="w-custom">
            <Typography>{getStepContent(activeStep)}</Typography>
            <Container className="mt-3">
              <Grid container spacing={2}>
                {/* <Grid item>
              { (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={()=>handleEvent("first")}
                >
                  Get First Data
                </Button>
              )}
            </Grid>
            <Grid item>
              { (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={()=>handleEvent("last")}
                >
                 Get Last Data
                </Button>
              )}
            </Grid>
            <Grid item>
              { (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={()=>handleEvent("previous")}
                >
                 Get Previous Data
                </Button>
              )}
            </Grid>
            <Grid item>
              { (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={()=>handleEvent("next")}
                >
                 Get Next Data
                </Button>
              )}
            </Grid> */}
                {activeStep !== 0 && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      className="bg-danger"
                      onClick={handleBack}
                    >
                      Previous
                    </Button>
                  </Grid>
                )}
                {activeStep !== steps.length - 1 && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      // color="primary"
                      style={{ backgroundColor: "#78C2AD" }}
                      // className="bg-primary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Grid>
                )}

                {activeStep === steps.length - 1 && (
                  <Grid item>
                    <Button
                      size="small"
                      variant="contained"
                      // color="success"
                      className="bg-success"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Save
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Container>
          </Paper>
        </div>
      </div>
    </Container>
  ) : (
    <Navigate to="/" />
  );
});

export default StockItemMenu;
