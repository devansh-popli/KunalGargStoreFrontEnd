import { privateAxios } from "./AxiosService"

export const loginUser=(loginData)=>{
    return privateAxios.post("/auth/login",loginData).then(response=>{
        return response.data
    })
}
export const getUserById=(id)=>{
    return privateAxios.get("/users/"+id).then(response=>{
        return response.data
    })
}
export const getAllUsers=(id)=>{
    return privateAxios.get(`/users?pageSize=${10000}`).then(response=>{
        return response.data
    })
}
export const saveScreenPermissions=(userId,screenPermissions)=>{
   return privateAxios.post(`/users/${userId}/screen-permissions`,screenPermissions).then(data=>{
       return data.data     
    })
}
export const updateUser=(user,id)=>{
   return privateAxios.put(`/users/${id}`,user).then(data=>{
       return data.data     
    })
}