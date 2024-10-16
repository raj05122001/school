import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { GiDuration } from "react-icons/gi";

function LectureDuration() {
  return (
    <Card sx={{ 
        maxWidth: "full", 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        backgroundImage: "url('/profilecard.jpg')", // Add background image
        backgroundSize: "cover", // Ensure the image covers the entire page
        backgroundPosition: "center", // Center the image
        }}>
      {/* Profile Picture */}
      <GiDuration style={{width:"50px", height:"50px", position:"absolute", top:3, left:3}}/>

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Teacher Name */}
        <Typography gutterBottom variant="h6" component="div" align='center' fontWeight={'bold'}>
          Average Duration
        </Typography>

        {/* Class and Department */}
        <Typography variant="body1" color="text.primary" align='center'>
          40 mins
        </Typography>
      </CardContent>
    </Card>
  );
}

export default LectureDuration;
