import React, { useState } from 'react';
import Sidebar from './Sidebar';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const SessionPage = () => {
  const { auth } = useAuth();
  const teacherId = auth.teacherId;
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [subject, setSubject] = useState('');
  const [sessionPrice, setSessionPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const axiosPrivate = useAxiosPrivate();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormError(''); // Clear the general error when closing the dialog
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if any required field is empty
    if (!dayOfWeek || !startHour || !startMinute || !endHour || !endMinute || !status || !paymentStatus || !subject || !sessionPrice) {
      setFormError('Please fill in all the required fields.');
      return;
    }

    // Validate hours and minutes
    const isValidTime = (hour, minute) => {
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    };

    if (!isValidTime(startHour, startMinute) || !isValidTime(endHour, endMinute)) {
      setFormError('Invalid time input.');
      return;
    }

    console.log(teacherId);
    try {
      const response = await axiosPrivate.post('http://localhost:3001/sessions/create', {
        teacherId: teacherId,
        startTime: `${dayOfWeek} ${startHour}:${startMinute}`,
        endTime: `${dayOfWeek} ${endHour}:${endMinute}`,
        status,
        paymentStatus,
        subject,
        sessionPrice,
      });

      console.log(response.data);
      handleClose(); // Close the popup after submitting
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={10} container justifyContent="center" alignItems="center">
        <Button variant="contained" color="primary" onClick={handleOpen} style={{ margin: '10px' }}>
          Make New Session
        </Button>
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Session Page</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="day-of-week-label">Day of the Week</InputLabel>
                <Select
                  labelId="day-of-week-label"
                  id="day-of-week"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  label="Day of the Week"
                  required
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  {/* Add other days as needed */}
                </Select>
              </FormControl>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  label="Start Hour"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  inputProps={{ min: 0, max: 23 }}
                  required
                />
                <TextField
                  label="Start Minute"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  inputProps={{ min: 0, max: 59 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  label="End Hour"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  inputProps={{ min: 0, max: 23 }}
                  required
                />
                <TextField
                  label="End Minute"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  inputProps={{ min: 0, max: 59 }}
                  required
                />
              </div>

              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  required
                >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="payment-status-label">Payment Status</InputLabel>
                <Select
                  labelId="payment-status-label"
                  id="payment-status"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  label="Payment Status"
                  required
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                margin="normal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <TextField
                label="Session Price"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={sessionPrice}
                onChange={(e) => setSessionPrice(e.target.value)}
                required
              />

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>

              {formError && <Typography variant="body2" color="error">{formError}</Typography>}
            </form>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default SessionPage;
