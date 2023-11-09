import React, { useState, useCallback, useRef } from "react";

import { useDropzone } from "react-dropzone";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

const BankDetails = ({ onFormChange, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameOfBank) {
      newErrors.nameOfBank = "Name of Bank is required";
    }

    if (!formData.branch) {
      newErrors.branch = "Branch is required";
    }

    if (!formData.accountHolderName) {
      newErrors.accountHolderName = "Account Holder Name is required";
    }

    if (!formData.accountNo) {
      newErrors.accountNo = "Account Number is required";
    }

    if (!formData.ifscNo) {
      newErrors.ifscNo = "IFSC Number is required";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  };

  function handleChooseFile() {
    fileInputRef.current.click();
  }
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the dropped files here, e.g., upload to the server or process locally
    console.log("Accepted Files:", acceptedFiles);
  }, []);
  const handleFileChangeDocument = (event, type) => {
    const localFile = event.target.files[0];
    if (
      localFile.type === "image/png" ||
      localFile.type === "image/jpeg" ||
      localFile.type === "image/jpg"
    ) {
      const reader = new FileReader();
      reader.onload = (r) => {
        setFormData({
          ...formData,
          placeholderBankDocument: r.target.result,
          bankDocumentImage: localFile,
        });
      };
      reader.readAsDataURL(localFile);
    } else {
      toast.error("Invalid File Format only jpeg/jpg/png allowed");
      setFormData({
        ...formData,
        placeholderBankDocument: null,
        bankDocumentImage: null,
      });
    }
  };
  const fileInputRef = useRef(null);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div>
      <h5 className="fw-bold">Bank Details</h5>
      <TextField
        className="mb-2"
        label="Name of Bank"
        name="nameOfBank"
        fullWidth
        value={formData.nameOfBank}
        onChange={handleInputChange}
        error={Boolean(errors.nameOfBank)}
        helperText={errors.nameOfBank}
      />

      <TextField
        className="mb-2"
        label="Branch"
        name="branch"
        fullWidth
        value={formData.branch}
        onChange={handleInputChange}
        error={Boolean(errors.branch)}
        helperText={errors.branch}
      />
      <TextField
        className="mb-2"
        label="Account Holder Name"
        name="accountHolderName"
        fullWidth
        value={formData.accountHolderName}
        onChange={handleInputChange}
        error={Boolean(errors.accountHolderName)}
        helperText={errors.accountHolderName}
      />
      <TextField
        className="mb-2"
        label="Account Number"
        name="accountNo"
        fullWidth
        value={formData.accountNo}
        onChange={handleInputChange}
        error={Boolean(errors.accountNo)}
        helperText={errors.accountNo}
      />
      <TextField
        className="mb-2"
        label="IFSC Number"
        name="ifscNo"
        fullWidth
        value={formData.ifscNo}
        onChange={handleInputChange}
        error={Boolean(errors.ifscNo)}
        helperText={errors.ifscNo}
      />
      <Form.Group className="mb-3">
        <Container className="text-center py-3 border">
          <p className="text-muted">Image Preview</p>
          <img
            className="img-fluid"
            style={{
              objectFit: "contain",
              maxHeight: "250px",
              width: "100%",
            }}
            src={formData.placeholderBankDocument}
            alt=""
          />
        </Container>
        <Form.Label className="my-1">Upload Bank Document Image</Form.Label>
        <Form.Control
          ref={fileInputRef}
          onChange={(event) => handleFileChangeDocument(event, "adhar")}
          type="file"
        />
      </Form.Group>
    </div>
  );
};

export default BankDetails;
