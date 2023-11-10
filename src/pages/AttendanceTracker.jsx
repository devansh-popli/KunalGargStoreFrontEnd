import React, { useEffect, useState } from "react";
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
function AttendanceTracker() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
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

  return (
    <Container className="mt-4">
      <h4 className="fw-bold">Attendance</h4>

      <Row>
        <Col md={4}>
        <AttendanceForm employees={employees} />
        </Col>
        <Col md={8}>
        <AttendanceTable attendanceRecords={attendanceRecords} />
        </Col>
      </Row>
    </Container>
  );
}

export default AttendanceTracker;
