"use client";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  useTheme,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getLectureById } from "@/api/apiHelper";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaDownload } from "react-icons/fa6";
import { useThemeContext } from "@/hooks/ThemeContext";

const LecturePage = ({ params }) => {
  const { id } = params;
  const { isDarkMode } = useThemeContext();
  const [lectureData, setLectureData] = useState({});
  const theme = useTheme(); // Access theme to apply dynamic styling

  useEffect(() => {
    if (id) {
      getMeetingByID();
    }
  }, [id]);

  const getMeetingByID = async () => {
    try {
      const apiResponse = await getLectureById(id);
      if (apiResponse?.data?.success) {
        setLectureData(apiResponse?.data?.data);
      }
    } catch (e) {
      setLectureData({});
      console.error(e);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          color: isDarkMode ? "#fff" : "#000",
        }}
        className="blur_effect_card"
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            paddingBottom: 2,
            borderBottom: `2px solid ${
              isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300]
            }`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {lectureData?.title || "Lecture Title"}
          </Typography>

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<FaDownload size={22} />}
              sx={{
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#fff" : theme.palette.primary.main,
              }}
            >
              Download
            </Button>

            <DarkMode />

            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <FaBell size={24} />
              </Badge>
            </IconButton>

            <UserImage width={40} height={40} />
          </Box>
        </Box>

        {/* Lecture Details */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Description:</strong> {lectureData?.description || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Department:</strong>{" "}
            {lectureData?.lecture_class?.department?.name || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Class:</strong> {lectureData?.lecture_class?.name || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Subject:</strong>{" "}
            {lectureData?.chapter?.subject?.name || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Chapter:</strong> {lectureData?.chapter?.chapter || "N/A"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Duration:</strong> {lectureData?.duration || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Scheduled Date:</strong>{" "}
            {lectureData?.schedule_date || "N/A"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Scheduled Time:</strong>{" "}
            {lectureData?.schedule_time || "N/A"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LecturePage;
