"use client";
import React from "react";
import { Box, Paper, CardContent, Typography, Grid, Avatar } from "@mui/material";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaBook, FaGraduationCap } from "react-icons/fa";

const lectureCardStyle = {
  display: "flex",
  padding: "16px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
};

const dateSectionStyle = {
  minWidth: "80px",
  backgroundColor: "#e0f7fa",
  borderRadius: "12px 0 0 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  textAlign: "center",
};

const lectureInfoStyle = {
  flexGrow: 1,
  paddingLeft: "16px",
};

const iconStyle = {
  marginRight: "8px",
  color: "#00796b",
};

const LectureCard = ({ lecture }) => {
  return (
    <Paper sx={lectureCardStyle}>
      <Box sx={dateSectionStyle}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {lecture.day}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00796b" }}>
          {lecture.dayOfWeek}
        </Typography>
      </Box>
      <Box sx={lectureInfoStyle}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {lecture.subject}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt style={iconStyle} />
          <Typography variant="body2">{lecture.date}</Typography>
          <FaClock style={{ ...iconStyle, marginLeft: "16px" }} />
          <Typography variant="body2">{lecture.time}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaGraduationCap style={iconStyle} />
          <Typography variant="body2">{lecture.class}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaBook style={iconStyle} />
          <Typography variant="body2">{lecture.topic}</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar src={lecture.instructorAvatar} alt={lecture.instructorName} sx={{ width: 24, height: 24, marginRight: "8px" }} />
          <Typography variant="body2">{lecture.instructorName}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LectureCard;
