import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { TextField, Button, Typography, Paper, Grid } from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const SessionPage = () => {
    const { auth } = useAuth();
    const teacherId = auth.teacherId;
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [subject, setSubject] = useState('');
    const [sessionPrice, setSessionPrice] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(teacherId);
        try {
            const response = await axiosPrivate.post('http://localhost:3001/sessions/create', {
                teacherId: teacherId,
                startTime,
                endTime,
                status,
                paymentStatus,
                subject,
                sessionPrice,
            },
                // {
                // headers: {
                //     'Authorization': 'Bearer '+ auth.accessToken, // Replace YOUR_ACCESS_TOKEN with the actual access token
                //     'Content-Type': 'application/json', // Adjust the content type as needed
                // },
            // }
            
            );

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Sidebar />
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
                    <Typography variant="h4" gutterBottom>
                        Session Page
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Start Time"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                            
                        <TextField
                            label="End Time"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                        <TextField
                            label="Status"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />

                        <TextField
                            label="Payment Status"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        />
                        <TextField
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <TextField
                            label="Session Price"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={sessionPrice}
                            onChange={(e) => setSessionPrice(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </>
    );
};

export default SessionPage;