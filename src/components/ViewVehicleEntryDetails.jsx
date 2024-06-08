import { Cancel } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import { Card, Carousel } from "react-bootstrap";
import { getVehicleImageByNameURl } from "../services/VehicleEntryService";
import { getUserById } from "../services/UserService";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { isAuthorisedVip } from "../constants/constants";

const ViewVehicleEntryDetails = ({
  driverData,
  handleClose,
  selectedImageIndex,
  handleSelect,
  imgLoading,
  handleImageLoad,
  selectedImageIndex1,
  handleSelect1,
  selectedImageIndex2,
  handleSelect2,
  excludedFields,
  setChangeStatus,
  camelCaseToTitleCase,
}) => {
  const [username, setUsername] = useState("");
  const userContext = useContext(UserContext);
  useEffect(() => {
    getUserById(driverData.statusUpdatedBy).then((data) =>
      setUsername(data?.name)
    );
  }, []);
  return (
    <Card className="p-2" style={{ width: "700px" }}>
      <div className="d-flex justify-content-between">
        <h5
          className="fw-bold p-2 w-100"
          style={{ borderBottom: "1px solid #ccc" }}
        >
          Vehicle Details
        </h5>
        <Cancel onClick={handleClose} style={{ cursor: "pointer" }} />
      </div>
      <div className="d-flex p-2">
        <div className="mx-2">
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
                  className={`w-100  d-block ${imgLoading ? "d-none" : ""}`}
                  src={getVehicleImageByNameURl(image)}
                  alt={`Vehicle Document ${index + 1}`}
                  onLoad={handleImageLoad}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="mx-2">
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
                  className={`w-100  d-block ${imgLoading ? "d-none" : ""}`}
                  src={getVehicleImageByNameURl(image)}
                  alt={`Vehicle Document ${index + 1}`}
                  onLoad={handleImageLoad}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Driver Document Image Slider */}
        <div>
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
                  className={`w-100 d-block ${imgLoading ? "d-none" : ""}`}
                  src={getVehicleImageByNameURl(image)}
                  alt={`Driver Document ${index + 1}`}
                  onLoad={handleImageLoad}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </div>
      <h6>
        <div className="d-flex flex-wrap m-0 p-0 h-0">
          <div
            className=" px-2 my-0 h-0 w-50"
            style={{
              borderRight: "2px solid #ccc",
            }}
          >
            {Object.entries(driverData)
              .slice(0, 17)
              .filter(([key]) => !excludedFields.includes(key))
              .map(([key, value], index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div className="w-50 " style={{ textAlign: "left" }}>
                    <strong className="text-muted">
                      {camelCaseToTitleCase(key)}
                    </strong>{" "}
                  </div>
                  <div className="w-50" style={{ textAlign: "right" }}>
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </div>
                </div>
              ))}
          </div>
          <div className="w-50 px-2">
            {Object.entries(driverData,userContext)
              .slice(17)
              .filter(([key]) => !excludedFields.includes(key))
              .map(
                ([key, value], index) =>
                  value != null && (
                    <div
                      key={index}
                      style={{
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        className="w-50 m-0 p-0"
                        style={{ textAlign: "left" }}
                      >
                        <strong className="text-muted">
                          {value != null && camelCaseToTitleCase(key)}
                        </strong>{" "}
                      </div>
                      <div
                        style={{ textAlign: "right" }}
                        className="w-50 m-0 p-0"
                      >
                        <span
                          className={
                            (key == "status"
                              ? value == "pending"
                                ? "bg-warning text-white"
                                : value == "rejected"
                                ? "bg-danger text-white"
                                : "bg-success text-white"
                              : "") + " p-1 rounded"
                          }
                        >
                          {key == "statusUpdatedBy"
                            ? username
                            : value != null &&
                              (typeof value === "string"
                                ? value
                                : JSON.stringify(value))}
                        </span>
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </h6>
      <div style={{ textAlign: "right" }} className=" mx-2 ">
        {isAuthorisedVip(driverData,userContext) && (
          <Button
            variant="contained"
            color="primary"
            className="text-capitalize"
            onClick={() => {
              setChangeStatus(true);
            }}
          >
            Change Status
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ViewVehicleEntryDetails;
