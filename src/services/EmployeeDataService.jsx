import { BASE_URL, privateAxios } from "./AxiosService";

export const saveEmployeeDataToBackend = (formData) => {
  return privateAxios
    .post("/employee/save", formData)
    .then((data) => data.data);
};
export const deleteEmployeeFromDirectory = (employee) => {
  return privateAxios
    .delete(`/employee/${employee.id}`)
    .then((data) => data.data);
};
export const getEmployeeDataFromBackend = (
  pageNum = 0,
  pageSize = 10000,
  sortBy = "firstName",
  sortDir = "asc"
) => {
  return privateAxios
    .get(
      `/employee/list?pageNumber=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((data) => data.data);
};
export const getEmployeeCodeFromBackend = (
  pageNum = 0,
  pageSize = 10,
  sortBy = "firstName",
  sortDir = "asc"
) => {
  return privateAxios
    .get(`/employee/lastEmployeeCode`)
    .then((data) => data.data);
};
export const saveEmployeeDocumentToBackend = (formData, type, file) => {
  const employeeDocumentImage = new FormData();
  employeeDocumentImage.append("employeeDocumentImage", file);
  return privateAxios
    .post(`/employee/upload/image/${formData}/${type}`, employeeDocumentImage)
    .then((data) => data.data);
};

export const saveAttendanceDataToBackend = (formData) => {
  return privateAxios
    .post("/api/attendance", formData)
    .then((data) => data.data);
};
export const getAttendanceDataFromBackend = (
  month,
  year=2023,
  empCode,
  pageNum = 0,
  pageSize = 31,
  sortBy = "attendanceDate",
  sortDir = "desc"
) => {
  return privateAxios
    .get(
      `/api/attendance?month=${month}&year=${year}&empCode=${empCode}&pageNumber=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((data) => data.data);
};

export const getAttendanceDataFromBackendByMonth = (
  month,
  year=2024,
  pageNum = 0,
  pageSize = 10000,
  sortBy = "attendanceDate",
  sortDir = "desc"
) => {
  return privateAxios
    .get(
      `/api/attendance/findByMonth?month=${month}&year=${year}&pageNumber=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((data) => data.data);
};
export const getAttendanceDataByDateFromBackend = (date, empCode) => {
  return privateAxios
    .get(`/api/attendance/findByEmpCodeAndDate?date=${date}&empCode=${empCode}`)
    .then((data) => data.data);
};
export const getEmployeeImageByTypeURl = (employeeId, type) => {
  return `${BASE_URL}/employee/image/${employeeId}/${type}`;
};
export const getAttendanceDataOfTodayFromBackend = (
  date,
  sortBy = "attendanceDate",
  sortDir = "desc"
) => {
  return privateAxios
    .get(
      `/api/attendance/findByToday?date=${date}&sortBy=${sortBy}&sortDir=${sortDir}`
    )
    .then((data) => {
      // let arr = data.data.content.sort(
      //   (a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate)
      // );
      // data.data.content=arr
      return data.data;
    });
};
export const deleteAttendanceDataByDateFromBackend = (attendanceId) => {
  return privateAxios
    .delete(`/api/attendance/${attendanceId}`)
    .then((data) => data.data);
};
