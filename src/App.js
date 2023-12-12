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
import { useEffect, useState } from "react";
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
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import TableViewIcon from "@mui/icons-material/TableView";
import MenuIcon from "@mui/icons-material/Menu";
import { ZoomIn } from "@mui/icons-material";
import Sidebar from "./components/Sidebar";
import EmployeeEnrollmentForm from "./pages/EmployeeEnrollmentForm";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import AttendanceTracker from "./pages/AttendanceTracker";
import AttendanceRecords from "./pages/AttendanceRecords";
import ViewLedgerAccount from "./pages/ViewLedgerAccount";
import VisitorForm from "./pages/VisitorForm";
import VehiceEntryForm1 from "./pages/VehiceEntryForm1";
import VehicleEntryForm2 from "./pages/VehicleEntryForm2";
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
  useEffect(()=>{
    if (window.location.pathname === "/") {
      console.log(window.location.pathname+"inside if")
      document.getElementById('theme-color-meta').setAttribute('content', 'RGB(250, 249, 248)');
    } else {
      console.log(window.location.pathname+"inside else")
      document.getElementById('theme-color-meta').setAttribute('content', 'white');
    }
  }, [window.location.pathname]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [toggle, setToggle] = useState(true);
  return (
    <>
        <BrowserRouter>
      <UserContextProvider>
          <div className={toggle?"dashboard":"dashboard-active"}>
            <ToastContainer draggable transition={Zoom} position="top-right" theme="colored" />
            <Sidebar toggle={toggle} setToggle={setToggle} />
            <section>
              <NavbarComponent setToggle={setToggle} />
              {loading && <SpinnerComponent />}
              <Routes>
                <Route path="/*" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route
                  path="/new-ledger-account-form"
                  element={<NewLedgerAccountForm />}
                />
                <Route path="/stock-item-menu" element={<StockItemMenu />} />
                <Route
                  path="/stock-item-menu/:id"
                  element={<StockItemMenu />}
                />
                <Route
                  path="/new-ledger-account-form/:id"
                  element={<NewLedgerAccountForm />}
                />
                <Route
                  path="/view-stock-item-menu"
                  element={<ViewStockItemMenu />}
                />
                <Route
                  path="/view-ledger-details"
                  element={<ViewLedgerAccount />}
                />
                <Route
                  path="/employee-form"
                  element={<EmployeeEnrollmentForm />}
                />
                <Route
                  path="/employee-directory"
                  element={<EmployeeDirectory />}
                />
                <Route
                  path="/attendance-tracker"
                  element={<AttendanceTracker />}
                />
                <Route
                  path="/attendance-records"
                  element={<AttendanceRecords />}
                />
                <Route
                  path="/visitor-entry"
                  element={<VisitorForm />}
                />
            
                <Route
                  path="/vehicle-entry"
                  element={<VehiceEntryForm1 />}
                />
                <Route
                  path="/vehicle-entry-form"
                  element={<VehicleEntryForm2 />}
                />
            
              </Routes>
            </section>
          </div>

          {/* </PersistentDrawerLeft> */}
          {/* <Footer /> */}
      </UserContextProvider>
        </BrowserRouter>
    </>
  );
}

export default App;
