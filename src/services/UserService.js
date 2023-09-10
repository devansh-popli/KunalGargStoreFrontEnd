import { privateAxios } from "./AxiosService"

export const loginUser=(user)=>{
    return privateAxios.post("/auth/login",user).then(res=>res.data)
}