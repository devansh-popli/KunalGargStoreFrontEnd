import cns from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import s from "./sidebar.module.scss";
import {
  AccessTime,
  AccountBalanceWallet,
  CarRental,
  Dashboard,
  DriveFolderUpload,
  Event,
  GarageTwoTone,
  Group,
  ListAlt,
  Person,
} from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { checkAccess } from "../auth/HelperAuth";

const Sidebar = React.memo(({ toggle, setToggle }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userContext = useContext(UserContext);
  

  return (
    <div
      className={cns(s.sidebar, toggle && userContext.isLogin ? s.active : ``)}
    >
      {toggle && (
        <ArrowBackIosIcon
          fontSize="large"
          className={s.sidebarCloseBtn}
          onClick={() => setToggle(false)}
        />
      )}

      <div className="d-flex align-content-center mt-4 align-items-center">
        <img className="mx-2 m-0" src="../../download.png" width={40} alt="" />
        <h6 className="m-0 pe-3 fs">MittalSteelIndustries</h6>
      </div>

      {userContext.isLogin && (
        <Nav className="mt-4 flex-column">
          {checkAccess("Dashboard", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/home"}
                className={
                    "d-flex align-content-center"
                }
              >
                <Dashboard className="text-white" />
                <h6 className="text-white mx-2 p-1">Dashboard</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {/* <Nav.Item>
            <Nav.Link
              onClick={() => {
                setIsActive(2);
                isMobile && setToggle(!toggle);
              }}
              as={NavLink}
              to={"/new-ledger-account-form"}
              className={isActive === 2 ? " d-flex align-content-center" : "d-flex align-content-center"}
            >
              <AccountBalanceWallet className="text-white" />
              <h6 className="text-white mx-2 p-1">New Ledger Account Form</h6>
            </Nav.Link>
          </Nav.Item> */}
          {checkAccess("Ledger Directory", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/view-ledger-details"}
                className={
                    " d-flex align-content-center"
                }
              >
                <AccountBalanceWallet className="text-white" />
                <h6 className="text-white mx-2 p-1">Vendor Directory</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {/* <Nav.Item>
            <Nav.Link
              onClick={() => {
                setIsActive(4);
                isMobile && setToggle(!toggle);
              }}
              as={NavLink}
              to={"/stock-item-menu"}
              className={isActive === 4 ? " d-flex align-content-center" : "d-flex align-content-center"}
            >
              <CarRental className="text-white" />
              <h6 className="text-white mx-2 p-1">Stock Item Menu</h6>
            </Nav.Link>
          </Nav.Item> */}
          {checkAccess("View Stock Item Menu", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/view-stock-item-menu"}
                className={
                    "d-flex align-content-center"
                }
              >
                <ListAlt className="text-white" />
                <h6 className="text-white mx-2 p-1">View Stock Item Menu</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Employee Directory", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/employee-directory"}
                className={
                     "d-flex align-content-center"
                }
              >
                <Group className="text-white" />
                <h6 className="text-white mx-2 p-1">Employee Directory</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Attendance Tracker", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/attendance-tracker"}
                className={
                     " d-flex align-content-center"
                }
              >
                <AccessTime className="text-white" />
                <h6 className="text-white mx-2 p-1">Attendance Tracker</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Attendance Records", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/attendance-records"}
                className={
                    " d-flex align-content-center"
                }
              >
                <Event className="text-white" />
                <h6 className="text-white mx-2 p-1">Attendance Records</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Visitor Form", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/visitor-entry"}
                className={
                     "d-flex align-content-center"
                }
              >
                <Person className="text-white" />
                <h6 className="text-white mx-2 p-1">Visitor Form</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Employee Gate Pass", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/gate-pass-form"}
                className={
                    "d-flex align-content-center"
                }
              >
                <GarageTwoTone className="text-white" />
                <h6 className="text-white mx-2 p-1">Gate Pass Form</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("Vehicle Entry Records", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/vehicle-entry-records"}
                className={
                    "d-flex align-content-center"
                }
              >
                <DriveFolderUpload className="text-white" />
                <h6 className="text-white mx-2 p-1">Vehicle Entry Records</h6>
              </Nav.Link>
            </Nav.Item>
          )}
          {checkAccess("JCB or HYDRA", "canRead") && (
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  isMobile && setToggle(!toggle);
                }}
                as={NavLink}
                to={"/vehicle-entry-data-jcb-hydra"}
                className={
                    "d-flex align-content-center"
                }
              >
                <CarRental className="text-white" />
                <h6 className="text-white mx-2 p-1">JCB or HYDRA</h6>
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      )}
    </div>
  );
});

export default React.memo(Sidebar);
