import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
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
const stateList=states
  return (
    <Container>
      {/* {JSON.stringify(formData)} */}
      <h2 className="my-3 fw-bold">New Ledger Account Form</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          {/* {stateList.filter(state=>state.code=='04')[0].state} */}
          {/* {formData.state} */}
          <Grid item xs={6}>
            <TextField
              label="GST No."
              variant="standard"
              name="gstNo"
              value={formData.gstNo}
              onChange={(event) => {
                const firstTwoDigits = event.target.value.substring(0, 2);

                // Find the state corresponding to the first two digits
                const state = stateList.filter(state => state?.code === firstTwoDigits)[0];
              
                setFormData({
                  ...formData,
                  gstNo: event.target.value,
                  pan: event.target.value.substring(2, 12),
                  state:state?.state.trim()
                });
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="A/c Name"
              variant="standard"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address"
              variant="standard"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              variant="standard"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Pincode"
              variant="standard"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel>State</InputLabel>
              <Select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                {
                  stateList.map(state=>(
                    <MenuItem value={state.state}>{state.state}</MenuItem>                     
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Opening Balance"
              variant="standard"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <InputLabel>MSMED Status</InputLabel>
              <Select
                name="msmedStatus"
                value={formData.msmedStatus}
                onChange={handleChange}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Contact No."
              variant="standard"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email Id/Area"
              variant="standard"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="PAN"
              variant="standard"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <TextField
              label="Whether Approved"
              variant="standard"
              name="approved"
              value={formData.approved}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Account Num"
              variant="standard"
              name="accountNum"
              value={formData.accountNum}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Account Name (same as firm name)"
              variant="standard"
              name="accountNameBank"
              value={formData.accountNameBank}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="IFSC"
              variant="standard"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
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
        <Row className="mt-4">
          <Col>
            <Button variant="contained" onClick={() => addNewData()}>
              Add New Data
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEvent("previous")}
              className="m-2"
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEvent("next")}
              className="m-2"
            >
              Next
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEvent("first")}
              className="m-2"
            >
              First
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEvent("last")}
              className="m-2"
            >
              Last
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={deleteData}
              className="float-right my-2"
            >
              Delete
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              className="float-right m-2"
              onClick={handleSubmit}
            >
              Save
            </Button>
            {/* <Button variant="primary" className="float-right m-2">Search</Button> */}
          </Col>
        </Row>
      </form>
    </Container>
  );
}

export default NewLedgerAccountForm;
