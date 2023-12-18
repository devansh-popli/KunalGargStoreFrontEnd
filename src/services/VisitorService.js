import { BASE_URL, privateAxios } from "./AxiosService";

export const submitVisitorData = (formData,timeIn) => {
  if(timeIn) formData.timeIn=timeIn
  return privateAxios.post("/api/visitors", formData).then((data) => data.data);
};

export const getVisitorData = () => {
  return privateAxios.get("/api/visitors").then((data) => data.data);
};

export const getVisitorImageByTypeURl = (visitorId,type="profile") => {
  return `${BASE_URL}/api/visitors/image/${visitorId}/${type}`;
};
export const saveVisitorDocumentToBackend = (visitorId, file,type) => {
  const visitorProfileImage = new FormData();
  visitorProfileImage.append("visitorProfileImage", file);
  return privateAxios
    .post(`/api/visitors/upload/image/${visitorId}/${type}`, visitorProfileImage)
    .then((data) => data.data);
};
