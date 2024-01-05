import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Button, Paper } from '@mui/material';  // Added Paper import
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';  // Added useAuth import
import useAxiosPrivate from '../hooks/useAxiosPrivate';  // Added useAxiosPrivate import
import useRefreshToken from '../hooks/useRefreshToken';  // Added useRefreshToken import

const RootContainer = styled('div')({
  display: 'flex',
  backgroundColor: '#C8EEEC',
});

const ContentContainer = styled('main')({
  flexGrow: 1,
  padding: (theme) => theme.spacing(3),
  backgroundColor: '#C8EEEC',
});

const ProfilePaper = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
  backgroundColor: '#F0F7FF',
  borderRadius: '15px',
  marginLeft: '10px',
  marginRight: '10px',
  marginTop: '10px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#2196f3',
  color: '#fff',
  marginTop: '10px',
});

const StudentHomePage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [studentData, setStudentData] = useState(null);
  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSpecificStudent = async () => {
      try {
        if (!auth.studentId) {
          console.error('Student ID is undefined.');
          return;
        }

        const response = await axiosPrivate.get(`/students/getSpecificStudent/${auth.studentId}`, {
          signal: controller.signal,
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
        {/* Content of the Student Homepage */}
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
                Contact: {studentData.user.educationalLevel}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Sessions: {studentData.user.subjectOfInterest}
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

export default StudentHomePage;