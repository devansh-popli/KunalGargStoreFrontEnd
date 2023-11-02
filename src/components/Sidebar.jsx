import React, { useContext } from "react";
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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
const Sidebar = ({ toggle, setToggle }) => {
  const userContext = useContext(UserContext);
  return (
    <div
      className={cns(s.sidebar, toggle && userContext.isLogin ? s.active : ``)}
    >
      {/* <Logo bookColor={'#fff'} /> */}
      {/* <Menu /> */}
      { toggle && (
        <ArrowBackIosIcon
          fontSize="large"
          className={s.sidebarCloseBtn}
          onClick={() => setToggle(false)}
        />
      )}
      <div className="d-flex justify-content-center align-items-center ">
        <img src="../../download.png" width={56} alt="" />
        <h5 className="mx-2">SHOPEASE</h5>
      </div>
      {userContext.isLogin && (
        <List className="mt-3">
          <ListItem disablePadding as={NavLink} to={"/new-ledger-account-form"}>
            <ListItemButton>
              <ListItemIcon>
                {<AccountBoxIcon className="text-white" />}
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
          <ListItem disablePadding as={NavLink} to={"/stock-item-menu"}>
            <ListItemButton>
              <ListItemIcon>
                {<InventoryIcon className="text-white" />}
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
          <ListItem disablePadding as={Link} to={"/view-stock-item-menu"}>
            <ListItemButton>
              <ListItemIcon>
                {<TableViewIcon className="text-white" />}
              </ListItemIcon>
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
        </List>
      )}
    </div>
  );
};

export default Sidebar;
