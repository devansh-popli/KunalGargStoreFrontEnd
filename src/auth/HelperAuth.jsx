export const doLoginLocalStorage = (data) => {
  localStorage.setItem("loginData", JSON.stringify(data));
};
export const getLoginData = () => {
  const data = localStorage.getItem("loginData");
  if (data && data != "undefined") {
    const loginData = JSON.parse(data);
    return loginData;
  }
};
export const getJwtToken = () => {
  const loginData = getLoginData();
  if (loginData) {
    return loginData.jwtToken;
  }
};
export const camelCaseToTitleCase = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
    .replace(/^./, (char) => char.toUpperCase());  // Capitalize the first letter
};

export const checkAccess=(screenName,access)=>{
  const hasReadAccessToScreen = getLoginData()?.user?.screenPermissions.some(
    (data) => data.screenName === screenName && data[access]
  );
  return hasReadAccessToScreen??false
}
export const isUserLoggedIn = () => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    return true;
  }
  return false
};
export const getUserInfo = () => {
  const data = getLoginData();
  if (data) return data.user;
};
export const doLogoutFromLocalStorage = () => {
  localStorage.removeItem("loginData");
};

export const states = [
  {
    state: "ARUNACHAL PRADESH",
    code: "12",
  },
  {
    state: "ASSAM",
    code: "18",
  },
  {
    state: "BIHAR",
    code: "10",
  },
  {
    state: "CHANDIGARH",
    code: "04",
  },
  {
    state: "CHHATISGARH",
    code: "22",
  },
  {
    state: "DELHI",
    code: "07",
  },
  {
    state: "EXPORT",
    code: "99",
  },
  {
    state: "GOA",
    code: "30",
  },
  {
    state: "GUJRAT",
    code: "24",
  },
  {
    state: "HARYANA",
    code: "06",
  },
  {
    state: "HIMACHAL PRADESH",
    code: "02",
  },
  {
    state: "JAMMU & KASHMIR",
    code: "01",
  },
  {
    state: "JHARKHAND",
    code: "20",
  },
  {
    state: "KARNATKA",
    code: "29",
  },
  {
    state: "KERALA",
    code: "32",
  },
  {
    state: "MADHYA PRADESH",
    code: "23",
  },
  {
    state: "MAHARASHTRA",
    code: "27",
  },
  {
    state: "MANIPUR",
    code: "14",
  },
  {
    state: "MEGHALYA",
    code: "17",
  },
  {
    state: "MIZORAM",
    code: "15",
  },
  {
    state: "NAGALAND",
    code: "13",
  },
  {
    state: "ODISHA",
    code: "21",
  },
  {
    state: "PUNJAB",
    code: "03",
  },
  {
    state: "RAJASTHAN",
    code: "08",
  },
  {
    state: "SIKKIM",
    code: "11",
  },
  {
    state: "TAMIL NADU",
    code: "33",
  },
  {
    state: "TRIPURA",
    code: "16",
  },
  {
    state: "UTTAR PRADESH",
    code: "09",
  },
  {
    state: "UTTRANCHAL",
    code: "05",
  },
  {
    state: "WEST BENGAL",
    code: "19",
  },
  {
    state: "DAMAN AND DIU",
    code: "25",
  },
  {
    state: "DADRA AND NAGAR HAVELLI",
    code: "26",
  },
  {
    state: "LAKSHADWEEP",
    code: "31",
  },
  {
    state: "PONDICHERRY",
    code: "34",
  },
  {
    state: "ANDAMAN & NICOBAR ISLANDS",
    code: "35",
  },
  {
    state: "ANDHRA PRADESH",
    code: "37",
  },
  {
    state: "TELANGANA",
    code: "36",
  },
  {
    state: "UTTARAKHAND",
    code: "05",
  },
  {
    state: "LADAKH",
    code: "38",
  },
  {
    state: "OTHER TERRITORY",
    code: "97",
  },
];
