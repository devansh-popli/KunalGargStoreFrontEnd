import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          {/* <NavbarComponent /> */}
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
            {/* <Footer /> */}
        </BrowserRouter>
      </UserContextProvider>
    </>
  );
}

export default App;
