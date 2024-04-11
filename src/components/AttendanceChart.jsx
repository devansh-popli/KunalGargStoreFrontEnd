import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';

const AttendanceChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (data && data.content && data.content.length > 0) {
      const processedData = processData(data.content);

      const options = {
        chart: {
          type: 'line',
          width: 400, // Set the width to your desired value
          height: 300,
        },
        title: {
          text: 'Employee Attendance Overview',
        },
        subtitle: {
          text: `Data for ${processedData.month} of ${data.content[0]?.employeeName}`,
        },
        xAxis: {
          categories: processedData.categories,
          title: {
            text: 'Date',
          },
          labels: {
            enabled: false, // Set enabled to false to remove x-axis labels
          },
        },
        yAxis: {
          title: {
            text: 'Hours',
          },
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y} hours',
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'Work Hours',
            data: processedData.workHours,
          },
          {
            name: 'Overtime Hours',
            data: processedData.overtimeHours,
          },
      
          {
            name: 'Absent Days',
            data: processedData.absentDays,
          },
        ],
      };

      setChartOptions(options);
    }
  }, [data]);

  const processData = (attendanceData) => {
    const categories = [];
    const workHours = [];
    const overtimeHours = [];
    const leaveDays = [];
    const absentDays = [];
    let month = null;

    // Get the month and year from the first entry
    const firstEntry = attendanceData[0];
    const firstDate = new Date(firstEntry.attendanceDate);
    month = firstDate.toLocaleString('default', { month: 'long' });

    // Set a maximum date based on the current month
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Generate categories for the entire month or up to the current date
    for (let i = 1; i <= maxDate.getDate(); i++) {
      const date = `${firstDate.getFullYear()}-${(firstDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      categories.push(date);

      // Check if the date is in the future or in the current month
      if (new Date(date) > today && firstDate.getMonth() === today.getMonth()) {
        workHours.push(null);
        overtimeHours.push(null);
        leaveDays.push(null);
        absentDays.push(null);
      } else {
        // Check if there is data for the current date
        const entryForDate = attendanceData.find((entry) => entry.attendanceDate === date);
        if (entryForDate) {
            const now = new Date();
          const totalHours = calculateTotalHours(entryForDate?.inTime, entryForDate.outTime?entryForDate.outTime:now.getHours()+":"+now.getMinutes());
          workHours.push(totalHours);
          overtimeHours.push(Math.max(totalHours - 8, 0)); // Assuming 8 hours as regular work hours
          leaveDays.push(entryForDate.leave ? 1 : 0);
          absentDays.push(0); // Data available for the date
        } else {
          // No data available for the current date
          workHours.push(0);
          overtimeHours.push(0);
          leaveDays.push(0);
          absentDays.push(1); // Consider it as absent
        }
      }
    }

    return {
      categories,
      workHours,
      overtimeHours,
      leaveDays,
      absentDays,
      month,
    };
  };

  const calculateTotalHours = (inTime, outTime) => {
    const inTimeParts = inTime?.split(':');
    const outTimeParts = outTime?outTime.split(':'):[new Date().getHours,new Date().getMinutes()];

    const inDateTime = new Date(0, 0, 0, inTimeParts[0], inTimeParts[1]);
    const outDateTime = new Date(0, 0, 0, outTimeParts[0], outTimeParts[1]);

    const totalMilliseconds = outDateTime - inDateTime;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    return totalHours;
  };

  return data && data.content && data.content.length > 0 ? (
    <div className='mt-3'>
    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  ) : null;
};

export default React.memo(AttendanceChart);
