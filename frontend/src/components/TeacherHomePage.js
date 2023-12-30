import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from '../hooks/useRefreshToken';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


const drawerWidth = 240;

const RootContainer = styled('div')({
    display: 'flex',
});

const DrawerContainer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
});

const DrawerPaper = styled('div')({
    width: drawerWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px', // Adjust as needed
});

const ContentContainer = styled('main')({
    flexGrow: 1,
    padding: (theme) => theme.spacing(3),
});

const ProfilePaper = styled(Paper)({
    padding: '20px',
    marginBottom: '20px',
});

const TeacherHomePage = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [teacherData, setTeacherData] = useState(null);
    const refresh = useRefreshToken();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTeacherProfile = async () => {
            try {
                if (!auth.teacherId) {
                    console.error('Teacher ID is undefined.');
                    return;
                }

                const response = await axiosPrivate.get(`/teachers/${auth.teacherId}`, {
                    signal: controller.signal
                });

                isMounted && setTeacherData(response.data.teacher);
            } catch (error) {
                console.error(error);
            }
        };

        getTeacherProfile();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth.teacherId, axiosPrivate]);

    
    return (
        
        <RootContainer>
            <Sidebar />
            {/* Main Content Area */}
            <ContentContainer>
                {/* Content of the Teacher Homepage */}
                {teacherData && (
                    <>
                        <ProfilePaper elevation={3}>
                            <Typography variant="h4" gutterBottom>
                                Teacher Profile
                            </Typography>
                            <Avatar sx={{ width: 100, height: 100, marginBottom: '10px' }}>
                                <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {teacherData.user.firstName} {teacherData.user.lastName}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Email: {teacherData.user.email}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                <PhoneIcon /> Contact: {teacherData.user.contactInformation?.phone}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Educational Credentials: {teacherData.educationalCredentials}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Subjects Taught:{' '}
                                {teacherData.subjectsTaught.length > 0
                                    ? teacherData.subjectsTaught.join(', ')
                                    : 'No subjects taught'}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Available Time Slots:{' '}
                                {teacherData.availableTimeSlots.length > 0
                                    ? teacherData.availableTimeSlots.join(', ')
                                    : 'No available time slots'}
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

export default TeacherHomePage;
