import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {TextField,Button,Typography,Paper,Grid,Dialog,DialogTitle,DialogContent,MenuItem,FormControl,InputLabel,Select,
} from '@mui/material';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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
  const [sessionsData, setSessionsData] = useState([]);
  const navigate = useNavigate();
  


  

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleUpdateSession = (session) => {
    // Set the existing session data to the state for the update form
    setUpdateSessionData(session);
  
    // Extract and set values for the update form fields
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    setDayOfWeek(session.startTime.split(' ')[0]);
    setUpdatedStartHour(startTime.getHours().toString());
    setUpdatedStartMinute(startTime.getMinutes().toString());
    setUpdatedEndHour(endTime.getHours().toString());
    setUpdatedEndMinute(endTime.getMinutes().toString());
    setUpdatedStatus(session.status);
    setUpdatedPaymentStatus(session.paymentStatus);
    setUpdatedSubject(session.subject);
    setUpdatedSessionPrice(session.sessionPrice);
  
    // Open the update dialog
    setUpdateDialogOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !dayOfWeek ||
      !startHour ||
      !startMinute ||
      !endHour ||
      !endMinute ||
      !status ||
      !paymentStatus ||
      !subject ||
      !sessionPrice
    ) {
      setFormError('Please fill in all the required fields.');
      return;
    }

    const isValidTime = (hour, minute) => {
      return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
    };

    if (!isValidTime(startHour, startMinute) || !isValidTime(endHour, endMinute)) {
      setFormError('Invalid time input.');
      return;
    }

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
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSessionsData = async () => {
      try {
        const response = await axiosPrivate.get(`/teachers/myStudents/${auth.teacherId}`);
        setSessionsData(response.data.studentsData || []);
      } catch (error) {
        console.error('Error fetching sessions data:', error);
      }
    };

    fetchSessionsData();
  }, [ handleUpdateSession, handleOpen]);

  const handleShowStudents = (session) => {
    setSelectedSession(session);
    setSelectedStudents(session.students);
  };
const [selectedStudents, setSelectedStudents] = useState(null);
const [selectedSession, setSelectedSession] = useState(null);
  

//update
const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
const [updateSessionData, setUpdateSessionData] = useState(null);



const handleUpdateDialogClose = () => {
  // Reset the state values when the update dialog is closed
  setUpdateSessionData(null);
  setUpdateDialogOpen(false);

  // Reset values for the update form fields
  setUpdatedStartHour('');
  setUpdatedStartMinute('');
  setUpdatedEndHour('');
  setUpdatedEndMinute('');
  setUpdatedStatus('');
  setUpdatedPaymentStatus('');
  setUpdatedSubject('');
  setUpdatedSessionPrice('');
  setDayOfWeek('');
};

const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  
  try {
    
    const response = await axiosPrivate.put(`http://localhost:3001/sessions/updateSession/${updateSessionData.sessionId}`, {
      teacherId: teacherId,
      startTime: `${dayOfWeek} ${updatedStartHour}:${updatedStartMinute}`,
      endTime: `${dayOfWeek} ${updatedEndHour}:${updatedEndMinute}`,
      status: updatedStatus,
      paymentStatus: updatedPaymentStatus,
      subject: updatedSubject,
      sessionPrice: updatedSessionPrice,
    });

    console.log(response.data);

    handleUpdateDialogClose();
  } catch (error) {
    console.error(error);
    
  }
  

};

const [updatedStartHour, setUpdatedStartHour] = useState('');
const [updatedStartMinute, setUpdatedStartMinute] = useState('');
const [updatedEndHour, setUpdatedEndHour] = useState('');
const [updatedEndMinute, setUpdatedEndMinute] = useState('');
const [updatedStatus, setUpdatedStatus] = useState('');
const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');
const [updatedSubject, setUpdatedSubject] = useState('');
const [updatedSessionPrice, setUpdatedSessionPrice] = useState('');

const YourFab = styled(Fab)({
  position:'relative',
  
});



return (
  <Grid container>
    <Grid item xs={2}>
      <Sidebar />
    </Grid>
    <Grid item xs={10} container direction="row" alignItems="flex-start">
      {/* Horizontally-scrollable container for session boxes */}
      <Paper
        elevation={3}
        style={{
          padding: '20px',
          margin: '20px',
          borderRadius: '20px',
          overflowX: 'auto',  
          scrollbarWidth: 'thin',  // For Firefox
    scrollbarColor: '#074c84 #f0f0f0',  // For Firefox
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: 'fit-content',  // Adjust the width as needed
          }}
        >
          {sessionsData.map((session) => (
            <Paper
              key={session.sessionId}
              elevation={3}
              style={{ padding: '10px', margin: '10px', borderRadius: '15px', width: '300px' }}
            >
              <Typography variant="h6">{session.subject}</Typography>
              <Typography>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Start Time:</span> {session.startTime}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>End Time:</span> {session.endTime}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Status:</span> {session.status}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Payment Status:</span> {session.paymentStatus}
              </Typography>
              <Typography>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Session Price:</span> {session.sessionPrice}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleShowStudents(session)}
                style={{ marginTop: '10px' }}
              >
                Show Students
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleUpdateSession(session)}
                style={{ marginTop: '10px', marginLeft: '10px' }}
              >
                Update
              </Button>
                  </Paper>
                ))}
              </div>
            </Paper>

            {/* Student Information Section */}
            <Paper
            elevation={3}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: '20px',
              margin: '20px',
              borderRadius: '20px',
              width: 'fit-content',
              overflowY: 'auto',
              maxHeight: '80vh',
              marginLeft: '20px',
              marginBottom: '200px'
            }}
          >
            {selectedStudents && selectedStudents.length > 0 ? (
                    selectedStudents.map((student) => (
                      <Paper
                        key={student.studentId}
                        elevation={3}
                        style={{ padding: '10px', margin: '10px', borderRadius: '15px', width: 'fit-content' }}
                      >
                        <Typography variant="h6">{`${selectedSession ? selectedSession.subject : ''}`}</Typography>
                        <Typography>
                          <span style={{ fontWeight: 'bold', color: '#074c84' }}>Name:</span> {`${student.firstName} ${student.lastName}`}
                        </Typography>
                        <Typography>
                          <span style={{ fontWeight: 'bold', color: '#074c84' }}>Email:</span> {`${student.email}`}
                        </Typography>
                        
                      </Paper>
                    ))
                  ) : (
                    <Typography>No students selected.</Typography>
                  )}
                </Paper>
              <YourFab
                color="primary"
                aria-label="add"
                style={{
                  position: 'fixed',
                  bottom: '2rem',  // You can adjust the value as needed
                  right: '2rem',   // You can adjust the value as needed
                }}
                onClick={handleOpen}
              >
                <AddIcon />
              </YourFab>
               <Dialog open={isUpdateDialogOpen} onClose={handleUpdateDialogClose} maxWidth="md" fullWidth>
              <DialogTitle>Update Session</DialogTitle>
              <DialogContent>
                <form onSubmit={handleUpdateSubmit}>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="day-of-week-update-label">Day of the Week</InputLabel>
                  <Select
                    labelId="day-of-week-update-label"
                    id="day-of-week-update"
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
                  </Select>
                </FormControl>
                <TextField
              label="Start Hour"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={updatedStartHour}
              onChange={(e) => setUpdatedStartHour(e.target.value)}
              inputProps={{ min: 0, max: 23 }}
              required
            />

            <TextField
              label="Start Minute"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={updatedStartMinute}
              onChange={(e) => setUpdatedStartMinute(e.target.value)}
              inputProps={{ min: 0, max: 59 }}
              required
            />

            <TextField
              label="End Hour"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={updatedEndHour}
              onChange={(e) => setUpdatedEndHour(e.target.value)}
              inputProps={{ min: 0, max: 23 }}
              required
            />

            <TextField
              label="End Minute"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={updatedEndMinute}
              onChange={(e) => setUpdatedEndMinute(e.target.value)}
              inputProps={{ min: 0, max: 59 }}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value)}
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
                value={updatedPaymentStatus}
                onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
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
              value={updatedSubject}
              onChange={(e) => setUpdatedSubject(e.target.value)}
              required
            />

            <TextField
              label="Session Price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={updatedSessionPrice}
              onChange={(e) => setUpdatedSessionPrice(e.target.value)}
              required
            />
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Update
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
        {/* Existing code for the form dialog */}
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
