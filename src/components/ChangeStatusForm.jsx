import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Card } from "react-bootstrap";
import { Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";

const ChangeStatusForm = ({ handleClose, updateStatus }) => {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    if (event.target.value !== "reject") {
      setRemarks("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    if (!status) {
      toast.error("Status in Mandatory");
      return;
    }
    if (status == "rejected" && !remarks) {
      toast.error("Remarks in Mandatory");
      return;
    }
    console.log({ status, remarks });
    updateStatus({ status, remarks });
    handleClose();
  };

  return (
    <Card component="form" className="p-2" style={{ width: "700px" }}>
      <div
        style={{
          borderBottom: "2px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h5>Change Status</h5>
        <div>
          <Cancel onClick={handleClose} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <div className="d-flex">
        <FormControl fullWidth className="w-50 mt-4">
          <InputLabel id="status-label">Status</InputLabel>

          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Status"
            onChange={handleStatusChange}
            required
          >
            <MenuItem value="approved">Approve</MenuItem>
            <MenuItem value="rejected">Reject</MenuItem>
          </Select>
        </FormControl>
        {status === "rejected" && (
          <TextField
            className="w-50 mt-4 mx-2"
            id="remarks"
            label="Remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            required
          />
        )}
      </div>
      <Button
        className="w-50 my-2"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Card>
  );
};

export default ChangeStatusForm;
