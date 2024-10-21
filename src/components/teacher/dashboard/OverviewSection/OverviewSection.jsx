"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getMyLectures } from "@/api/apiHelper";
import LectureCardSkeleton from "@/commonComponents/Skeleton/LectureCardSkeleton/LectureCardSkeleton";

const iconStyle = {
  fontSize: "24px",
  color: "#1976d2",
};

const OverviewSection = () => {
  const { isDarkMode } = useThemeContext();
  const [allLecture, setAllLecture] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllLecture();
  }, []);

  const getAllLecture = async () => {
    setIsLoading(true);
    try {
      const response = await getMyLectures("UPCOMMING");
      if (response?.data?.success) {
        setAllLecture(response?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, height: "100%", maxHeight: 465 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <FaChalkboardTeacher size={26} style={{ ...iconStyle }} />
        <Typography
          className={`${isDarkMode ? "dark-heading" : "light-heading"} h4`}
          sx={{ fontWeight: "bold" }}
        >
          Upcomming Lectures
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 4 }, (_, ind) => (
              <Grid item xs={12} sm={6} md={6} key={ind}>
                <LectureCardSkeleton />
              </Grid>
            ))
          : allLecture?.lecture_data?.data
              ?.slice(0, 4)
              ?.map((lecture, index) => (
                <Grid
                  item
                  xs={12}
                  sm={
                    allLecture?.lecture_data?.data?.length > 2
                      ? allLecture?.lecture_data?.data?.length === 3 &&
                        index === 2
                        ? 12
                        : 6
                      : 12
                  }
                  md={
                    allLecture?.lecture_data?.data?.length > 2
                      ? allLecture?.lecture_data?.data?.length === 3 &&
                        index === 2
                        ? 12
                        : 6
                      : 12
                  }
                  key={lecture.id}
                >
                  <LectureCard lecture={lecture} />
                </Grid>
              ))}
      </Grid>
    </Box>
  );
};

export default OverviewSection;
