import React, { useState, useEffect, useContext } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import {
    Container,
    TextField,
  } from '@mui/material';
import ProfileDetails from '../components/ProfileDetails';
import EmployementDetails from '../components/EmployementDetails';
import NomineeDetails from '../components/NomineeDetails';
import BankDetails from '../components/BankDetails';
import MedicalDetails from '../components/MedicalDetails';
import EmployeementDetails from '../components/EmployeementDetails';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
// Mock API function (replace with actual API calls)
const saveEmployeeDataToAPI = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call
      resolve();
    }, 1000);
  });
};

const steps = [
  'Personal Details',
  'Address',
  'Profile Details',
  'Employee Details',
  'Nominee',
  'Bank',
  'Medical',
  'Employment'
];

function EmployeeEnrollmentForm() {
  const userContext=useContext(UserContext)
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nominee1: {
        name: '',
        relationship: '',
        mobile: '',
        aadharCard: '',
      },
      nominee2: {
        name: '',
        relationship: '',
        mobile: '',
        aadharCard: '',
      },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await saveEmployeeDataToAPI(formData);
        alert('Form data saved successfully!');
        // You can redirect the user to another page here.
      } catch (error) {
        alert('Failed to save form data. Please try again.');
      }
    } else {
      handleNext();
    }
  };

  const handleFormChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//   });

 

  return userContext.isLogin ?(
    <Container className='mt-3'>
        <h4 className='fw-bold'>Employee Registration</h4>
        <Stepper className='my-3' activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}  sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#78C2AD', // circle color (COMPLETED)
              },
              '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                {
                  color: 'grey.500', // Just text label (COMPLETED)
                },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#78C2AD', // circle color (ACTIVE)
              },
              '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                {
                  color: 'grey.500', // Just text label (ACTIVE)
                },
              '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                fill: 'white', // circle's number (ACTIVE)
              },
            }}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className='d-flex justify-content-center'>
      <Paper elevation={3} style={{ padding: '20px' }} className='w-50'>
        {activeStep === steps.length ? (
          <div>
            <Typography variant="h5">Thank you for completing the form.</Typography>
          </div>
        ) : (
          <div>
            {activeStep === 0 && (
              // Personal Details
              <PersonalDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 1 && (
              // Address
              <Address onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 2 && (
              // Address
              <ProfileDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 3 && (
              // Address
              <EmployementDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 4 && (
              // Address
              <NomineeDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 5 && (
              // Address
              <BankDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 6 && (
              // Address
              <MedicalDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {activeStep === 7 && (
              // Address
              <EmployeementDetails onFormChange={handleFormChange} formData={formData} setFormData={setFormData} />
            )}
            {/* Add sections for other steps */}
            <div>
              <Button size='small' disabled={activeStep === 0} className={activeStep!==0?`font-primary`:``} onClick={handleBack}>
                Back
              </Button>
              <Button size='small' style={{backgroundColor:'#78C2AD'}} variant="contained"  onClick={handleSave}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Paper>
      </div>
    </Container>
  ):<Navigate to="/"/>;
}

function PersonalDetails({ onFormChange, formData,setFormData }) {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.empCode) {
        newErrors.empCode = 'Employee Code is required';
      }
  
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
  
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
  
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }
  
      return newErrors;
    };
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  const handleChange = (event) => {
    onFormChange(event.target.name, event.target.value);
  };

  return (
    <div>
      <h5 className='fw-bold'>Personal Details</h5>
        <TextField
            label="Employee Code"
            variant='outlined'
            name="empCode"
            fullWidth
            value={formData.empCode}
            onChange={handleInputChange}
            error={Boolean(errors.empCode)}
            helperText={errors.empCode}
             className='mb-3'
          />
        <TextField
            label="First Name"
            variant='outlined'
            name="firstName"
            fullWidth
            value={formData.firstName}
            onChange={handleInputChange}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
             className='mb-3'
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={formData.lastName}
            onChange={handleInputChange}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
            className='mb-3'
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            className='mb-3'
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={Boolean(errors.phoneNumber)}
            helperText={errors.phoneNumber}
            className='mb-3'
          />
    </div>
  )
}

function Address({ onFormChange, formData ,setFormData}) {
  const handleChange = (event) => {
    onFormChange(event.target.name, event.target.value);
  };
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.houseNo) {
      newErrors.houseNo = 'House No is required';
    }

    if (!formData.street) {
      newErrors.street = 'Street is required';
    }

    if (!formData.landmark) {
      newErrors.landmark = 'Landmark is required';
    }

    if (!formData.cityTehsil) {
      newErrors.cityTehsil = 'City/Tehsil is required';
    }

    if (!formData.postcode) {
      newErrors.postcode = 'Postcode is required';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div>
      <h5 className='fw-bold'>Address</h5>
          <TextField
            label="House No"
            name="houseNo"
            fullWidth
            value={formData.houseNo}
            onChange={handleInputChange}
            error={Boolean(errors.houseNo)}
            helperText={errors.houseNo}
            className='mb-3'
          />
          <TextField
            label="Street"
            name="street"
            fullWidth
            value={formData.street}
            onChange={handleInputChange}
            error={Boolean(errors.street)}
            helperText={errors.street}
            className='mb-3'
          />
          <TextField
            label="Landmark"
            name="landmark"
            fullWidth
            value={formData.landmark}
            onChange={handleInputChange}
            error={Boolean(errors.landmark)}
            helperText={errors.landmark}
            className='mb-3'
          />
          <TextField
            label="City / Tehsil"
            name="cityTehsil"
            fullWidth
            value={formData.cityTehsil}
            onChange={handleInputChange}
            error={Boolean(errors.cityTehsil)}
            helperText={errors.cityTehsil}
            className='mb-3'
          />
          <TextField
            label="Postcode"
            name="postcode"
            fullWidth
            value={formData.postcode}
            onChange={handleInputChange}
            error={Boolean(errors.postcode)}
            helperText={errors.postcode}
            className='mb-3'
          />
    </div>
  );
}

export default EmployeeEnrollmentForm;