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
import { getLectureById, releasedLecture } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import HeaderMOL from "@/components/MOL/Header/HeaderMOL";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import LectureOverview from "@/components/MOL/LectureOverview/LectureOverview";
import LectureDetails from "@/components/MOL/LectureDetails/LectureDetails";
import CommentsSection from "@/components/teacher/CommentsSection/CommentsSection";
import Articles from "@/components/teacher/Articles/Articles";
import RatingSection from "@/components/teacher/RatingSection/RatingSection";
import LectureAnalytics from "@/components/teacher/LectureAnalytics/LectureAnalytics";
import LectureAttachments from "@/components/MOL/LectureAttachment/LectureAttachment";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { toast } from "react-hot-toast";
import LectureDescription from "@/commonComponents/LectureDescription/LectureDescription";

const LecturePage = ({ params }) => {
  const { id } = params;
  const { isDarkMode } = useThemeContext();
  const [lectureData, setLectureData] = useState({});
  const theme = useTheme(); // Access theme to apply dynamic styling
  const [loading, setLoading] = useState(true);
  const [videoTimeStamp, setVideoTimeStamp] = useState(0);

  useEffect(() => {
    if (id) {
      getMeetingByID();
    }
  }, [id]);

  const getMeetingByID = async () => {
    setLoading(true);
    try {
      const apiResponse = await getLectureById(id);
      if (apiResponse?.data?.success) {
        setLectureData(apiResponse?.data?.data);
      }
      setLoading(false);
    } catch (e) {
      setLectureData({});
      console.error(e);
      setLoading(false);
    }
  };

  const handleReleased = async () => {
    try {
      await releasedLecture(id, { is_released: true });
      getMeetingByID();
      toast.success("Lecture has been published.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lecture status. Please try again.");
    }
  };

  const classID = lectureData?.lecture_class?.id;

  const videoPlayer = useMemo(
    () => (
      <VideoPlayer
        id={id}
        duration={lectureData?.duration}
        setVideoTimeStamp={setVideoTimeStamp}
      />
    ),
    [id, lectureData?.duration]
  );
  const headerMOL = useMemo(
    () => (
      <HeaderMOL
        lectureData={lectureData}
        handleReleased={handleReleased}
        isEdit={true}
        isShowPic={false}
        loading={loading}
      />
    ),
    [lectureData]
  );

  const descriptionMOL = useMemo(
    () => (
      <LectureDescription
        lectureData={lectureData}
        isShowPic={false}
        loading={loading}
        videoTimeStamp={videoTimeStamp}
      />
    ),
    [lectureData, videoTimeStamp]
  );
  const lectureOverview = useMemo(
    () => <LectureOverview lectureId={id} isEdit={true} />,
    [id]
  );
  const lectureDetails = useMemo(
    () => <LectureDetails id={id} classID={classID} />,
    [id, classID]
  );
  // const articles = useMemo(() => <Articles lectureId={id} />, [id]);
  const lectureAnalytics = useMemo(
    () => <LectureAnalytics lectureId={id} />,
    [id]
  );
  const lectureAttachment = useMemo(
    () => <LectureAttachments lectureId={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );
  const ratingSection = useMemo(
    () => <RatingSection id={id} isShowRating={false} />,
    [id]
  );
  const commentSection = useMemo(() => <CommentsSection id={id} />, [id]);

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
      <Box sx={{ marginBottom: "4px", paddingBottom: "4px", height: "80%" }}>
        {headerMOL}
      </Box>

      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            {lectureData?.video_src === "PDF" ? (
              <AudioPlayer
                audio={`${process.env.NEXT_PUBLIC_URL}${lectureData?.audio}`}
                id={id}
                duration={lectureData?.duration}
              />
            ) : (
              <Box sx={{ maxHeight: "500px", width: "100%", height: 500 }}>
                {videoPlayer}
              </Box>
            )}
            {descriptionMOL}
            {lectureOverview}
            {lectureDetails}
            {/* {articles} */}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          {[
            [lectureAnalytics, lectureAttachment],
            [ratingSection, commentSection],
          ].map((section, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "row", lg: "column" },
                gap: 2,
                width: "100%",
                mb: index === 0 ? 2 : 0, 
                mt: { xs: index === 1 ? 2 : 0, md: 0 },
                overflowX: { xs: "auto", lg: "visible" },
                "& > *": {
                  flex: { xs: "1 1 0", lg: "none" },
                  width: { xs: "calc(50% - 1rem)", lg: "100%" },
                  minWidth: { xs: "150px", lg: "auto" },
                },
              }}
            >
              {section}
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LecturePage;
