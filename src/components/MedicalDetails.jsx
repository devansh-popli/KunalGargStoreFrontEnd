import React, { useState } from 'react';
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


const MedicalDetails = ({ onFormChange, formData, setFormData ,readOnly}) => {
    
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>  
      <h5 className='fw-bold'>Medical</h5>
      <FormControl fullWidth className="mb-2">
        <InputLabel>Disability Status</InputLabel>
        <Select disabled={readOnly}
          name="disabilityStatus"
          value={formData.disabilityStatus}
          onChange={handleInputChange}
          error={Boolean(errors.disabilityStatus)}
        >
          <MenuItem value="Physical">Physical</MenuItem>
          <MenuItem value="Intellectual">Intellectual</MenuItem>
          <MenuItem value="Mental">Mental</MenuItem>
          <MenuItem value="Not Applicable">Not Applicable</MenuItem>
        </Select>
      </FormControl>
      <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
        label="Height (Cm)"
        name="height"
        fullWidth
        value={formData.height}
        onChange={handleInputChange}
        error={Boolean(errors.height)}
        helperText={errors.height}
      />
      <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
        label="Weight (Kg)"
        name="weight"
        fullWidth
        value={formData.weight}
        onChange={handleInputChange}
        error={Boolean(errors.weight)}
        helperText={errors.weight}
      />
      <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
        label="Blood Group"
        name="bloodGroup"
        fullWidth
        value={formData.bloodGroup}
        onChange={handleInputChange}
        error={Boolean(errors.bloodGroup)}
        helperText={errors.bloodGroup}
      />
      <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
        label="Disease"
        name="disease"
        fullWidth
        value={formData.disease}
        onChange={handleInputChange}
      />
      <FormControl fullWidth className="mb-2">
        <InputLabel>COVID-19 Vaccination</InputLabel>
        <Select disabled={readOnly}
          name="covidVaccination"
          value={formData.covidVaccination}
          onChange={handleInputChange}
          error={Boolean(errors.covidVaccination)}
        >
          <MenuItem value="Single Dose Vaccinated">Single Dose Vaccinated</MenuItem>
          <MenuItem value="Double Dose Vaccinated">Double Dose Vaccinated</MenuItem>
          <MenuItem value="Double + Booster Vaccinated">Double + Booster Vaccinated</MenuItem>
          <MenuItem value="Not Yet Vaccinated">Not Yet Vaccinated</MenuItem>
        </Select>
      </FormControl>
      {formData.covidVaccination === 'Double + Booster Vaccinated' && (
        <>
          <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
            label="Doctor's Name"
            name="doctorName"
            fullWidth
            value={formData.doctorName}
            onChange={handleInputChange}
            error={Boolean(errors.doctorName)}
            helperText={errors.doctorName}
          />
          <TextField inputProps={{ style: { textTransform: 'uppercase' } }}  disabled={readOnly} className="mb-2"
            label="Doctor's Phone No"
            name="doctorPhone"
            fullWidth
            type='number'
            value={formData.doctorPhone}
            onChange={handleInputChange}
            error={Boolean(errors.doctorPhone)}
            helperText={errors.doctorPhone}
          />
        </>
      )}</div>
  )
}

export default MedicalDetails