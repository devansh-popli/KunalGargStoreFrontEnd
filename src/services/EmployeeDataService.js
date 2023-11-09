import { privateAxios } from "./AxiosService";

export const saveEmployeeDataToBackend = (formData) => {
    console.log(formData,"printing formData")
  return privateAxios
    .post("/employee/save", formData)
    .then((data) => data.data);
};
export const getEmployeeDataFromBackend = (pageNum=0,pageSize=10,sortBy="firstName",sortDir="asc") => {
  return privateAxios
    .get(`/employee/list?pageNumber=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`)
    .then((data) => data.data);
};
export const getEmployeeCodeFromBackend = (pageNum=0,pageSize=10,sortBy="firstName",sortDir="asc") => {
  return privateAxios
    .get(`/employee/lastEmployeeCode`)
    .then((data) => data.data);
};
export const saveEmployeeDocumentToBackend = (formData,type,file) => {
    console.log(formData,"printing formData")
    const employeeDocumentImage=new FormData()
    employeeDocumentImage.append("employeeDocumentImage",file)
  return privateAxios
    .post(`/employee/upload/image/${formData}/${type}`, employeeDocumentImage)
    .then((data) => data.data);
};
