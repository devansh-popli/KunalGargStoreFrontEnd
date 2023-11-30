import React, { useContext, useEffect, useState } from "react";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTable from "../components/AttendanceTable";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { List, ListItem } from "@mui/material";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";
import { Col, Row } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import AttendanceChart from "../components/AttendanceChart";
import WorkHoursPieChart from "../components/WorkHoursPieChart";
import AttendanceTableOfToday from "../components/AttendanceTableOfToday";
const AttendanceTracker=React.memo(()=> {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const userContext=useContext(UserContext)
  useEffect(() => {
    getEmployeeDataFromBackend()
      .then((data) => {
        setEmployees(data.content);
      })
      .catch((error) => {
        console.log("Internal Server Error while getting employees");
      });
  }, []);
  const markAttendance = () => {
    // Your logic to mark attendance goes here
    // You may want to send a request to your server to record attendance
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const randomEmployee =
      employees[Math.floor(Math.random() * employees.length)];

    const newRecord = {
      id: attendanceRecords.length + 1,
      date: currentDate,
      employeeName: randomEmployee.name,
      timeIn: currentTime,
      timeOut: "", // You can update this when implementing time out functionality
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
  };
  return userContext.isLogin ? (
    <Container className="mt-2">
      <Row>
        <Col md={4}>
        <AttendanceForm employees={employees} />
        <AttendanceChart  data={userContext.monthlyAttendance}/>
        <WorkHoursPieChart data={userContext.dailyData}/>
        </Col>
        <Col md={8}>
        <AttendanceTableOfToday attendanceRecords={attendanceRecords} employeeList={employees} />
        </Col>
      </Row>
    </Container>
  ):<Navigate to={"/"}/>;
})

export default AttendanceTracker;
