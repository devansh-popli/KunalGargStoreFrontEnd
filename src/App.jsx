import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "./App.css";
import NavbarComponent from "./components/NavbarComponent";
import SpinnerComponent from "./components/SpinnerComponents";
import { UserContextProvider } from "./context/UserContextProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewLedgerAccountForm from "./pages/NewLedgerAccountForm";
import StockItemMenu from "./pages/StockItemMenu";
import ViewStockItemMenu from "./pages/ViewStockItemMenu";
import { privateAxios } from "./services/AxiosService";

import AdminDashboard from "./pages/AdminDashboard";
import AttendanceRecords from "./pages/AttendanceRecords";
import AttendanceTracker from "./pages/AttendanceTracker";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import EmployeeEnrollmentForm from "./pages/EmployeeEnrollmentForm";
import VehiceEntryForm1 from "./pages/VehiceEntryForm1";
import VehicleEntryForm2 from "./pages/VehicleEntryForm2";
import VehicleEntryRecords from "./pages/VehicleEntryRecords";
import VehicleEntryRecordsJCB from "./pages/VehicleEntryRecordsJCB";
import ViewLedgerAccount from "./pages/ViewLedgerAccount";
import VisitorForm from "./pages/VisitorForm";
import { checkAccess } from "./auth/HelperAuth";
import AddUserForm from "./components/AddUserForm";
import JCBorHYDRARecords from "./pages/JCBorHYDRARecords";
import GatePassForm from "./pages/GatePassForm";
import { UserContext } from "./context/UserContext";
function App() {
  const [loading, setLoading] = useState(false);
 useEffect(()=>{
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
 },[])
  useEffect(() => {
    if (window.location.pathname === "/") {
      //      console.log(window.location.pathname + "inside if");
      document
        .getElementById("theme-color-meta")
        .setAttribute("content", "#C4EDDD");
    } else {
      //      console.log(window.location.pathname + "inside else");
      document
        .getElementById("theme-color-meta")
        .setAttribute("content", "white");
    }
  }, [window.location.pathname]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [toggle, setToggle] = useState(false);
const {isLogin}=useContext(UserContext)
  return (
    <>
      
        <BrowserRouter>
          <div className={toggle ? "dashboard" :!isLogin? "dashboard-active2":"dashboard-active"}>
            <ToastContainer
              draggable
              transition={Zoom}
              position="top-right"
              theme="colored"
            />
            <section>
              <NavbarComponent toggle={toggle} setToggle={setToggle} />
              {loading && <SpinnerComponent />}
              <Routes>
                {/* {checkAccess("Dashboard", "canRead") && ( */}
                  <Route path="/" element={<Home />} />
                {/* )} */}
                <Route path="/login" element={<Login />} />
                {/* {checkAccess("Dashboard", "canRead") && ( */}
                  <Route path="/home" element={<Home />} />
                {/* )} */}
                {checkAccess("Ledger Directory", "canWrite") && (
                  <Route
                    path="/new-ledger-account-form"
                    element={<NewLedgerAccountForm />}
                  />
                )}
                {checkAccess("View Stock Item Menu", "canWrite") && (
                  <Route path="/stock-item-menu" element={<StockItemMenu />} />
                )}
                {checkAccess("View Stock Item Menu", "canUpdate") && (
                  <Route
                    path="/stock-item-menu/:id"
                    element={<StockItemMenu />}
                  />
                )}
                {checkAccess("Ledger Directory", "canUpdate") && (
                  <Route
                    path="/new-ledger-account-form/:id"
                    element={<NewLedgerAccountForm />}
                  />
                )}
                {checkAccess("View Stock Item Menu", "canRead") && (
                  <Route
                    path="/view-stock-item-menu"
                    element={<ViewStockItemMenu />}
                  />
                )}
                {checkAccess("Ledger Directory", "canRead") && (
                  <Route
                    path="/view-ledger-details"
                    element={<ViewLedgerAccount />}
                  />
                )}
                {checkAccess("Employee Directory", "canWrite") && (
                  <Route
                    path="/employee-form"
                    element={<EmployeeEnrollmentForm />}
                  />
                )}

                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/add-user-form" element={<AddUserForm />} />
                <Route path="/add-user-form/:id" element={<AddUserForm />} />
                {checkAccess("Employee Directory", "canRead") && (
                  <Route
                    path="/employee-directory"
                    element={<EmployeeDirectory />}
                  />
                )}
                {checkAccess("Attendance Tracker", "canRead") && (
                  <Route
                    path="/attendance-tracker"
                    element={<AttendanceTracker />}
                  />
                )}
                {checkAccess("Attendance Records", "canRead") && (
                  <Route
                    path="/attendance-records"
                    element={<AttendanceRecords />}
                  />
                )}
                {checkAccess("Employee Gate Pass", "canRead") && (
                  <Route
                    path="/gate-pass-form"
                    element={<GatePassForm />}
                  />
                )}
                {checkAccess("Visitor Form", "canRead") && (
                  <Route path="/visitor-entry" element={<VisitorForm />} />
                )}
                {checkAccess("JCB or HYDRA", "canWrite") && (
                  <Route path="/vehicle-entry" element={<VehiceEntryForm1 />} />
                )}
                {checkAccess("Vehicle Entry Records", "canWrite") && (
                  <Route
                    path="/vehicle-entry-form"
                    element={<VehicleEntryForm2 />}
                  />
                )}
                {checkAccess("Vehicle Entry Records", "canRead") && (
                  <Route
                    path="/vehicle-entry-records"
                    element={<VehicleEntryRecords />}
                  />
                )}
                {checkAccess("JCB or HYDRA", "canRead") && (
                  <Route
                    path="/vehicle-entry-data-jcb-hydra"
                    element={<JCBorHYDRARecords />}
                  />
                )}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
              </Routes>
            </section>
          </div>

          {/* </PersistentDrawerLeft> */}
          {/* <Footer /> */}
        </BrowserRouter>
    </>
  );
}
function NotFound() {
  const navigate=useNavigate()
  return (
    <div style={{ textAlign: "center", marginTop: "50px",cursor:"pointer" }} onClick={()=>navigate("/login")}>
      <img
        src={"/404.svg"}
        alt="404 Illustration"
        style={{ maxWidth: "100%", height: "500px" }}
      />
    </div>
  ); // You can customize this component or redirect to a 404 page
}
export default App;
