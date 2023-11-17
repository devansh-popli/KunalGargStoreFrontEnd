import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";

const NomineeDetails = ({ onFormChange, formData, setFormData, readOnly }) => {
  const [errors, setErrors] = useState({});

  
  const handleInputChange = (e, nomineeIndex) => {
    const { name, value } = e.target;
    const updatedNominees = [...formData.nominees]; // Clone the nominees array
    updatedNominees[nomineeIndex] = {
      ...updatedNominees[nomineeIndex],
      [name]: value,
    };
    setFormData({
      ...formData,
      nominees: updatedNominees,
    });
  };
  return (
    <div>
      <h5 className="fw-bold">Nominee Details</h5>
      <h6 variant="h6" className="">
        Enter Nominee 1 Details
      </h6>
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Name"
        name="name"
        fullWidth
        value={formData?.nominees[0]?.name}
        onChange={(e) => handleInputChange(e, "0")}
        error={Boolean(errors.nominee1Name)}
        helperText={errors.nominee1Name}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Relationship"
        name="relationship"
        fullWidth
        value={formData?.nominees[0]?.relationship}
        onChange={(e) => handleInputChange(e, "0")}
        error={Boolean(errors.nominee1Relationship)}
        helperText={errors.nominee1Relationship}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Mobile"
        name="mobile"
        fullWidth
        value={formData?.nominees[0]?.mobile}
        onChange={(e) => handleInputChange(e, "0")}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Aadhar Card"
        name="aadharCard"
        fullWidth
        value={formData?.nominees[0]?.aadharCard}
        onChange={(e) => handleInputChange(e, "0")}
      />

      <h6 variant="h6">Enter Nominee 2 Details</h6>
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Name"
        name="name"
        fullWidth
        value={formData?.nominees[1]?.name}
        onChange={(e) => handleInputChange(e, "1")}
        error={Boolean(errors.nominee2Name)}
        helperText={errors.nominee2Name}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Relationship"
        name="relationship"
        fullWidth
        value={formData?.nominees[1]?.relationship}
        onChange={(e) => handleInputChange(e, "1")}
        error={Boolean(errors.nominee2Relationship)}
        helperText={errors.nominee2Relationship}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Mobile"
        name="mobile"
        fullWidth
        value={formData?.nominees[1]?.mobile}
        onChange={(e) => handleInputChange(e, "1")}
      />
      <TextField
        disabled={readOnly}
        className="mb-2"
        label="Aadhar Card"
        name="aadharCard"
        fullWidth
        value={formData?.nominees[1]?.aadharCard}
        onChange={(e) => handleInputChange(e, "1")}
      />
    </div>
  );
};

export default NomineeDetails;
