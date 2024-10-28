"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import { getLectureById } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import HeaderMOL from "@/components/MOL/Header/HeaderMOL";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import LectureOverview from "@/components/MOL/LectureOverview/LectureOverview";
import LectureDetails from "@/components/MOL/LectureDetails/LectureDetails";
import CommentsSection from "@/components/teacher/CommentsSection/CommentsSection";
import Articles from "@/components/teacher/Articles/Articles";
import RatingSection from "@/components/teacher/RatingSection/RatingSection";
import LectureAnalytics from "@/components/teacher/LectureAnalytics/LectureAnalytics";

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

  const videoPlayer = useMemo(() => <VideoPlayer id={id} />, [id]);

  return (
    <Box
      sx={{
        height: "100%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          color: isDarkMode ? "#fff" : "#000",
          backgroundImage: isDarkMode
            ? "url('/headerBGDark1.jpg')"
            : "url('/headerBG1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: 1,
          p: 2,
        }}
      >
        <HeaderMOL lectureData={lectureData} isDarkMode={isDarkMode} />
      </Paper>

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} md={8} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ maxHeight: "500px", width: "100%", height: 500 }}>
              {videoPlayer}
            </Box>
            <LectureOverview isDarkMode={isDarkMode} lectureId={id} />
            <LectureDetails isDarkMode={isDarkMode} />
            <Articles lectureId={id} />
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LectureAnalytics lectureId={id} />
            <RatingSection />
            <CommentsSection />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LecturePage;
