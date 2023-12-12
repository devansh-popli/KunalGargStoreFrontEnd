import React, { useState } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";

const steps = [
  "Vehicle Information",
  "Documents",
  "Driver Details",
  "Owner Details",
  "Summary",
];

const VehicleEntryForm2 = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // State for storing form data
  const [vehicleInfo, setVehicleInfo] = useState({
    purpose: "",
    dated: "",
    documentType: "",
    documentNo: "",
    vendorName: "",
    vehicleType: "",
    tuuAbo: "",
    dateOfEntry: "",
    dayOfEntry: "",
    timeOfEntry: "",
    dateOfExit: "",
    dayOfExit: "",
    timeOfExit: "",
  });

  const handleFieldChange = (fieldName) => (event) => {
    setVehicleInfo((prevData) => ({
      ...prevData,
      [fieldName]: event.target.value,
    }));

  };
  const handleVehicleTypeToggle = (type) => () => {
    // const updatedVehicleTypes = vehicleInfo.vehicleType.includes(type)
    //   ? vehicleInfo.vehicleType.filter((t) => t !== type)
    //   : [...vehicleInfo.vehicleType, type];

    setVehicleInfo((prevData) => ({
      ...prevData,
      vehicleType: type,
    }));
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <h5 className="fw-bold">
                Please fill Vehicle Information to Proceed
              </h5>
              </Grid>
              <Grid item xs={12}>
                <FormLabel component="legend">Purpose</FormLabel>
                <RadioGroup
                  aria-label="Purpose"
                  name="purpose"
                  value={vehicleInfo.purpose}
                  onChange={handleFieldChange("purpose")}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel
                    value="lifting"
                    control={<Radio />}
                    label="Lifting"
                  />
                  <FormControlLabel
                    value="unloading"
                    control={<Radio />}
                    label="Unloading"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dated"
                  type="date"
                  fullWidth
                  value={vehicleInfo.dated}
                  onChange={handleFieldChange("dated")}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel component="legend">Document Type</FormLabel>
                <RadioGroup
                  aria-label="documentType"
                  name="documentType"
                  value={vehicleInfo.documentType}
                  onChange={handleFieldChange("documentType")}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel
                    value="challan"
                    control={<Radio />}
                    label="Challan"
                  />
                  <FormControlLabel
                    value="invoice"
                    control={<Radio />}
                    label="Invoice"
                  />
                </RadioGroup>
              </Grid>
              {/* <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={vehicleInfo.documentType}
                    onChange={handleFieldChange("documentType")}
                  >
                    <MenuItem value="challan">Challan</MenuItem>
                    <MenuItem value="invoice">Invoice</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              {/* <Grid item xs={12}>
                <TextField
                  label="Document No."
                  fullWidth
                  value={vehicleInfo.documentNo}
                  onChange={handleFieldChange("documentNo")}
                />
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  label="Vendor Name"
                  fullWidth
                  value={vehicleInfo.vendorName}
                  onChange={handleFieldChange("vendorName")}
                />
              </Grid>
              <Grid item xs={12}>
              <FormLabel component="legend">Vehicle Type</FormLabel>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant={vehicleInfo.vehicleType.includes('car') ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={handleVehicleTypeToggle('car')}
                    style={{ color:vehicleInfo.vehicleType.includes('car') ? 'white' : '#78C2AD',borderColor: '#78C2AD', backgroundColor: vehicleInfo.vehicleType.includes('car') ? '#78C2AD' : 'inherit' ,borderRadius:"30px"}}
                  >
                    Car
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={vehicleInfo.vehicleType.includes('truck') ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={handleVehicleTypeToggle('truck')}
                    style={{color:vehicleInfo.vehicleType.includes('truck') ? 'white' : '#78C2AD',borderColor: '#78C2AD', borderRadius:"30px",backgroundColor: vehicleInfo.vehicleType.includes('truck') ? '#78C2AD' : 'inherit' }}
                  >
                    Truck
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={vehicleInfo.vehicleType.includes('motorcycle') ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={handleVehicleTypeToggle('motorcycle')}
                    style={{ borderColor: '#78C2AD',color:vehicleInfo.vehicleType.includes('motorcycle') ? 'white' : '#78C2AD',borderRadius:"30px",backgroundColor: vehicleInfo.vehicleType.includes('motorcycle') ? '#78C2AD' : 'inherit' }}
                  >
                    Motorcycle
                  </Button>
                </Grid>
                {/* Add more vehicle types as needed */}
              </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tuu / Abo"
                  fullWidth
                  value={vehicleInfo.tuuAbo}
                  onChange={handleFieldChange("tuuAbo")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date of Entry"
                  type="date"
                  fullWidth
                  value={vehicleInfo.dateOfEntry}
                  onChange={handleFieldChange("dateOfEntry")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Day of Entry"
                  fullWidth
                  value={vehicleInfo.dayOfEntry}
                  onChange={handleFieldChange("dayOfEntry")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Time of Entry"
                  type="time"
                  fullWidth
                  value={vehicleInfo.timeOfEntry}
                  onChange={handleFieldChange("timeOfEntry")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date of Exit"
                  type="date"
                  fullWidth
                  value={vehicleInfo.dateOfExit}
                  onChange={handleFieldChange("dateOfExit")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Day of Exit"
                  fullWidth
                  value={vehicleInfo.dayOfExit}
                  onChange={handleFieldChange("dayOfExit")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Time of Exit"
                  type="time"
                  fullWidth
                  value={vehicleInfo.timeOfExit}
                  onChange={handleFieldChange("timeOfExit")}
                />
              </Grid>
            </Grid>

            {/* Add other fields for Vehicle Information */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select>
                  <MenuItem value="challan">Challan</MenuItem>
                  <MenuItem value="invoice">Invoice</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Add other fields for Documents */}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            {/* Add fields for Driver Details */}
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            {/* Add fields for Owner Details */}
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2}>
            <Typography variant="h6">Summary</Typography>
            {/* Display entered data for summary */}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-3">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <h4 className="fw-bold">Vehicle Entry Form</h4>
          <Paper elevation={3} style={{ padding: "40px", marginBottom: 20 }}>
            {getStepContent(activeStep)}
            <div style={{ marginTop: 20 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={3}
            style={{ padding: 20, marginBottom: 20, marginTop: 37 }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VehicleEntryForm2;
