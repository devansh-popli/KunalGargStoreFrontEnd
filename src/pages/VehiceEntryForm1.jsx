import React, { useState } from "react";
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

const VehicleEntryForm1 = () => {
  const [selectedOption, setSelectedOption] = useState("Jcb");
  const [hydraCapacity, setHydraCapacity] = useState("");
  const [photos, setPhotos] = useState([]);
  const [inTime, setInTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );
  const [outTime, setOutTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );
  const [inDate, setInDate] = useState(new Date().toISOString().split("T")[0]);
  const [outDate, setOutDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleHydraCapacityChange = (event) => {
    setHydraCapacity(event.target.value);
  };

  const handlePhotosChange = (event) => {
    const files = event.target.files;
    setPhotos(files);
  };

  return (
    <Paper elevation={1} className="w-90" style={{ padding: 20, margin: 20 }}>
      <Typography variant="h5" gutterBottom>
        Vehicle Entry Form
      </Typography>
      <div className="d-flex">
        <Grid container spacing={2} className="w-60">
          <Grid item xs={6}>
            <TextField label="Gate Pass No." fullWidth size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Site" fullWidth size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="In Time"
              type="time"
              value={inTime}
              onChange={(e) => setInTime(e.target.value)}
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
              value={outTime}
              onChange={(e) => setOutTime(e.target.value)}
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
              value={inDate}
              onChange={(e) => setInDate(e.target.value)}
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
              value={outDate}
              onChange={(e) => setOutDate(e.target.value)}
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
              <Select value={selectedOption} onChange={handleOptionChange}>
                <MenuItem value="Jcb">Jcb</MenuItem>
                <MenuItem value="Hydra">Hydra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {selectedOption === "Hydra" && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Hydra Capacity</InputLabel>
                <Select
                  value={hydraCapacity}
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
            <TextField label="Owner Bank Account No." fullWidth size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Owner Phone No." fullWidth size="small" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Brief Justification"
              fullWidth
              multiline
              rows={4}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Entered by (username of gatepass generator)"
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
        <div className="w-50 text-center isDesktop">
          <img className="w-75" src="../../car.jpg" alt="" />
        </div>
      </div>
      <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
        Submit
      </Button>
    </Paper>
  );
};

export default VehicleEntryForm1;
