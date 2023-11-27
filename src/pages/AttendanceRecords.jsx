import { Container } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import AttendanceChart from "../components/AttendanceChart";
import WorkHoursPieChart from "../components/WorkHoursPieChart";
import { UserContext } from "../context/UserContext";
import AttendanceChartMonthly from "../components/AttendanceChartMonthly";
import AttendanceChart1 from "../components/AttendanceChart1";

const AttendanceRecords = () => {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    getEmployeeDataFromBackend()
      .then((data) => {
        setEmployees(data.content);
      })
      .catch((error) => {
        toast.error("ERROR occured file fetching employees");
      });
  }, []);
  const userContext = useContext(UserContext);
  return (
    <Container>
      <Row>
        <Col sm={4}>
        <AttendanceChart1 />
          <AttendanceChart data={userContext.monthlyAttendance} />
        </Col>
        <Col sm={8}>
          <Container className="mt-3 w-100">
            <AttendanceTable employeeList={employees} />
            
            {/* <AttendanceChartMonthly /> */}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AttendanceRecords;
