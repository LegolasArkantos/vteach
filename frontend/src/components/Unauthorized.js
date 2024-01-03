import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Paper, Grid } from '@mui/material';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh', // Set the container to full height of the viewport
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
                    Unauthorized
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" paragraph>
                    You do not have access to the requested page.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={goBack}>
                            Go Back
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Unauthorized;
