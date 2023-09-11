import { privateAxios } from "./AxiosService"

export const loginUser=(loginData)=>{
    return privateAxios.post("/auth/login",loginData).then(response=>{
        return response.data
    })
}