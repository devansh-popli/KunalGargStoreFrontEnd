import React, { useState, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';
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
    const dropzoneStyle = {
      border: '2px dashed #ccc',
      borderRadius: '4px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
    };
    
    function handleChooseFile() {
      document.getElementById('fileInput').click();
    }
    const onDrop = useCallback((acceptedFiles) => {
      // Handle the dropped files here, e.g., upload to the server or process locally
      console.log('Accepted Files:', acceptedFiles);
    }, []);
  
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div>
      <h5 className='fw-bold'>Bank Details</h5>
        <TextField className="mb-2"
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
  />
   <div className='mb-3'>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop files here, or click to select bank document files</p>
      </div>
      <Button variant="outlined" className='mt-2' color="primary" component="span" onClick={handleChooseFile}>
        Choose File
      </Button>
    </div>
  </div>
  )
}

export default BankDetails