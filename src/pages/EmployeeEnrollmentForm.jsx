import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Webcam from "react-webcam";
import { Container, TextField } from "@mui/material";
import ProfileDetails from "../components/ProfileDetails";
import "react-tooltip/dist/react-tooltip.css";
import EmployementDetails from "../components/EmployementDetails";
import NomineeDetails from "../components/NomineeDetails";
import BankDetails from "../components/BankDetails";
import MedicalDetails from "../components/MedicalDetails";
import EmployeementDetails from "../components/EmployeementDetails";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  getEmployeeCodeFromBackend,
  getEmployeeImageByType,
  getEmployeeImageByTypeURl,
  saveEmployeeDataToBackend,
  saveEmployeeDocumentToBackend,
} from "../services/EmployeeDataService";
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
  "Personal Details",
  "Address",
  "Profile Details",
  "Employee Details",
  "Nominee",
  "Bank",
  "Medical",
  "Employment",
];

function EmployeeEnrollmentForm({
  paper = true,
  selectedEmployee,
  handleClose,
  setSelectedEmployee,
  readOnly,
}) {
  const userContext = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nominees: [],
  });
  const navigate = useNavigate();
  const setUpdateFormData = (employee) => {
    let aadharImage = null;
    let drivingImage = null;
    let panCardImage = null;
    let passportImage = null;
    let signatureImage = null;
    let profileImage = null;
    let bankDocumentImage;
    if (employee.aadharImageId)
      aadharImage = getEmployeeImageByTypeURl(employee.id, "aadhar");
    if (employee.drivingImageId)
      drivingImage = getEmployeeImageByTypeURl(employee.id, "driving");
    if (employee.panCardImageId)
      panCardImage = getEmployeeImageByTypeURl(employee.id, "pan");
    if (employee.passportImageId)
      passportImage = getEmployeeImageByTypeURl(employee.id, "passport");
    if (employee.signatureImageId)
      signatureImage = getEmployeeImageByTypeURl(employee.id, "signature");
    if (employee.profileImageId)
      profileImage = getEmployeeImageByTypeURl(employee.id, "profileImage");
    if (employee.bankDocumentImageId)
      bankDocumentImage = getEmployeeImageByTypeURl(
        employee.id,
        "bankDocument"
      );
    employee.placeholderBankDocument = bankDocumentImage;
    employee.placeholderProfile = profileImage;
    employee.placeholderSignature = signatureImage;
    employee.placeholder = [
      aadharImage,
      drivingImage,
      panCardImage,
      passportImage,
    ];
    setFormData(employee);
  };
  useEffect(() => {
    if (selectedEmployee) {
      // setFormData();
      setUpdateFormData(selectedEmployee);
    } else {
      getEmployeeCodeFromBackend()
        .then((data) => {
          const nextNumericPart = parseInt(data.split("-")[1]) + 1;
          setFormData({
            ...formData,
            empCode: `EMP-${String(nextNumericPart).padStart(3, "0")}`,
          });
        })
        .catch((error) => {
          toast.error("Internal Server Error");
        });
    }
  }, []);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const excludedProperties = [
    "placeholderBankDocument",
    "placeholderProfile",
    "placeholderSignature",
    "placeholder",
  ];
  const handleSave = async () => {
    if (activeStep === steps.length - 1) {
      try {
        if (activeStep == 7) {
          let errors = validateForm8();
          Object.entries(errors).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`);
          });
          if (Object.keys(errors).length != 0) return;
        }
        const filteredEmployeeData = Object.entries(formData).reduce(
          (acc, [key, value]) => {
            if (!excludedProperties.includes(key)) {
              // Include the property in the new object
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        let res = await saveEmployeeDataToBackend(filteredEmployeeData);

        if (formData.profileImage && res) {
          await saveEmployeeDocumentToBackend(
            res.id,
            "profileImage",
            formData.profileImage
          );
        }

        if (formData.signatureImage && res) {
          await saveEmployeeDocumentToBackend(
            res.id,
            "signature",
            formData.signatureImage
          );
        }

        // Use Promise.all for parallel execution of asynchronous calls
        if (formData.panDocumentFiles && res) {
          await Promise.all(
            formData.panDocumentFiles.map((doc) =>
              saveEmployeeDocumentToBackend(res.id, "pan", doc)
            )
          );
        }

        if (formData.drivingDocumentFiles && res) {
          await Promise.all(
            formData.drivingDocumentFiles.map((doc) =>
              saveEmployeeDocumentToBackend(res.id, "driving", doc)
            )
          );
        }

        if (formData.passportDocumentFiles && res) {
          await Promise.all(
            formData.passportDocumentFiles.map((doc) =>
              saveEmployeeDocumentToBackend(res.id, "passport", doc)
            )
          );
        }

        if (formData.aadharDocumentFiles && res) {
          await Promise.all(
            formData.aadharDocumentFiles.map((doc) =>
              saveEmployeeDocumentToBackend(res.id, "aadhar", doc)
            )
          );
        }

        if (formData.bankDocumentImage && res) {
          await saveEmployeeDocumentToBackend(
            res.id,
            "bankDocument",
            formData.bankDocumentImage
          );
        }
        toast.success("Form data saved successfully!");
        navigate("/employee-directory");
        setSelectedEmployee(res);
        handleClose();
        // You can redirect the user to another page here.
      } catch (error) {
        toast("Failed to save form data. Please try again.");
      }
    } else {
      if (activeStep == 0) {
        let errors = validateForm1();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 1) {
        let errors = validateForm2();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 2) {
        let errors = validateForm3();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 3) {
        let errors = validateForm4();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 4) {
        let errors = validateForm5();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 5) {
        let errors = validateForm6();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
      if (activeStep == 6) {
        let errors = validateForm7();
        Object.entries(errors).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
        if (Object.keys(errors).length != 0) return;
      }
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
  const validateForm1 = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.empCode) {
      newErrors.empCode = "Employee Code is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }

    return newErrors;
  };
  const validateForm2 = () => {
    const newErrors = {};

    if (!formData.houseNo) {
      newErrors.houseNo = "House No is required";
    }

    if (!formData.street) {
      newErrors.street = "Street is required";
    }

    if (!formData.landmark) {
      newErrors.landmark = "Landmark is required";
    }

    if (!formData.cityTehsil) {
      newErrors.cityTehsil = "City/Tehsil is required";
    }

    if (!formData.postcode) {
      newErrors.postcode = "Postcode is required";
    }

    return newErrors;
  };
  const validateForm3 = () => {
    const newErrors = {};

    if (!formData.designation) {
      newErrors.designation = "Designation is required";
    }
    if (!formData.jobExperience) {
      newErrors.jobExperience = "Job experience is required";
    }

    if (!formData.jobExperienceLocation) {
      newErrors.jobExperienceLocation = "Job experience location is required";
    }
    if (formData.jobExperience == "Yes" && !formData.jobExperienceInMonths) {
      newErrors.jobExperienceInMonths = "Job experience in Months is required";
    }
    return newErrors;
  };
  const validateForm4 = () => {
    const newErrors = {};

    let filledDocumentCount = 0;

    if (formData.aadharCard) {
      filledDocumentCount++;
    }

    if (formData.panCard) {
      filledDocumentCount++;
    }

    if (formData.drivingLicenseNo) {
      filledDocumentCount++;
    }

    if (formData.passportNo) {
      filledDocumentCount++;
    }

    if (filledDocumentCount < 3) {
      newErrors.general = "At least three documents are required";
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

    if (!formData.placeholder || formData.placeholder?.length < 3) {
      newErrors.documents = "Please upload at least 3 document";
    }

    return newErrors;
  };
  const validateForm5 = () => {
    const newErrors = {};

    if (!formData?.nominees[0]?.name) {
      newErrors.nominee1Name = "Nominee 1 name is required";
    }

    if (!formData?.nominees[0]?.relationship) {
      newErrors.nominee1Relationship = "Nominee 1 relationship is required";
    }

    if (!formData?.nominees[1]?.name) {
      newErrors.nominee2Name = "Nominee 2 name is required";
    }

    if (!formData?.nominees[1]?.relationship) {
      newErrors.nominee2Relationship = "Nominee 2 relationship is required";
    }

    return newErrors;
  };
  const validateForm6 = () => {
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

  const validateForm7 = () => {
    const newErrors = {};

    if (!formData.disabilityStatus) {
      newErrors.disabilityStatus = 'Disability status is required';
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!formData.covidVaccination) {
      newErrors.covidVaccination = 'COVID-19 vaccination status is required';
    }

    if (formData.covidVaccination === 'Double + Booster Vaccinated' && !formData.doctorName) {
      newErrors.doctorName = 'Doctor name is required for booster vaccination';
    }

    if (formData.covidVaccination === 'Double + Booster Vaccinated' && !formData.doctorPhone) {
      newErrors.doctorPhone = 'Doctor phone is required for booster vaccination';
    }

    return newErrors;
  };
  const validateForm8 = () => {
    const newErrors = {};

    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of Joining is required";
    }

    if (!formData.employmentHours) {
      newErrors.employmentHours = "Employment Hours is required";
    }

    if (!formData.employmentStatus) {
      newErrors.employmentStatus = "Employment Status is required";
    }

    if (!formData.monthlySalary && !formData.dailyRate) {
      newErrors.salary = "Monthly Salary or Daily Rate is required";
    }

    if (formData.employmentHours === "Part Time" && !formData.hourlyRate) {
      newErrors.hourlyRate = "Hourly Rate is required for Part-Time employment";
    }

    if (!formData.weeklyOffDay) {
      newErrors.weeklyOffDay = "Weekly Off Day is required";
    }

    return newErrors;
  };
  return userContext.isLogin ? (
    <Container className="mt-3">
      <h4 className="fw-bold ">Employee Registration</h4>
      {/* {JSON.stringify(formData)} */}
      {paper && (
        <Stepper className="hide-mobile" activeStep={activeStep}>
          {steps.map((label) => (
            <Step
              key={label}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#78C2AD", // circle color (COMPLETED)
                },
                "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500", // Just text label (COMPLETED)
                  },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#78C2AD", // circle color (ACTIVE)
                },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500", // Just text label (ACTIVE)
                  },
                "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                  fill: "white", // circle's number (ACTIVE)
                },
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <div className="d-flex justify-content-center">
        <Paper
          elevation={3}
          style={
            paper ? { padding: "20px" } : { margin: "0px", padding: "10px" }
          }
          className={paper ? "w-custom" : "w-100"}
        >
          {activeStep === steps.length ? (
            <div>
              <Typography variant="h5">
                Thank you for completing the form.
              </Typography>
            </div>
          ) : (
            <div>
              {activeStep === 0 && (
                // Personal Details
                <PersonalDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 1 && (
                // Address
                <Address
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 2 && (
                // Address
                <ProfileDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 3 && (
                // Address
                <EmployementDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 4 && (
                // Address
                <NomineeDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 5 && (
                // Address
                <BankDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 6 && (
                // Address
                <MedicalDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {activeStep === 7 && (
                // Address
                <EmployeementDetails
                  onFormChange={handleFormChange}
                  formData={formData}
                  setFormData={setFormData}
                  readOnly={readOnly}
                />
              )}
              {/* Add sections for other steps */}
              <div>
                <Button
                  size="small"
                  disabled={activeStep === 0}
                  className={activeStep !== 0 ? `font-primary` : ``}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  size="small"
                  style={{ backgroundColor: "#78C2AD" }}
                  variant="contained"
                  onClick={handleSave}
                  className={
                    activeStep === steps.length - 1 && readOnly ? "d-none" : ""
                  }
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </Paper>
      </div>
    </Container>
  ) : (
    <Navigate to="/" />
  );
}

function PersonalDetails({ onFormChange, formData, setFormData, readOnly }) {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleChange = (event) => {
    onFormChange(event.target.name, event.target.value);
  };
  // useEffect(() => {
  // }, [formData]);
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
  const handleFileChangeSignature = (event, type = "file") => {
    if (type == "cam") {
      if (showCameraSignature) {
        const imageSrc = webcamRefSignature.current.getScreenshot();
        setFormData({
          ...formData,
          placeholderSignature: imageSrc,
          signatureImage: dataURLtoFile(imageSrc, "captured_image.jpg"),
        });
        webcamRefSignature.current.video.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        setShowCameraSignature(false);
      } else {
        setShowCameraSignature(true);
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
          setFormData({
            ...formData,
            placeholderSignature: r.target.result,
            signatureImage: localFile,
          });
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
    }
  };
  const webcamRef = useRef(null);
  const webcamRefSignature = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showCameraSignature, setShowCameraSignature] = useState(false);
  const captureImage = () => {};
  return (
    <div>
      <h5 className="fw-bold">Personal Details</h5>
      <TextField
        label="Employee Code"
        variant="outlined"
        name="empCode"
        fullWidth
        value={formData.empCode}
        onChange={handleInputChange}
        error={Boolean(errors.empCode)}
        helperText={errors.empCode}
        className="mb-3"
        disabled
        InputLabelProps={{
          shrink: formData.empCode ? true : false, // Set shrink to true if value is present
        }}
      />
      <TextField
        disabled={readOnly}
        label="First Name"
        variant="outlined"
        name="firstName"
        fullWidth
        value={formData.firstName}
        onChange={handleInputChange}
        error={Boolean(errors.firstName)}
        helperText={errors.firstName}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Last Name"
        name="lastName"
        fullWidth
        value={formData.lastName}
        onChange={handleInputChange}
        error={Boolean(errors.lastName)}
        helperText={errors.lastName}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Email"
        name="email"
        fullWidth
        value={formData.email}
        onChange={handleInputChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Phone Number"
        name="phoneNumber"
        fullWidth
        value={formData.phoneNumber}
        onChange={handleInputChange}
        error={Boolean(errors.phoneNumber)}
        helperText={errors.phoneNumber}
        className="mb-3"
      />
      <Form.Group className="mb-3">
        <Container className="text-center py-3 border" fluid>
          <p className="text-muted">Profile Image Preview</p>
          <img
            className="img-fluid"
            style={{
              objectFit: "contain",
              maxHeight: "250px",
              width: "100%",
            }}
            src={formData.placeholderProfile}
            alt=""
          />
        </Container>
        <div className={readOnly ? "d-none" : ""}>
          <Form.Label>Select Profile Image</Form.Label>

          {showCamera && (
            <div className="text-center">
              <Webcam
                width={300}
                height={200}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
            </div>
          )}
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
                <CameraAltIcon />
              </Button>
              <ReactTooltip
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
      <Form.Group className="mb-3">
        <Container className="text-center py-3 border">
          <p className="text-muted">Signature Image Preview</p>
          <img
            className="img-fluid"
            style={{
              objectFit: "contain",
              maxHeight: "250px",
              width: "100%",
            }}
            src={formData.placeholderSignature}
            alt=""
          />
        </Container>
        <div className={readOnly ? "d-none" : ""}>
          {showCameraSignature && (
            <div className="text-center">
              <Webcam
                width={300}
                height={200}
                audio={false}
                ref={webcamRefSignature}
                screenshotFormat="image/jpeg"
              />
            </div>
          )}
          <Form.Label>Upload Signature Image</Form.Label>
          <div className="d-flex align-items-center">
            <div>
              <Button
                onClick={(event) => handleFileChangeSignature(event, "cam")}
                variant="outlined"
                type="error"
                data-tooltip-id="my-tooltip2"
                data-tooltip-content="Take Photo"
              >
                <CameraAltIcon />
              </Button>
              <ReactTooltip
                id="my-tooltip2"
                place="bottom"
                type="info"
                effect="solid"
              />
            </div>

            <span className="mx-2">or</span>
            <InputGroup>
              <Form.Control
                onChange={(event) => handleFileChangeSignature(event)}
                type="file"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setFormData({
                    ...formData,
                    placeholderSignature: undefined,
                    signatureImage: null,
                  });
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </div>
        </div>
      </Form.Group>
    </div>
  );
}

function Address({ onFormChange, formData, setFormData, readOnly }) {
  const handleChange = (event) => {
    onFormChange(event.target.name, event.target.value);
  };
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div>
      <h5 className="fw-bold">Address</h5>
      <TextField
        disabled={readOnly}
        label="House No"
        name="houseNo"
        fullWidth
        value={formData.houseNo}
        onChange={handleInputChange}
        error={Boolean(errors.houseNo)}
        helperText={errors.houseNo}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Street"
        name="street"
        fullWidth
        value={formData.street}
        onChange={handleInputChange}
        error={Boolean(errors.street)}
        helperText={errors.street}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Landmark"
        name="landmark"
        fullWidth
        value={formData.landmark}
        onChange={handleInputChange}
        error={Boolean(errors.landmark)}
        helperText={errors.landmark}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="City / Tehsil"
        name="cityTehsil"
        fullWidth
        value={formData.cityTehsil}
        onChange={handleInputChange}
        error={Boolean(errors.cityTehsil)}
        helperText={errors.cityTehsil}
        className="mb-3"
      />
      <TextField
        disabled={readOnly}
        label="Postcode"
        name="postcode"
        fullWidth
        value={formData.postcode}
        onChange={handleInputChange}
        error={Boolean(errors.postcode)}
        helperText={errors.postcode}
        className="mb-3"
      />
    </div>
  );
}

export default EmployeeEnrollmentForm;
