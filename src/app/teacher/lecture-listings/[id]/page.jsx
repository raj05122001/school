"use client";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  useTheme,
  Paper,
  Grid,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getLectureById } from "@/api/apiHelper";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaDownload } from "react-icons/fa6";
import { useThemeContext } from "@/hooks/ThemeContext";
import HeaderMOL from "@/components/MOL/Header/HeaderMOL";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import LectureOverview from "@/components/MOL/LectureOverview/LectureOverview";
import CommentsSection from "@/components/teacher/CommentsSection/CommentsSection";
import Articles from "@/components/teacher/Articles/Articles";
import RatingSection from "@/components/teacher/RatingSection/RatingSection";
import LectureAnalytics from "@/components/teacher/LectureAnalytics/LectureAnalytics";
import LectureDetails from "@/components/MOL/LectureDetails/LectureDetails";

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
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          color: isDarkMode ? "#fff" : "#000",
          // background: "linear-gradient(to right, rgb(255, 129, 119) 0%, rgb(255, 134, 122) 0%, rgb(255, 140, 127) 21%, rgb(249, 145, 133) 52%, rgb(207, 85, 108) 78%, rgb(177, 42, 91) 100%)",
          backgroundImage: isDarkMode
            ? "url('/headerBGDark1.jpg')"
            : "url('/headerBG1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "8px",
        }}
        className="blur_effect_card"
      >
        <HeaderMOL lectureData={lectureData} isDarkMode={isDarkMode} />
      </Paper>

      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ maxHeight: "500px", width: "100%", height: "100%" }}>
            {videoPlayer}
          </Box>
          <Box mt={4}>
            <LectureOverview isDarkMode={isDarkMode} lectureId={id} />
          </Box>

          <Box mt={4}>
          <LectureDetails isDarkMode={isDarkMode} />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <LectureAnalytics lectureId={id} />
            </Grid>
            <Grid item xs={12}>
              <RatingSection />
            </Grid>
            <Grid item xs={12}>
              <CommentsSection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Articles lectureId={id} />
      </Box>
    </Box>
  );
};

export default LecturePage;
