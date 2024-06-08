import {
  AccessTime,
  Camera,
  CameraAlt,
  Cancel,
  CancelOutlined,
  CancelPresentationOutlined,
  CancelPresentationSharp,
  Close,
  Edit,
  Payment,
  Save,
  Send,
  Visibility,
} from "@mui/icons-material";
import { Skeleton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useContext, useRef, useState } from "react";
import {
  Card,
  Carousel,
  Container,
  Form,
  Modal,
  Pagination,
  Table,
} from "react-bootstrap";
import { checkAccess } from "../auth/HelperAuth";
import {
  getVehicle2Entry,
  getVehicleImageByNameURl,
  saveVehicleDocument2ToBackend,
  saveVehicleEntry2,
} from "../services/VehicleEntryService";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import PDFGenerator from "./PdfGenerator";
import PaymentForm from "./PaymentForm";
import ViewVehicleEntryDetails from "./ViewVehicleEntryDetails";
import ChangeStatusForm from "./ChangeStatusForm";
import { UserContext } from "../context/UserContext";
import {
  ROLE_DIRECTOR,
  ROLE_NORMAL,
  ROLE_SUPERVISOR,
  checkLoggedInRole,
} from "../constants/constants";
import { Link } from "react-router-dom";
import UserTimeoutForm from "./UserTimeoutForm";

const VehicleEntryTable = ({
  columns,
  filteredRows,
  rowsPerPage,
  handleSort,
  setData,
}) => {
  const excludedFields = [
    "vehicleDocument",
    "id",
    "driverDocument",
    "tuuAbo",
    "vehicleImages",
    "statusHistories",
  ];
  const [imgLoading, setImgLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImageIndex1, setSelectedImageIndex1] = useState(0);
  const [selectedImageIndex2, setSelectedImageIndex2] = useState(0);
  const handleClose = () => {
    setOpen(false);
    setChangeStatus(false);
    setImgLoading(true);
    setSelectedImageIndex(0);
  };
  const handleSelect = (selectedIndex, e) => {
    setSelectedImageIndex(selectedIndex);
  };
  const handleSelect1 = (selectedIndex, e) => {
    setSelectedImageIndex1(selectedIndex);
  };
  const handleSelect2 = (selectedIndex, e) => {
    setSelectedImageIndex2(selectedIndex);
  };
  const handleImageLoad = () => {
    setImgLoading(false); // Set loading state to false when the image is loaded
  };
  const timeOut = ({selectedUser,timeoutDate}) => {
    const formData=selectedData
    const currentDate = new Date();
    // Format the time as "00:31:31"
    const formattedTime = currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    // Format the date as "YYYY-MM-DD"
    const year = timeoutDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Set formData.outTime and formData.outDate
    formData.timeOfExit = formattedTime;
    formData.dateOfExit = formattedDate;
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    formData.dayOfExit = days[currentDate.getDay()];
    formData.status = "pending";
    formData.statusUpdatedBy = userContext?.userData?.userId;
    formData.assignedToRole = selectedUser;
    saveVehicleEntry2(formData)
      .then((res) => {
        toast.success("outtime updated");
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };
  const submitAgain = (formData) => {
    formData.status = "pending";
    formData.statusUpdatedBy = userContext?.userData?.userId;
    formData.assignedToRole = "ROLE_SUPERVISOR";
    saveVehicleEntry2(formData)
      .then((res) => {
        toast.success("Submitted!! Assigned to Supervisor");
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };
  const clearImageFromBackend = (image) => {
    const request=selectedData
    const vehicleImages = selectedData.vehicleImages.filter((data) => {
      return data != image;
    });
    request.vehicleImages=vehicleImages
    setSelectedData((prev) => ({ ...prev, vehicleImages: vehicleImages }));
    saveVehicleEntry2(request)
      .then((res) => {
        toast.success("Image Removed");
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };
  const [driverData, setDriverData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = useState(0);
  const handleOpen = (ddata) => {
    setDriverData(ddata);
    setOpen(true);
  };

  const [selectedData, setSelectedData] = useState(null);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleOpen2 = (ddata) => {
    setSelectedData(ddata);
    setOpen2(true);
  };
  const handleOpen3 = (ddata) => {
    setSelectedData(ddata);
    setOpen3(true);
  };
  const handleOpen4 = (ddata) => {
    setSelectedData(ddata);
    setOpen4(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClose3 = () => {
    setOpen3(false);
  };
  const handleClose4 = () => {
    setOpen4(false);
  };
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const webcamRef = useRef(null);
  const webcamRefSignature = useRef(null);
  const [showCamera, setShowCamera] = useState(true);
  const webcamRefAadhar = useRef(null);
  const [showCameraAadhar, setShowCameraAadhar] = useState(false);
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
    placeholderProfile: [],
    profileImage: [],
  });
  const userContext = useContext(UserContext);
  const handleFileChangeProfile = (event, type = "file") => {
    if (type == "cam") {
      if (showCamera) {
        const imageSrc = webcamRef.current.getScreenshot();
        setFormData({
          ...formData,
          placeholderProfile: [...formData.placeholderProfile, imageSrc],
          profileImage: [
            ...formData.profileImage,
            dataURLtoFile(imageSrc, "captured_image.jpg"),
          ],
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
  const camelCaseToTitleCase = (camelCase) => {
    return camelCase
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
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
  const savePaymentInfo = ({
    paymentType,
    paymentTerms,
    otherTerms,
    commercialCost,
  }) => {
    if (otherTerms != "") {
      paymentTerms = otherTerms;
    }
    const request = selectedData;
    request.paymentType = paymentType;
    request.paymentTerms = paymentTerms;
    request.commercialCost = commercialCost;
    if (request.paymentType) {
      saveVehicleEntry2(request)
        .then((res) => {
          toast.success("Payment Info updated");
          handleClose3();
        })
        .catch((error) => {
          toast.error("Internal Server Error While Saving");
        });
    }
  };
  const updateStatus = (request) => {
    driverData.status = request.status;
    driverData.statusUpdatedBy = userContext?.userData?.userId;
    driverData.remarks = request.remarks;
    if (
      request.status == "approved" &&
      checkLoggedInRole(ROLE_SUPERVISOR, userContext) &&
      driverData.assignedToRole == ROLE_SUPERVISOR
    ) {
      driverData.assignedToRole = ROLE_DIRECTOR;
    } else if (
      request.status == "approved" &&
      checkLoggedInRole(ROLE_DIRECTOR, userContext) &&
      driverData.assignedToRole == ROLE_DIRECTOR
    ) {
      driverData.assignedToRole = "COMPLETED";
    } else if (
      request.status == "rejected" &&
      checkLoggedInRole(ROLE_DIRECTOR, userContext) &&
      driverData.assignedToRole == ROLE_DIRECTOR
    ) {
      driverData.assignedToRole = ROLE_SUPERVISOR;
    } else {
      driverData.assignedToRole = ROLE_NORMAL;
    }
    saveVehicleEntry2(driverData)
      .then((res) => {
        toast.success("Status updated");
        handleClose3();
      })
      .catch((error) => {
        toast.error("Internal Server Error While Saving");
      });
  };
  const handleSaveFiles = () => {
    if (formData.profileImage.length > 0) {
      formData.profileImage.map(async (vehicleDocument) => {
        saveVehicleDocument2ToBackend(
          selectedData.id,
          vehicleDocument,
          "vehicleImage"
        )
          .then((data) => {
            toast.success("Images Saved");
            handleClose2();
            getVehicle2Entry()
              .then((data) => {
                setData((prev) => data);
              })
              .catch((error) => {
                toast.error("Internal Server Error");
              });
          })
          .catch((error) => {
            toast.error("Error Occured");
          });
      });
    }
  };
  return (
    <>
      <div>
        {" "}
        <Table
          responsive
          size="small"
          className="text-center"
          style={filteredRows?.length <= 0 ? { minHeight: "280px" } : {}}
        >
          <thead style={{ backgroundColor: "#205072" }}>
            <tr>
              {columns?.map((column) => (
                <th
                  align="center"
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {column.label}
                </th>
              ))}
              <th
                align="center"
                style={{ minWidth: "100px", width: "210px", maxWidth: "250px" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredRows
            ).map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <>
                    {column?.id == "status" ? (
                      <td key={column?.id}>
                        <span
                          className={
                            (row[column?.id] == "pending"
                              ? "bg-warning"
                              : row[column?.id] == "rejected"
                              ? "bg-danger"
                              : row[column?.id] == "approved"
                              ? "bg-success"
                              : "") + " rounded text-white p-1 text-capitalize"
                          }
                        >
                          {row[column?.id] ?? ""}
                        </span>
                      </td>
                    ) : (
                      <td key={column?.id}>{row[column?.id] ?? ""}</td>
                    )}
                  </>
                ))}
                <td>
                  <Tooltip title="View" className="">
                    <Button
                      style={{ minWidth: "1px" }}
                      onClick={() => handleOpen(row)}
                    >
                      <Visibility />
                    </Button>
                  </Tooltip>
                  {/* {checkAccess("Attendance Tracker", "canUpdate") &&
                  row.dateOfExit &&
                  userContext?.userData?.roles[0].roleName ===
                    "ROLE_SUPERVISOR" && (
                    <>
                      <Tooltip title="Time Out" className="">
                        <Button size="small" onClick={() => timeOut(row)}>
                          <small>
                            <AccessTime />
                          </small>
                        </Button>
                      </Tooltip>
                    </>
                  )} */}
                  {checkAccess("Attendance Tracker", "canUpdate") &&
                    !row.dateOfExit && (
                      <>
                        {row?.vehicleImages?.length > 0 &&
                          row?.paymentType?.length > 0 && (
                            <>
                              <Tooltip title="Time Out" className="">
                                <Button
                                  style={{ minWidth: "1px" }}
                                  size="small"
                                  onClick={() => handleOpen4(row)}
                                >
                                  <small>
                                    <AccessTime />
                                  </small>
                                </Button>
                              </Tooltip>
                            </>
                          )}
                        <Tooltip title="Set Payment Info" className="">
                          <Button
                            style={{ minWidth: "1px" }}
                            size="small"
                            onClick={() => handleOpen3(row)}
                          >
                            <small>
                              <Payment />
                            </small>
                          </Button>
                        </Tooltip>
                        <Tooltip title="Click Vehicle" className="">
                          <Button
                            style={{ minWidth: "1px" }}
                            size="small"
                            onClick={() => handleOpen2(row)}
                          >
                            <small>
                              <CameraAlt />
                            </small>
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  {/* {row && row.dateOfExit &&(
                        <PDFGenerator data={row} title="Vehicle Entry Record" />
                      )} */}
                  {checkAccess("Attendance Tracker", "canUpdate") &&
                    row.dateOfExit &&
                    row.status === "rejected" &&
                    row.assignedToRole == ROLE_NORMAL && (
                      <>
                        {row?.vehicleImages?.length > 0 &&
                          row?.paymentType?.length > 0 && (
                            <>
                              <Tooltip title="Submit Again" className="">
                                <Button
                                  style={{ minWidth: "1px" }}
                                  size="small"
                                  onClick={() => submitAgain(row)}
                                >
                                  <small>
                                    <Send />
                                  </small>
                                </Button>
                              </Tooltip>
                            </>
                          )}
                        <Tooltip title="Set Payment Info" className="">
                          <Button
                            style={{ minWidth: "1px" }}
                            size="small"
                            as={Link}
                            to={`/vehicle-entry-form/${row.id}`}
                          >
                            <small>
                              <Edit />
                            </small>
                          </Button>
                        </Tooltip>
                        <Tooltip title="Set Payment Info" className="">
                          <Button
                            style={{ minWidth: "1px" }}
                            size="small"
                            onClick={() => handleOpen3(row)}
                          >
                            <small>
                              <Payment />
                            </small>
                          </Button>
                        </Tooltip>
                        <Tooltip title="Click Vehicle" className="">
                          <Button
                            style={{ minWidth: "1px" }}
                            size="small"
                            onClick={() => handleOpen2(row)}
                          >
                            <small>
                              <CameraAlt />
                            </small>
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  {/* {row && row.dateOfExit &&(
                        <PDFGenerator data={row} title="Vehicle Entry Record" />
                      )} */}
                </td>
              </tr>
            ))}

            {filteredRows.length <= 0 && (
              <Container>
                <img
                  src="../../noData.svg"
                  width={250}
                  height={250}
                  alt=""
                  className="position-absolute"
                  style={{
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </Container>
            )}
          </tbody>
        </Table>
        <Pagination>
          <Pagination.Prev
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
          />

          {/* Assuming filteredRows is an array and rowsPerPage is the number of items per page */}
          {Array.from({
            length: Math.ceil(filteredRows.length / rowsPerPage),
          }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={page === index}
              onClick={() => handleChangePage(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handleChangePage(page + 1)}
            disabled={
              page === Math.floor(filteredRows.length / rowsPerPage) ||
              filteredRows.length <= rowsPerPage
            }
          />
        </Pagination>
        <Modal
          show={open3}
          onHide={handleClose3}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className="p-2">
            <PaymentForm savePaymentInfo={savePaymentInfo} />
          </Card>
        </Modal>
        <Modal
          show={open4}
          onHide={handleClose4}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className="p-2">
            <UserTimeoutForm timeOut={timeOut} />
          </Card>
        </Modal>
        <Modal
          show={open2}
          onHide={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Card className="p-2">
            <Form.Group className="mb-2">
              <Container
                className="text-center border py-1"
                style={{ borderRadius: "10px" }}
                fluid
              >
                <p className="text-muted m-0 p-0">Profile Preview</p>
                {!showCamera && (
                  <Carousel
                    data-bs-theme="dark"
                    indicators={false}
                    activeIndex={selectedImageIndex}
                    onSelect={handleSelect}
                    interval={null} // Disable automatic sliding
                  >
                    {imgLoading && (
                      <Skeleton variant="rect" width="100%" height={300} />
                    )}
                    {formData.placeholderProfile.map((image, index) => (
                      <Carousel.Item key={index} className="position-relative">
                        <img
                          style={{
                            height: "340px",
                            objectFit: "contain",
                          }}
                          className={`w-100  d-block ${
                            imgLoading ? "d-none" : ""
                          }`}
                          src={image}
                          alt={`Vehicle Document ${index + 1}`}
                          onLoad={handleImageLoad}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: "0",
                            top: "0", // Ensure it is placed at the top
                            zIndex: "10", // Increase z-index to ensure it is above the image
                            cursor: "pointer",
                          }}
                        >
                          <Close
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                placeholderProfile:
                                  formData.placeholderProfile.filter(
                                    (data) => data != image
                                  ),
                              }));
                            }}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                    {selectedData.vehicleImages.map((image, index) => (
                      <Carousel.Item key={index} className="position-relative">
                        <img
                          style={{
                            height: "340px",
                            objectFit: "contain",
                          }}
                          className={`w-100  d-block ${
                            imgLoading ? "d-none" : ""
                          }`}
                          src={getVehicleImageByNameURl(image)}
                          alt={`Vehicle Document ${index + 1}`}
                          onLoad={handleImageLoad}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: "0",
                            top: "0", // Ensure it is placed at the top
                            zIndex: "10", // Increase z-index to ensure it is above the image
                            cursor: "pointer",
                          }}
                        >
                          <Close
                            onClick={() => {
                              clearImageFromBackend(image);
                            }}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  // <img
                  //   className="img-fluid rounded"
                  //   style={{
                  //     objectFit: "contain",
                  //     maxHeight: "300px",
                  //     width: "100%",
                  //   }}
                  //   src={pp}
                  //   alt=""
                  // />
                )}

                {showCamera && (
                  <div className="text-center">
                    <Webcam
                      width={330}
                      height={230}
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                    />
                  </div>
                )}
              </Container>
              <div>
                <Form.Label>Select Vehicle Images</Form.Label>
                <div className="d-flex align-items-center">
                  <div>
                    <Tooltip title="Click Vehicle Image">
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
                    </Tooltip>
                    <Tooltip title="Save Vehicle Images">
                      <Button
                        data-for="happyFace"
                        onClick={(event) => handleSaveFiles()}
                        className="mx-2"
                        variant="outlined"
                        type="error"
                        disabled={formData.profileImage.length == 0}
                      >
                        <Save />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Card>
        </Modal>
      </div>
      <Modal
        show={open}
        onHide={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!changeStatus ? (
          <ViewVehicleEntryDetails
            handleClose={handleClose}
            driverData={driverData}
            selectedImageIndex={selectedImageIndex}
            handleSelect={handleSelect}
            imgLoading={imgLoading}
            handleImageLoad={handleImageLoad}
            selectedImageIndex1={selectedImageIndex1}
            handleSelect1={handleSelect1}
            selectedImageIndex2={selectedImageIndex2}
            handleSelect2={handleSelect2}
            excludedFields={excludedFields}
            camelCaseToTitleCase={camelCaseToTitleCase}
            setChangeStatus={setChangeStatus}
          />
        ) : (
          <ChangeStatusForm
            handleClose={handleClose}
            updateStatus={updateStatus}
          />
        )}
      </Modal>
    </>
  );
};

export default VehicleEntryTable;
