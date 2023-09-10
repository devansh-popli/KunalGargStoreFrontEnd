import { privateAxios } from "./AxiosService"

export const saveStockItemMenu=(data)=>{
   return privateAxios.post("/api/v1/stockItemMenu",data).then(res=>res.data)
}
export const getStockItemMenuByAction=(action,currentId)=>{
   return privateAxios.get(`/api/v1/navigate?currentId=${currentId}&action=${action}`).then(res=>res.data)
}
export const getStockItemMenuByAccountId=(accountId)=>{
   return privateAxios.get(`/api/v1/get/stock-item-menu?accountId=${accountId}`).then(res=>res.data)
}
export const deleteStockItemMenuById=(id)=>{
   return privateAxios.delete(`/api/v1/stockItemMenu/${id}`).then(res=>res.data)
}