import React, { useContext, useEffect, useMemo, useState } from "react";
import cns from "classnames";

// Components

// Scss
import s from "./sidebar.module.scss";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import ContactsIcon from "@mui/icons-material/Contacts";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { UserContext } from "../context/UserContext";
import { Grid, Hidden, useMediaQuery } from "@mui/material";
// import { ThemeProvider } from '@mui/material/styles';
import Footer from "./Footer";
import { Link, NavLink } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import TableViewIcon from "@mui/icons-material/TableView";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  AccessTime,
  AccountBalance,
  AccountBalanceWallet,
  AddBox,
  AddBoxOutlined,
  CarRental,
  Dashboard,
  DriveEta,
  DriveFolderUpload,
  Event,
  Group,
  ListAlt,
  Person,
  PersonAdd,
  ShoppingBag,
  ShoppingBasket,
} from "@mui/icons-material";
const Sidebar = React.memo(({ toggle, setToggle }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    // Update isMobile state based on the width of the viewport
    setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
  };
  useEffect(() => {
    // Initial check and set up event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const userContext = useContext(UserContext);
  const [isActive, setIsActive] = useState(1);
  return (
    <div
      className={cns(s.sidebar, toggle && userContext.isLogin ? s.active : ``)}
    >
      {/* <Logo bookColor={'#fff'} /> */}
      {/* <Menu /> */}
      {toggle && (
        <ArrowBackIosIcon
          fontSize="large"
          className={s.sidebarCloseBtn}
          onClick={() => setToggle(false)}
        />
      )}
      <div className="d-flex  mt-4  align-items-center ">
        <img className="mx-2 m-0" src="../../download.png" width={40} alt="" />
        <h6 className=" m-0 p-0 fs">MittalSteelIndustries</h6>
      </div>
      {userContext.isLogin && (
        <List className="mt-1">
          <ListItem
            onClick={() => {
              setIsActive(1);
              console.log(isActive+"isact")
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==1} className={isActive===1 ? "activeList":"active"}
            to={"/home"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<Dashboard className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Dashboard</h6>
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            onClick={() => {
              setIsActive(2);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==2} className={isActive==1 ? "activeList":""}
            to={"/new-ledger-account-form"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<AccountBalanceWallet className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">New Ledger Account Form</h6>
            </ListItemButton>
          </ListItem> */}
          <ListItem
            onClick={() => {
              setIsActive(3);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==3} className={isActive==1 ? "activeList":""}
            to={"/view-ledger-details"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<AccountBalanceWallet className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Ledger Directory</h6>
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            onClick={() => {
              setIsActive(4);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==4} className={isActive==1 ? "activeList":""}
            to={"/stock-item-menu"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<ShoppingBag className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Stock Item Menu</h6>
            </ListItemButton>
          </ListItem> */}
          <ListItem
            onClick={() => {
              setIsActive(5);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==5} className={isActive==1 ? "activeList":""}
            to={"/view-stock-item-menu"}
          >
            <ListItemButton>
              <ListItemIcon>{<ListAlt className="text-white" />}</ListItemIcon>
              <h6 className="text-white m-0 p-0">View Stock Item Menu</h6>
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            onClick={() => {
              setIsActive(6);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==6} className={isActive==1 ? "activeList":""}
            to={"/employee-form"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<PersonAdd className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Employee Form</h6>
            </ListItemButton>
          </ListItem> */}
          <ListItem
            onClick={() => {
              setIsActive(7);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==7} className={isActive==1 ? "activeList":""}
            to={"/employee-directory"}
          >
            <ListItemButton>
              <ListItemIcon>{<Group className="text-white" />}</ListItemIcon>
              <h6 className="text-white m-0 p-0">Employee Directory</h6>
            </ListItemButton>
          </ListItem>
          <ListItem
            onClick={() => {
              setIsActive(8);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==8} className={isActive==1 ? "activeList":""}
            to={"/attendance-tracker"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<AccessTime className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Attendance Tracker</h6>
            </ListItemButton>
          </ListItem>
          <ListItem
            onClick={() => {
              setIsActive(9);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==9} className={isActive==1 ? "activeList":""}
            to={"/attendance-records"}
          >
            <ListItemButton>
              <ListItemIcon>{<Event className="text-white" />}</ListItemIcon>
              <h6 className="text-white m-0 p-0">Attendance Records</h6>
            </ListItemButton>
          </ListItem>
          <ListItem
            onClick={() => {
              setIsActive(10);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==10} className={isActive==1 ? "activeList":""}
            to={"/visitor-entry"}
          >
            <ListItemButton>
              <ListItemIcon>{<Person className="text-white" />}</ListItemIcon>
              {/* <ListItemText
                primary={"Visitor Form"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              /> */}
              <h6 className="text-white m-0 p-0">Visitor Form</h6>
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            onClick={() => {
              setIsActive(11);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==11} className={isActive==1 ? "activeList":""}
            to={"/vehicle-entry"}
          >
            <ListItemButton>
              <ListItemIcon>{<DriveEta className="text-white" />}</ListItemIcon>
              <h6 className="text-white m-0 p-0">JCB or HYDRA Form</h6>
            </ListItemButton>
          </ListItem> */}
          {/* <ListItem
            onClick={() => {
              setIsActive(12);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==12} className={isActive==1 ? "activeList":""}
            to={"/vehicle-entry-form"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<DriveFolderUpload className="text-white" />}
              </ListItemIcon>
              <h6 className="text-white m-0 p-0">Vehicle Entry Form</h6>
            </ListItemButton>
          </ListItem> */}
          <ListItem
            onClick={() => {
              setIsActive(13);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==13} className={isActive==1 ? "activeList":""}
            to={"/vehicle-entry-records"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<DriveFolderUpload className="text-white" />}
              </ListItemIcon>
              {/* <ListItemText
                primary={"Vehicle Entry Records"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              /> */}
              <h6 className="text-white m-0 p-0">Vehicle Entry Records</h6>
            </ListItemButton>
          </ListItem>
          <ListItem
            onClick={() => {
              setIsActive(14);
              isMobile && setToggle(!toggle);
            }}
            disablePadding
            as={NavLink} selected={isActive ==14} className={isActive==1 ? "activeList":""}
            to={"vehicle-entry-data-jcb-hydra"}
          >
            <ListItemButton>
              <ListItemIcon>
                {<CarRental className="text-white" />}
              </ListItemIcon>
              {/* <ListItemText
                primary={"JCB or HYDRA"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              /> */}
              <h6 className="text-white m-0 p-0">JCB or HYDRA</h6>
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </div>
  );
});

export default Sidebar;
