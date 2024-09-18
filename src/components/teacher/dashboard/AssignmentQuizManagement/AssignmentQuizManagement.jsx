import React from "react";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaPlus, FaClipboardCheck, FaChartPie } from "react-icons/fa";
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

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
};

const AssignmentQuizManagement = () => {
  // Sample data
  const pendingSubmissions = [
    { id: 1, student: "John Doe", assignment: "Math Quiz 1" },
    { id: 2, student: "Jane Smith", assignment: "Science Assignment" },
    { id: 3, student: "Alice Johnson", assignment: "History Quiz" },
  ];

  const statistics = [
    { id: 1, title: "Math Quiz 1", score: 85 },
    { id: 2, title: "Science Assignment", score: 92 },
    { id: 3, title: "History Quiz", score: 78 },
  ];

  return (
    <Box sx={{ flexGrow: 1}}>
      <Grid container spacing={3}>
        {/* Assignment/Quiz Statistics */}
        <Grid item xs={12} >
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
                <FaChartPie style={{ marginRight: 8 }} />
                Assignment/Quiz Statistics
              </Typography>
              <List>
                {statistics.map((stat) => (
                  <ListItem key={stat.id}>
                    <ListItemText
                      primary={stat.title}
                      secondary={`Score: ${stat.score}%`}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={stat.score}
                      size={40}
                      thickness={5}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentQuizManagement;
