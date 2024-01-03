import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('');
  const [subjectsOfInterest, setSubjectsOfInterest] = useState('');
  const [educationalCredentials, setEducationalCredentials] = useState(''); // Add missing state for teacher

  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
        role,
        educationalLevel,
        subjectsOfInterest,
        educationalCredentials, 
      };

      
      const response = await axios.post('http://localhost:3001/auth/signup', userData);

      // Handle the successful response (you may want to do something with the response data)
      console.log('Signup successful:', response.data);

      // Navigate to the desired page after successful signup
      navigate('/login');
    } catch (error) {
      // Handle errors, you may want to update the state to display an error message
      console.error('Signup error:', error.response?.data || error.message);
      setError('Signup failed. Please check your inputs and try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Sign up</Typography>
        <form sx={{ width: '100%', mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="firstName"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          {role === 'teacher' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Educational Credentials"
              id="educationalCredentials"
              value={educationalCredentials}
              onChange={(e) => setEducationalCredentials(e.target.value)}
            />
          ) : role === 'student' ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Educational Level"
                id="educationalLevel"
                value={educationalLevel}
                onChange={(e) => setEducationalLevel(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Subjects of Interest"
                id="subjectsOfInterest"
                value={subjectsOfInterest}
                onChange={(e) => setSubjectsOfInterest(e.target.value)}
              />
            </>
          ) : null}
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button fullWidth variant="contained" color="primary" onClick={handleSignup}>
            Sign up
          </Button>
        </form>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignupPage;
