import React, { useEffect, useState } from "react";
import VehicleEntryRecordsJCB from "./VehicleEntryRecordsJCB";
import { getVehicleEntry } from "../services/VehicleEntryService";

const JCBorHYDRARecords = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTerm1, setSearchTerm1] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [data, setData] = useState([]);
    useEffect(() => {
        getVehicleEntry()
          .then((data) => {
            setData(data);
          })
          .catch((error) => {
            toast.error("Internal Server Error");
          });
      }, []);
    const sortedRows = [...data].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        return (sortDirection === "asc" ? 1 : -1) * aValue?.localeCompare(bValue);
      });
    
      const filteredRows = sortedRows.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString()?.toLowerCase()?.includes(searchTerm)
        )
      );
      const filteredRows1 = sortedRows.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString()?.toLowerCase()?.includes(searchTerm1)
        )
      );
  return (
    <div>
      <VehicleEntryRecordsJCB sortDirection={sortDirection} setSortDirection={setSortDirection} setSortColumn={setSortColumn} sortColumn={sortColumn} filteredRows={filteredRows.filter(data=>!data.outDate)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="mt-2">
      <VehicleEntryRecordsJCB sortDirection={sortDirection} setSortDirection={setSortDirection} setSortColumn={setSortColumn} sortColumn={sortColumn} filteredRows={filteredRows1.filter(data=>data.outDate)} searchTerm={searchTerm1} setSearchTerm={setSearchTerm1}/>
      </div>
    </div>
  );
};

export default JCBorHYDRARecords;
