import React from 'react';
import { Box, Typography, Paper, Button, Badge, IconButton, Avatar } from '@mui/material';
import { FaBell } from 'react-icons/fa';

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
        padding: 2, 
        boxSizing: 'border-box',         
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white
        backdropFilter: 'blur(10px)', // Adds the glass blur effect
        borderRadius: '16px', // Rounded corners for a smooth card look
        border: '1px solid rgba(255, 255, 255, 0.3)', // Adds a subtle border
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Light shadow for depth
        backgroundImage: "url('/CoverBG.jpg')", // Add background image
        backgroundSize: "cover", // Ensure the image covers the entire page
        backgroundPosition: "center", // Center the image
        height:"100%",
        color:"white",
        }}>
      <Box sx={{display:"flex", justifyContent:"space-between"}}>
        <Box>
            <Typography variant="h4" sx={{ textAlign: 'left', color:"white" }}>
            {getGreeting()} Ravi Kumar
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: 'left', color:"white"}}>
                Have a nice day!
            </Typography>
        </Box>
        <Box sx={{display:"flex", gap:4, alignItems:"flex-start"}}>
            <IconButton color="inherit" sx={{marginTop:1}}>
            <Badge badgeContent={4} color="error">
            <FaBell size={24} color="#ffffff" />
            </Badge>
        </IconButton>
        <Avatar
        alt="Ravi Kumar"
        src="/sampleprofile.jpg" // Sample profile image
        sx={{ width: 40, height: 40 }}
      />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FFD700",
                  ":hover": {
                    backgroundColor: "#DAA520",
                  },
                  color:"#003366"
                }}

              >
                Create Lecture
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#90EE90",
                  ":hover": {
                    backgroundColor: "#3CB371",
                    
                  },
                  color:"#006400"
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
