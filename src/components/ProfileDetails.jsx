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
  } from '@mui/material';
const ProfileDetails = ({ onFormChange, formData, setFormData ,readOnly}) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.designation) {
        newErrors.designation = 'Designation is required';
      }
      if (!formData.jobExperience) {
        newErrors.jobExperience = 'Job experience is required';
      }
  
      if (!formData.jobExperienceLocation) {
        newErrors.jobExperienceLocation = 'Job experience location is required';
      }
      if (!formData.jobExperience) {
        newErrors.jobExperience = 'Job experience is required';
      }
      return newErrors;
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  return (
    <>
    <h5 className="fw-bold">Profile Details</h5>
      <FormControl fullWidth>
        <InputLabel>Designation</InputLabel>
        <Select disabled={readOnly}
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
      <FormControl fullWidth className="mb-3">
        <InputLabel>Job Experience</InputLabel>
        <Select disabled={readOnly}
          name="jobExperience"
          value={formData.jobExperience}
          onChange={handleInputChange}
          error={Boolean(errors.jobExperience)}
        >
          <MenuItem value="">Select Job Experience</MenuItem>
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </Select>
      </FormControl>
      <TextField disabled={readOnly}
        label="Job Experience in Months/Years"
        name="jobExperience"
        fullWidth
        value={formData.jobExperience}
        onChange={handleInputChange}
        error={Boolean(errors.jobExperience)}
        helperText={errors.jobExperience}
        className="mb-3"
      />
      <TextField disabled={readOnly}
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
