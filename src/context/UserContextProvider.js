import React, { useEffect, useState } from 'react'
import { doLoginLocalStorage, doLogoutFromLocalStorage, getUserInfo, isUserLoggedIn } from '../auth/HelperAuth';
import { UserContext } from './UserContext'

export const UserContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState();
    const [userData, setUserData] = useState();
    useEffect(() => {
        setIsLogin(isUserLoggedIn());
        setUserData(getUserInfo());
      },[]);
    const doLogin=(data)=>{
        doLoginLocalStorage(data)
        setIsLogin(true)
        setUserData(getUserInfo())
    }
    const doLogout=()=>{
        doLogoutFromLocalStorage()
        setIsLogin(false)
        setUserData(null)
    }
    return (
        <UserContext.Provider value={{doLogin: doLogin ,isLogin:isLogin,userData:userData,doLogout:doLogout}}>
            {children}
        </UserContext.Provider>
    )
}
