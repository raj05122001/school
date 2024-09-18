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
} from "@mui/material";
import { FaPlus, FaEdit, FaTrash, FaChartLine } from "react-icons/fa";
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

const LectureManagement = () => {
  // Sample data
  const lectures = [
    { id: 1, title: "Introduction to Mathematics", views: 120 },
    { id: 2, title: "Physics Basics", views: 150 },
    { id: 3, title: "Chemistry Fundamentals", views: 98 },
  ];

  return (
    <Box sx={{ flexGrow: 1}}>
      <Grid container spacing={3}>
        {/* Lecture Analytics */}
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
                Lecture Analytics
              </Typography>
              <List>
                {lectures.map((lecture) => (
                  <ListItem key={lecture.id}>
                    <ListItemText
                      primary={lecture.title}
                      secondary={`Views: ${lecture.views}`}
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

export default LectureManagement;
