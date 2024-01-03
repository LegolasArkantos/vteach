import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';


const StudentHomePage = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [teacherData, setStudentData] = useState(null);
    const refresh = useRefreshToken();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSpecificStudent = async () => {
            try {
                if (!auth.studentId) {
                    console.error('Student ID is undefined.');
                    return;
                }

                const response = await axiosPrivate.get(`/students/${auth.studentId}`, {
                    signal: controller.signal
                });

                isMounted && setStudentData(response.data.student);
            } catch (error) {
                console.error(error);
            }
        };

        getSpecificStudent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth.studentId, axiosPrivate]);

    
    return (
        
        <RootContainer>
            <Sidebar />
            {/* Main Content Area */}
            <ContentContainer>
                {/* Content of the Teacher Homepage */}
                {studentData && (
                    <>
                        <ProfilePaper elevation={3}>
                            <Typography variant="h4" gutterBottom>
                                Student Profile
                            </Typography>
                            <Avatar sx={{ width: 100, height: 100, marginBottom: '10px' }}>
                                <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {studentData.user.firstName} {studentData.user.lastName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Email: {studentData.user.email}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <PhoneIcon /> Contact: {studentData.user.contactInformation?.phone}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Teachers: {studentData.teachers}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Sessions: {' '}
                                {studentData.sessions}
                            </Typography>
                        </ProfilePaper>
                        {/* Add more sections as needed */}
                    </>
                )}
                <button onClick={()=> refresh()}>refresh</button>
            </ContentContainer>
        </RootContainer>
    );
};

export default StudentHomePage;
