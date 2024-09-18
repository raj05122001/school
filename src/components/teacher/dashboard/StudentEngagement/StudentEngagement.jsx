import React from "react";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { FaChartLine, FaBullhorn } from "react-icons/fa";
import { keyframes } from "@mui/system";

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
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
  },
  padding: 2,
  textAlign: "center",
};

const StudentEngagement = () => {
  // Sample data
  const analytics = {
    performance: 85, // Average student performance percentage
    attendance: 90, // Attendance percentage
    engagement: 75, // Engagement percentage
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Performance Analytics */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaChartLine style={{ marginRight: 8 }} />
                Performance Analytics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Student Performance</Typography>
                <CircularProgress
                  variant="determinate"
                  value={analytics.performance}
                  size={80}
                  thickness={5}
                  sx={{ mt: 1 }}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {analytics.performance}%
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Attendance</Typography>
                <LinearProgress
                  variant="determinate"
                  value={analytics.attendance}
                  sx={{ height: 10, mt: 1, borderRadius: 5 }}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {analytics.attendance}%
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Engagement</Typography>
                <LinearProgress
                  variant="determinate"
                  value={analytics.engagement}
                  sx={{ height: 10, mt: 1, borderRadius: 5 }}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {analytics.engagement}%
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentEngagement;
