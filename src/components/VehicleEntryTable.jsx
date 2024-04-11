import {
  AccessTime,
  Camera,
  CameraAlt,
  Cancel,
  Save,
  Visibility,
} from "@mui/icons-material";
import { Skeleton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useRef, useState } from "react";
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
} from "../services/VehicleEntryService";
import Webcam from "react-webcam";
import { toast } from "react-toastify";

const VehicleEntryTable = ({
  columns,
  filteredRows,
  rowsPerPage,
  handleClose,
  selectedImageIndex,
  handleSelect,
  selectedImageIndex1,
  handleSelect1,
  selectedImageIndex2,
  handleSelect2,
  imgLoading,
  driverData,
  open,
  handleOpen,
  timeOut,
  handleImageLoad,
  handleSort,
  setData
}) => {
  const excludedFields = ["vehicleDocument", "id", "driverDocument", "tuuAbo"];
  const [page, setPage] = useState(0);
  const [selectedData, setSelectedData] = useState(null);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleOpen2 = (ddata) => {
    setSelectedData(ddata);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const [open2, setOpen2] = useState(false);
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
  const handleSaveFiles = () => {
    if (formData.profileImage.length > 0) {
      formData.profileImage.map(async (vehicleDocument) => {
        await saveVehicleDocument2ToBackend(
          selectedData.id,
          vehicleDocument,
          "vehicleImage"
        );
      });
      toast.success("Images Saved");

      handleClose2();
      getVehicle2Entry()
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          toast.error("Internal Server Error");
        });
    }
  };
  return (
    <div>
      {" "}
      <Table responsive  size="small" className="text-center">
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
            <th align="center" className="px-5">
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
                <td key={column?.id}>{row[column?.id] ?? ""}</td>
              ))}
              <td>
                <Tooltip title="View" className="">
                  <Button onClick={() => handleOpen(row)}>
                    <Visibility />
                  </Button>
                </Tooltip>
                {checkAccess("Attendance Tracker", "canUpdate") &&
                  !row.dateOfExit && (
                    <>
                      {row?.vehicleImages?.length > 0 && (
                        <Tooltip title="Time Out" className="">
                          <Button size="small" onClick={() => timeOut(row)}>
                            <small>
                              <AccessTime />
                            </small>
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip title="Click Vehicle" className="">
                        <Button size="small" onClick={() => handleOpen2(row)}>
                          <small>
                            <CameraAlt />
                          </small>
                        </Button>
                      </Tooltip>
                    </>
                  )}
              </td>
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
                            <Skeleton
                              variant="rect"
                              width="100%"
                              height={300}
                            />
                          )}
                          {formData.placeholderProfile.map((image, index) => (
                            <Carousel.Item key={index}>
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
                      <Form.Label>Select Profile Image</Form.Label>
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

                        {/* <span className="mx-2">or</span>
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
                      </InputGroup> */}
                      </div>
                    </div>
                  </Form.Group>
                </Card>
              </Modal>
              <Modal
                show={open}
                onHide={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Card className="p-2">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">Vehicle Details</h5>
                    <Cancel
                      onClick={handleClose}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <h6>
                    <strong>Vehicle Images:</strong>
                  </h6>
                  <Carousel
                    data-bs-theme="dark"
                    indicators={false}
                    activeIndex={selectedImageIndex}
                    onSelect={handleSelect}
                    interval={null} // Disable automatic sliding
                  >
                    {imgLoading && (
                      <Skeleton variant="rect" width="100%" height={200} />
                    )}
                    {driverData?.vehicleImages?.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          style={{ height: "150px", objectFit: "contain" }}
                          className={`w-100  d-block ${
                            imgLoading ? "d-none" : ""
                          }`}
                          src={getVehicleImageByNameURl(image)}
                          alt={`Vehicle Document ${index + 1}`}
                          onLoad={handleImageLoad}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <h6>
                    <strong>Vehicle Document:</strong>
                  </h6>
                  <Carousel
                    data-bs-theme="dark"
                    indicators={false}
                    activeIndex={selectedImageIndex1}
                    onSelect={handleSelect1}
                    interval={null} // Disable automatic sliding
                  >
                    {imgLoading && (
                      <Skeleton variant="rect" width="100%" height={200} />
                    )}
                    {driverData?.vehicleDocument?.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          style={{ height: "150px", objectFit: "contain" }}
                          className={`w-100  d-block ${
                            imgLoading ? "d-none" : ""
                          }`}
                          src={getVehicleImageByNameURl(image)}
                          alt={`Vehicle Document ${index + 1}`}
                          onLoad={handleImageLoad}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  {/* Driver Document Image Slider */}
                  <h6>
                    <strong>Driver Document:</strong>
                  </h6>
                  <Carousel
                    data-bs-theme="dark"
                    indicators={false}
                    activeIndex={selectedImageIndex2}
                    onSelect={handleSelect2}
                    interval={null} // Disable automatic sliding
                  >
                    {imgLoading && (
                      <Skeleton variant="rect" width="100%" height={200} />
                    )}
                    {driverData?.driverDocument?.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          style={{ height: "150px", objectFit: "contain" }}
                          className={`w-100 d-block ${
                            imgLoading ? "d-none" : ""
                          }`}
                          src={getVehicleImageByNameURl(image)}
                          alt={`Driver Document ${index + 1}`}
                          onLoad={handleImageLoad}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <h6>
                    <div className="d-flex flex-wrap">
                      <div style={{ flex: 1, marginRight: "20px" }}>
                        {Object.entries(driverData)
                          .slice(0, 9)
                          .filter(([key]) => !excludedFields.includes(key))
                          .map(([key, value], index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                              <strong>{key}:</strong>{" "}
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </div>
                          ))}
                      </div>
                      <div style={{ flex: 1 }}>
                        {Object.entries(driverData)
                          .slice(9, 15)
                          .filter(([key]) => !excludedFields.includes(key))
                          .map(([key, value], index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                              <strong>{key}:</strong>{" "}
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </div>
                          ))}
                      </div>
                      <div style={{ flex: 1 }}>
                        {Object.entries(driverData)
                          .slice(15)
                          .filter(([key]) => !excludedFields.includes(key))
                          .map(([key, value], index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                              <strong>{key}:</strong>{" "}
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </h6>
                </Card>
              </Modal>
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
    </div>
  );
};

export default VehicleEntryTable;
