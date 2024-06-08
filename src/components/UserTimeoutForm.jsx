import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { ROLE_SUPERVISOR } from "../constants/constants";
import { privateAxios } from "../services/AxiosService";
// import { format, utcToZonedTime } from 'date-fns-tz';
const UserTimeoutForm = ({timeOut}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [timeoutDate, setTimeoutDate] = useState("");
  const role = ROLE_SUPERVISOR

  useEffect(() => {
    if (role) {
      privateAxios
        .get(`/users/role/${role}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };
  const [timeoutTime, setTimeoutTime] = useState('');

  const handleDateChange = (event) => {
    setTimeoutDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTimeoutTime(event.target.value);
  };
  useEffect(() => {
    const now = new Date();
    const timeZone = 'Asia/Kolkata';

    // const zonedDate = utcToZonedTime(now, timeZone);
    const currentDate = new Date().toISOString().split("T")[0]
    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false })

    // setTimeoutDate(currentDate);
    // const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
    setTimeoutDate(currentDate);
    setTimeoutTime(currentTime);
  }, []);
  return (
    <form>
      <FormControl fullWidth margin="normal">
        <InputLabel id="user-label">Assign to Supervisor</InputLabel>
        <Select
          labelId="user-label"
          value={selectedUser}
          onChange={handleUserChange}
        >
          {users?.content?.map((user) => (
            <MenuItem key={user.userId} value={user.userId}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Timeout Date"
        type="date"
        value={timeoutDate}
        onChange={handleDateChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Timeout Time"
        type="time"
        value={timeoutTime}
        onChange={handleTimeChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" onClick={()=>timeOut({selectedUser,timeoutDate,timeoutTime})}>
        Set Timeout
      </Button>
    </form>
  );
};

export default UserTimeoutForm;
