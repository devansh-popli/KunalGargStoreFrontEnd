// EmployeeSearchBar.js
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

const EmployeeSearchBar = ({
  onSearch,
  selectedEmployeeName,
  setSelectedEmployeeName,
  searchTerm,
  setSearchTerm
}) => {
//   const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    // setSelectedEmployee("")
    const newSearchTerm = event.target.value;
//    console.log(newSearchTerm)
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };
  useEffect(() => {
//    console.log(selectedEmployeeName)
    if (selectedEmployeeName && selectedEmployeeName.length > 0) {
      setSearchTerm(selectedEmployeeName);
      setSelectedEmployeeName("")
    }
  }, [selectedEmployeeName]);
  return (
    <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }} 
      label="Search Employees"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={handleSearchChange}
    />
  );
};

export default React.memo(EmployeeSearchBar);
