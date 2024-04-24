import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import AttendanceChart from "../components/AttendanceChart";
import AttendanceChart1 from "../components/AttendanceChart1";
import AttendanceTable from "../components/AttendanceTable";
import { UserContext } from "../context/UserContext";
import useJwtChecker from "../helper/useJwtChecker";
import { getEmployeeDataFromBackend } from "../services/EmployeeDataService";

const AttendanceRecords = React.memo(() => {
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
  const jetChecker = useJwtChecker();
  const userContext = useContext(UserContext);
  return (
    <Container>
      <Row>
        {userContext.monthlyAttendance && (
          <Col sm={12} md={4}>
            <AttendanceChart1 />
            <AttendanceChart data={userContext.monthlyAttendance} />
          </Col>
        )}
        <Col sm={12} md={userContext.monthlyAttendance ? 8 : 12}>
          <div className="mt-3 w-100">
            <AttendanceTable employeeList={employees} />

            {/* <AttendanceChartMonthly /> */}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

export default React.memo(AttendanceRecords);
