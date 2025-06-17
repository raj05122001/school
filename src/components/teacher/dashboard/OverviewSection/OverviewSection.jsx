"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  Skeleton,
} from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import LectureCard from "@/commonComponents/LectureCard/LectureCard";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getMyLectures } from "@/api/apiHelper";
import LectureCardSkeleton from "@/commonComponents/Skeleton/LectureCardSkeleton/LectureCardSkeleton";
import { FaExclamationCircle } from "react-icons/fa";
import { AppContextProvider } from "@/app/main";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

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
const t=useTranslations();
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  useEffect(() => {
    if (!openCreateLecture && !openRecordingDrawer) {
      getAllLecture();
    }
  }, [openCreateLecture, openRecordingDrawer]);

  const getAllLecture = async () => {
    setIsLoading(true);
    try {
      const status =
        userDetails?.role === "STUDENT" ? "COMPLETED" : "UPCOMMING";
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
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        height: "100%",
        maxHeight: 465,
        backgroundColor: "var(--Website_color-white, #FFF)",
        borderRadius: "20px",
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
          {userDetails?.role === "STUDENT"
            ? t(`Lectures For You`)
            : t(`Upcoming Lectures`)}
        </Typography>
      </Box>

      {/* Skeleton Loading Section */}
      {/* {isLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 4 }, (_, ind) => (
            <Grid item xs={12} sm={6} md={6} key={ind}>
              <LectureCardSkeleton />
            </Grid>
          ))}
        </Grid>
      )} */}
      {isLoading && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: 400,
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
          <Table sx={{ border: "none" }}>
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
                <TableCell>Class</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Chapter</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
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
                <LectureCard lecture={lecture} getAllLecture={getAllLecture} />
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
              allLecture?.lecture_data?.data?.length > 4 ? 400 : "auto", // Set scroll height only when needed
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
                  Subject
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
                  Chapter
                </TableCell>
                <TableCell
                  sx={{
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                    border: "none",
                    color: "#3B3D3B",
                    fontFamily: "Inter",
                    fontWeight: "600",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    fontSize: "14px",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ borderBottom: "none" }}>
              {allLecture?.lecture_data?.data?.map((lecture) => (
                <LectureCard
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                maxHeight: 300,
                overflowY: "auto",
                borderRadius: "10px",
                border: "none",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "",
                      "Topic",
                      "Class",
                      "Time",
                      "Subject",
                      "Chapter",
                      "Action",
                    ].map((heading, i) => (
                      <TableCell key={i}>
                        <Skeleton variant="text" width="60%" />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: 2 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array.from({ length: 7 }).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton variant="text" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {userDetails?.role !== "STUDENT" && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          py={3}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#141514",
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              fontFamily: "Inter",
                              fontSize: "18px",
                            }}
                          >
                            <FaExclamationCircle
                              size={20}
                              style={{ marginRight: 8 }}
                            />
                            {t("No Lectures")}
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              display: "inline-flex",
                              padding: "12px 32px",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                              textTransform: "none",
                              borderRadius: "8px",
                              background: "#141514",
                              color: "#FFF",
                              textAlign: "center",
                              fontFeatureSettings: "'liga' off, 'clig' off",
                              fontFamily: "Aptos",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: "700",
                              lineHeight: "24px",
                              "&:hover": {
                                border: "1px solid #141514",
                                background: "#E5E5E5",
                                color: "#141514",
                              },
                            }}
                            // startIcon={<FaChalkboardTeacher size={18} />}
                            onClick={() => handleCreateLecture("", false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 25 24"
                              fill="none"
                            >
                              <path
                                d="M12.0625 22C17.5625 22 22.0625 17.5 22.0625 12C22.0625 6.5 17.5625 2 12.0625 2C6.5625 2 2.0625 6.5 2.0625 12C2.0625 17.5 6.5625 22 12.0625 22Z"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.0625 12H16.0625"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M12.0625 16V8"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            {t("Create Lecture")}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default OverviewSection;
