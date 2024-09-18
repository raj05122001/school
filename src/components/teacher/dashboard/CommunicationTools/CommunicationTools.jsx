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
  TextField,
  IconButton,
} from "@mui/material";
import { FaEnvelope, FaDownload } from "react-icons/fa";
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
  padding: 2,
  textAlign: "center",
  minHeight: "355px", // Set the height for both cards
};

const CommunicationTools = () => {
  // Sample data
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      content: "Can you review my assignment?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "Jane Smith",
      content: "What is the due date for the project?",
      time: "11:00 AM",
    },
    {
      id: 3,
      sender: "Admin",
      content: "Meeting rescheduled to 2 PM.",
      time: "11:30 AM",
    },
  ];

  const reports = [
    { id: 1, title: "Performance Report - September", date: "2024-09-30" },
    { id: 2, title: "Attendance Sheet - September", date: "2024-09-30" },
    { id: 3, title: "Quiz Results - Week 1", date: "2024-09-07" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Download Reports */}
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
                <FaDownload style={{ marginRight: 8 }} />
                Download Reports
              </Typography>
              <List sx={{ mt: 2 }}>
                {reports.map((report) => (
                  <ListItem key={report.id}>
                    <ListItemText
                      primary={report.title}
                      secondary={`Date: ${report.date}`}
                    />
                    <IconButton
                      edge="end"
                      aria-label="download"
                      sx={{ color: "#1976d2" }}
                    >
                      <FaDownload />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>

        {/* Messages */}
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
                <FaEnvelope style={{ marginRight: 8 }} />
                Messages
              </Typography>
              <List sx={{ maxHeight: "320px", overflow: "auto" }}>
                {messages.map((message) => (
                  <ListItem key={message.id}>
                    <ListItemText
                      primary={message.content}
                      secondary={`From: ${message.sender} | Time: ${message.time}`}
                    />
                    <IconButton
                      edge="end"
                      aria-label="reply"
                      sx={{ color: "#1976d2" }}
                    >
                      <FaEnvelope />
                    </IconButton>
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

export default CommunicationTools;
