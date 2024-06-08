import React, { useState } from "react";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormLabel,
  Button,
} from "@mui/material";
import { ModalHeader } from "react-bootstrap";
import { toast } from "react-toastify";

const PaymentForm = ({ savePaymentInfo }) => {
  const [paymentType, setPaymentType] = useState("cash");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [otherTerms, setOtherTerms] = useState("");
  const [commercialCost, setCommercialCost] = useState("");

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handlePaymentTermsChange = (event) => {
    setPaymentTerms(event.target.value);
  };

  const handleOtherTermsChange = (event) => {
    setOtherTerms(event.target.value);
  };

  const handleCommercialCostChange = (event) => {
    setCommercialCost(event.target.value);
  };
  const validateForm = () => {
    console.log("validating")
    try{

        if (paymentType === "credit" && !paymentTerms) {
            toast.error("Please select payment terms.");
            return false;
        }
        if (paymentTerms === "other" && !otherTerms) {
            toast.error("Please specify other terms.");
            return false;
        }
        if (!commercialCost) {
            toast.error("Please enter commercial cost.");
            return false;
        }
    }catch(e)
    {
        console.log(e)
    }
    console.log("here")
    return true;
  };
  const savePaymentInfo1 = () => {
    console.log("calling payment info")
    try {
      if (validateForm()) {
        savePaymentInfo({
          paymentType,
          paymentTerms,
          otherTerms,
          commercialCost,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form>
      <ModalHeader>Payment Details</ModalHeader>
      <FormControl component="fieldset" className="mt-2">
        <FormLabel>Payment Type</FormLabel>
        <RadioGroup
          className="d-flex flex-row"
          aria-label="payment-type"
          name="payment-type"
          value={paymentType}
          onChange={handlePaymentTypeChange}
        >
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="credit" control={<Radio />} label="Credit" />
          <FormControlLabel value="FOR" control={<Radio />} label="FOR" />
        </RadioGroup>
      </FormControl>

      {paymentType === "credit" && (
        <div>
          <FormControl className="w-50 mt-2 me-1">
            <InputLabel id="payment-terms-label">Payment Terms</InputLabel>
            <Select
              labelId="payment-terms-label"
              id="payment-terms"
              value={paymentTerms}
              onChange={handlePaymentTermsChange}
            >
              <MenuItem value={7}>7 Days</MenuItem>
              <MenuItem value={10}>10 Days</MenuItem>
              <MenuItem value={15}>15 Days</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {paymentTerms === "other" && (
            <TextField
              id="other-terms"
              label="Other Terms"
              value={otherTerms}
              className=" mt-2"
              onChange={handleOtherTermsChange}
            />
          )}
        </div>
      )}
      <div>
        <FormControl>
          <FormLabel>Commercial Cost</FormLabel>
          <TextField
            id="commercial-cost"
            label="Commercial Cost"
            type="number"
            value={commercialCost}
            className="w-100 mt-2"
            onChange={handleCommercialCostChange}
          />
        </FormControl>
      </div>
      <div>
        <Button
          className="mt-2"
          variant="contained"
          color="primary"
          onClick={savePaymentInfo1}
        >
          Save Payment Info
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
