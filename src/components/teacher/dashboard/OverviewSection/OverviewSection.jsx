"use client";
import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getMyLectures } from "@/api/apiHelper";
import LectureCardSkeleton from "@/commonComponents/Skeleton/LectureCardSkeleton/LectureCardSkeleton";
import { FaExclamationCircle } from "react-icons/fa";
import { AppContextProvider } from "@/app/main";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const iconStyle = {
  fontSize: "24px",
  color: "#1976d2",
};

const OverviewSection = () => {
  const { handleCreateLecture, openCreateLecture, openRecordingDrawer } =
    useContext(AppContextProvider);
  const { isDarkMode } = useThemeContext();
  const [allLecture, setAllLecture] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  useEffect(() => {
    if (!openCreateLecture && !openRecordingDrawer) {
      getAllLecture();
    }
  }, [openCreateLecture, openRecordingDrawer]);

  const getAllLecture = async () => {
    setIsLoading(true);
    try {
      const status = userDetails?.role === "STUDENT" ? "COMPLETED" : "UPCOMMING";
      const response = await getMyLectures(status);
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
          sx={{ fontWeight: 600, fontFamily: "Inter, sans-serif", fontSize:"22px", fontStyle:"normal", lineHeight:"normal"}}
        >
          {userDetails?.role === "STUDENT"
            ? `Lectures For You`
            : `Upcoming Lectures`}
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
                <LectureCard lecture={lecture} getAllLecture={getAllLecture} />
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
          {userDetails?.role !== "STUDENT" && (
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
                  <FaExclamationCircle
                    size={30}
                    style={{ marginRight: "8px" }}
                  />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    You don&apos;t have any lectures. Please create a lecture.
                  </Box>
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FFD700", // Gold
                    transition: "all 150ms ease-in-out",
                    color: "#003366", // Dark blue for text
                    fontWeight: "bold",
                    padding: "12px 24px",
                    borderRadius: "8px", // Rounded corners
                    display: "flex",
                    alignItems: "center",
                    ":hover": {
                      backgroundColor: "#FFC107", // Slightly darker gold on hover
                      boxShadow:
                        "0 0 10px 0 #FFC107 inset, 0 0 10px 4px #FFC107", // Hover effect
                    },
                  }}
                  startIcon={<FaChalkboardTeacher size={20} />}
                  onClick={() => handleCreateLecture("", false)}
                >
                  Create Lecture
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default OverviewSection;
