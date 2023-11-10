import axios from "axios";
import { getJwtToken } from "../auth/HelperAuth";

export const BASE_URL='http://localhost:9090'
// export const BASE_URL='https://api.craftcastle.co.in'

export const privateAxios=axios.create({
    baseURL:BASE_URL
}) 
privateAxios.interceptors.request.use(
  (config) => {
    //request me modification krege
    const token = getJwtToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
