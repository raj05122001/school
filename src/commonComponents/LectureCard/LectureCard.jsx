"use client";
import React from "react";
import { Box, Paper, CardContent, Typography, Grid, Avatar } from "@mui/material";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaBook, FaGraduationCap } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";

const LectureCard = ({ lecture }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  const lectureCardStyle = {
    display: "flex",
    padding: "16px",
    borderRadius: "12px",
    background: isDarkMode ? "linear-gradient(to top, #09203f 0%, #537895 100%)" : "#ffffff",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      backgroundColor: isDarkMode ? "#424242" : "#f5f5f5",
    },
  };

  const dateSectionStyle = {
    minWidth: "80px",
    backgroundColor: isDarkMode ? "#041E42" : "#e0f7fa",
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
    color: isDarkMode ? primaryColor : "#00796b",
  };

  const textStyle = {
    color: isDarkMode ? "#ffffff" : "#000000",
  };

  return (
    <Paper sx={lectureCardStyle}>
      <Box sx={dateSectionStyle}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: textStyle.color }}>
          {lecture.day}
        </Typography>
        <Typography variant="body2" sx={{ color: isDarkMode ? primaryColor : "#00796b" }}>
          {lecture.dayOfWeek}
        </Typography>
      </Box>
      <Box sx={lectureInfoStyle}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: textStyle.color }}>
          {lecture.subject}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt style={iconStyle} />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture.date}
          </Typography>
          <FaClock style={{ ...iconStyle, marginLeft: "16px" }} />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture.time}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaGraduationCap style={iconStyle} />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture.class}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <FaBook style={iconStyle} />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture.topic}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar src={lecture.instructorAvatar} alt={lecture.instructorName} sx={{ width: 24, height: 24, marginRight: "8px" }} />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture.instructorName}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LectureCard;
