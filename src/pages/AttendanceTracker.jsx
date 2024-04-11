import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AttendanceChart from "../components/AttendanceChart";
import AttendanceForm from "../components/AttendanceForm";
import AttendanceTableOfToday from "../components/AttendanceTableOfToday";
import WorkHoursPieChart from "../components/WorkHoursPieChart";
import { UserContext } from "../context/UserContext";
import useJwtChecker from "../helper/useJwtChecker";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";
import { checkAccess } from "../auth/HelperAuth";
const AttendanceTracker = React.memo(() => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const userContext = useContext(UserContext);
  useEffect(() => {
    getEmployeeDataFromBackend()
      .then((data) => {
        setEmployees(data.content);
      })
      .catch((error) => {
        //        console.log("Internal Server Error while getting employees");
      });
  }, []);
  const jetChecker = useJwtChecker();
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
    <Container className="mt-2">
      <Row>
        {userContext.monthlyAttendance ||
          (checkAccess("Attendance Tracker", "canWrite") && (
            <Col sm={12} md={4}>
              {checkAccess("Attendance Tracker", "canWrite") && (
                <AttendanceForm employees={employees} />
              )}
              <AttendanceChart data={userContext.monthlyAttendance} />
              <WorkHoursPieChart data={userContext.dailyData} />
            </Col>
          ))}
        <Col
          sm={12}
          md={(userContext.monthlyAttendance || checkAccess("Attendance Tracker", "canWrite")) ? 8 : 12}
        >
          <AttendanceTableOfToday
            attendanceRecords={attendanceRecords}
            employeeList={employees}
          />
        </Col>
      </Row>
    </Container>
  );
});

export default React.memo(AttendanceTracker);
