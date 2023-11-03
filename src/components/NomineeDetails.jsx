import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const NomineeDetails = ({ onFormChange, formData, setFormData }) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.nominee1.name) {
        newErrors.nominee1Name = 'Nominee 1 name is required';
      }
  
      if (!formData.nominee1.relationship) {
        newErrors.nominee1Relationship = 'Nominee 1 relationship is required';
      }
  
      if (!formData.nominee2.name) {
        newErrors.nominee2Name = 'Nominee 2 name is required';
      }
  
      if (!formData.nominee2.relationship) {
        newErrors.nominee2Relationship = 'Nominee 2 relationship is required';
      }
  
      return newErrors;
    };
  
    const handleInputChange = (e, nomineeKey) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [nomineeKey]: {
          ...formData[nomineeKey],
          [name]: value,
        },
      });
    };
  return (
    <div>  
  <Typography variant="h6" className='mt-3'>Enter Nominee 1 Details</Typography>
              <TextField className="my-2"
    label="Name"
    name="name"
    fullWidth
    value={formData.nominee1.name}
    onChange={(e) => handleInputChange(e, 'nominee1')}
    error={Boolean(errors.nominee1Name)}
    helperText={errors.nominee1Name}
  />
  <TextField className="mb-2"
    label="Relationship"
    name="relationship"
    fullWidth
    value={formData.nominee1.relationship}
    onChange={(e) => handleInputChange(e, 'nominee1')}
    error={Boolean(errors.nominee1Relationship)}
    helperText={errors.nominee1Relationship}
  />
  <TextField className="mb-2"
    label="Mobile"
    name="mobile"
    fullWidth
    value={formData.nominee1.mobile}
    onChange={(e) => handleInputChange(e, 'nominee1')}
  />
  <TextField className="mb-2"
    label="Aadhar Card"
    name="aadharCard"
    fullWidth
    value={formData.nominee1.aadharCard}
    onChange={(e) => handleInputChange(e, 'nominee1')}
  />

<Typography variant="h6">Enter Nominee 2 Details</Typography>
  <TextField className="mb-2"
    label="Name"
    name="name"
    fullWidth
    value={formData.nominee2.name}
    onChange={(e) => handleInputChange(e, 'nominee2')}
    error={Boolean(errors.nominee2Name)}
    helperText={errors.nominee2Name}
  />
  <TextField className="mb-2"
    label="Relationship"
    name="relationship"
    fullWidth
    value={formData.nominee2.relationship}
    onChange={(e) => handleInputChange(e, 'nominee2')}
    error={Boolean(errors.nominee2Relationship)}
    helperText={errors.nominee2Relationship}
  />
  <TextField className="mb-2"
    label="Mobile"
    name="mobile"
    fullWidth
    value={formData.nominee2.mobile}
    onChange={(e) => handleInputChange(e, 'nominee2')}
  />
  <TextField className="mb-2"
    label="Aadhar Card"
    name="aadharCard"
    fullWidth
    value={formData.nominee2.aadharCard}
    onChange={(e) => handleInputChange(e, 'nominee2')}
  /></div>
  )
}

export default NomineeDetails