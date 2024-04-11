import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';

const WorkHoursPieChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    if (data && data.content && data.content.length > 0) {
      const processedData = processData(data.content);

      const options = {
        chart: {
          type: 'pie',
          height: 300,
        },
        title: {
          text: 'Work Hours Distribution',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f} hours</b>',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:.2f} hours',
            },
          },
        },
        series: [
          {
            name: 'Work Hours',
            colorByPoint: true,
            data: processedData,
          },
        ],
      };

      setChartOptions(options);
    }
  }, [data]);

  const processData = (attendanceData) => {
    const employeeWorkHours = {};

    // Calculate total work hours for each employee
    attendanceData.forEach((entry) => {
      const totalHours = calculateTotalHours(entry?.inTime, entry?.outTime?entry.outTime:new Date().getHours+":"+new Date().getMinutes);
      if (employeeWorkHours.hasOwnProperty(entry.employeeName)) {
        employeeWorkHours[entry.employeeName] += totalHours;
      } else {
        employeeWorkHours[entry.employeeName] = totalHours;
      }
    });

    // Convert data to Highcharts format
    const pieChartData = Object.keys(employeeWorkHours).map((employeeName) => ({
      name: employeeName,
      y: employeeWorkHours[employeeName],
    }));

    return pieChartData;
  };

  const calculateTotalHours = (inTime, outTime) => {
    const inTimeParts = inTime.split(':');
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

export default React.memo(WorkHoursPieChart);
