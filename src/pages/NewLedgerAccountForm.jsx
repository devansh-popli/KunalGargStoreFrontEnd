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
} from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
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

function NewLedgerAccountForm() {
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
          ...formData,
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
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    // You can handle form submission logic here
    e.preventDefault();
    await saveLedgerAccount(formData)
      .then(async (data) => {
        console.log(data);
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

  const stateList = states;
  const userContext = useContext(UserContext);
  return userContext.isLogin ? (
    <Container>
      {/* {JSON.stringify(formData)} */}
      <h2 className="fw-bold">New Ledger Account Form</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="A/c Code"
              variant="standard"
              name="accountCode"
              disabled
              value={formData.accountCode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={8} className="mx-1" sm={4}>
            <TextField
              label="GST No."
              variant="standard"
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
          <Grid xs={4} sm={3}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className="mt-5 mx-3"
              onClick={() => fetchGSTINDetails()}
            >
              fetch gst Details
            </Button>
          </Grid>
          {/* {stateList.filter(state=>state.code=='04')[0].state} */}
          {/* {formData.state} */}
          {/* <Grid
            item
            xs={12}
            spacing={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Grid item xs={8} className="mx-1" sm={6}>
              <TextField
                label="GST No."
                variant="standard"
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
            <Grid xs={4} sm={6}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              label="A/c Name"
              variant="standard"
              name="accountName"
              value={formData.accountName}
              onChange={(event) => {
                // handleChange()
                setFormData({
                  ...formData,
                  accountName: event.target.value,
                  accountNameBank: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel>MSMED Status</InputLabel>
              <Select
                name="msmedStatus"
                value={formData.msmedStatus}
                onChange={handleChange}
              >
                <MenuItem value="Micro Enterprises">Micro Enterprises</MenuItem>
                <MenuItem value="Small Enterprises">Small Enterprises</MenuItem>
                <MenuItem value="Medium Enterprises">
                  Medium Enterprises
                </MenuItem>
                <MenuItem value="Not Covered in MSMED">
                  Not Covered in MSMED
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Opening Balance"
              variant="standard"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <TextField
                label="Address"
                variant="standard" // Set the desired variant here
                name="address"
                value={formData.address}
                onChange={handleChange}
                // multiline
                // rows={3}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              variant="standard"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="standard">
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                {stateList.map((state) => (
                  <MenuItem value={state.state}>{state.state}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Pincode"
              variant="standard"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Grid>
        
        
          <Grid item xs={12} sm={4}>
            <TextField
              label="Contact No."
              variant="standard"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email Id/Area"
              variant="standard"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="PAN"
              variant="standard"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Turnover Below 10 Cr</InputLabel>
              <Select
                name="turnoverBelow10Cr"
                value={formData.turnoverBelow10Cr}
                onChange={handleChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="standard">
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Num"
              variant="standard"
              name="accountNum"
              value={formData.accountNum}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Name (same as firm name)"
              variant="standard"
              name="accountNameBank"
              value={formData.accountNameBank}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IFSC"
              variant="standard"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Branch"
              variant="standard"
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
              <Button
                variant="contained"
                onClick={() => addNewData()}
                style={{ backgroundColor: "#78C2AD", color: "white" }}
              >
                Add New Data
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEvent("previous")}
                style={{ backgroundColor: "#F2A73D", color: "white" }}
                className="m-2"
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEvent("next")}
                style={{ backgroundColor: "#FF5E5B", color: "white" }}
                className="m-2"
              >
                Next
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEvent("first")}
                style={{ backgroundColor: "#55B4B0", color: "white" }}
                className="m-2"
              >
                First
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEvent("last")}
                style={{ backgroundColor: "#ACD7E5", color: "white" }}
                className="m-2"
              >
                Last
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={deleteData}
                style={{ backgroundColor: "#F17300", color: "white" }}
                className="float-right my-2"
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmit}
                style={{ backgroundColor: "#1DB954", color: "white" }}
                className="float-right m-2"
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
    </Container>
  ) : (
    <Navigate to={"/"} />
  );
}

export default NewLedgerAccountForm;
