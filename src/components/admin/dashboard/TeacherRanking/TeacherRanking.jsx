import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Skeleton,
} from "@mui/material";
import { borderRadius, styled } from "@mui/system";
import { CiStar } from "react-icons/ci";
import { TbTrendingUp } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getTeacherLectureCompletion,
  getTopTeachers,
  getWatchtimeComparison,
} from "@/api/apiHelper";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Image from "next/image";
import TeacherTableSkeleton from "./TeacherTableSkeleton";
import TeacherGraph from "./TeacherGraph";

const StarRating = styled(CiStar)({
  color: "#FFD700",
  marginBottom: "4px",
});

const TeacherRanking = ({ topTeachers, loading, onTeacherSelect }) => {
  // const { isDarkMode } = useThemeContext();
  // const [topTeacher, setTopTeachers] = useState({});
  // const [teacherID, setTeacherID] = useState(1);
  // const [countData, setCountData] = useState([]);
  // const [watchData, setWatchData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [loading2, setLoading2] = useState(true);
  // const [loading3, setLoading3] = useState(true);

  // useEffect(() => {
  //   fetchTopTeachers();
  // }, []);

  // const fetchTopTeachers = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getTopTeachers();
  //     if (response?.success) {
  //       setTopTeachers(response?.data);
  //       const topTeachersArray = Object.values(response?.data);
  //       handleRowClick(topTeachersArray?.[0]?.["Organizer ID"]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchTeacherLectureCount = async (teacherID) => {
  //   setLoading2(true);
  //   try {
  //     const response = await getTeacherLectureCompletion(teacherID);
  //     if (response?.success) {
  //       setCountData(response?.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching response", error);
  //   } finally {
  //     setLoading2(false);
  //   }
  // };

  // const fetchWatchtimeComparison = async (teacherID) => {
  //   setLoading3(true);
  //   try {
  //     const response = await getWatchtimeComparison(teacherID);
  //     if (response?.success) {
  //       setWatchData(response?.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching response", error);
  //   } finally {
  //     setLoading3(false);
  //   }
  // };

  const topTeachersArray = Object.values(topTeachers);

  // const handleRowClick = (id) => {
  //   setTeacherID(id);
  //   fetchTeacherLectureCount(id);
  //   fetchWatchtimeComparison(id);
  // };
  return (
      <Box sx={{ display: "flex", marginTop:"16px"}}>

            {/* Teachers Table on the Right */}
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                backgroundColor: "var(--Website_color-white, #FFF)",
                borderRadius: "20px",
                width:"100%"
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
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
                  All Teachers
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ mt: 4 }}>
                  <TeacherTableSkeleton row={4} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    maxHeight: topTeachersArray?.length > 5 ? 500 : "auto", // Set scroll height only when needed
                    overflowY:
                      topTeachersArray?.length > 5 ? "scroll" : "visible",
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
                      stickyHeader
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
                        >
                          Profile
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
                          Teacher
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
                          Total Lectures
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
                          Completed Lectures
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
                          Average Rating
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ borderBottom: "none" }}>
                      {topTeachersArray?.map((teacher, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                          }}
                          onClick={() =>
                            // handleRowClick(teacher?.["Organizer ID"])
                            onTeacherSelect(teacher?.["Organizer ID"])
                          }
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Image
                                src={
                                  teacher?.["Profile Pic"]
                                    ? `${BASE_URL_MEET}/media/${teacher?.["Profile Pic"]}`
                                    : "/TopTeachers.png"
                                }
                                width={50}
                                height={50}
                                style={{ borderRadius: "100%" }}
                                alt="Teacher pic"
                              />
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#3B3D3B",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                lineHeight: "normal",
                                width: "105px",
                              }}
                              noWrap
                            >
                              {teacher?.Name}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#3B3D3B",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                lineHeight: "normal",
                                width: "41px",
                                height: "18px",
                                flexShrink: 0,
                              }}
                            >
                              {teacher?.["Total Lectures"]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#3B3D3B",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                lineHeight: "normal",
                                width: "105px",
                              }}
                            >
                              {teacher["Completed Lectures"] || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#3B3D3B",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontStyle: "normal",
                                lineHeight: "normal",
                                width: "105px",
                              }}
                            >
                              {parseFloat(teacher["Average Feedback"]).toFixed(
                                2
                              ) || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
      </Box>
  );
};

export default TeacherRanking;
