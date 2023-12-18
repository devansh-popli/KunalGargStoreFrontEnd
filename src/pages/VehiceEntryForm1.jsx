import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { FormLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import { saveVehicleDocumentToBackend, saveVehicleEntry } from "../services/VehicleEntryService";
import { privateAxios } from "../services/AxiosService";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import useJwtChecker from "../helper/useJwtChecker";

const VehicleEntryForm1 = () => {
  const [formData, setFormData] = useState({
    gatePassNo: "",
    site: "",
    inTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
    outTime: new Date().toLocaleTimeString("en-US", { hour12: false }),
    inDate: new Date().toISOString().split("T")[0],
    outDate: new Date().toISOString().split("T")[0],
    selectedOption: "Jcb",
    hydraCapacity: "",
    photos: [],
    ownerBankAccount: "",
    ownerPhone: "",
    justification: "",
    enteredBy: "",
  });

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
useEffect(()=>{
  fetchLastAccountCode()
},[])
  const handleOptionChange = (event) => {
    handleFieldChange("selectedOption", event.target.value);
  };

  const handleHydraCapacityChange = (event) => {
    handleFieldChange("hydraCapacity", event.target.value);
  };

  const handlePhotosChange = (event) => {
    handleFieldChange("photos", event.target.files);
  };
  const fetchLastAccountCode = async () => {
    await privateAxios
      .get("/api/vehicle-entries/lastAccountCode")
      .then((response) => {
        const lastAccountCode = response.data;
        // Generate the next account code
        const nextNumericPart = parseInt(lastAccountCode.split("-")[1]) + 1;
        // setNextAccountCode(`abc-${String(nextNumericPart).padStart(3, "0")}`);
        setFormData({
          gatePassNo: `abc-${String(nextNumericPart).padStart(3, "0")}`,
        });
      })
      .catch((error) => {
        toast.error("Error while fetching gate pass no.")
        console.error("Error fetching last account code:", error);
      });
  };

const handleSubmit=()=>{
  console.log( formData.photos)
  saveVehicleEntry(formData).then(res=>{
    Array.from(formData.photos).map(img=>{
      
    saveVehicleDocumentToBackend(res.id,img).then(data=>{
      res.photoUrl=data.imageName
        toast.success("Data Saved Successfully")
      }).catch(error=>{
        toast.error("Vehicle Entry Logged but error uploading profile Image")
      })
    
  })
}).catch(error=>{
  toast.error("Internal Server Error")
})
}
const checktoken=useJwtChecker()
const userContext=useContext(UserContext)
  return userContext.isLogin ?(
    <Paper elevation={1} className="w-90" style={{ padding: 20, margin: 20 }}>
      <h4 className="fw-bold mb-3">
        Vehicle Entry Form
      </h4>
      <div className="d-flex">
        <Grid container spacing={2} className="w-60">
          <Grid item xs={6}>
            <TextField
              label="Gate Pass No."
              fullWidth
              size="small"
              value={formData.gatePassNo}
              disabled
              InputLabelProps={{
                shrink: true,
              }}  
              onChange={(e) => handleFieldChange("gatePassNo", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Site"
              fullWidth
              size="small"
              onChange={(e) => handleFieldChange("site", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="In Time"
              type="time"
              value={formData.inTime}
              onChange={(e) => handleFieldChange("inTime", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-clock" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Out Time"
              type="time"
              value={formData.outTime}
              onChange={(e) => handleFieldChange("outTime", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="far fa-clock" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="In Date"
              type="date"
              value={formData.inDate}
              onChange={(e) => handleFieldChange("inDate", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Out Date"
              type="date"
              value={formData.outDate}
              onChange={(e) => handleFieldChange("outDate", e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={formData.selectedOption}
                onChange={handleOptionChange}
              >
                <MenuItem value="Jcb">Jcb</MenuItem>
                <MenuItem value="Hydra">Hydra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.selectedOption === "Hydra" && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Hydra Capacity</InputLabel>
                <Select
                  value={formData.hydraCapacity}
                  onChange={handleHydraCapacityChange}
                >
                  <MenuItem value="12">12 ton</MenuItem>
                  <MenuItem value="16">16 ton</MenuItem>
                  <MenuItem value="manual">Manual Text</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Owner Bank Account No."
              fullWidth
              size="small"
              onChange={(e) =>
                handleFieldChange("ownerBankAccount", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Owner Phone No."
              fullWidth
              size="small"
              onChange={(e) =>
                handleFieldChange("ownerPhone", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormLabel style={{ color: "#797979" }}>Brief Justification</FormLabel>
            <textarea
              className="w-100"
              style={{
                border: "1.6px solid #CBCBCB",
                borderRadius: "5px",
              }}
              multiline
              rows={4}
              size="small"
              onChange={(e) =>
                handleFieldChange("justification", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Entered by (username of gatepass generator)"
              fullWidth
              size="small"
              onChange={(e) =>
                handleFieldChange("enteredBy", e.target.value)
              }
            />
          </Grid>
        </Grid>
        <div className="w-50 text-center isDesktop">
          <img className="w-75" src="../../car.jpg" alt="" />
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Paper>
  ):<Navigate to={"/"}/>;
};

export default VehicleEntryForm1;
