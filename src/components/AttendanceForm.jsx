import {
  Autocomplete,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import {
  getAttendanceDataByDateFromBackend,
  saveAttendanceDataToBackend,
} from "../services/EmployeeDataService";
import EmployeeSearchBar from "./EmployeeSearchBar";
import { Card } from "react-bootstrap";

const AttendanceForm = React.memo(({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const indianTimeZone = "Asia/Kolkata";
  const currentDate = new Date().toLocaleDateString("en-IN", {
    timeZone: indianTimeZone,
  });
  const [day, month, year] = currentDate.split("/").map(Number);

  const currentIndianDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [time, setTime] = useState(
    new Date().getHours() + ":" + new Date().getMinutes()
  );
  const [isManualEdit, setIsManualEdit] = useState(false);
  useEffect(() => {
    const intverl = setInterval(() => {
      if (!isManualEdit) {
        const hours = new Date().getHours().toString().padStart(2, "0");
        const minutes = new Date().getMinutes().toString().padStart(2, "0");
        const sec = new Date().getSeconds().toString().padStart(2, "0");
        setTime(`${hours}:${minutes}:${sec}`);
      }
    }, 1000);
    return () => clearInterval(intverl);
  }, [isManualEdit]);
  const [searchResults, setSearchResults] = useState([]);
  const [timeOut, setTimeOut] = useState("");
  const userContext = useContext(UserContext);
  const handleEmployeeChange = (searchTermN) => {
    // Perform your employee search logic here and update the searchResults state
    // For example, you can filter employees based on the search term
    // Replace this with your actual employee data and search logic
    if (searchTermN != "") {
      let filteredEmployees = "";
      if (
        searchTermN.includes("EMP") ||
        !isNaN(searchTermN) ||
        searchTermN.includes("emp")
      ) {
        filteredEmployees = employees.filter((employee) =>
          employee.empCode.toLowerCase().includes(searchTermN.toLowerCase())
        );
      } else {
        filteredEmployees = employees.filter((employee) =>
          employee.firstName.toLowerCase().includes(searchTermN.toLowerCase())
        );
      }
      setSearchResults(
        filteredEmployees.length >= 5
          ? filteredEmployees.slice(0, 5)
          : filteredEmployees
      );
    } else {
      setSearchResults([]);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");

  const handleTimeInChange = (event) => {
    setIsManualEdit(true);
    setTime(event.target.value);
  };

  const handleTimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };

  const handleTimeInButtonClick = async () => {
    // Handle the logic for marking time in
    let oldattendance = null;
    // toast.success(selectedEmployee)
    if (!selectedEmployee) {
      toast.error("employee is not selected");
      return;
    }
    if (time != null && time != "") {
      await getAttendanceDataByDateFromBackend(
        currentIndianDate,
        selectedEmployee.empCode
      ).then((data) => {
        oldattendance = data;
      });
      if (oldattendance.inTime && !oldattendance.outTime) {
        toast.error("First Fill Out time of old record!");
        return;
      }
      let employee = employees.filter((employee) => {
        if (employee.empCode === selectedEmployee.empCode) return employee;
      });
      // if(oldattendance?.outTime<time){
      //   toast.warn("Intime should be before Outtime")
      //   return
      // }
      await saveAttendanceDataToBackend({
        // id: oldattendance?.id,
        empCode: selectedEmployee.empCode,
        employeeName: employee[0].firstName + " " + employee[0].lastName,
        inTime: time,
        outTime: null,
        attendanceDate: currentIndianDate,
      })
        .then((data) => {
          toast.success("Intime Updated Successfully");
          userContext.setUpdatedAttendance(data);
        })
        .catch((error) => {
          toast.error("Error while saving attendance");
        });
    } else {
      toast.error("Please select in time");
    }
    setIsManualEdit(false);
    setSelectedEmployee(null);
  };

  const handleTimeOutButtonClick = async () => {
    // Handle the logic for marking time out
    if (!selectedEmployee) {
      toast.error("employee is not selected");
      return;
    }
    if (time != null && time != "") {
      let oldattendance = null;
      await getAttendanceDataByDateFromBackend(
        currentIndianDate,
        selectedEmployee.empCode
      ).then((data) => {
        oldattendance = data;
      });
      if (!oldattendance.inTime) {
        toast.error("No In time is not there for this user!");
        return;
      }
      if (oldattendance.inTime > time) {
        toast.warn("Out time should be after Intime");
        return;
      }
      let employee = employees.filter((employee) => {
        if (employee.empCode === selectedEmployee.empCode) return employee;
      });
      await saveAttendanceDataToBackend({
        id: oldattendance?.id,
        empCode: selectedEmployee.empCode,
        employeeName: employee[0].firstName + " " + employee[0].lastName,
        inTime: oldattendance?.inTime,
        outTime: time,
        attendanceDate: currentIndianDate,
      })
        .then((data) => {
          toast.success("Outime Updated Successfully");
          userContext.setUpdatedAttendance(data);
        })
        .catch((error) => {
          toast.error("Error while saving attendance");
        });
    } else {
      toast.error("Please select Out Time");
    }
    setIsManualEdit(false);
    setSelectedEmployee(null);
  };

  // Dummy employee list, replace it with your actual list
  // const employeeList = ['Employee 1', 'Employee 2', 'Employee 3'];
  const filterOptions = (options, { inputValue }) => {
    // Customize this function based on your search logic
    return options.filter(
      (option) =>
        option.empCode.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.firstName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  return (
    <Card
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        borderRadius: "10px",
      }}
      className="mt-1"
    >
      <h5 className="fw-bold">Attendance</h5>
      {/* <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <InputLabel id="employee-label">Select Employee</InputLabel>
        <Select
          labelId="employee-label"
          id="employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          {employees.map((employee, index) => (
            <MenuItem key={index} value={employee.empCode}>
              {employee.firstName + " "}
              {employee.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <div className="d-flex flex-column me-2" style={{ marginBottom: "20px" }}>
        {/* <EmployeeSearchBar
          onSearch={handleEmployeeChange}
          selectedEmployeeName={selectedEmployeeName}
          setSelectedEmployeeName={setSelectedEmployeeName}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        /> */}
        {/* Render your search results or other components based on the search */}
        <Autocomplete
          options={employees}
          getOptionLabel={(employee) =>
            employee.empCode+" "+employee.firstName + " " + employee.lastName
          }
          filterOptions={filterOptions}
          onChange={(e,val)=>setSelectedEmployee(val)}
          value={selectedEmployee}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Employees"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>
      <TextField
        inputProps={{ style: { textTransform: "uppercase" } }}
        id="date"
        label="Date"
        type="date"
        disabled
        defaultValue={currentIndianDate}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: "20px" }}
      />

      <TextField
        inputProps={{ style: { textTransform: "uppercase" } }}
        id="time-in"
        label="Time"
        type="time"
        fullWidth
        value={time}
        onChange={handleTimeInChange}
        InputLabelProps={{
          shrink: true,
        }}
        // inputProps={{
        //   step: 300, // 5 minutes
        // }}
        style={{ marginBottom: "20px" }}
      />

      {/* <TextField autoComplete="off" inputProps={{ style: { textTransform: 'uppercase' } }} 
        id="time-out"
        label="Time Out"
        type="time"
        fullWidth
        value={timeOut}
        onChange={handleTimeOutChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 minutes
        }}
        style={{ marginBottom: '20px' }}
      /> */}
      <div className="d-flex justify-content-center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleTimeInButtonClick}
        >
          Time In
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleTimeOutButtonClick}
          style={{ marginLeft: "10px" }}
        >
          Time Out
        </Button>
      </div>
    </Card>
  );
});

export default React.memo(AttendanceForm);
