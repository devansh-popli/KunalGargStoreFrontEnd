import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextareaAutosize,
  Container,
  Paper,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Navigate, useParams } from "react-router-dom";
import {
  deleteStockItemMenuById,
  getStockItemMenuByAccountId,
  getStockItemMenuByAction,
  saveStockItemMenu,
} from "../services/StockItemMenuService";
import { privateAxios } from "../services/AxiosService";
import {
  deleteLedgerAccountById,
  getLedgerAccountByAccountId,
  getLedgerAccountByAction,
  saveLedgerAccount,
} from "../services/LedgerAccountService";
import { states } from "../auth/HelperAuth";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Delete } from "@mui/icons-material";
import useJwtChecker from "../helper/useJwtChecker";
const NewLedgerAccountForm = React.memo(() => {
  const [nextAccountCode, setNextAccountCode] = useState("");

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getLedgerAccountByAccountId(id)
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
    getLedgerAccountByAction(action, formData.accountCode)
      .then((data) => {
        toast.success(action + " data fetched");
        setFormData((prevData) => ({
          ...prevData,
          id: data?.id || "",
          accountCode: data?.accountCode || "",
          gstNo: data?.gstNo || "",
          accountName: data?.accountName || "",
          address: data?.address || "",
          city: data?.city || "",
          pincode: data?.pincode || "",
          state: data?.state || "",
          openingBalance: data?.openingBalance || "",
          msmedStatus: data?.msmedStatus || "",
          contactNo: data?.contactNo || "",
          email: data?.email || "",
          pan: data?.pan || "",
          turnoverBelow10Cr: data?.turnoverBelow10Cr || "",
          approved: data?.approved || "",
          accountNum: data?.accountNum || "",
          accountNameBank: data?.accountNameBank || "",
          ifsc: data?.ifsc || "",
          branch: data?.branch || "",
        }));
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
      gstNo: "",
      accountName: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      openingBalance: "",
      msmedStatus: "",
      contactNo: "",
      email: "",
      pan: "",
      turnoverBelow10Cr: "",
      approved: "",
      accountNum: "",
      accountNameBank: "",
      ifsc: "",
      branch: "",
    }));
    scrollToTop();
  };
  const deleteData = () => {
    deleteLedgerAccountById(formData.id)
      .then(async (data) => {
        toast.success("Stock Item Deleted Successfully");
        await fetchLastAccountCode();
        setFormData((prevData) => ({
          ...prevData,
          accountCode: "",
          gstNo: "",
          accountName: "",
          address: "",
          city: "",
          pincode: "",
          state: "",
          openingBalance: "",
          msmedStatus: "",
          contactNo: "",
          email: "",
          pan: "",
          turnoverBelow10Cr: "",
          approved: "",
          accountNum: "",
          accountNameBank: "",
          ifsc: "",
          branch: "",
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
      .get("/api/ledger-accounts/lastAccountCode")
      .then((response) => {
        const lastAccountCode = response.data;
        // Generate the next account code
        const nextNumericPart = parseInt(lastAccountCode.split("-")[1]) + 1;
        setNextAccountCode(`abc-${String(nextNumericPart).padStart(3, "0")}`);
        setFormData({
          accountCode: `abc-${String(nextNumericPart).padStart(3, "0")}`,
        });
      })
      .catch((error) => {
        console.error("Error fetching last account code:", error);
      });
  };

  const [formData, setFormData] = useState({
    accountCode: "",
    gstNo: "",
    accountName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    openingBalance: "",
    msmedStatus: "",
    contactNo: "",
    email: "",
    pan: "",
    turnoverBelow10Cr: "",
    approved: "",
    accountNum: "",
    accountNameBank: "",
    ifsc: "",
    branch: "",
  });
  const fetchGSTINDetails = () => {
    privateAxios
      .get(`/auth/search/gst?gstin=${formData.gstNo}`)
      .then((data) => {
        const completeAddress = `${data.data.pradr?.addr?.bno || ""}, ${
          data.data.pradr?.addr?.bnm || ""
        }, ${data.data.pradr?.addr?.st || ""}, ${
          data.data.pradr?.addr?.loc || ""
        }, ${data.data.pradr?.addr?.dst || ""}, ${
          data.data.pradr?.addr?.stcd || ""
        } - ${data.data.pradr?.addr?.pncd || ""}`;
        const firstTwoDigits = formData.gstNo.substring(0, 2);
        const state = stateList.filter(
          (state) => state?.code === firstTwoDigits
        )[0];
        setFormData({
          ...formData,
          gstNo: formData.gstNo.toUpperCase(),
          accountName: data.data.tradeNam,
          accountNameBank: data.data.tradeNam,
          pan: formData.gstNo.substring(2, 12),
          address: completeAddress || "",
          city: data.data.pradr?.addr.loc || "",
          pincode: data.data.pradr?.addr.pncd || "",
          state: state?.state.trim(),
        });
      })
      .catch((error) => {
        toast.error("Error Occurred in fetching gst details");
      });
  };
  const validateAccountName = (value) => {
    return value.trim() !== "" ? null : "A/c Name is required";
  };

  const validateAccountCode = (value) => {
    return value.trim() !== "" ? null : "A/c Code is required";
  };
  const validateApprovedSupplier = (value) => {
    return value.trim() !== "" ? null : "Supplier or Customer is required";
  };

  const validateCity = (value) => {
    return value.trim() !== "" ? null : "City is required";
  };

  const validateState = (value) => {
    return value.trim() !== "" ? null : "State is required";
  };

  const validateContactNo = (value) => {
    // Add your specific validation logic for contact number
    return value.trim() !== "" ? null : "Contact No is required";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let error = null;
    switch (name) {
      case "accountName":
        error = validateAccountName(value);
        break;
      case "accountCode":
        error = validateAccountCode(value);
        break;
      case "approved":
        error = validateApprovedSupplier(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "state":
        error = validateState(value);
        break;
      case "contactNo":
        error = validateContactNo(value);
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: value,
      [`${name}Error`]: error,
    });
  };

  const handleSubmit = async (e) => {
    // You can handle form submission logic here
    e.preventDefault();
    // Validate form fields
    const accountNameError = validateAccountName(formData?.accountName || "");
    const accountCodeError = validateAccountCode(formData?.accountCode || "");
    const cityError = validateCity(formData?.city || "");
    const stateError = validateState(formData?.state || "");
    const contactNoError = validateContactNo(formData?.contactNo || "");
    const approvedError = validateApprovedSupplier(formData?.approved || "");

    // Check if there are any validation errors
    if (
      accountNameError ||
      accountCodeError ||
      approvedError ||
      cityError ||
      stateError ||
      contactNoError
    ) {
      // If there are errors, update the state to display them
      setFormData({
        ...formData,
        accountNameError: accountNameError,
        accountCodeError: accountCodeError,
        approvedError: approvedError,
        cityError: cityError,
        stateError: stateError,
        contactNoError: contactNoError,
      });
      toast.error("Fill All Required Fields");
      return; // Exit the function if there are errors
    }
    await saveLedgerAccount(formData)
      .then(async (data) => {
        toast.success("data saved successfully");
        await fetchLastAccountCode();
        setFormData((prevData) => ({
          ...prevData,
          gstNo: "",
          accountName: "",
          address: "",
          city: "",
          pincode: "",
          state: "",
          openingBalance: "",
          msmedStatus: "",
          contactNo: "",
          email: "",
          pan: "",
          turnoverBelow10Cr: "",
          approved: "",
          accountNum: "",
          accountNameBank: "",
          ifsc: "",
          branch: "",
        }));
        scrollToTop();
      })
      .catch((error) => {
        toast.error("error occured");
        console.log(error);
      });
  };
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setFormData({ ...formData, approved: event.target.value });
  };
  const stateList = states;
  const userContext = useContext(UserContext);
  const jetChecker = useJwtChecker();
  return userContext.isLogin ? (
    <Container className="mt-3">
      {/* {JSON.stringify(formData)} */}
      <div className="d-flex justify-content-center">
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px" }}
          className="w-100"
        >
          <h4 className="fw-bold mb-3">New Ledger Account Form</h4>
          <div className="d-flex">
          <form onSubmit={handleSubmit} className="w-60">
            <Grid
              className="myGridItem"
              container
              spacing={3}
              alignItems={"center"}
            >
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="A/c Code"
                  name="accountCode"
                  disabled
                  value={formData.accountCode}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formData.accountCodeError)}
                />
                {formData.accountCodeError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.accountCodeError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={6}>
                <RadioGroup
                  aria-label="supplier-customer"
                  name="supplier-customer-group"
                  value={formData.approved}
                  onChange={handleOptionChange}
                  style={{ display: "flex", flexDirection: "row" }}
                  error={Boolean(formData.approvedError)}
                >
                  <FormControlLabel
                    value="supplier"
                    control={<Radio color="primary" />}
                    label="Supplier"
                  />
                  <FormControlLabel
                    value="customer"
                    control={<Radio color="primary" />}
                    label="Customer"
                  />
                </RadioGroup>
                {formData.approvedError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.approvedError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem mx-1" item xs={8} sm={4}>
                <TextField
                  label="GST No."
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={(event) => {
                    const firstTwoDigits = event.target.value.substring(0, 2);

                    // Find the state corresponding to the first two digits
                    const state = stateList.filter(
                      (state) => state?.code === firstTwoDigits
                    )[0];
                    // if (event.target.value.length == 15) {

                    // }
                    setFormData({
                      ...formData,
                      gstNo: event.target.value.toUpperCase(),
                      pan: event.target.value.substring(2, 12).toUpperCase(),
                      state: state?.state.trim(),
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" xs={3} sm={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ fontSize: "11px" }}
                  className="mt-1 mx-2 "
                  onClick={() => fetchGSTINDetails()}
                >
                  fetch gst Details
                </Button>
              </Grid>
              {/* {stateList.filter(state=>state.code=='04')[0].state} */}
              {/* {formData.state} */}
              {/* <Grid className="myGridItem"
            item
            xs={12}
            spacing={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid className="myGridItem" item xs={8} className="mx-1" sm={6}>
              <TextField
                label="GST No."
                
                name="gstNo"
                value={formData.gstNo}
                onChange={(event) => {
                  const firstTwoDigits = event.target.value.substring(0, 2);

                  // Find the state corresponding to the first two digits
                  const state = stateList.filter(
                    (state) => state?.code === firstTwoDigits
                  )[0];
                  // if (event.target.value.length == 15) {

                  // }
                  setFormData({
                    ...formData,
                    gstNo: event.target.value.toUpperCase(),
                    pan: event.target.value.substring(2, 12).toUpperCase(),
                    state: state?.state.trim(),
                  });
                }}
                fullWidth
              />
            </Grid>
            <Grid className="myGridItem" xs={4} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                 className="my-2"
                onClick={() => fetchGSTINDetails()}
              >
                fetch gst Details
              </Button>
            </Grid>
          </Grid> */}
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="A/c Name"
                  name="accountName"
                  value={formData.accountName}
                  onChange={(event) => {
                    // handleChange()
                    let error = validateAccountName(event.target.value);
                    setFormData({
                      ...formData,
                      accountName: event.target.value,
                      accountNameBank: event.target.value,
                      [`accountNameError`]: error,
                    });
                  }}
                  fullWidth
                  error={Boolean(formData.accountNameError)}
                />
                {formData.accountNameError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.accountNameError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>MSMED Status</InputLabel>
                  <Select
                    name="msmedStatus"
                    value={formData.msmedStatus}
                    onChange={handleChange}
                  >
                    <MenuItem value="Micro Enterprises">
                      Micro Enterprises
                    </MenuItem>
                    <MenuItem value="Small Enterprises">
                      Small Enterprises
                    </MenuItem>
                    <MenuItem value="Medium Enterprises">
                      Medium Enterprises
                    </MenuItem>
                    <MenuItem value="Not Covered in MSMED">
                      Not Covered in MSMED
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Opening Balance"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={12}>
                  <TextField
                    label="Address"
                    // Set the desired variant here
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    fullWidth
                    rows={2}
                    maxRows={4}
                  />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formData.cityError)}
                />
                {formData.cityError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.cityError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={Boolean(formData.stateError)}
                  >
                    {stateList.map((state) => (
                      <MenuItem value={state.state}>{state.state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.stateError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.stateError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>

              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Contact No."
                  name="contactNo"
                  type="number"
                  value={formData.contactNo}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formData.contactNoError)}
                />
                {formData.contactNoError && (
                  <div
                    className="error-message"
                    style={{ position: "absolute" }}
                  >
                    {formData.contactNoError}
                  </div>
                )}
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Email Id/Area"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="PAN"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <FormLabel component="legend">Turnover Below 10 Cr</FormLabel>
                <RadioGroup
                  aria-label="turnoverBelow10Cr"
                  name="turnoverBelow10Cr"
                  value={formData.turnoverBelow10Cr}
                  onChange={handleChange}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio color="primary" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio color="primary" />}
                    label="No"
                  />
                </RadioGroup>
              </Grid>
              {/* <Grid className="myGridItem" item xs={12} sm={6}>
                <FormControl fullWidth >
                  <InputLabel>Whether Approved</InputLabel>
                  <Select
                    name="approved"
                    value={formData.approved}
                    onChange={handleChange}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Account Num"
                  name="accountNum"
                  value={formData.accountNum}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Account Name"
                  name="accountNameBank"
                  value={formData.accountNameBank}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="IFSC"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid className="myGridItem" item xs={12} sm={4}>
                <TextField
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Container fluid>
              <Row className="mt-2">
                <Col>
                  {/* <Button
                    size="small"
                    variant="contained"
                    
                    style={{ backgroundColor: "#78C2AD", color: "white" }}
                  >
                    Add New Data
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    
                    style={{ backgroundColor: "#F2A73D", color: "white" }}
                    className="m-2"
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    
                    style={{ backgroundColor: "#FF5E5B", color: "white" }}
                    className="m-2"
                  >
                    Next
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    
                    style={{ backgroundColor: "#55B4B0", color: "white" }}
                    className="m-2"
                  >
                    First
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    
                    style={{ backgroundColor: "#ACD7E5", color: "white" }}
                    className="m-2"
                  >
                    Last
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    
                    style={{ backgroundColor: "#F17300", color: "white" }}
                    className="float-right my-2"
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    variant="contained"
                    color="success"
                    
                    style={{ backgroundColor: "#1DB954", color: "white" }}
                    className="float-right m-2"
                  >
                    Save
                  </Button> */}
                  <div className="d-flex justify-content-end">
                    <Tooltip title="Delete">
                      <IconButton onClick={deleteData}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Previous Data">
                      <IconButton onClick={() => handleEvent("previous")}>
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Next Data">
                      <IconButton onClick={() => handleEvent("next")}>
                        <ArrowForwardIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add New Data">
                      <IconButton onClick={() => addNewData()}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Go to First Page">
                      <IconButton onClick={() => handleEvent("first")}>
                        <FirstPageIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Go to Last Page">
                      <IconButton onClick={() => handleEvent("last")}>
                        <LastPageIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save">
                      <IconButton onClick={handleSubmit}>
                        <SaveIcon style={{ color: "#78C2AD" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            </Container>
          </form>
          <div className="w-30 text-center mt-5 ms-5 isDesktop">
            <img src="../../ledger.jpg" className="w-100" alt="" />
          </div>      
          </div>
        </Paper>
      </div>
    </Container>
  ) : (
    <Navigate to={"/"} />
  );
});

export default NewLedgerAccountForm;
