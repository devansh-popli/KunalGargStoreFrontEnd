import isJwtTokenExpired from "jwt-check-expiry";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getJwtToken } from "../auth/HelperAuth";
import { UserContext } from "../context/UserContext";

const useJwtChecker = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const token = getJwtToken();
  useEffect(() => {
    const token = getJwtToken();
//    console.log(token, "tken");
    if (token) {
      try {
        // isJwtTokenExpired(token)
        if (isJwtTokenExpired(token)) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            confirmButtonColor: "#78C2AD",
          });
          context.doLogout();
          navigate("/login");
        }
      } catch (ex) {
        context.doLogout();
        navigate("/login");
      }
    }
    else{
      context.doLogout();
      navigate("/login");
    }
  }, []);
};

export default useJwtChecker;
