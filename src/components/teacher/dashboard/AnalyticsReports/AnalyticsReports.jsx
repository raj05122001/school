import React from "react";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  List,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaBullhorn, FaQuestionCircle } from "react-icons/fa";

const iconButtonStyle = {
  color: "#1976d2",
  "&:hover": {
    color: "#1565c0",
  },
};

const cardStyle = {
  padding: 2,
  textAlign: "center",
  minWidth: "400px",
  minHeight: "350px", // Set same height for both cards
};

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
};

const AnalyticsReports = () => {
  // Sample data
  const queries = [
    {
      id: 1,
      student: "John Doe",
      query: "What is the due date for the Math Quiz 1?",
    },
    {
      id: 2,
      student: "Jane Smith",
      query: "Can you explain the last topic on Photosynthesis?",
    },
    {
      id: 3,
      student: "Alice Johnson",
      query: "How do we access the online library?",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Student Queries */}
        <Grid item xs={12} sm={6}>
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
                <FaQuestionCircle style={{ marginRight: 8 }} />
                Student Queries
              </Typography>
              <List>
                {queries.map((query) => (
                  <ListItem key={query.id}>
                    <ListItemText
                      primary={query.query}
                      secondary={`Asked by: ${query.student}`}
                    />
                    <IconButton
                      edge="end"
                      aria-label="reply"
                      sx={iconButtonStyle}
                    >
                      <FaQuestionCircle />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>
        {/* Announcements */}
        <Grid item xs={12} sm={6}>
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
                <FaBullhorn style={{ marginRight: 8 }} />
                Announcements
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter your announcement here..."
                multiline
                rows={4}
                sx={{ mt: 2, mb: 2 }}
              />
              <Button variant="contained" sx={buttonStyle}>
                Post Announcement
              </Button>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsReports;
