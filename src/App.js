import "./App.css";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NavbarComponent from "./components/NavbarComponent";
import { ToastContainer, Zoom } from "react-toastify";
import { UserContextProvider } from "./context/UserContextProvider";
import Home from "./pages/Home";
import NewLedgerAccountForm from "./pages/NewLedgerAccountForm";
import StockItemMenu from "./pages/StockItemMenu";
import Footer from "./components/Footer";
import ViewStockItemMenu from "./pages/ViewStockItemMenu";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import SpinnerComponent from "./components/SpinnerComponents";
import { privateAxios } from "./services/AxiosService";
import PersistentDrawerLeft from "./components/PersistentDrawerLeft";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import TableViewIcon from '@mui/icons-material/TableView';
import MenuIcon from '@mui/icons-material/Menu';
function App() {
  const [loading, setLoading] = useState(false);
  privateAxios.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
  privateAxios.interceptors.response.use(
    (config) => {
      setLoading(false);
      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    }
  );
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          {/* <NavbarComponent /> */}
          {/* <PersistentDrawerLeft> */}
          <div>
      {/* <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Responsive Drawer</Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
      {/* {userContext.isLogin && 
      
              <List>
            <ListItem disablePadding  as={NavLink} to={"/new-ledger-account-form"} >
              <ListItemButton>
                <ListItemIcon >
                  { <AccountBoxIcon  />}
                </ListItemIcon>
                <ListItemText  primary={'New Ledger Account Form'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding as={NavLink} to={"/stock-item-menu"}>
              <ListItemButton>
                <ListItemIcon>
                  { <InventoryIcon />}
                </ListItemIcon>
                <ListItemText  primary={'Stock Item Menu'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding  as={Link} to={"/view-stock-item-menu"}>
              <ListItemButton>
                <ListItemIcon>
                  { <TableViewIcon />}
                </ListItemIcon>
                <ListItemText  primary={'View Stock Item Menu'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
          </List>
          {/* } 
      {/* </Drawer> 

      <main> */}
      <PersistentDrawerLeft>
      <ToastContainer
              draggable
              transition={Zoom}
              position="bottom-center"
            />
            {loading && <SpinnerComponent />}
            <Routes>
              <Route path="" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route
                path="/new-ledger-account-form"
                element={<NewLedgerAccountForm />}
              />
              <Route path="/stock-item-menu" element={<StockItemMenu />} />
              <Route path="/stock-item-menu/:id" element={<StockItemMenu />} />
              <Route
                path="/view-stock-item-menu"
                element={<ViewStockItemMenu />}
              />
            </Routes>
            </PersistentDrawerLeft>
    </div>
           
          {/* </PersistentDrawerLeft> */}
            {/* <Footer /> */}
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;
