
import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Button, Paper, Grid } from '@mui/material';  // Added Paper import
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';  // Added useAuth import
import useAxiosPrivate from '../hooks/useAxiosPrivate';  // Added useAxiosPrivate import
import useRefreshToken from '../hooks/useRefreshToken';  // Added useRefreshToken import
import student from '../../../backend/models/student';

const StudentSessionPage = () => {
    const { auth } = useAuth();
    const studentId = auth.studentId;
    const axiosPrivate = useAxiosPrivate();
    const [sessionsData, setSessionsData] = useState([]);
  
    useEffect(() => {
      const fetchSessionsData = async () => {
        try {
          console.log('Fetching sessions data...');
          const response = await axiosPrivate.get(`/students/sessions/${studentId}`);
          console.log('Sessions data response:', response.data);
          setSessionsData(response.data.sessions || []);
        } catch (error) {
          console.error('Error fetching sessions data:', error);
        }
      };
  
      fetchSessionsData();
    }, [axiosPrivate, studentId]);
  
    console.log('Rendered with sessions data:', sessionsData);
  
    return (
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10} container direction="row" alignItems="flex-start">
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              margin: '20px',
              borderRadius: '20px',
              width: 'fit-content',
              overflowY: 'auto',
              maxHeight: '80vh',
              scrollbarWidth: 'thin',
            }}
          >
            {sessionsData.map((session) => (
              <Paper
                key={session.sessionId}
                elevation={3}
                style={{ padding: '10px', margin: '10px', borderRadius: '15px', width: 'fit-content' }}
              >
                <Typography variant="h6">{session.subject}</Typography>
                <Typography>{`Time: ${session.startTime} - ${session.endTime}`}</Typography>
                <Typography>{`Status: ${session.status}`}</Typography>
                <Typography>{`Payment Status: ${session.paymentStatus}`}</Typography>
                <Typography>{`Session Price: ${session.sessionPrice}`}</Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    );
  };
  
  export default StudentSessionPage;