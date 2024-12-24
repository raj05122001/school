"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Grid } from "@mui/material";
import { getLectureById, getMolMarks, updateMolMarks } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import HeaderMOL from "@/components/MOL/Header/HeaderMOL";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import LectureOverview from "@/components/MOL/LectureOverview/LectureOverview";
import LectureDetails from "@/components/MOL/LectureDetails/LectureDetails";
import CommentsSection from "@/components/teacher/CommentsSection/CommentsSection";
import Articles from "@/components/teacher/Articles/Articles";
import RatingSection from "@/components/teacher/RatingSection/RatingSection";
import LectureAnalytics from "@/components/teacher/LectureAnalytics/LectureAnalytics";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import PersonalisedRecommendations from "@/components/student/MOL/PersonalisedRecommendations/PersonalisedRecommendations";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import LectureAttachments from "@/components/MOL/LectureAttachment/LectureAttachment";

const LecturePage = ({ params }) => {
  const { id } = params;
  const { isDarkMode } = useThemeContext();
  const [lectureData, setLectureData] = useState({});
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [marksData, setMarksData] = useState({
    student_score: 0,
    viewed_highlights: true,
    viewed_notes: true,
    viewed_summary: true,
    viewed_video: true,
  });

  useEffect(() => {
    if (id) {
      getMeetingByID();
      fetchMolMarks();
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

  const fetchMolMarks = async () => {
    try {
      const response = await getMolMarks(id, userDetails?.student_id);
      if (response?.data?.success) {
        setMarksData(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const classID = lectureData?.lecture_class?.id;

  const videoPlayer = useMemo(() => <VideoPlayer id={id} />, [id]);
  const headerMOL = useMemo(
    () => (
      <HeaderMOL lectureData={lectureData} isEdit={false} isShowPic={true} />
    ),
    [lectureData]
  );
  const lectureOverview = useMemo(
    () => (
      <LectureOverview
        lectureId={id}
        isEdit={false}
        marksData={marksData}
        isStudent={true}
        setMarksData={setMarksData}
      />
    ),
    [id, marksData]
  );
  const lectureDetails = useMemo(
    () => (
      <LectureDetails
        id={id}
        classID={classID}
        marksData={marksData}
        isStudent={true}
        setMarksData={setMarksData}
      />
    ),
    [id, classID, marksData]
  );
  const articles = useMemo(() => <Articles lectureId={id} />, [id]);
  const lectureAnalytics = useMemo(
    () => <LectureAnalytics lectureId={id} />,
    [id]
  );
  const ratingSection = useMemo(
    () => <RatingSection id={id} isShowRating={true} />,
    [id]
  );
  const commentSection = useMemo(() => <CommentsSection id={id} />, [id]);
  const personalisedRecommendations = useMemo(
    () => <PersonalisedRecommendations id={id} marksData={marksData} />,
    [id, marksData]
  );
  const lectureAttachment = useMemo(
    () => <LectureAttachments lectureId={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );

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
        {headerMOL}
      </Paper>

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} md={8} lg={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {lectureData?.video_src === "PDF" ? (
              <AudioPlayer
                audio={`${process.env.NEXT_PUBLIC_URL}${lectureData?.audio}`}
                duration={lectureData?.duration}
                id={id}
              />
            ) : (
              <Box sx={{ maxHeight: "500px", width: "100%", height: 500 }}>
                {videoPlayer}
              </Box>
            )}
            {lectureOverview}
            {lectureDetails}
            {personalisedRecommendations}
            {articles}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} lg={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {lectureAnalytics}
            {lectureAttachment}
            {ratingSection}
            {commentSection}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LecturePage;
