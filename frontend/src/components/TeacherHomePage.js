import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const UpdateButton = styled(Button)({
  backgroundColor: '#4caf50',
  color: '#fff',
  marginTop: '10px',
});

const TeacherHomePage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [teacherData, setTeacherData] = useState(null);
  

  const [isUpdating, setIsUpdating] = useState(false);

  // State for form fields
  const [updateData, setUpdateData] = useState({
    educationalCredentials: '',
    subjectsTaught: '',
    firstName: '',
    lastName: '',
    contactInformation: '',
  });



  //profile
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
  }, [auth.teacherId, axiosPrivate,teacherData,setTeacherData]);




  const handleUpdateClick = () => {
    setIsUpdating(true);
    // Populate form fields with existing data
    setUpdateData({
      educationalCredentials: teacherData.educationalCredentials || '',
      
      firstName: teacherData.user.firstName || '',
      lastName: teacherData.user.lastName || '',
      contactInformation: teacherData.user.contactInformation?.phone || '',
    });
  };

  const handleInputChange = (field, value) => {
    setUpdateData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      // Send updated data to the server
      await axiosPrivate.put(`http://localhost:3001/teachers/updateProfile/${auth.teacherId}`, {
        educationalCredentials: updateData.educationalCredentials,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
      contactInformation: { phone: updateData.contactInformation },
      });

      
      // Close the form
      setIsUpdating(false);
    } catch (error) {
      console.error(error);
    }
  };

  

  return (
    <RootContainer>
      <Sidebar />
      <ContentContainer>
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
              {isUpdating ? (
                
                <Dialog open={isUpdating} onClose={() => setIsUpdating(false)}maxWidth="md"fullWidth={true} style={{ height: '80%', minHeight: '600px' }}>
                  <DialogTitle>Update Teacher Profile</DialogTitle>
                  <DialogContent>
                    
                      <TextField
                        label="Educational Credentials"
                        fullWidth
                        value={updateData.educationalCredentials}
                        onChange={(e) => handleInputChange('educationalCredentials', e.target.value)}
                        style={{ marginBottom: '15px', marginTop: '10px' }}
                      />
                      
                      <TextField
                        label="First Name"
                        fullWidth
                        value={updateData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        style={{ marginBottom: '15px' }}
                      />
                      <TextField
                        label="Last Name"
                        fullWidth
                        value={updateData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        style={{ marginBottom: '15px' }}
                      />
                      <TextField
                        label="Contact Information"
                        fullWidth
                        value={updateData.contactInformation}
                        onChange={(e) => handleInputChange('contactInformation', e.target.value)}
                        style={{ marginBottom: '15px' }}
                      />
                    
                  </DialogContent>
                  <DialogActions>
                    <UpdateButton onClick={handleUpdateSubmit}>Update</UpdateButton>
                    <StyledButton onClick={() => setIsUpdating(false)}>Cancel</StyledButton>
                  </DialogActions>
                </Dialog>
              ) : (
                // Display "Update" button
                <StyledButton onClick={handleUpdateClick}>Update</StyledButton>
              )}
                            
            </ProfilePaper>
          </>
        )}
      </ContentContainer>
    </RootContainer>
  );
};

export default TeacherHomePage;
