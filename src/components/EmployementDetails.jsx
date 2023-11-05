import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  Grid,
} from "@mui/material";
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const EmployementDetails = ({ onFormChange, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadharCard) {
      newErrors.aadharCard = "Aadhar card is required";
    }

    if (!formData.panCard) {
      newErrors.panCard = "PAN card is required";
    }

    if (!formData.drivingLicenseNo) {
      newErrors.drivingLicenseNo = "Driving license number is required";
    }

    if (!formData.passportNo) {
      newErrors.passportNo = "Passport number is required";
    }

    if (!formData.policeVerificationStation) {
      newErrors.policeVerificationStation =
        "Police verification station is required";
    }

    if (!formData.policeVerificationCertificateNo) {
      newErrors.policeVerificationCertificateNo =
        "Certificate number is required";
    }

    if (!formData.dateOfIssue) {
      newErrors.dateOfIssue = "Date of issue is required";
    }

    if (!formData.dateOfExpiry) {
      newErrors.dateOfExpiry = "Date of expiry is required";
    }

    if (!formData.issuedBy) {
      newErrors.issuedBy = "Issued by is required";
    }

    if (documentFiles.length === 0) {
      newErrors.documents = "Please upload at least one document";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e) => {
    const files = e.target.files;
    setDocumentFiles(Array.from(files));
  };
  const [documentFiles, setDocumentFiles] = useState([]);
  return (
    <div>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        id="selectedDocument"
        name="selectedDocument"
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />
      {/* <label htmlFor="selectedDocument" className="mt-3"></label> */}
      <div className="d-flex my-2 align-items-center">
        <TextField
          className=" w-80  "
          label="Aadhar Card"
          name="aadharCard"
          fullWidth
          value={formData.aadharCard}
          onChange={handleInputChange}
          error={Boolean(errors.aadharCard)}
          helperText={errors.aadharCard}
        />
         <Button
         className="mx-2"
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField
          className=" w-80"
          label="PAN Card"
          name="panCard"
          fullWidth
          value={formData.panCard}
          onChange={handleInputChange}
          error={Boolean(errors.panCard)}
          helperText={errors.panCard}
        />
        <Button
        className="mx-2"
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField
          className="w-80"
          label="Driving License No"
          name="drivingLicenseNo"
          fullWidth
          value={formData.drivingLicenseNo}
          onChange={handleInputChange}
          error={Boolean(errors.drivingLicenseNo)}
          helperText={errors.drivingLicenseNo}
        />
        <Button
          component="label"
          variant="contained"
           className="mx-2"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField
          className=" w-80 "
          label="Passport No"
          name="passportNo"
          fullWidth
          value={formData.passportNo}
          onChange={handleInputChange}
          error={Boolean(errors.passportNo)}
          helperText={errors.passportNo}
        />
          <Button
          component="label"
          variant="contained"
          className="mx-2"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </div>
      <TextField
        className="mb-2"
        label="Police Verification Station"
        name="policeVerificationStation"
        fullWidth
        value={formData.policeVerificationStation}
        onChange={handleInputChange}
        error={Boolean(errors.policeVerificationStation)}
        helperText={errors.policeVerificationStation}
      />
      <TextField
        className="mb-2"
        label="Certificate No"
        name="policeVerificationCertificateNo"
        fullWidth
        value={formData.policeVerificationCertificateNo}
        onChange={handleInputChange}
        error={Boolean(errors.policeVerificationCertificateNo)}
        helperText={errors.policeVerificationCertificateNo}
      />
      <TextField
        className="mb-2"
        label="Date of Issue"
        name="dateOfIssue"
        fullWidth
        type="date"
        value={formData.dateOfIssue}
        onChange={handleInputChange}
        error={Boolean(errors.dateOfIssue)}
        helperText={errors.dateOfIssue}
      />
      <TextField
        className="mb-2"
        label="Date of Expiry"
        name="dateOfExpiry"
        fullWidth
        type="date"
        value={formData.dateOfExpiry}
        onChange={handleInputChange}
        error={Boolean(errors.dateOfExpiry)}
        helperText={errors.dateOfExpiry}
      />
      <TextField
        className="mb-2"
        label="Issued By"
        name="issuedBy"
        fullWidth
        value={formData.issuedBy}
        onChange={handleInputChange}
        error={Boolean(errors.issuedBy)}
        helperText={errors.issuedBy}
      />
    </div>
  );
};

export default EmployementDetails;
