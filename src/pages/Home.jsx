// Home.jsx

import React, { useContext, useEffect, useState } from "react";
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
import { getAttendanceDataFromBackendByMonth, getAttendanceDataOfTodayFromBackend, getEmployeeDataFromBackend } from "../services/EmployeeDataService";
import { toast } from "react-toastify";
import { getVisitorData } from "../services/VisitorService";

const Home = () => {
  // Dummy data for visitors and employees
  const [recentAttendance,setRecentAttendance]=useState([])
  const [todayAttendance,setTodayAttendance]=useState([])
  const [employees, setEmployees] = useState([]);
  const [visitors,setVisitors] =useState([])
  const indianTimeZone = "Asia/Kolkata";
  const currentIndianDate = new Date()
    .toLocaleDateString("en-IN", { timeZone: indianTimeZone })
    .split("/")
    .reverse()
    .join("-");
  useEffect(() => {
    getAttendanceDataOfTodayFromBackend(currentIndianDate).then(data=>{
setTodayAttendance(data.content)
    }).catch(error=>{
      toast.error("Error while fetching Attendance Records of Today")
    })
    getAttendanceDataFromBackendByMonth(new Date().getMonth()+1,new Date().getFullYear()).then(data=>{
      let groupedData=[]
      data.content.forEach(attendance=>{
        if(groupedData.filter(rec=>rec?.employeeName==attendance.employeeName).length<=0)
        groupedData.push(attendance)
      })
      setRecentAttendance(groupedData)
    }).catch(error=>{
      toast.error("error while fetching attendance")
    })
    getEmployeeDataFromBackend()
      .then((data) => {
        setEmployees(data.content);
      })
      .catch((error) => {
        toast.error("Error while fetching employees data");
      });
    getVisitorData()
      .then((data) => {
        setVisitors(data);
      })
      .catch((error) => {
        toast.error("Error while fetching Visitors data");
      });
  }, []);

  const daysThreshold = 30; 
const currentDate = new Date();
const thresholdDate = new Date();
const calculateRecentJoiners=()=>{
  thresholdDate.setDate(currentDate.getDate() - daysThreshold);
  
  const recentJoiners = employees.filter((employee) => {
    const joinDate = new Date(employee.dateOfJoining);
    return joinDate >= thresholdDate && joinDate <= currentDate;
  });
  return recentJoiners.length
}
  // Dummy data for recent attendance
   // Count the occurrences of each purpose
   const purposeCounts = visitors.reduce((acc, entry) => {
    const purpose = entry.purpose.toLowerCase();
    acc[purpose] = (acc[purpose] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the pie chart
  const pieData = Object.entries(purposeCounts).map(([purpose, count]) => ({
    name: purpose,
    y: count,
  }));

  const visitorChartOptions = {
    chart: {
      type: "pie"
    },
    title: {
      text: "Visitors Purpose Distribution"
    },
    series: [{
      name: "Visitors",
      data: pieData,
    }],
  };

  const maleCount = employees.filter((employee) => employee.gender === "Male").length;
const femaleCount = employees.filter((employee) => employee.gender === "Female").length;

// Calculate the ratio
const totalEmployees = maleCount + femaleCount;
const maleRatio = (maleCount / totalEmployees) * 100;
const femaleRatio = (femaleCount / totalEmployees) * 100;

// Create the chart options
const genderRatioChartOptions = {
  chart: {
    type: "pie",
  },
  title: {
    text: "Employee Gender Ratio",
  },
  series: [
    {
      name: "Gender",
      colorByPoint: true,
      data: [
        {
          name: "Male",
          y: maleRatio,
        },
        {
          name: "Female",
          y: femaleRatio,
        },
      ],
    },
  ],
};
  // Function to calculate work hours based on in and out times
  const calculateWorkHours = (inTime, outTime) => {
    const inTimeParts = inTime?.split(':');
    const outTimeParts = outTime?outTime.split(':'):[new Date().getHours,new Date().getMinutes()];
    const inDateTime = new Date(0, 0, 0, inTimeParts[0], inTimeParts[1]);
    const outDateTime = new Date(0, 0, 0, outTimeParts[0], outTimeParts[1]);
    const totalMilliseconds = outDateTime - inDateTime;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    return totalHours;
  };

  // Highcharts configuration for different charts
  const attendanceChartOptions = {
    title: {
      text: "Every Employees Last Attendance",
    },
    xAxis: {
      categories: recentAttendance.map((data) => `${data.employeeName} - ${data.attendanceDate}`),
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
  
  const getDepartment=()=>{
 return employees.reduce((acc,data)=>{
      const department=data.department
      acc[department]=(acc[department]||0)+1
      return acc;
    },{})
  }
  const employeeCountChartOptions = {
    title: {
      text: "Employee Count by Department",
    },
    xAxis: {
      categories: Object.keys(getDepartment()||{}),
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
        data: Object.values(getDepartment()||{}), // Replace with actual employee count by department
      },
    ],
  };
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const jetChecker = useJwtChecker();
  return userContext.isLogin ? (
    <Container className="mt-3">
      {/* Cards for Recent Visitors and Employee Information */}
      <h3 className="fw-bold">Dashbord</h3>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Number of Visitors</h6>
              <h3 className="fw-bold">{visitors.filter(visitor=>visitor.timeOut=='').length}</h3>
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
              <h6 className="fw-bold">Employees Present Today</h6>
              <h3 className="fw-bold">{todayAttendance.length}</h3>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent className="text-center">
              <h6 className="fw-bold">Recent Joiners</h6>
              <h3 className="fw-bold">{calculateRecentJoiners()}</h3>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} className="mt-1">
          {/* Employee Attendance Chart */}
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={visitorChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={genderRatioChartOptions}
                />
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Grid>
    </Container>
  ) : (
    <Navigate to="/" />
  );
};

export default Home;
