import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import {
  getAttendanceDataByDateFromBackend,
  saveAttendanceDataToBackend,
} from "../services/EmployeeDataService";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const AttendanceForm = ({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  
const indianTimeZone = 'Asia/Kolkata';
const currentIndianDate = new Date().toLocaleDateString('en-IN', { timeZone: indianTimeZone }).split('/').reverse().join('-');


  const [time, setTime] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const userContext = useContext(UserContext);
  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleTimeInChange = (event) => {
    setTime(event.target.value);
  };

  const handleTimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };

  const handleTimeInButtonClick = async () => {
    // Handle the logic for marking time in
    console.log("Time In: ", time);
    let oldattendance = null;
    await getAttendanceDataByDateFromBackend(
      currentIndianDate,
      selectedEmployee
    ).then((data) => {
      if (data.id != null) {
        oldattendance = data;
      }
    });
    let employee = employees.filter((employee) => {
      if (employee.empCode === selectedEmployee) return employee;
    });
    if(oldattendance?.outTime<time){
      toast.warn("Intime should be before Outtime")
      return
    }
    console.log(employee);
    await saveAttendanceDataToBackend({
      id: oldattendance?.id,
      empCode: selectedEmployee,
      employeeName: employee[0].firstName + " " + employee[0].lastName,
      inTime: time,
      outTime: oldattendance?.outTime,
      attendanceDate: currentIndianDate,
    })
      .then((data) => {
        toast.success("Intime Updated Successfully");
        userContext.setUpdatedAttendance(data);
      })
      .catch((error) => {
        toast.error("Error while saving attendance");
      });
  };

  const handleTimeOutButtonClick = async () => {
    // Handle the logic for marking time out
    console.log("Time Out: ", time);
    let oldattendance = null;
    await getAttendanceDataByDateFromBackend(
      currentIndianDate,
      selectedEmployee
    ).then((data) => {
      if (data.id != null) {
        oldattendance = data;
      }
    });
    if(oldattendance.inTime>time){
      toast.warn("Out time should be after Intime")
      return
    }
    let employee = employees.filter((employee) => {
      if (employee.empCode === selectedEmployee) return employee;
    });
    await saveAttendanceDataToBackend({
      id: oldattendance?.id,
      empCode: selectedEmployee,
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
  };

  // Dummy employee list, replace it with your actual list
  // const employeeList = ['Employee 1', 'Employee 2', 'Employee 3'];

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}
    >
      <h5 className="fw-bold">Attendance</h5>
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
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
      </FormControl>

      <TextField
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
        id="time-in"
        label="Time"
        type="time"
        fullWidth
        value={time}
        onChange={handleTimeInChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 minutes
        }}
        style={{ marginBottom: "20px" }}
      />

      {/* <TextField
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
    </Paper>
  );
};

export default AttendanceForm;
