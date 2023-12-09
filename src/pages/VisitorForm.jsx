import React, { useContext, useRef, useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Tooltip,
  Container,
  TableContainer,
} from '@mui/material';
import Webcam from 'react-webcam';
import { Form, InputGroup } from 'react-bootstrap';
import { CameraAlt } from '@mui/icons-material';
import { toast } from 'react-toastify';
import VisitorTable from '../components/VisitorTable';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phone: '',
    address: '',
    photo: null,
    purpose: '',
    timeIn: '',
    timeOut: '',
    aadharNumber: '',
  });

  const [mandatoryFieldsError, setMandatoryFieldsError] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleSubmit = () => {
    // Validate mandatory fields
    if (!formData.name || !formData.fatherName || !formData.phone || !formData.address || !formData.purpose) {
      setMandatoryFieldsError(true);
      return;
    }

    // Handle form submission
    // Add your logic to submit the form data

    // Reset the form after submission
    setFormData({
      name: '',
      fatherName: '',
      phone: '',
      address: '',
      photo: null,
      purpose: '',
      timeIn: '',
      timeOut: '',
      aadharNumber: '',
    });

    setMandatoryFieldsError(false);
  };
  const handleFileChangeProfile = (event, type = "file") => {
    if (type == "cam") {
      if (showCamera) {
        const imageSrc = webcamRef.current.getScreenshot();
        setFormData({
          ...formData,
          placeholderProfile: imageSrc,
          profileImage: dataURLtoFile(imageSrc, "captured_image.jpg"),
        });
        webcamRef.current.video.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        setShowCamera(false);
      } else {
        setShowCamera(true);
      }
    } else {
      const localFile = event.target.files[0];
      if (
        localFile.type === "image/png" ||
        localFile.type === "image/jpeg" ||
        localFile.type === "image/jpg"
      ) {
        const reader = new FileReader();
        reader.onload = (r) => {
          setFormData(
            {
              ...formData,
              placeholderProfile: r.target.result,
              profileImage: localFile,
            },
            () => {}
          );
        };
        reader.readAsDataURL(localFile);
      } else {
        toast.error("Invalid File Format only jpeg/jpg/png allowed");
        setFormData({
          ...formData,
          placeholderProfile: null,
          profileImage: null,
        });
      }
    }
  };
  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const webcamRef = useRef(null);
  const webcamRefSignature = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const userContext=useContext(UserContext)
  return userContext.isLogin ? (
    <Grid container spacing={2} justifyContent="start">
      <Grid item xs={12} md={5}>
        <Paper elevation={3} style={{ padding:'20px' }} className='ms-3 mt-3'>
          <h4 className='fw-bold'>Visitor Entry Form</h4>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Father's Name"
                fullWidth
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Form.Group className="mb-2">
        <Container className="text-center py-3 border" style={{borderRadius:"10px"}} fluid>
          <p className="text-muted">Profile Image Preview</p>
          {!showCamera && <img
            className="img-fluid rounded"
            style={{
              objectFit: "contain",
              maxHeight: "200px",
              width: "100%"
            }}
            src={formData.placeholderProfile}
            alt=""
          />}
          
          {showCamera && (
            <div className="text-center">
              <Webcam
                width={160}
                height={160}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            </div>
          )}
        </Container>
        <div >
          <Form.Label>Select Profile Image</Form.Label>
          <div className="d-flex align-items-center">
            <div>
              <Button
                data-for="happyFace"
                onClick={(event) => handleFileChangeProfile(event, "cam")}
                variant="outlined"
                type="error"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Take Photo"
              >
                <CameraAlt />
              </Button>
              <Tooltip
                id="my-tooltip"
                place="bottom"
                type="info"
                effect="solid"
              />
            </div>

            <span className="mx-2">or</span>
            <InputGroup>
              <Form.Control
                onChange={(event) => handleFileChangeProfile(event)}
                type="file"
              />
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setFormData({
                    ...formData,
                    placeholderProfile: undefined,
                    profileImage: null,
                  });
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </div>
        </div>
      </Form.Group>
   
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Purpose"
                fullWidth
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleInputChange('timeIn', new Date().toLocaleTimeString())}
              >
                Time In
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleInputChange('timeOut', new Date().toLocaleTimeString())}
              >
                Time Out
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Aadhar Card Number"
                fullWidth
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Time In
              </Button>
              {mandatoryFieldsError && (
                <Typography color="error" variant="caption" display="block" marginTop="10px">
                  * Please fill in all mandatory fields.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}md={7}>
        <VisitorTable visitors={[]} handleTimeout={()=>console.log("first")}/>
      </Grid>
    </Grid>
  ):<Navigate to={"/"}/>;
};

export default VisitorForm;
