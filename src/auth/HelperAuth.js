export const doLoginLocalStorage = (data) => {
    localStorage.setItem("loginData", JSON.stringify(data));
}
export const getLoginData = () => {
    const data = localStorage.getItem("loginData");
     const loginData=JSON.parse(data);
     return loginData
}
export const getJwtToken = () => {
     const loginData=getLoginData()
     if(loginData)
     {
        return loginData.jwtToken
     }
}
export const isUserLoggedIn = () => {
    const jwtToken = getJwtToken()
    if (jwtToken) {
        // console.log(true+"true true")
            return true;
    }
}
export const getUserInfo = () => {
    const data =getLoginData()
    // console.log(JSON.parse(data).user)
    if(data)
    return data.user;
}
export const doLogoutFromLocalStorage = () => {
    localStorage.removeItem("loginData");
}