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
import HeaderMOL from "@/components/MOL/Header/HeaderMOL";

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
          padding: 1,
          color: isDarkMode ? "#fff" : "#000",
          // background: "linear-gradient(to right, rgb(255, 129, 119) 0%, rgb(255, 134, 122) 0%, rgb(255, 140, 127) 21%, rgb(249, 145, 133) 52%, rgb(207, 85, 108) 78%, rgb(177, 42, 91) 100%)",
          backgroundImage: isDarkMode ? "url('/headerBGDark1.jpg')" : "url('/headerBG1.jpg')", // Add background image
          backgroundSize: "cover", // Ensure the image covers the entire page
          backgroundPosition: "center", // Center the image
          maxWidth: "98%", // Set the maximum width for the component
          margin: "0 auto", // Center the Paper component horizontally
          marginTop:"8px",
        }}
        className="blur_effect_card"
      >
        <HeaderMOL lectureData={lectureData} isDarkMode={isDarkMode} />
      </Paper>
    </Box>
  );
};

export default LecturePage;
