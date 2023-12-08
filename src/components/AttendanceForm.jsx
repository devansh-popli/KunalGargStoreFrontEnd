import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import {
  getAttendanceDataByDateFromBackend,
  saveAttendanceDataToBackend,
} from "../services/EmployeeDataService";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import EmployeeSearchBar from "./EmployeeSearchBar";

const AttendanceForm = React.memo(({ employees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const indianTimeZone = 'Asia/Kolkata';
const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: indianTimeZone });
const [day, month, year] = currentDate.split('/').map(Number);

const currentIndianDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [time, setTime] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [timeOut, setTimeOut] = useState("");
  const userContext = useContext(UserContext);
  const handleEmployeeChange = (searchTermN) => {
    // Perform your employee search logic here and update the searchResults state
    // For example, you can filter employees based on the search term
    // Replace this with your actual employee data and search logic
    if (searchTermN != "") {
      let filteredEmployees=""
      if(searchTermN.includes("EMP"))
      {
         filteredEmployees = employees.filter((employee) =>
        employee.empCode.toLowerCase().includes(searchTermN.toLowerCase())
      );
      }
      else{
         filteredEmployees = employees.filter((employee) =>
        employee.firstName.toLowerCase().includes(searchTermN.toLowerCase())
        );
      }
      setSearchResults(filteredEmployees.length>=5?filteredEmployees.slice(0,5):filteredEmployees);
    } else {
      setSearchResults([]);
    }
  };
const [searchTerm,setSearchTerm]=useState("")

  const handleTimeInChange = (event) => {
    setTime(event.target.value);
  };

  const handleTimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };

  const handleTimeInButtonClick = async () => {
    // Handle the logic for marking time in
    let oldattendance = null;
    if(selectedEmployee=="")
    {
      toast.error("employee is not selected")
      return
    }
    if(time!=null && time !="")
    {

    await getAttendanceDataByDateFromBackend(
      currentIndianDate,
      selectedEmployee
    ).then((data) => {
        oldattendance = data;
    });
    if(oldattendance.inTime && !oldattendance.outTime)
    {
      toast.error("First Fill Out time of old record!")
      return
    }
    let employee = employees.filter((employee) => {
      if (employee.empCode === selectedEmployee) return employee;
    });
    // if(oldattendance?.outTime<time){
    //   toast.warn("Intime should be before Outtime")
    //   return
    // }
    await saveAttendanceDataToBackend({
      // id: oldattendance?.id,
      empCode: selectedEmployee,
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
    }
    else{
      toast.error("Please select in time")
    }
  };

  const handleTimeOutButtonClick = async () => {
    // Handle the logic for marking time out
    if(selectedEmployee=="")
    {
      toast.error("employee is not selected")
      return
    }
    if( time!=null && time !="")
    {
    let oldattendance = null;
    await getAttendanceDataByDateFromBackend(
      currentIndianDate,
      selectedEmployee
    ).then((data) => {
        oldattendance = data;
    });
    if(!oldattendance.inTime)
    {
      toast.error("No In time is not there for this user!")
      return
    }
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
    }
    else{
      toast.error("Please select Out Time")
    }
  };

  // Dummy employee list, replace it with your actual list
  // const employeeList = ['Employee 1', 'Employee 2', 'Employee 3'];
  useEffect(() => {
    console.log("search ress")
    setSearchResults([]);
  }, [selectedEmployeeName]);
  const selectEmployee = (e,employee) => {
    try{
      e.preventDefault();
      console.log(employee)
      setSelectedEmployeeName(employee.firstName + " " + employee.lastName);
      setSelectedEmployee(employee.empCode);
    }
    catch(e)
    {
      console.log(e)
    }
  }
  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "400px", margin: "auto",borderRadius: '10px'  }} className="mt-1"
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
  <div className="d-flex flex-column me-2" style={{marginBottom:"20px"}}>
          <EmployeeSearchBar
            onSearch={handleEmployeeChange}
            selectedEmployeeName={selectedEmployeeName}
            setSelectedEmployeeName={setSelectedEmployeeName}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {/* Render your search results or other components based on the search */}

          <List
            class={"bg-white border-1 shadow p-0"}
            
            style={{
              width: "216px",
              position: "absolute",
              borderRadius: "5px",
              top: "160px",
              zIndex: 100
            }}
          >
            {searchResults.map((employee) => (
              <ListItem
                key={employee.id}
                style={{ cursor: "pointer", borderBottom: "1px solid #dcdcdc" }}
                onClick={(e) => selectEmployee(e,employee)}
              >
                <ListItemText
                  primary={employee.firstName + " " + employee.lastName}
                />
              </ListItem>
            ))}
          </List>
        </div>
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
});

export default AttendanceForm;
