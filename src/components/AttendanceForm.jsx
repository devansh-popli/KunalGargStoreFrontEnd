import React, { useState } from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';

const AttendanceForm = ({employees}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [time, setTime] = useState('');
  const [timeOut, setTimeOut] = useState('');

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleTimeInChange = (event) => {
    setTime(event.target.value);
  };

  const handleTimeOutChange = (event) => {
    setTimeOut(event.target.value);
  };

  const handleTimeInButtonClick = () => {
    // Handle the logic for marking time in
    console.log('Time In: ', time);
  };

  const handleTimeOutButtonClick = () => {
    // Handle the logic for marking time out
    console.log('Time Out: ', timeOut);
  };

  // Dummy employee list, replace it with your actual list
  // const employeeList = ['Employee 1', 'Employee 2', 'Employee 3'];

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h5 className='fw-bold'>Attendance</h5>
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="employee-label">Select Employee</InputLabel>
        <Select
          labelId="employee-label"
          id="employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          {employees.map((employee, index) => (
            <MenuItem key={index} value={employee.id}>
              {employee.firstName+" "}{employee.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id="date"
        label="Date"
        type="date"
        disabled
        defaultValue={new Date().toISOString().split('T')[0]}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        id="time-in"
        label="Time"
        type="time"
        fullWidth
        value={time}
        onChange={handleTimeInChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 minutes
        }}
        style={{ marginBottom: '20px' }}
      />

      {/* <TextField
        id="time-out"
        label="Time Out"
        type="time"
        fullWidth
        value={timeOut}
        onChange={handleTimeOutChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 minutes
        }}
        style={{ marginBottom: '20px' }}
      /> */}

      <Button variant="contained" color="primary" onClick={handleTimeInButtonClick}>
        Time In
      </Button>

      <Button variant="contained" color="secondary" onClick={handleTimeOutButtonClick} style={{ marginLeft: '10px' }}>
        Time Out
      </Button>
    </Paper>
  );
};

export default AttendanceForm;
