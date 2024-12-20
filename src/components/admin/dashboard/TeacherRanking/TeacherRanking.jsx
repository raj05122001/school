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

const StarRating = styled(CiStar)({
  color: "#FFD700",
  marginBottom: "4px",
});

const TeacherRanking = () => {
  const { isDarkMode } = useThemeContext();
  const [topTeacher, setTopTeachers] = useState({});
  const [teacherID, setTeacherID] = useState(1);
  const [countData, setCountData] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  useEffect(() => {
    fetchTopTeachers();
  }, []);

  const fetchTopTeachers = async () => {
    setLoading(true);
    try {
      const response = await getTopTeachers();
      if (response?.success) {
        setTopTeachers(response?.data);
        const topTeachersArray = Object.values(response?.data);
        handleRowClick(topTeachersArray?.[0]?.["Organizer ID"]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherLectureCount = async (teacherID) => {
    setLoading2(true);
    try {
      const response = await getTeacherLectureCompletion(teacherID);
      if (response?.success) {
        setCountData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching response", error);
    } finally {
      setLoading2(false);
    }
  };

  const fetchWatchtimeComparison = async (teacherID) => {
    setLoading3(true);
    try {
      const response = await getWatchtimeComparison(teacherID);
      if (response?.success) {
        setWatchData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching response", error);
    } finally {
      setLoading3(false);
    }
  };

  const topTeachersArray = Object.values(topTeacher);

  const handleRowClick = (id) => {
    setTeacherID(id);
    fetchTeacherLectureCount(id);
    fetchWatchtimeComparison(id);
  };
  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        margin: "0 auto",
        height: "100%",
        color: isDarkMode ? "#FFF8DC" : "#36454F",
        background: isDarkMode
          ? ""
          : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      }}
      className="blur_effect_card"
    >
      <Box sx={{ display: "flex" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box>
              <Typography variant="h4" align="left" gutterBottom>
                <TbTrendingUp
                  style={{ marginRight: "2px", marginTop: "2px" }}
                />
                Trending Teachers
              </Typography>
              {/* Top 3 Teachers on the Left */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  // marginLeft: "16px",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "10px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: isDarkMode
                        ? "0 6px 10px #D3D3D3"
                        : "0 6px 10px #FBCEB1",
                      margin: "8px 0",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h2" sx={{ color: "#36454F" }} > 
                     <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                     <Skeleton variant="circular" width={100} height={100}/>
                     </Box> 
                      <Skeleton variant="text" width={150} height={40} />
                      <Skeleton variant="text" width={150} height={20} />
                      <Skeleton variant="text" width={150} height={20} />
                    </Typography>
                  </Box>
                ) : (
                  topTeachersArray?.map((teacher, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: isDarkMode
                          ? "0 6px 10px #D3D3D3"
                          : "0 6px 10px #FBCEB1",
                        margin: "8px 0",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {/* <Avatar sx={{ width: 56, height: 56, marginBottom: "8px" }}>
                {teacher?.Name[0]}
              </Avatar> */}
                      <Image
                        src={
                          teacher?.["Profile Pic"]
                            ? `${BASE_URL_MEET}/media/${teacher?.["Profile Pic"]}`
                            : "/TopTeachers.png"
                        }
                        alt="Teacher pic"
                        width={100}
                        height={100}
                        style={{ borderRadius: "100%" }}
                      />
                      <Typography variant="h6" mt={2}>
                        {teacher?.Name}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Lectures {teacher["Total Lectures"] || 0}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Completed Lectures {teacher["Completed Lectures"] || 0}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <StarRating />
                        <Typography variant="body2">
                          {parseFloat(teacher["Average Feedback"]).toFixed(2) ||
                            0}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            {/* Teachers Table on the Right */}
            <Box>
              <Typography variant="h4" align="center" gutterBottom>
                <FaChalkboardTeacher /> All Teachers
              </Typography>

              {loading ? (
                <Box sx={{ mt: 4 }}>
                  <TeacherTableSkeleton row={4} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  className="blur_effect_card"
                  sx={{ margin: "0 auto", maxHeight: 600 }}
                >
                  <Table>
                    <TableHead stickyHeader>
                      <TableRow>
                        <TableCell>Profile</TableCell>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Total Lectures</TableCell>
                        <TableCell>Completed Lectures</TableCell>
                        <TableCell>Average Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topTeachersArray?.map((teacher, index) => (
                        <TableRow
                          key={index}
                          onClick={() =>
                            handleRowClick(teacher?.["Organizer ID"])
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

                          <TableCell>{teacher?.Name}</TableCell>

                          <TableCell>{teacher?.["Total Lectures"]}</TableCell>
                          <TableCell>
                            {teacher["Completed Lectures"] || 0}
                          </TableCell>
                          <TableCell>
                            {parseFloat(teacher["Average Feedback"]).toFixed(
                              2
                            ) || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box>
                <Box display={"flex"} gap={2}>
                  {/* Line Chart for Lecture Completion Data */}
                  {teacherID && countData?.length > 0 && (
                    <Box
                      sx={{ marginTop: 4, width: "100%", height: "20%" }}
                      className="blur_effect_card"
                    >
                      <Typography
                        mt={3}
                        variant="h6"
                        align="center"
                        gutterBottom
                      >
                        Lecture Completion Analytics
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                          data={countData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            angle={-45}
                            dy={10}
                            textAnchor="end"
                            interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                          />
                          <Line
                            type="monotone"
                            dataKey="teacher_data"
                            stroke="#8884d8"
                            name="Teacher Lecture Count"
                          />
                          <Line
                            type="monotone"
                            dataKey="avg_data"
                            stroke="#82ca9d"
                            name="Average Lecture Count"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}

                  {/* Line Chart for Lecture Watchime Data Comparison */}
                  {teacherID && watchData?.length > 0 && (
                    <Box
                      sx={{ marginTop: 4, width: "100%", height: "20%" }}
                      className="blur_effect_card"
                    >
                      <Typography
                        mt={3}
                        variant="h6"
                        align="center"
                        gutterBottom
                      >
                        Lecture Watchtime Analytics
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                          data={watchData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            angle={-45}
                            dy={10}
                            textAnchor="end"
                            interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                          />
                          <Line
                            type="monotone"
                            dataKey="teacher_data"
                            stroke="#8884d8"
                            name="Watchtime"
                          />
                          <Line
                            type="monotone"
                            dataKey="avg_data"
                            stroke="#82ca9d"
                            name="Average Lecture Watchtime"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Box>
                <Typography
                  sx={{
                    // mt: 2,
                    textAlign: "center",
                    fontSize: "12px",
                    color: isDarkMode ? "#f0f0f0" : "#2b2b2b",
                  }}
                >
                  Select a teacher to view detailed analytics. The charts will
                  display trends over time, including the number of lectures
                  completed and watch time analytics, allowing a comparison
                  between the selected teacher&apos;s performance and the
                  overall average.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherRanking;
