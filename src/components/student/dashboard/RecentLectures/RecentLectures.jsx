"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Button, Skeleton, TableCell, TableRow, TableBody, TableHead, Table, TableContainer, Paper } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getStudentLectures } from "@/api/apiHelper";
import LectureCardSkeleton from "@/commonComponents/Skeleton/LectureCardSkeleton/LectureCardSkeleton";
import { FaExclamationCircle } from "react-icons/fa";
import LectureCardStudent from "@/commonComponents/LectureCard/LectureCardStudent";

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
      console.log("Response for student", response);
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
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        height: "100%",
        maxHeight: "353px",
        backgroundColor: "var(--Website_color-white, #FFF)",
        borderRadius: "20px",
        width:"100%",
        marginTop:"16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box sx={{ height: "24px", width: "24px", flexShrink: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.6602 10.4395L20.6802 14.6195C19.8402 18.2295 18.1802 19.6895 15.0602 19.3895C14.5602 19.3495 14.0202 19.2595 13.4402 19.1195L11.7602 18.7195C7.59018 17.7295 6.30018 15.6695 7.28018 11.4895L8.26018 7.29952C8.46018 6.44952 8.70018 5.70952 9.00018 5.09952C10.1702 2.67952 12.1602 2.02952 15.5002 2.81952L17.1702 3.20952C21.3602 4.18952 22.6402 6.25952 21.6602 10.4395Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.0599 19.3896C14.4399 19.8096 13.6599 20.1596 12.7099 20.4696L11.1299 20.9896C7.15985 22.2696 5.06985 21.1996 3.77985 17.2296L2.49985 13.2796C1.21985 9.30961 2.27985 7.20961 6.24985 5.92961L7.82985 5.40961C8.23985 5.27961 8.62985 5.16961 8.99985 5.09961C8.69985 5.70961 8.45985 6.44961 8.25985 7.29961L7.27985 11.4896C6.29985 15.6696 7.58985 17.7296 11.7599 18.7196L13.4399 19.1196C14.0199 19.2596 14.5599 19.3496 15.0599 19.3896Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.6401 8.53027L17.4901 9.76027"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11.6602 12.4004L14.5602 13.1404"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Box>

        <Typography
          sx={{
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontStyle: "normal",
            lineHeight: "normal",
          }}
        >
          Recent Lectures
        </Typography>
      </Box>

      {/* Skeleton Loading Section */}
      {isLoading && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{

            overflowY: "scroll",
            borderRadius: "10px",
            border: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table  sx={{ border: "none" }}>
            <TableHead
              sx={{
                backgroundColor: "#F3F5F7",
                borderRadius: "10px",
                border: "none",
              }}
            >
              <TableRow>
                <TableCell />
                <TableCell>Topic</TableCell>
                <TableCell>Institute</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" width="100%" height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Lecture Card Section */}
      {/* {allLecture?.lecture_data?.data?.length > 0 && (
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
      )} */}

      {allLecture?.lecture_data?.data?.length > 0 && (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  maxHeight:
                    allLecture?.lecture_data?.data?.length > 4 ? 300 : "auto", // Set scroll height only when needed
                  overflowY:
                    allLecture?.lecture_data?.data?.length > 4 ? "scroll" : "visible",
                  borderRadius: "10px",
                  border: "none",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE/Edge
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, Edge
                  },
                }}
              >
                <Table sx={{ border: "none" }}>
                  <TableHead
                    sx={{
                      backgroundColor: "#F3F5F7",
                      borderRadius: "10px",
                      border: "none",
                      position:"sticky"
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          borderTopLeftRadius: "10px",
                          borderBottomLeftRadius: "10px",
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      ></TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      >
                        Topic
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      >
                        Institute
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      >
                        Time
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      >
                        Class
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "none",
                          color: "#3B3D3B",
                          fontFamily: "Inter",
                          fontWeight: "600",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          fontSize: "14px",
                        }}
                      >
                        Subject
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ borderBottom: "none", width:"100%" }}>
                    {allLecture?.lecture_data?.data?.map((lecture) => (
                      <LectureCardStudent
                        key={lecture.id}
                        lecture={lecture}
                        getAllLecture={getAllLecture}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
