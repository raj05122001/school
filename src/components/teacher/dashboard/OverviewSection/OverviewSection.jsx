"use client";
import React from "react";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";
import { keyframes } from "@mui/system";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";

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
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
};

const iconStyle = {
  fontSize: "24px",
  color: "#1976d2",
};

const OverviewSection = () => {
  const { isDarkMode } = useThemeContext();

  const lectures = [
    {
      id: 1,
      day: "3",
      dayOfWeek: "Tuesday",
      date: "Sep 3, 2024",
      time: "09:15 pm",
      subject: "Low Level Design",
      class: "BSC-III",
      topic: "Lld And Hld",
      instructorName: "Dheeraj Malviya",
      instructorAvatar: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      day: "4",
      dayOfWeek: "Wednesday",
      date: "Sep 4, 2024",
      time: "10:00 am",
      subject: "High Level Design",
      class: "BSC-III",
      topic: "Hld Concepts",
      instructorName: "Neha Sharma",
      instructorAvatar: "https://example.com/avatar2.jpg",
    },
    {
      id: 3,
      day: "5",
      dayOfWeek: "Thursday",
      date: "Sep 5, 2024",
      time: "11:30 am",
      subject: "Database Systems",
      class: "BSC-II",
      topic: "Normalization",
      instructorName: "Rahul Verma",
      instructorAvatar: "https://example.com/avatar3.jpg",
    },
    {
      id: 4,
      day: "6",
      dayOfWeek: "Friday",
      date: "Sep 6, 2024",
      time: "02:00 pm",
      subject: "Operating Systems",
      class: "BSC-I",
      topic: "Process Management",
      instructorName: "Anjali Gupta",
      instructorAvatar: "https://example.com/avatar4.jpg",
    },
  ];

  const pendingAssignments = [
    { id: 1, title: "Math Assignment 1", dueDate: "2024-09-05" },
    { id: 2, title: "Science Project", dueDate: "2024-09-07" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "Submission",
      details: "John Doe submitted Math Assignment 1.",
    },
    {
      id: 2,
      type: "Forum Post",
      details: "Alice posted in Science Discussion Forum.",
    },
    {
      id: 3,
      type: "Message",
      details: "You have a new message from Jane Smith.",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {/* Upcoming Lectures */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FaChalkboardTeacher size={26} style={{ ...iconStyle }} />
            <Typography
              className={`${
                isDarkMode ? "dark-heading" : "light-heading"
              } h4`}
              sx={{fontWeight:'bold'}}
            >
              Upcomming Lectures
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {lectures.map((lecture) => (
              <Grid item xs={12} sm={6} md={6} key={lecture.id}>
                <LectureCard lecture={lecture} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewSection;
