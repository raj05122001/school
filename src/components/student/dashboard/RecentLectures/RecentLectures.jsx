"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getStudentLectures } from "@/api/apiHelper";
import LectureCardSkeleton from "@/commonComponents/Skeleton/LectureCardSkeleton/LectureCardSkeleton";
import { FaExclamationCircle } from "react-icons/fa";

const iconStyle = {
  fontSize: "24px",
  color: "#1976d2",
};

const RecentLectures = () => {
  const { isDarkMode } = useThemeContext();
  const [allLecture, setAllLecture] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllLecture();
  }, []);

  const getAllLecture = async () => {
    setIsLoading(true);
    try {
      const response = await getStudentLectures("COMPLETED");
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
          variant="h4"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          sx={{ fontWeight: "bold" }}
        >
          Recent Lectures
        </Typography>
      </Box>

      {/* Skeleton Loading Section */}
      {isLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }, (_, ind) => (
            <Grid item xs={12} sm={6} md={6} key={ind}>
              <LectureCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Lecture Card Section */}
      {allLecture?.lecture_data?.data?.length > 0 && (
        <Grid container spacing={3}>
          {allLecture?.lecture_data?.data
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
      )}

      {/* No Data Section */}
      {allLecture?.lecture_data?.data?.length === 0 && !isLoading && (
        <Grid container spacing={3} direction="row">
          {/* Skeleton Loading Section */}
          <Grid item container xs={12} sm={6} spacing={2}>
            <Grid item xs={12}>
              <LectureCardSkeleton />
            </Grid>
            <Grid item xs={12}>
              <LectureCardSkeleton />
            </Grid>
          </Grid>
          {/* Create Lecture Section */}
          <Grid
            item
            container
            xs={12}
            sm={6}
            justifyContent="center"
            alignItems="center"
            direction="column"
            spacing={2}
          >
            <Grid item>
              <Typography
                variant="h6"
                align="center"
                color={isDarkMode ? "white" : "textSecondary"}
              >
                <FaExclamationCircle size={30} style={{ marginRight: "8px" }} />
                <Box display="flex" alignItems="center" justifyContent="center">
                  You don&apos;t have any lectures.
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RecentLectures;
