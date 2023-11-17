import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Carousel from "react-bootstrap/Carousel";
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
import { toast } from "react-toastify";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const EmployementDetails = ({ onFormChange, formData, setFormData,readOnly }) => {
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
  const handleFileChangeDocument = (event, type) => {
    const localFiles = event.target.files;
    if (localFiles) {
      Array.from(localFiles)?.map((localFile) => {
        if (
          localFile.type === "image/png" ||
          localFile.type === "image/jpeg" ||
          localFile.type === "image/jpg"
        ) {
          const reader = new FileReader();
          reader.onload = (r) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              placeholder: [
                ...(prevFormData?.placeholder || []), // Initialize as an empty array if not present
                r.target.result,
              ],
              ...(type === "passport" && {
                passportDocumentFiles: [
                  ...(formData?.passportDocumentFiles || []),
                  localFile,
                ],
              }),
              ...(type === "pan" && {
                panDocumentFiles: [
                  ...(formData?.panDocumentFiles || []),
                  localFile,
                ],
              }),
              ...(type === "driving" && {
                drivingDocumentFiles: [
                  ...(formData?.drivingDocumentFiles || []),
                  localFile,
                ],
              }),
              ...(type === "adhar" && {
                aadharDocumentFiles: [
                  ...(formData?.aadharDocumentFiles || []),
                  localFile,
                ],
              }),
            }));
            console.log(formData?.placeholder?.length);
          };
          reader.readAsDataURL(localFile);
        } else {
          toast.error("Invalid File Format only jpeg/jpg/png allowed");
          setFormData({
            ...formData,
            placeholderSignature: null,
            signatureImage: null,
          });
        }
      });
    }
  };
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRef4 = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const handleFileChangeDocument = (e,type) => {
  //   const files = e.target.files;
  //   if(files)
  //   {
  //     setIsLoading(true);
  //     const imageFilesArray = Array.from(files);
  //     setImageFiles([...imageFiles, ...imageFilesArray]);
  //     const previewArray = imageFilesArray.map((file) => URL.createObjectURL(file));
  //     setImagePreviews([...imagePreviews, ...previewArray]);
  //     console.log(imagePreviews.length)
  //     setIsLoading(false);
  //   }
  // };
  const [documentFiles, setDocumentFiles] = useState([]);
  function openImageInNewTab(dataUrl) {
    const newWindow = window.open();
    newWindow.document.write(
      `<div style={{display:"flex",textAlign:"center"}}><img src="${dataUrl}" alt="Image"></div>`
    );
  }
  const triggerFileInputClick1 = () => {
    if (fileInputRef1.current) {
      fileInputRef1.current.click(); // Trigger a click on the file input
    }
  };
  const triggerFileInputClick2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click(); // Trigger a click on the file input
    }
  };
  const triggerFileInputClick3 = () => {
    if (fileInputRef3.current) {
      fileInputRef3.current.click(); // Trigger a click on the file input
    }
  };
  const triggerFileInputClick4 = () => {
    if (fileInputRef4.current) {
      fileInputRef4.current.click(); // Trigger a click on the file input
    }
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // You can adjust the number of slides shown at a time
    slidesToScroll: 1,
  };
  return (
    <div>
      {/* {JSON.stringify(formData.placeholder)} */}
      <h5 className="fw-bold">Employee Details</h5>
      {/* <label htmlFor="selectedDocument" className="mt-3"></label> */}
      <Container className="text-center py-3 border">
        <p className="text-muted">Image Preview</p>
        {formData.placeholder && formData.placeholder.length > 0 && (
          <Carousel data-bs-theme="dark" indicators={false} controls={formData.placeholder.length>0}>
            {formData.placeholder.map((file, index) => (
              <Carousel.Item key={index}>
                <img
                  className="img-fluid mx-2"
                  style={{
                    objectFit: "contain",
                    maxHeight: "150px",
                    width: "100%",
                  }}
                  src={file}
                  alt=""
                  onClick={() => openImageInNewTab(file)}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Container>
      <div className="d-flex my-2 align-items-center">
        <TextField disabled={readOnly}
          className={readOnly?"w-100":"w-80"}
          label="Aadhar Card"
          name="aadharCard"
          fullWidth
          value={formData.aadharCard}
          onChange={handleInputChange}
          error={Boolean(errors.aadharCard)}
          helperText={errors.aadharCard}
        />
        <Button
          className={readOnly?"d-none":"mx-2"}
         component="label"
          onClick={triggerFileInputClick1}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        ></Button>{" "}
        <Form.Control
          className="d-none"
          ref={fileInputRef1}
          onChange={(event) => handleFileChangeDocument(event, "adhar")}
          type="file"
        />
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField disabled={readOnly}
          className={readOnly?"w-100":"w-80"}
          label="PAN Card"
          name="panCard"
          fullWidth
          value={formData.panCard}
          onChange={handleInputChange}
          error={Boolean(errors.panCard)}
          helperText={errors.panCard}
        />
        <Button
          className={readOnly?"d-none":"mx-2"}
          component="label"
          onClick={triggerFileInputClick2}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        ></Button>{" "}
        <Form.Control
          className="d-none"
          ref={fileInputRef2}
          onChange={(event) => handleFileChangeDocument(event, "pan")}
          type="file"
        />
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField disabled={readOnly}
          className={readOnly?"w-100":"w-80"}
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
          className={readOnly?"d-none":"mx-2"}
          onClick={triggerFileInputClick3}
          startIcon={<CloudUploadIcon />}
        ></Button>{" "}
        <Form.Control
          className="d-none"
          ref={fileInputRef3}
          onChange={(event) => handleFileChangeDocument(event, "driving")}
          type="file"
        />
      </div>
      <div className="d-flex mb-2 align-items-center">
        <TextField disabled={readOnly}
          className={readOnly?"w-100":"w-80"}
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
          className={readOnly?"d-none":"mx-2"}
          onClick={triggerFileInputClick4}
          startIcon={<CloudUploadIcon />}
        ></Button>{" "}
        <Form.Control
          className="d-none"
          ref={fileInputRef4}
          onChange={(event) => handleFileChangeDocument(event, "passport")}
          type="file"
        />
      </div>
      <TextField disabled={readOnly}
        className="mb-2"
        label="Police Verification Station"
        name="policeVerificationStation"
        fullWidth
        value={formData.policeVerificationStation}
        onChange={handleInputChange}
        error={Boolean(errors.policeVerificationStation)}
        helperText={errors.policeVerificationStation}
      />
      <TextField disabled={readOnly}
        className="mb-2"
        label="Certificate No"
        name="policeVerificationCertificateNo"
        fullWidth
        value={formData.policeVerificationCertificateNo}
        onChange={handleInputChange}
        error={Boolean(errors.policeVerificationCertificateNo)}
        helperText={errors.policeVerificationCertificateNo}
      />
      <TextField disabled={readOnly}
        className="mb-2"
        label="Date of Issue"
        name="dateOfIssue"
        fullWidth
        type="date"
        value={formData.dateOfIssue}
        onChange={handleInputChange}
        error={Boolean(errors.dateOfIssue)}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {
            placeholder: "dd mm yy",
            style: { textTransform: "none" }, // Prevent uppercase transformation
          },
        }}
        helperText={errors.dateOfIssue}
      />
      <TextField disabled={readOnly}
        className="mb-2"
        label="Date of Expiry"
        name="dateOfExpiry"
        fullWidth
        type="date"
        value={formData.dateOfExpiry}
        onChange={handleInputChange}
        error={Boolean(errors.dateOfExpiry)}
        helperText={errors.dateOfExpiry}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {
            placeholder: "dd mm yy",
            style: { textTransform: "none" }, // Prevent uppercase transformation
          },
        }}
      />
      <TextField disabled={readOnly}
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
