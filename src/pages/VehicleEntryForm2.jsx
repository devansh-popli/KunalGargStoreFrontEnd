import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Card, Carousel, Form } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import useJwtChecker from "../helper/useJwtChecker";
import { privateAxios } from "../services/AxiosService";
import {
  getVehicleImageByNameURl,
  saveVehicleDocument2ToBackend,
  saveVehicleEntry2,
} from "../services/VehicleEntryService";

const steps = ["Vehicle Information", "Time", "Documents", "Owner Details"];

const VehicleEntryForm2 = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleNext = () => {
    const isValid = validateForm(activeStep);

    if (activeStep === steps.length - 1 && isValid) {
      if (activeStep === steps.length - 1) {
        //        console.log(vehicleInfo);
        if (vehicleInfo.vehicleType == "others")
          vehicleInfo.vehicleType = vehicleInfo.vehicleType1;
        saveVehicleEntry2(vehicleInfo)
          .then(async (data) => {
            if (selectedFiles.driverDocuments.length > 0) {
              await selectedFiles.driverDocuments.map(
                async (driverDocument) => {
                  await saveVehicleDocument2ToBackend(
                    data.id,
                    driverDocument,
                    "driver"
                  );
                }
              );
            }
            if (selectedFiles.vehicleDocuments.length > 0) {
              await selectedFiles.vehicleDocuments.map(
                async (vehicleDocument) => {
                  await saveVehicleDocument2ToBackend(
                    data.id,
                    vehicleDocument,
                    "vehicle"
                  );
                }
              );
            }
            toast.success("Data Saved");
            navigate("/vehicle-entry-records");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error occurred while saving data");
          });
      }
    } else if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [vehicleInfo, setVehicleInfo] = useState({
    purpose: "",
    dated: "",
    documentType: "",
    documentNo: "",
    vendorName: "",
    vehicleType: "",
    tuuAbo: "",
    dayOfEntry: daysOfWeek[new Date().getDay()],
    vehicleDocument: [],
    driverDocument: [],
    dateOfExit: "",
    dayOfExit: "",
    timeOfEntry: new Date().toLocaleTimeString("en-US", { hour12: false }),
    dateOfEntry: new Date().toISOString().split("T")[0],
    timeOfExit: "",
    phoneNo: "",
    panNo: "",
    bankAccountNo: "",
    briefDescription: "",
  });
  const [isManualEdit, setIsManualEdit] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isManualEdit) {
        setVehicleInfo((prev) => ({
          ...prev,
          timeOfEntry: new Date().toLocaleTimeString("en-US", {
            hour12: false,
          }),
          dayOfEntry: daysOfWeek[new Date().getDay()],
          dateOfEntry: new Date().toISOString().split("T")[0],
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isManualEdit]);
  const handleFieldChange = useCallback((fieldName) => (event) => {
    if (fieldName == "timeOfEntry") {
      setIsManualEdit(true);
    }
    if (fieldName == "dayOfEntry") {
      setIsManualEdit(true);
    }
    if (fieldName == "dateOfEntry") {
      setIsManualEdit(true);
    }
    if (
      fieldName == "phoneNo" &&
      (!/^[0-9]*$/.test(event.target.value) || event.target.value.length > 10)
    ) {
      return;
    }
    setVehicleInfo((prevData) => ({
      ...prevData,
      [fieldName]: event.target.value,
    }));
    // Clear validation error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  });

  const handleVehicleTypeToggle = (type) => () => {
    // const updatedVehicleTypes = vehicleInfo.vehicleType.includes(type)
    //   ? vehicleInfo.vehicleType.filter((t) => t !== type)
    //   : [...vehicleInfo.vehicleType, type];

    setVehicleInfo((prevData) => ({
      ...prevData,
      vehicleType: type,
    }));
  };

  const [selectedFiles, setSelectedFiles] = useState({
    vehicleDocuments: [],
    driverDocuments: [],
  });

  const handleFileChange = (type) => (event) => {
    const file = event.target.files;
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [type]: Array.from(file),
    }));
  };

  const validateForm = (step) => {
    const newErrors = {};

    // Validate based on the step
    switch (step) {
      case 0:
        // Validate Vehicle Information
        if (!vehicleInfo.purpose) {
          newErrors.purpose = "Purpose is required";
        }
        if (!vehicleInfo.dated) {
          newErrors.dated = "Dated is required";
        }
        if (!vehicleInfo.documentType) {
          newErrors.documentType = "Document Type is required";
        }
        if (vehicleInfo.vehicleType.length == 0) {
          newErrors.vehicleType = "Vehicle Type is required";
        }
        if (!vehicleInfo.vendorName) {
          newErrors.vendorName = "Vendor Name is required";
        }
        // Add validations for other fields in Vehicle Information
        break;
      case 1:
        // Validate Time
        if (!vehicleInfo.dateOfEntry) {
          newErrors.dateOfEntry = "Date of Entry is required";
        }
        if (!vehicleInfo.dayOfEntry) {
          newErrors.dayOfEntry = "Day of Entry is required";
        }
        if (!vehicleInfo.timeOfEntry) {
          newErrors.timeOfEntry = "Time of Entry is required";
        }
        // if (!vehicleInfo.dateOfExit) {
        //   newErrors.dateOfExit = "Date of Exit is required";
        // }
        // if (!vehicleInfo.dayOfExit) {
        //   newErrors.dayOfExit = "Day of Exit is required";
        // }
        // if (!vehicleInfo.timeOfExit) {
        //   newErrors.timeOfExit = "Time of Exit is required";
        // }
        // Add validations for other fields in Time
        break;
      case 2:
        // Validate Documents
        if (
          selectedFiles.vehicleDocuments.length === 0 &&
          vehicleInfo?.vehicleDocument?.length <= 0
        ) {
          newErrors.vehicleDocuments = "Vehicle Documents are required";
        }
        if (
          selectedFiles.driverDocuments.length === 0 &&
          vehicleInfo?.driverDocument?.length <= 0
        ) {
          newErrors.driverDocuments = "Driver Documents are required";
        }
        break;
      case 3:
        // Validate Owner Details
        if (!vehicleInfo.phoneNo) {
          newErrors.phoneNo = "Phone No. is required";
        }
        if (!vehicleInfo.panNo) {
          newErrors.panNo = "PAN No. is required";
        }
        if (!vehicleInfo.bankAccountNo) {
          newErrors.bankAccountNo = "Bank Account No. is required";
        }
        if (!vehicleInfo.briefDescription) {
          newErrors.briefDescription = "Brief Description is required";
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [imgLoading, setImgLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [stockItems, setStockItems] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    privateAxios
      .get(
        `/api/ledger-accounts/stock-item-menu/all?pageSize=${10000}&sortBy=${"accountName"}`
      )
      .then((response) => {
        setStockItems(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
    if (id) {
      privateAxios
      .get(
        `/api/v2/vehicle-entries/${id}`
      )
      .then((response) => {
        setVehicleInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock items:", error);
      });
    }
  }, []);
  const handleSelect = (selectedIndex, e) => {
    setSelectedImageIndex(selectedIndex);
  };
  const handleImageLoad = () => {
    setImgLoading(false); // Set loading state to false when the image is loaded
  };

  const getStepContent = (step) => {
    const hasValidationError = (field) => errors[field] !== undefined;

    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            {/* ... (unchanged code for step 0) */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h5 className="fw-bold">
                  Please fill Vehicle Information to Proceed
                </h5>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  className="w-60"
                  label="Vehicle Number"
                  fullWidth
                  value={vehicleInfo.vehicleNumber}
                  onChange={handleFieldChange("vehicleNumber")}
                />
                <Button
                  variant="contained"
                  className="mt-2 ms-2"
                  size="small"
                  onClick={() => {
                    privateAxios
                      .get(
                        `/api/v2/vehicle-entries/vehicleNumber/${vehicleInfo.vehicleNumber}`
                      )
                      .then((data) => {
                        if (data.data.id != null) {
                          data.data.id = null;
                          data.data.dateOfExit = null;
                          data.data.dayOfExit = null;
                          data.data.timeOfExit = null;
                          data.data.vendorName = null;
                          data.data.documentType = null;
                          data.data.status = null;
                          data.data.paymentType = null;
                          data.data.paymentTerms = null;
                          data.data.assignedToRole = null;
                          data.data.commercialCost = null;
                          data.data.vehicleImages = [];
                          setVehicleInfo(data.data);
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  }}
                >
                  Fetch Last Details
                </Button>
                {errors.vehicleNumber && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      {errors.vehicleNumber}
                    </Typography>
                  </Grid>
                )}
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
                {errors.purpose && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      {errors.purpose}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="off"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  className="w-60"
                  label="Dated"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={vehicleInfo.dated}
                  onChange={handleFieldChange("dated")}
                />
                {errors.dated && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      {errors.dated}
                    </Typography>
                  </Grid>
                )}
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
                {errors.documentType && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      {errors.documentType}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  className=""
                  label="Document Number"
                  type="text"
                  fullWidth
                  value={vehicleInfo.documentNo}
                  onChange={handleFieldChange("documentNo")}
                />
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
                <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }}  className="w-60"
                  label="Document No."
                  fullWidth
                  value={vehicleInfo.documentNo}
                  onChange={handleFieldChange("documentNo")}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <FormControl className="w-100">
                  <InputLabel>Select Vendor Name</InputLabel>
                  <Select
                    value={vehicleInfo.vendorName}
                    onChange={handleFieldChange("vendorName")}
                  >
                    {stockItems.map((data) => (
                      <MenuItem value={data.accountName}>
                        {data.accountName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* <TextField
                  autoComplete="off"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  className="w-60"
                  label="Vendor Name"
                  fullWidth
                  value={vehicleInfo.vendorName}
                  onChange={handleFieldChange("vendorName")}
                /> */}
                {errors.vendorName && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="error">
                      {errors.vendorName}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormLabel component="legend">Vehicle Type</FormLabel>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant={
                        vehicleInfo.vehicleType.includes("car")
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      size="small"
                      onClick={handleVehicleTypeToggle("car")}
                      style={{
                        color: vehicleInfo.vehicleType.includes("car")
                          ? "white"
                          : "#78C2AD",
                        borderColor: "#78C2AD",
                        backgroundColor: vehicleInfo.vehicleType.includes("car")
                          ? "#78C2AD"
                          : "inherit",
                        borderRadius: "30px",
                      }}
                    >
                      Car
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={
                        vehicleInfo.vehicleType.includes("truck")
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      size="small"
                      onClick={handleVehicleTypeToggle("truck")}
                      style={{
                        color: vehicleInfo.vehicleType.includes("truck")
                          ? "white"
                          : "#78C2AD",
                        borderColor: "#78C2AD",
                        borderRadius: "30px",
                        backgroundColor: vehicleInfo.vehicleType.includes(
                          "truck"
                        )
                          ? "#78C2AD"
                          : "inherit",
                      }}
                    >
                      Truck
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={
                        vehicleInfo.vehicleType.includes("motorcycle")
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      size={"small"}
                      onClick={handleVehicleTypeToggle("motorcycle")}
                      style={{
                        borderColor: "#78C2AD",
                        color: vehicleInfo.vehicleType.includes("motorcycle")
                          ? "white"
                          : "#78C2AD",
                        borderRadius: "30px",
                        backgroundColor: vehicleInfo.vehicleType.includes(
                          "motorcycle"
                        )
                          ? "#78C2AD"
                          : "inherit",
                      }}
                    >
                      Motorcycle
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={
                        vehicleInfo.vehicleType.includes("others")
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      size={"small"}
                      onClick={handleVehicleTypeToggle("others")}
                      style={{
                        borderColor: "#78C2AD",
                        color: vehicleInfo.vehicleType.includes("others")
                          ? "white"
                          : "#78C2AD",
                        borderRadius: "30px",
                        backgroundColor: vehicleInfo.vehicleType.includes(
                          "others"
                        )
                          ? "#78C2AD"
                          : "inherit",
                      }}
                    >
                      Others
                    </Button>
                  </Grid>
                  {vehicleInfo.vehicleType === "others" && (
                    <Grid xs={12} item>
                      <TextField
                        autoComplete="off"
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        size="small"
                        label="Others"
                        value={vehicleInfo.vehicleType1}
                        onChange={(e) =>
                          setVehicleInfo((prev) => ({
                            ...prev,
                            vehicleType1: e.target.value,
                          }))
                        }
                      />
                    </Grid>
                  )}

                  {/* Add more vehicle types as needed */}
                  {errors.vehicleType && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="error">
                        {errors.vehicleType}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Add other fields for Vehicle Information */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                inputProps={{ style: { textTransform: "uppercase" } }}
                className="w-60"
                label="Date of Entry"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={vehicleInfo.dateOfEntry}
                onChange={handleFieldChange("dateOfEntry")}
              />
              {errors.dateOfEntry && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.dateOfEntry}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                inputProps={{ style: { textTransform: "uppercase" } }}
                className="w-60"
                label="Day of Entry"
                fullWidth
                value={vehicleInfo.dayOfEntry}
                onChange={handleFieldChange("dayOfEntry")}
              />
              {errors.dayOfEntry && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.dayOfEntry}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                inputProps={{ style: { textTransform: "uppercase" } }}
                className="w-60"
                label="Time of Entry"
                type="time"
                fullWidth
                value={vehicleInfo.timeOfEntry}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleFieldChange("timeOfEntry")}
              />
              {errors.timeOfEntry && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.timeOfEntry}
                  </Typography>
                </Grid>
              )}
            </Grid>
            {/* <Grid item xs={12}>
              <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }} 
                className="w-60"
                label="Date of Exit"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                value={vehicleInfo.dateOfExit}
                onChange={handleFieldChange("dateOfExit")}
              />
              {errors.dateOfExit && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.dateOfExit}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }} 
                className="w-60"
                label="Day of Exit"
                fullWidth
                value={vehicleInfo.dayOfExit}
                onChange={handleFieldChange("dayOfExit")}
              />
              {errors.dayOfExit && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.dayOfExit}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }} 
                className="w-60"
                label="Time of Exit"
                InputLabelProps={{
                  shrink: true,
                }}
                type="time"
                fullWidth
                value={vehicleInfo.timeOfExit}
                onChange={handleFieldChange("timeOfExit")}
              />
              {errors.timeOfExit && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error">
                    {errors.timeOfExit}
                  </Typography>
                </Grid>
              )}
            </Grid> */}

            {/* Add similar error checks for other fields in step 1 */}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Container>
              <div className="mt-3">
                <h4 className="fw-bold">Document Upload Form</h4>
                {vehicleInfo?.vehicleDocument.length > 0 && (
                  <>
                    <h5 className="fw-bold">Vehicle Document</h5>
                    <Carousel
                      data-bs-theme="dark"
                      indicators={false}
                      activeIndex={selectedImageIndex}
                      onSelect={handleSelect}
                      interval={null} // Disable automatic sliding
                    >
                      {imgLoading && (
                        <Skeleton variant="rect" width="100%" height={200} />
                      )}
                      {vehicleInfo?.vehicleDocument?.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            style={{ height: "150px", objectFit: "contain" }}
                            className={`w-100  d-block ${
                              imgLoading ? "d-none" : ""
                            }`}
                            src={getVehicleImageByNameURl(image)}
                            alt={`Vehicle Document ${index + 1}`}
                            onLoad={handleImageLoad}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>

                    {/* Driver Document Image Slider */}
                    <h5>
                      <strong>Driver Document:</strong>
                    </h5>
                    <Carousel
                      data-bs-theme="dark"
                      indicators={false}
                      activeIndex={selectedImageIndex}
                      onSelect={handleSelect}
                      interval={null} // Disable automatic sliding
                    >
                      {imgLoading && (
                        <Skeleton variant="rect" width="100%" height={200} />
                      )}
                      {vehicleInfo?.driverDocument?.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            style={{ height: "150px", objectFit: "contain" }}
                            className={`w-100 d-block ${
                              imgLoading ? "d-none" : ""
                            }`}
                            src={getVehicleImageByNameURl(image)}
                            alt={`Driver Document ${index + 1}`}
                            onLoad={handleImageLoad}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </>
                )}
                <Form>
                  <Form.Group controlId="vehicleDocuments">
                    <Form.Label>Vehicle Documents</Form.Label>
                    <Form.Control
                      className="w-60"
                      type="file"
                      multiple
                      onChange={handleFileChange("vehicleDocuments")}
                    />
                    {errors.vehicleDocuments && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="error">
                          {errors.vehicleDocuments}
                        </Typography>
                      </Grid>
                    )}
                  </Form.Group>
                  <Form.Group controlId="driverDocuments">
                    <Form.Label>Driver Documents</Form.Label>
                    <Form.Control
                      className="w-60"
                      type="file"
                      multiple
                      onChange={handleFileChange("driverDocuments")}
                    />
                    {errors.driverDocuments && (
                      <Grid item xs={12}>
                        <Typography variant="caption" color="error">
                          {errors.driverDocuments}
                        </Typography>
                      </Grid>
                    )}
                  </Form.Group>
                </Form>
              </div>
            </Container>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            {/* ... (unchanged code for step 3) */}
            <Grid item xs={12}>
              <h4 className="fw-bold">Owner Details</h4>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    autoComplete="off"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    className="w-60"
                    label="Phone No."
                    fullWidth
                    type="text"
                    value={vehicleInfo.phoneNo}
                    onChange={handleFieldChange("phoneNo")}
                  />
                  {errors.phoneNo && (
                    <Grid item xs={12} md={12}>
                      <Typography variant="caption" color="error">
                        {errors.phoneNo}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    autoComplete="off"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    className="w-60"
                    label="PAN No."
                    fullWidth
                    value={vehicleInfo.panNo}
                    onChange={handleFieldChange("panNo")}
                  />
                  {errors.panNo && (
                    <Grid item xs={12} md={12}>
                      <Typography variant="caption" color="error">
                        {errors.panNo}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    autoComplete="off"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    className="w-60"
                    label="Bank Account No."
                    fullWidth
                    value={vehicleInfo.bankAccountNo}
                    onChange={handleFieldChange("bankAccountNo")}
                  />
                  {errors.bankAccountNo && (
                    <Grid item xs={12} md={12}>
                      <Typography variant="caption" color="error">
                        {errors.bankAccountNo}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} display={"flex"} flexDirection={"column"}>
                  <FormLabel style={{ color: "#797979" }}>
                    Brief Description
                  </FormLabel>
                  <textarea
                    className="w-60"
                    style={{
                      border: "1.6px solid #CBCBCB",
                      borderRadius: "5px",
                    }}
                    multiline
                    rows={4}
                    size="small"
                    value={vehicleInfo.briefDescription}
                    onChange={handleFieldChange("briefDescription")}
                  />
                  {errors.briefDescription && (
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <Typography variant="caption" color="error">
                        {errors.briefDescription}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const checktoken = useJwtChecker();
  const userContext = useContext(UserContext);

  return userContext.isLogin ? (
    <Container className="mt-3">
      <Grid item xs={12} className="isMobile">
        <Card
          className="padding shadow rounded border-0"
          elevation={3}
          style={{ marginBottom: 20, marginTop: 37 }}
        >
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <span className="font">{label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <h4 className="fw-bold">Vehicle Entry Form</h4>
          <Card
            elevation={3}
            className="padding2 shadow rounded border-0"
            style={{ marginBottom: 20 }}
          >
            {getStepContent(activeStep)}
            <div style={{ marginTop: 20 }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} className="isDesktop">
          <Card
            elevation={3}
            className="shadow rounded border-0"
            style={{ padding: 20, marginBottom: 20, marginTop: 37 }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Card>
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Navigate to={"/login"} />
  );
};

export default React.memo(VehicleEntryForm2);
