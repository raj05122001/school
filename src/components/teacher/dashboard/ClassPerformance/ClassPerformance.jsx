import React from 'react';
import { Box, Paper, CardContent, Typography, List, ListItem, ListItemText, Grid, CircularProgress, LinearProgress } from '@mui/material';
import { keyframes } from '@mui/system';
import { FaChartBar, FaUserCheck, FaFileAlt } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardStyle = {
  animation: `${fadeIn} 0.5s ease-in-out`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
  padding: 2,
  textAlign: 'center',
};

const progressBarStyle = {
  height: '10px',
  borderRadius: '5px',
  backgroundColor: '#e0e0e0',
};

const ClassPerformance = () => {
  // Sample data
  const studentPerformance = 75; // Percentage
  const attendanceRate = 90; // Percentage
  const quizAssignmentScore = 85; // Percentage

  return (
    <Box sx={{ flexGrow: 1}}>
      <Grid container spacing={3} direction={"column"}>
        {/* Overall Student Performance */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaChartBar style={{ marginRight: 8 }} />
                Overall Student Performance
              </Typography>
              <CircularProgress variant="determinate" value={studentPerformance} size={80} thickness={5} />
              <Typography variant="h5" sx={{ mt: 2 }}>
                {studentPerformance}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Class-wise performance summary
              </Typography>
            </CardContent>
          </Paper>
        </Grid>

        {/* Attendance Overview */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaUserCheck style={{ marginRight: 8 }} />
                Attendance Overview
              </Typography>
              <CircularProgress variant="determinate" value={attendanceRate} size={80} thickness={5} />
              <Typography variant="h5" sx={{ mt: 2 }}>
                {attendanceRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Recent attendance trends
              </Typography>
            </CardContent>
          </Paper>
        </Grid>

        {/* Quiz/Assignment Scores */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaFileAlt style={{ marginRight: 8 }} />
                Quiz/Assignment Scores
              </Typography>
              <LinearProgress variant="determinate" value={quizAssignmentScore} sx={progressBarStyle} />
              <Typography variant="h5" sx={{ mt: 2 }}>
                {quizAssignmentScore}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Latest quizzes and assignments
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClassPerformance;
