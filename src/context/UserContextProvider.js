import React, { useEffect, useState } from 'react'
import { doLoginLocalStorage, doLogoutFromLocalStorage, getUserInfo, isUserLoggedIn } from '../auth/HelperAuth';
import { UserContext } from './UserContext'
import { useNavigate } from 'react-router-dom';

export const UserContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState();
    const [userData, setUserData] = useState();
    const [updatedAttendance, setUpdatedAttendance] = useState(null);
    const [monthlyAttendance, setMonthlyAttendance] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    // const [fetchAttendanceRecord, setUserData] = useState();
    useEffect(() => {
        setIsLogin(isUserLoggedIn());
        setUserData(getUserInfo());
      },[]);
    const doLogin=(data)=>{
        doLoginLocalStorage(data)
        setIsLogin(true)
        setUserData(getUserInfo())
    }
    const navigate=useNavigate()
    const doLogout=()=>{
        doLogoutFromLocalStorage()
        setIsLogin(false)
        setUserData(null)
        document.getElementById('theme-color-meta').setAttribute('content', 'RGB(250, 249, 248)');
    }
    return (
        <UserContext.Provider value={{dailyData:dailyData,setDailyData:setDailyData,setMonthlyAttendance:setMonthlyAttendance,monthlyAttendance:monthlyAttendance,doLogin: doLogin ,isLogin:isLogin,userData:userData,doLogout:doLogout,updatedAttendance:updatedAttendance, setUpdatedAttendance:setUpdatedAttendance}}>
            {children}
        </UserContext.Provider>
    )
}
