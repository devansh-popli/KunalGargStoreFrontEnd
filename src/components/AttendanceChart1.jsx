import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getAttendanceDataFromBackendByMonth } from "../services/EmployeeDataService";
import { toast } from "react-toastify";

const AttendanceChart1 = () => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    getAttendanceDataFromBackendByMonth(new Date().getMonth() + 1, new Date().getFullYear())
      .then((data) => {
        if (data && data.content && data.content.length > 0) {
          const processedData = processData(data.content);
          const options = {
            chart: {
              type: "column",
              width: 400,
              height: 320,
            },
            title: {
              text: "Monthly Overview",
            },
            subtitle: {
              text: `Data for ${processedData.month}`,
            },
            xAxis: {
              categories: processedData.employeeNames,
              title: {
                text: "Employee",
              },
            },
            yAxis: {
              title: {
                text: "Hours",
              },
            },
            tooltip: {
              headerFormat: "<b>{point.x}</b><br/>",
              pointFormat: "{series.name}: {point.y} days",
            },
            plotOptions: {
              column: {
                stacking: "normal",
              },
            },
            series: [
              ...processedData.presentDaysSeries, // New series for present days
            ],
          };

          setChartOptions(options);
        }
      })
      .catch((error) => {
        toast.error("Error While Getting Chart Details");
      });
  }, []);

  const processData = (attendanceData) => {
    const employeeNames = Array.from(new Set(attendanceData.map((entry) => entry.employeeName)));

    const workHoursSeries = employeeNames.map((employeeName) => {
      const totalWorkHours = calculateTotalWorkHours(employeeName, attendanceData);
      return {
        name: `Work Hours - ${employeeName}`,
        data: [totalWorkHours],
      };
    });

    const overtimeHoursSeries = employeeNames.map((employeeName) => {
      const totalOvertimeHours = calculateTotalOvertimeHours(employeeName, attendanceData);
      return {
        name: `Overtime Hours - ${employeeName}`,
        data: [totalOvertimeHours],
      };
    });

    const absentDaysSeries = employeeNames.map((employeeName) => {
      const totalAbsentDays = calculateTotalAbsentDays(employeeName, attendanceData);
      return {
        name: `Absent Days - ${employeeName}`,
        data: [totalAbsentDays],
      };
    });

    const presentDaysSeries = employeeNames.map((employeeName) => {
      const totalPresentDays = calculateTotalPresentDays(employeeName, attendanceData);
      return {
        name: `Present Days - ${employeeName}`,
        data: [totalPresentDays],
      };
    });

    const month = new Date(attendanceData[0]?.attendanceDate).toLocaleString("default", {
      month: "long",
    });

    return {
      employeeNames,
      workHours: workHoursSeries,
      overtimeHours: overtimeHoursSeries,
      absentDays: absentDaysSeries,
      presentDaysSeries, // New series for present days
      month,
    };
  };

  const calculateTotalWorkHours = (employeeName, attendanceData) => {
    const employeeData = attendanceData.filter(
      (entry) => entry.employeeName === employeeName && entry.outTime
    );

    return employeeData.reduce((total, entry) => {
      return total + calculateTotalHours(entry.inTime, entry.outTime);
    }, 0);
  };

  const calculateTotalOvertimeHours = (employeeName, attendanceData) => {
    const totalWorkHours = calculateTotalWorkHours(employeeName, attendanceData);
    return Math.max(totalWorkHours - attendanceData.length * 8, 0);
  };

  const calculateTotalAbsentDays = (employeeName, attendanceData) => {
    return attendanceData.filter(
      (entry) => entry.employeeName === employeeName && !entry.outTime
    ).length;
  };

  const calculateTotalPresentDays = (employeeName, attendanceData) => {
    const uniqueDates = new Set(); // Use a set to store unique dates
  
    attendanceData.forEach((entry) => {
      if (entry.employeeName === employeeName && entry.outTime) {
        // Extract date part from attendanceDate
        const date = entry.attendanceDate.split('T')[0];
  
        // Add the date to the set
        uniqueDates.add(date);
      }
    });
  
    // Return the count of unique dates
    return uniqueDates.size;
  };
  const calculateTotalHours = (inTime, outTime) => {
    const inTimeParts = inTime?.split(":");
    const outTimeParts = outTime.split(":");
    const inDateTime = new Date(0, 0, 0, inTimeParts[0], inTimeParts[1]);
    const outDateTime = new Date(0, 0, 0, outTimeParts[0], outTimeParts[1]);
    const totalMilliseconds = outDateTime - inDateTime;
    return totalMilliseconds / (1000 * 60 * 60);
  };

  return (
    <div className="mt-3">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AttendanceChart1;
