"use client";
import React from "react";
import { Box, Paper, Typography, Avatar, Skeleton } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";

const LectureCardSkeleton = () => {
  const { isDarkMode } = useThemeContext();

  const lectureCardStyle = {
    display: "flex",
    padding: "16px",
    borderRadius: "12px",
    background: isDarkMode ? "linear-gradient(to top, #09203f 0%, #537895 100%)" : "#ffffff",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
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

  const textStyle = {
    color: isDarkMode ? "#ffffff" : "#000000",
  };

  return (
    <Paper sx={lectureCardStyle}>
      <Box sx={dateSectionStyle}>
        <Skeleton variant="rectangular" width={40} height={40} />
        <Skeleton variant="text" width={60} height={20} sx={{ marginTop: 1 }} />
      </Box>
      <Box sx={lectureInfoStyle}>
        <Skeleton variant="text" width="70%" height={28} sx={{ marginBottom: 1 }} />
        <Box display="flex" alignItems="center" mb={1}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="30%" height={20} sx={{ marginLeft: 2 }} />
          <Skeleton variant="circular" width={20} height={20} sx={{ marginLeft: 3 }} />
          <Skeleton variant="text" width="30%" height={20} sx={{ marginLeft: 2 }} />
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="50%" height={20} sx={{ marginLeft: 2 }} />
        </Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="50%" height={20} sx={{ marginLeft: 2 }} />
        </Box>
        <Box display="flex" alignItems="center">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="40%" height={20} sx={{ marginLeft: 2 }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default LectureCardSkeleton;
