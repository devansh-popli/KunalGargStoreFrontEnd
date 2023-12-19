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
      <div className="d-flex alignment justify-content-center align-items-center ">
        <img className="" src="../../download.png" width={56} alt="" />
        <h5 className="mx-2">SHOPEASE</h5>
      </div>
      {userContext.isLogin && (
        <List className="mt-3">
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={NavLink} to={"/new-ledger-account-form"}>
            <ListItemButton>
              <ListItemIcon>
                {<AccountBalanceWallet className="text-white" />}
              </ListItemIcon>
              <ListItemText
                primary={"New Ledger Account Form"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontStyle:"italic"
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={NavLink} to={"/view-ledger-details"}>
            <ListItemButton>
              <ListItemIcon>
                {<AccountBalanceWallet className="text-white" />}
              </ListItemIcon>
              <ListItemText
                primary={"Ledger Directory"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontStyle:"italic"
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={NavLink} to={"/stock-item-menu"}>
            <ListItemButton>
              <ListItemIcon>
                {<ShoppingBag className="text-white" />}
              </ListItemIcon>
              <ListItemText
                primary={"Stock Item Menu"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
              {/* <h6 className='fw-medium--dark' style={{color:"white"}}>Stock Item Menu</h6> */}
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/view-stock-item-menu"}>
            <ListItemButton>
              <ListItemIcon>{<ListAlt className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"View Stock Item Menu"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/employee-form"}>
            <ListItemButton>
              <ListItemIcon>
                {<PersonAdd className="text-white" />}
              </ListItemIcon>
              <ListItemText
                primary={"Employee Form"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/employee-directory"}>
            <ListItemButton>
              <ListItemIcon>{<Group className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Employee Directory"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/attendance-tracker"}>
            <ListItemButton>
              <ListItemIcon>
                {<AccessTime className="text-white" />}
              </ListItemIcon>
              <ListItemText
                primary={"Attendance Tracker"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/attendance-records"}>
            <ListItemButton>
              <ListItemIcon>{<Event className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Attendance Records"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/visitor-entry"}>
            <ListItemButton>
              <ListItemIcon>{<Person className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Visitor Form"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/vehicle-entry"}>
            <ListItemButton>
              <ListItemIcon>{<DriveEta className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Vehicle Entry Form"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/vehicle-entry-form"}>
            <ListItemButton>
              <ListItemIcon>{<DriveFolderUpload className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Vehicle Entry Form 2"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"/vehicle-entry-records"}>
            <ListItemButton>
              <ListItemIcon>{<DriveFolderUpload className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"Vehicle Entry Records"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem onClick={() => isMobile && setToggle(!toggle)}disablePadding as={Link} to={"vehicle-entry-data-jcb-hydra"}>
            <ListItemButton>
              <ListItemIcon>{<DriveFolderUpload className="text-white" />}</ListItemIcon>
              <ListItemText
                primary={"JCB or HYDRA"}
                primaryTypographyProps={{
                  color: "white",
                  fontWeight: "medium",
                  variant: "body2",
                  // fontSize:"20px"
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </div>
  );
});

export default Sidebar;
