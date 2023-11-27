import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getAttendanceDataFromBackendByMonth } from "../services/EmployeeDataService";
import { toast } from "react-toastify";

const AttendanceChartMonthly = () => {
  const [chartOptions, setChartOptions] = useState(null);
//   const [data, setData] = useState(null);

  useEffect(() => {
    // let data=null
    getAttendanceDataFromBackendByMonth(
      new Date().getMonth()+1,
      new Date().getFullYear()
    )
      .then((data) => {
        // setData(res);
        if (data && data.content && data.content.length > 0) {
            const processedData = processData(data.content);
      console.log(processedData)
      const options = {
        chart: {
          type: "line", // Use area chart for better visibility
          width: 700,
          height: 400,
        },
        title: {
          text: "Monthly Overview",
        },
        subtitle: {
          text: `Data for ${processedData.month}`,
        },
        xAxis: {
          categories: processedData.categories,
          title: {
            text: "Date",
          },
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          title: {
            text: "Value",
          },
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}",
        },
        plotOptions: {
          area: {
            stacking: "normal",
            lineColor: "#666666",
            lineWidth: 1,
            marker: {
              lineWidth: 1,
              lineColor: "#666666",
            },
          },
        },
        series: [
          ...processedData.workHours,
          ...processedData.overtimeHours,
          ...processedData.absentDays,
        ],
      };
      
      
      

      setChartOptions(options);          }
      })
      .catch((error) => {
        toast.error("Error While Getting Chart Details");
      });
    
  }, []);
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const processData = (attendanceData) => {
    const categories = [];
    const workHoursSeries = [];
    const overtimeHoursSeries = [];
    const absentDaysSeries = [];
    let month = null;
  
    // Identify unique employee names
    const employeeNames = Array.from(
      new Set(attendanceData.map((entry) => entry.employeeName))
    );
  
    // Process data for each employee
    employeeNames.forEach((employeeName) => {
      const employeeData = attendanceData.filter(
        (entry) =>
          entry.employeeName === employeeName &&
          new Date(entry.attendanceDate).getMonth() === new Date().getMonth()
      );
  
      const totalWorkHours = employeeData.reduce((sum, entry) => {
        const totalHours = calculateTotalHours(
          entry.inTime,
          entry.outTime || getCurrentTime()
        );
        return sum + totalHours;
      }, 0);
  
      const totalOvertimeHours = Math.max(totalWorkHours - employeeData.length * 8, 0);
      const totalAbsentDays = employeeData.filter((entry) => !entry.outTime).length;
  
      if (!month) {
        month = new Date(employeeData[0]?.attendanceDate).toLocaleString("default", {
          month: "long",
        });
      }
  
      // Push total values to series
      workHoursSeries.push({
        name: `Work Hours - ${employeeName}`,
        data: [totalWorkHours],
      });
  
      overtimeHoursSeries.push({
        name: `Overtime Hours - ${employeeName}`,
        data: [totalOvertimeHours],
      });
  
      absentDaysSeries.push({
        name: `Absent Days - ${employeeName}`,
        data: [totalAbsentDays],
      });
    });
  
    return {
      categories: ["Current Month"],
      workHours: workHoursSeries,
      overtimeHours: overtimeHoursSeries,
      absentDays: absentDaysSeries,
      month,
    };
  };
  
  
  
  
  
  const calculateTotalHours = (inTime, outTime) => {
    const inTimeParts = inTime?.split(":");
    const outTimeParts = outTime
      ? outTime.split(":")
      : [new Date().getHours, new Date().getMinutes()];

    const inDateTime = new Date(0, 0, 0, inTimeParts[0], inTimeParts[1]);
    const outDateTime = new Date(0, 0, 0, outTimeParts[0], outTimeParts[1]);

    const totalMilliseconds = outDateTime - inDateTime;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    return totalHours;
  };

  return  (
    <div className="mt-3">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  ) 
};

export default AttendanceChartMonthly;
