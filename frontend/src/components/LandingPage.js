// src/components/LandingPage.js
// src/components/LandingPage.js
// src/components/LandingPage.js
import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { styled } from '@mui/system';


const images = [
  'https://unsplash.com/photos/Q7wGvnbuwj0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dGVhY2h8ZW58MHx8fHwxNzA0MDUwNDE0fDA&force=true', // Replace with your image URLs
  'https://unsplash.com/photos/4-EeTnaC1S4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHRlYWNofGVufDB8fHx8MTcwNDA1MDQxNHww&force=true',
  'https://unsplash.com/photos/-mCXEsLd2sU/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8dGVhY2h8ZW58MHx8fHwxNzA0MDUwNDE0fDA&force=true',
];


  
const texts = [
    'Uzair giving ted talk on rdr2',
    'Explore and Learn',
    'Of course its imad at nanis house',
    
  ];
  
  const AnimatedText = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#ffffff',
    animation: 'fadeInDown 1s ease-in-out',
    opacity: 0,
    animationFillMode: 'forwards',
    '@keyframes fadeInDown': {
      '0%': {
        opacity: 0,
        transform: 'translateY(-20px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  });
  
  const StyledSlider = styled(Slider)({
    // Add custom styling for the slider
    '.slick-prev, .slick-next': {
      // Target the arrow heads
      filter: 'brightness(60%)', // Darken the color (adjust as needed)
    },
  });
  
  const Segment = styled('div')({
    position: 'relative',
    fontFamily: 'Roboto, sans-serif', // Use the Roboto font directly in styling
    backgroundColor: '#C8EEEC',
    color: '#ffffff',
    padding: '40px',
    textAlign: 'center',
    backgroundImage: 'url("https://unsplash.com/photos/XSDTr93bhBo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fHRlYWNofGVufDB8fHx8MTcwNDA1MDQxNHww&force=true")', // Replace with your background image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  });
  
  const LandingPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      beforeChange: (current, next) => {
        setActiveIndex(next);
      },
    };
  
    return (
      <Box
        sx={{
          backgroundColor: '#C8EEEC',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <AppBar position="fixed" style={{ background: '#55a0ff', color: '#ffffff' }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Welcome to Vteach
            </Typography>
            <Button color="inherit" href="login">
              <Typography variant="subtitle1" style={{ color: '#ffffff' }}>
                Login
              </Typography>
            </Button>
            <Button color="inherit" href="signup">
              <Typography variant="subtitle1" style={{ color: '#ffffff' }}>
                Sign Up
              </Typography>
            </Button>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '64px', position: 'relative' }}>
          <StyledSlider {...settings}>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Background ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'scale-down',
                    borderRadius: '8px',
                  }}
                />
              </div>
            ))}
          </StyledSlider>
          <AnimatedText key={activeIndex}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {texts[activeIndex]}
            </Typography>
          </AnimatedText>
          <Segment>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Welcome to Vteach - Empowering Learning Together
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '20px' }}>
              Vteach is a cutting-edge teaching platform that strives to create an inclusive and
              engaging learning environment for students and educators. Our mission is to empower
              educators with innovative tools and resources while fostering a community that values
              collaborative learning. Join Vteach today and be a part of the future of education.
            </Typography>
          </Segment>
        </Container>
      </Box>
    );
  };
  
  export default LandingPage;