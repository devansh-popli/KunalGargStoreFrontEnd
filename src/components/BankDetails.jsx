import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const BankDetails = ({ onFormChange, formData, setFormData }) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.nameOfBank) {
        newErrors.nameOfBank = 'Name of Bank is required';
      }
  
      if (!formData.branch) {
        newErrors.branch = 'Branch is required';
      }
  
      if (!formData.accountHolderName) {
        newErrors.accountHolderName = 'Account Holder Name is required';
      }
  
      if (!formData.accountNo) {
        newErrors.accountNo = 'Account Number is required';
      }
  
      if (!formData.ifscNo) {
        newErrors.ifscNo = 'IFSC Number is required';
      }
  
      return newErrors;
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
  return (
    <div>  <TextField className="mb-2 mt-3"
    label="Name of Bank"
    name="nameOfBank"
    fullWidth
    value={formData.nameOfBank}
    onChange={handleInputChange}
    error={Boolean(errors.nameOfBank)}
    helperText={errors.nameOfBank}
  />
  <TextField className="mb-2"
    label="Branch"
    name="branch"
    fullWidth
    value={formData.branch}
    onChange={handleInputChange}
    error={Boolean(errors.branch)}
    helperText={errors.branch}
  />
  <TextField className="mb-2"
    label="Account Holder Name"
    name="accountHolderName"
    fullWidth
    value={formData.accountHolderName}
    onChange={handleInputChange}
    error={Boolean(errors.accountHolderName)}
    helperText={errors.accountHolderName}
  />
  <TextField className="mb-2"
    label="Account Number"
    name="accountNo"
    fullWidth
    value={formData.accountNo}
    onChange={handleInputChange}
    error={Boolean(errors.accountNo)}
    helperText={errors.accountNo}
  />
  <TextField className="mb-2"
    label="IFSC Number"
    name="ifscNo"
    fullWidth
    value={formData.ifscNo}
    onChange={handleInputChange}
    error={Boolean(errors.ifscNo)}
    helperText={errors.ifscNo}
  /></div>
  )
}

export default BankDetails