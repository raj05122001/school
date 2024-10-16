import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

function GreetingCard() {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Paper elevation={3} sx={{ 
        width: '100%',     
        padding: 3, 
        boxSizing: 'border-box',         
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white
        backdropFilter: 'blur(10px)', // Adds the glass blur effect
        borderRadius: '12px', // Rounded corners for a smooth card look
        border: '1px solid rgba(255, 255, 255, 0.3)', // Adds a subtle border
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Light shadow for depth
        backgroundImage: "url('/GreetingImage2.jpg')", // Add background image
        backgroundSize: "cover", // Ensure the image covers the entire page
        backgroundPosition: "center", // Center the image
        height:"100%",
        }}>
      <Typography variant="h4" sx={{ textAlign: 'left' }}>
        {getGreeting()} Ravi Kumar
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
        Have a nice day!
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#50C878",
                  ":hover": {
                    backgroundColor: "#00A36C",
                  },
                }}
              >
                Create Lecture
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#50C878",
                  ":hover": {
                    backgroundColor: "#00A36C",
                  },
                }}
              >
                Create Quiz
              </Button>
            </Box>
        </Box>
    </Paper>
  );
}

export default GreetingCard;
