import React, { useCallback, useEffect, useState } from "react";
import {
  doLoginLocalStorage,
  doLogoutFromLocalStorage,
  getLoginData,
  getUserInfo,
  isUserLoggedIn,
} from "../auth/HelperAuth";
import Login from "../pages/Login";
import { UserContext } from "./UserContext";

export const UserContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState();
  const [userData, setUserData] = useState();
  const [screenPermissions, setScreenPermissions] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  // const [fetchAttendanceRecord, setUserData] = useState();
  useEffect(() => {
    setIsLogin(isUserLoggedIn());
    setUserData(getUserInfo());
  }, []);
  const doLogin = useCallback((data) => {
    doLoginLocalStorage(data);
    setIsLogin(true);
    setUserData(getUserInfo());
    setScreenPermissions(getLoginData()?.user?.screenPermissions)
  }, []);
  const doLogout = useCallback(() => {
    doLogoutFromLocalStorage();
    setIsLogin(false);
    setUserData(null);
    document
      .getElementById("theme-color-meta")
      .setAttribute("content", "#C4EDDD");
  }, []);
  return (
    <UserContext.Provider
      value={{
        dailyData: dailyData,
        setDailyData: setDailyData,
        setMonthlyAttendance: setMonthlyAttendance,
        monthlyAttendance: monthlyAttendance,
        doLogin: doLogin,
        isLogin: isLogin,
        userData: userData,
        screenPermissions: screenPermissions,
        doLogout: doLogout,
        updatedAttendance: updatedAttendance,
        setUpdatedAttendance: setUpdatedAttendance,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
