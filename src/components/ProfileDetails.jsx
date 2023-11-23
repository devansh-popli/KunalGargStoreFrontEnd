import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
const ProfileDetails = ({ onFormChange, formData, setFormData, readOnly }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <>
      <h5 className="fw-bold">Profile Details</h5>
      <FormControl fullWidth component="fieldset" className="mb-3">
        <FormLabel>Department</FormLabel>
        <RadioGroup
          row
          aria-label="department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
        >
          {/* Adjust the department options as needed */}
          <FormControlLabel
            value="HR"
            control={
              <Radio
                size="small"
                sx={{
                  color: "#78C2AD;",
                  "&.Mui-checked": {
                    color: "#78C2AD;",
                  },
                }}
              />
            }
            label="HR"
          />
          <FormControlLabel
            value="Finance"
            control={
              <Radio
                size="small"
                sx={{
                  color: "#78C2AD;",
                  "&.Mui-checked": {
                    color: "#78C2AD;",
                  },
                }}
              />
            }
            label="Finance"
          />
          <FormControlLabel
            value="IT"
            control={
              <Radio
                size="small"
                sx={{
                  color: "#78C2AD;",
                  "&.Mui-checked": {
                    color: "#78C2AD;",
                  },
                }}
              />
            }
            label="IT"
          />
          {/* Add more options as needed */}
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Designation</InputLabel>
        <Select
          disabled={readOnly}
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          error={Boolean(errors.designation)}
          className="mb-3"
        >
          <MenuItem value="">Select Designation</MenuItem>
          <MenuItem value="Supervisor">Supervisor</MenuItem>
          <MenuItem value="Fitter">Fitter</MenuItem>
          <MenuItem value="Welder">Welder</MenuItem>
          <MenuItem value="Helper">Helper</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth component="fieldset" className="mb-3">
        <FormLabel component="legend">Job Experience</FormLabel>
        <RadioGroup
          aria-label="jobExperience"
          name="jobExperience"
          value={formData.jobExperience}
          onChange={handleInputChange}
          className="d-flex flex-row"
        >
          <FormControlLabel
            value="No"
            control={
              <Radio
                size="small"
                sx={{
                  color: "#78C2AD;",
                  "&.Mui-checked": {
                    color: "#78C2AD;",
                  },
                }}
              />
            }
            label="No"
          />
          <FormControlLabel
            value="Yes"
            control={
              <Radio
                size="small"
                sx={{
                  color: "#78C2AD;",
                  "&.Mui-checked": {
                    color: "#78C2AD;",
                  },
                }}
              />
            }
            label="Yes"
          />
        </RadioGroup>
      </FormControl>
      <TextField
        disabled={readOnly}
        label="Job Experience in Months/Years"
        name="jobExperienceInMonths"
        fullWidth
        value={formData.jobExperienceInMonths}
        onChange={handleInputChange}
        error={Boolean(errors.jobExperienceInMonths)}
        helperText={errors.jobExperienceInMonths}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Job Experience Location"
        name="jobExperienceLocation"
        fullWidth
        value={formData.jobExperienceLocation}
        onChange={handleInputChange}
        error={Boolean(errors.jobExperienceLocation)}
        helperText={errors.jobExperienceLocation}
        className="mb-3"
      />
    </>
  );
};

export default ProfileDetails;
