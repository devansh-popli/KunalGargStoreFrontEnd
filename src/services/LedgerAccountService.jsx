import { privateAxios } from "./AxiosService"

export const saveLedgerAccount=(data)=>{
   return privateAxios.post("/api/ledger-accounts/save",data).then(res=>res.data)
}
export const getLedgerAccountByAction=(action,currentId)=>{
   return privateAxios.get(`/api/ledger-accounts/navigate/action?currentId=${currentId}&action=${action}`).then(res=>res.data)
}
export const getLedgerAccountByAccountId=(accountId)=>{
   return privateAxios.get(`/api/ledger-accounts/get?accountId=${accountId}`).then(res=>res.data)
}
export const deleteLedgerAccountById=(id)=>{
   return privateAxios.delete(`/api/ledger-accounts/${id}`).then(res=>res.data)
}