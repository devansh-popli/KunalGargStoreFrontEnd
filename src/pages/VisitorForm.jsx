import React, { useContext, useEffect, useRef, useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Webcam from "react-webcam";
import { Form, InputGroup } from "react-bootstrap";
import { CameraAlt } from "@mui/icons-material";
import { toast } from "react-toastify";
import VisitorTable from "../components/VisitorTable";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import {
  getVisitorData,
  saveVisitorDocumentToBackend,
  submitVisitorData,
} from "../services/VisitorService";

const VisitorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phone: "",
    address: "",
    photo: null,
    purpose: "",
    timeIn: "",
    timeOut: "",
    aadharNumber: "",
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
  const [visitors, setVisitors] = useState([]);
  useEffect(() => {
    getVisitorData().then((data) => {
      setVisitors(data);
    });
  }, []);
  const handleSubmit = () => {
    // Validate mandatory fields
    if (
      !formData.name ||
      !formData.fatherName ||
      !formData.phone ||
      !formData.address ||
      !formData.purpose
    ) {
      setMandatoryFieldsError(true);
      return;
    }

    // Handle form submission
    // Add your logic to submit the form data
    if (formData.purpose == "Other") formData.purpose = formData.purpose1;
    submitVisitorData(formData, new Date())
      .then(async (res) => {
        if (formData.profileImage) {
          await saveVisitorDocumentToBackend(
            res.id,
            formData.profileImage,
            "profile"
          )
            .then((data) => {
              res.photo = data.imageName;
              // toast.success("Visitor Logged Successfully");
            })
            .catch((error) => {
              toast.error("Visitor Logged but error uploading profile Image");
              return;
            });
        }
        if (formData.aadharImage) {
          await saveVisitorDocumentToBackend(
            res.id,
            formData.aadharImage,
            "aadhar"
          )
            .then((data) => {
              res.photo = data.imageName;
              toast.success("Visitor Logged Successfully");
            })
            .catch((error) => {
              toast.error("Visitor Logged but error uploading aadhar Image");
            });
        }
        setVisitors([...visitors, res]);
      })
      .catch((data) => {
        toast.error("Internal Server Error");
      });

    // Reset the form after submission
    setFormData({
      name: "",
      fatherName: "",
      phone: "",
      address: "",
      photo: null,
      purpose: "",
      timeIn: "",
      timeOut: "",
      aadharNumber: "",
    });
    handleClose();
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
  const handleFileChangeAadhar = (event, type = "file") => {
    if (type == "cam") {
      if (showCameraAadhar) {
        const imageSrc = webcamRefAadhar.current.getScreenshot();
        setFormData({
          ...formData,
          placeholderAadhar: imageSrc,
          aadharImage: dataURLtoFile(imageSrc, "captured_image.jpg"),
        });
        webcamRefAadhar.current.video.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        setShowCameraAadhar(false);
      } else {
        setShowCameraAadhar(true);
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
              placeholderAadhar: r.target.result,
              aadharImage: localFile,
            },
            () => {}
          );
        };
        reader.readAsDataURL(localFile);
      } else {
        toast.error("Invalid File Format only jpeg/jpg/png allowed");
        setFormData({
          ...formData,
          placeholderAadhar: null,
          aadharImage: null,
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
  const purposeList = [
    { id: 1, name: "Meeting" },
    { id: 2, name: "Interview" },
    { id: 3, name: "Delivery" },
    { id: 4, name: "Appointment" },
    { id: 5, name: "Event" },
    { id: 6, name: "Training" },
    { id: 7, name: "Consultation" },
    { id: 8, name: "Maintenance" },
    { id: 9, name: "Site Visit" },
    { id: 10, name: "Vendor Visit" },
    { id: 11, name: "Customer Support" },
    { id: 12, name: "Sales Presentation" },
    { id: 13, name: "Networking" },
    { id: 14, name: "Workshop" },
    { id: 15, name: "Audition" },
    { id: 16, name: "Other" },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: 20,
    p: 4,
  };
  const webcamRef = useRef(null);
  const webcamRefSignature = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRefAadhar = useRef(null);
  const [showCameraAadhar, setShowCameraAadhar] = useState(false);
  const userContext = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return userContext.isLogin ? (
    <>
      <div className="container">
        <div className="d-flex flex-row-reverse m-4 ">
          {" "}
          <Button variant="contained" onClick={handleOpen}>
            Add Visitor
          </Button>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper elevation={3} style={style} className="ms-3 mt-3 w-50">
            <h4 className="fw-bold">Visitor Entry Form</h4>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Father's Name"
                  fullWidth
                  value={formData.fatherName}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  type="number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  fullWidth
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Group className="mb-2">
                  <Container
                    className="text-center border py-1"
                    style={{ borderRadius: "10px" }}
                    fluid
                  >
                    <p className="text-muted m-0 p-0">Profile Image Preview</p>
                    {!showCamera && (
                      <img
                        className="img-fluid rounded"
                        style={{
                          objectFit: "contain",
                          maxHeight: "130px",
                          width: "100%",
                        }}
                        src={formData.placeholderProfile}
                        alt=""
                      />
                    )}

                    {showCamera && (
                      <div className="text-center">
                        <Webcam
                          width={130}
                          height={130}
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                        />
                      </div>
                    )}
                  </Container>
                  <div>
                    <Form.Label>Select Profile Image</Form.Label>
                    <div className="d-flex align-items-center">
                      <div>
                        <Button
                          data-for="happyFace"
                          onClick={(event) =>
                            handleFileChangeProfile(event, "cam")
                          }
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
                <Form.Group className="mb-2">
                  <Container
                    className="text-center py-1 border"
                    style={{ borderRadius: "10px" }}
                    fluid
                  >
                    <p className="text-muted m-0 p-0">Aadhar Preview</p>
                    {!showCameraAadhar && (
                      <img
                        className="img-fluid rounded"
                        style={{
                          objectFit: "contain",
                          maxHeight: "130px",
                          width: "100%",
                        }}
                        src={formData.placeholderAadhar}
                        alt=""
                      />
                    )}

                    {showCameraAadhar && (
                      <div className="text-center">
                        <Webcam
                          width={130}
                          height={130}
                          audio={false}
                          ref={webcamRefAadhar}
                          screenshotFormat="image/jpeg"
                        />
                      </div>
                    )}
                  </Container>
                  <div>
                    <Form.Label>Select Aadhar Image</Form.Label>
                    <div className="d-flex align-items-center">
                      <div>
                        <Button
                          data-for="happyFace"
                          onClick={(event) =>
                            handleFileChangeAadhar(event, "cam")
                          }
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
                          onChange={(event) => handleFileChangeAadhar(event)}
                          type="file"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              placeholderAadhar: undefined,
                              aadharImage: null,
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
              <Grid
                item
                xs={12}
                sm={6}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Select
                  label="Purpose"
                  className="mt-1"
                  fullWidth
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                >
                  {purposeList.map((data) => (
                    <MenuItem key={data.id} value={data.name}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
                {formData.purpose == "Other" && (
                  <TextField
                    label="Other"
                    fullWidth
                    className="ms-2 my-0"
                    value={formData.purpose1}
                    onChange={(e) =>
                      handleInputChange("purpose1", e.target.value)
                    }
                  />
                )}
              </Grid>
              <Grid item xs={12} className="d-flex">
                <Button
                  variant="contained"
                  color="primary"
                  className="me-4"
                  onClick={handleSubmit}
                >
                  Time In
                </Button>
                {mandatoryFieldsError && (
                  <Typography
                    color="error"
                    variant="caption"
                    display="block"
                    marginTop="10px"
                  >
                    * Please fill in all mandatory fields.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Modal>
        <Grid item xs={12} md={12} className="px-2">
          <VisitorTable
            title={"Current Visitors"}
            visitors={visitors}
            handleTimeout={(visitor) => {
              visitor.timeOut = new Date();
              submitVisitorData(visitor).then((data) => {
                let newvis = visitors.map((vis) => {
                  if (vis.id == data.id) {
                    vis = data;
                  }
                  return vis;
                });
                setVisitors(newvis);
              });
            }}
          />
        </Grid>
        <Grid item xs={12} md={12} className="px-2">
          <VisitorTable
            title={"Visitors History"}
            visitors={visitors}
            handleTimeout={(visitor) => {
              visitor.timeOut = new Date();
              submitVisitorData(visitor).then((data) => {
                let newvis = visitors.map((vis) => {
                  if (vis.id == data.id) {
                    vis = data;
                  }
                  return vis;
                });
                setVisitors(newvis);
              });
            }}
          />
        </Grid>
      </div>
    </>
  ) : (
    <Navigate to={"/"} />
  );
};

export default VisitorForm;
