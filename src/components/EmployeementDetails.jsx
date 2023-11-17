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
} from "@mui/material";
const EmployeementDetails = ({ onFormChange, formData, setFormData ,readOnly }) => {
  const [errors, setErrors] = useState({});

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h5 className="fw-bold">Employment Details</h5>
      {" "}
      <TextField disabled={readOnly}
        className="mb-2 mt-3"
        label="Date of Joining"
        name="dateOfJoining"
        fullWidth
        type="date"
        value={formData.dateOfJoining}
        onChange={handleInputChange}
        error={Boolean(errors.dateOfJoining)}
        helperText={errors.dateOfJoining}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {
            placeholder: 'dd mm yy',
            style: { textTransform: 'none' }, // Prevent uppercase transformation
          },
        }}
      />
      <FormControl fullWidth className="mb-2">
        <InputLabel>Employment Hours</InputLabel>
        <Select
          name="employmentHours"
          value={formData.employmentHours}
          onChange={handleInputChange}
          error={Boolean(errors.employmentHours)}
        >
          <MenuItem value="Full Time">Full Time</MenuItem>
          <MenuItem value="Part Time">Part Time</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className="mb-2">
        <InputLabel>Employment Status</InputLabel>
        <Select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleInputChange}
          error={Boolean(errors.employmentStatus)}
        >
          <MenuItem value="Permanent">Permanent</MenuItem>
          <MenuItem value="Casual">Casual</MenuItem>
        </Select>
      </FormControl>
      <TextField disabled={readOnly}
        className="mb-2"
        label="Monthly Salary"
        name="monthlySalary"
        fullWidth
        value={formData.monthlySalary}
        onChange={handleInputChange}
        error={Boolean(errors.salary)}
        helperText={errors.salary}
      />
      {formData.employmentHours === "Part Time" && (
        <TextField disabled={readOnly}
          className="mb-2"
          label="Hourly Rate"
          name="hourlyRate"
          fullWidth
          value={formData.hourlyRate}
          onChange={handleInputChange}
          error={Boolean(errors.hourlyRate)}
          helperText={errors.hourlyRate}
        />
      )}
      <TextField disabled={readOnly}
        className="mb-2"
        label="Weekly Off Day"
        name="weeklyOffDay"
        fullWidth
        value={formData.weeklyOffDay}
        onChange={handleInputChange}
        error={Boolean(errors.weeklyOffDay)}
        helperText={errors.weeklyOffDay}
      />
    </div>
  );
};

export default EmployeementDetails;
