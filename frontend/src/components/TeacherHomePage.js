import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useRefreshToken from '../hooks/useRefreshToken';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const RootContainer = styled('div')({
  display: 'flex',
  backgroundColor: '#C8EEEC',
});



const ContentContainer = styled('main')({
    flexGrow: 1,
    padding: (theme) => theme.spacing(3),
    backgroundColor: '#C8EEEC', // Set the desired background color
  });
  
  const ProfilePaper = styled(Paper)({
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#F0F7FF', // Set the desired background color
    borderRadius: '15px', // Set the border-radius for a curved box effect
    marginLeft: '10px', // Add some margin to move away from the sidebar
    marginRight:'10px',
    marginTop: '10px',
    
  });

const StyledButton = styled(Button)({
  backgroundColor: '#2196f3', // Change color as needed
  color: '#fff', // Change text color as needed
  marginTop: '10px',
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
          signal: controller.signal,
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
              <Typography variant="h5" gutterBottom>
                {teacherData.user.firstName} {teacherData.user.lastName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Email:</span> {teacherData.user.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Contact:</span>{' '}
                {teacherData.user.contactInformation?.phone}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Educational Credentials:</span>{' '}
                {teacherData.educationalCredentials}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Subjects Taught:</span>{' '}
                {teacherData.subjectsTaught.length > 0
                  ? teacherData.subjectsTaught.join(', ')
                  : 'No subjects taught'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <span style={{ fontWeight: 'bold', color: '#074c84' }}>Available Time Slots:</span>{' '}
                {teacherData.availableTimeSlots.length > 0
                  ? teacherData.availableTimeSlots.join(', ')
                  : 'No available time slots'}
              </Typography>
              <StyledButton onClick={() => refresh()}>Refresh</StyledButton>
            </ProfilePaper>
            {/* Add more sections as needed */}
          </>
        )}
      </ContentContainer>
    </RootContainer>
  );
};

export default TeacherHomePage;