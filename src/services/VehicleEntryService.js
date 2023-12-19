import { privateAxios } from "./AxiosService"

export const saveVehicleEntry=(formData)=>{
    return privateAxios.post("/api/vehicle-entries",formData).then(data=>data.data)
}
export const getVehicleEntry=()=>{
    return privateAxios.get("/api/vehicle-entries").then(data=>data.data)
}
export const getVehicle2Entry=()=>{
    return privateAxios.get("/api/v2/vehicle-entries").then(data=>data.data)
}
export const saveVehicleEntry2=(formData)=>{
    return privateAxios.post("/api/v2/vehicle-entries",formData).then(data=>data.data)
}

export const saveVehicleDocumentToBackend = (vehicleEntryId, file) => {
    const vehicleEntryProfileImage = new FormData();
    vehicleEntryProfileImage.append("vehicleProfileImage", file);
    return privateAxios
      .post(`/api/vehicle-entries/upload/image/${vehicleEntryId}`, vehicleEntryProfileImage)
      .then((data) => data.data);
  };

export const saveVehicleDocument2ToBackend = (vehicleEntryId, file,type) => {
    const vehicleEntryProfileImage = new FormData();
    vehicleEntryProfileImage.append("vehicleProfileImage", file);
    return privateAxios
      .post(`/api/v2/vehicle-entries/upload/image/${vehicleEntryId}/${type}`, vehicleEntryProfileImage)
      .then((data) => data.data);
  };