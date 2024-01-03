import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const { setAuth } = useAuth()
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      
      const response = await axios.post(
        'http://localhost:3001/auth/login',
        { email, password },
        { withCredentials: true } 
    );
      
      console.log(response.data)
      
      const { accessToken, refreshToken,role,teacherId,studentId } = response.data;


      // Call the login function with the user data
      console.log(accessToken,role,teacherId);
      setAuth({ accessToken, refreshToken ,role,teacherId, studentId});
      if (role === 'teacher') {
        navigate('/teacherhomepage');
      } else {
        navigate('/studenthomepage');
      }
  

     
    } catch (error) {
      console.error('Login failed:', error);
      if (!error?.response) {
        setError('No Server Response');
      } else if (error.response?.status === 400) {
        setError('Missing Username or Password');
      } else if (error.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Login Failed');
      }
    }
  };


  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Login</Typography>
        <form sx={{ width: '100%', mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link to="/signup" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
