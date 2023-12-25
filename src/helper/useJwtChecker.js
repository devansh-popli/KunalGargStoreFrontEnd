import React, { useContext, useEffect } from "react";
import { getJwtToken } from "../auth/HelperAuth";
import isJwtTokenExpired from "jwt-check-expiry";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const useJwtChecker = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const token =getJwtToken()
  useEffect(() => {
    const token = getJwtToken();
    console.log(token,"tken")
    if (token!=undefined && token && token!='') {
      try{
        // isJwtTokenExpired(token)
        if (isJwtTokenExpired(token)) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            confirmButtonColor: "#78C2AD",
          });
          context.doLogout();
          navigate("/")
        }
      }
      catch(ex){
        context.doLogout()
        navigate("/")
      }
    }
    else{
      navigate("/")
    }
  }, []);
  if (token!=undefined && token && token!='') {
  return isJwtTokenExpired(token);
  }
};

export default useJwtChecker;
