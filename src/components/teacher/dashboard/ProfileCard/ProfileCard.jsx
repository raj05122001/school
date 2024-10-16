import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, IconButton } from '@mui/material';
import { FaEdit } from "react-icons/fa";

function ProfileCard() {
  return (
    <Card sx={{ 
        maxWidth: "full", 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        p: 2,
        background: 'linear-gradient(to top, #09203f 0%, #537895 100%)'
        }}>
      {/* Edit Button */}
      <IconButton
        aria-label="edit"
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <FaEdit style={{color:"white"}}/>
      </IconButton>

      {/* Profile Picture */}
      <Avatar
        alt="Ravi Kumar"
        src="/sampleprofile.jpg" // Sample profile image
        sx={{ width: 100, height: 100, mr: 2 }}
      />

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Teacher Name */}
        <Typography gutterBottom variant="h5" component="div" fontFamily={'monospace'} fontWeight={'bold'} color={'white'}>
          Ravi Kumar
        </Typography>
        <Box sx={{display:"flex", gap: 2}}>
            {/* Class and Department */}
            <Typography variant="body2" color={'white'}>
            Class: M.Tech
            </Typography>
            ♦️
            <Typography variant="body2" color={'white'}>
            Department: Mathematics
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
