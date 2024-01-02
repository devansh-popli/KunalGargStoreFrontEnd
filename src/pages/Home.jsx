// Home.jsx

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Container,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { UserContext } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import useJwtChecker from "../helper/useJwtChecker";

const Home = () => {
  // Dummy data for visitors and employees
  const visitors = [
    { name: 'Visitor 1', phone: '1234567890', entryTime: 'Morning' },
    { name: 'Visitor 2', phone: '9876543210', entryTime: 'Afternoon' },
    { name: 'Visitor 3', phone: '5555555555', entryTime: 'Evening' },
    // Add more visitor data as needed
  ];
  const employees = [
    {
      id: 1,
      empCode: "EMP001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "9876543210",
      department: "IT",
      designation: "Software Developer",
      monthlySalary: "$5000",
      // Add more employee details
    },
    // Add more employee data as needed
  ];

  // Dummy data for recent attendance
  const recentAttendance = [
    {
      id: 1,
      empCode: "EMP001",
      employeeName: "John Doe",
      inTime: "09:00 AM",
      outTime: "05:00 PM",
      attendanceDate: new Date(),
    },
    // Add more attendance data as needed
  ];
  const visitorEntryTimeChartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Visitor Entry Time Distribution',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
      },
    },
    series: [
      {
        name: 'Visitor Entry Times',
        colorByPoint: true,
        data: visitors.map((visitor) => ({ name: visitor.entryTime, y: 1 })),
      },
    ],
  };
  // Function to calculate work hours based on in and out times
  const calculateWorkHours = (inTime, outTime) => {
    // Implement your logic to calculate work hours
    return 8; // Assuming 8 hours for now
  };

  // Highcharts configuration for different charts
  const attendanceChartOptions = {
    title: {
      text: "Employee Attendance Chart",
    },
    xAxis: {
      categories: recentAttendance.map((data) => data.employeeName),
    },
    yAxis: {
      title: {
        text: "Total Hours",
      },
    },
    series: [
      {
        type: "column",
        name: "Work Hours",
        data: recentAttendance.map((data) =>
          calculateWorkHours(data.inTime, data.outTime)
        ),
      },
    ],
  };

  const employeeCountChartOptions = {
    title: {
      text: "Employee Count by Department",
    },
    xAxis: {
      categories: ["HR", "IT", "Finance", "Sales", "Operations"],
    },
    yAxis: {
      title: {
        text: "Number of Employees",
      },
    },
    series: [
      {
        type: "bar",
        name: "Number of Employees",
        data: [15, 20, 10, 25, 30], // Replace with actual employee count by department
      },
    ],
  };
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  const jetChecker=useJwtChecker()
  return userContext.isLogin?(
    <Container className="mt-3">
      {/* Cards for Recent Visitors and Employee Information */}
     <h3 className="fw-bold">Dashbord</h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Number of Visitors</h6>
              <h3 className="fw-bold">{visitors.length}</h3>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Number of Employees</h6>
              <h3 className="fw-bold">{employees.length}</h3>
            </CardContent>
          </Card>
        </Grid>

        {/* Add another card for additional information */}
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Number of Employees</h6>
              <h3 className="fw-bold">{employees.length}</h3>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Number of Employees</h6>
              <h3 className="fw-bold">{employees.length}</h3>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
          <Grid container spacing={3} className="mt-1">
            {/* Employee Attendance Chart */}
            <Grid item xs={12} sm={5}>
              <Card>
                <CardContent>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={attendanceChartOptions}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Employee Count by Department Chart */}
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                 
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={employeeCountChartOptions}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <HighchartsReact highcharts={Highcharts} options={visitorEntryTimeChartOptions} />
              </CardContent>
            </Card>
          </Grid>
          </Grid>
      </Grid>
    </Container>
  ):<Navigate to="/"/>;
};

export default Home;
