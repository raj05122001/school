import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
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
import { getTeacherLectureCompletion, getTopTeachers, getWatchtimeComparison } from "@/api/apiHelper";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Image from "next/image";
import TeacherTableSkeleton from "./TeacherTableSkeleton";
import { useTranslations } from "next-intl";

/**
 * A small wrapper for the profile image to give it a circular border/ring.
 */
const AvatarWrapper = styled("div")(({ theme }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  overflow: "hidden",
  border: `2px solid ${theme.palette.primary?.light || "#90CAF9"}`,
}));

/**
 * StyledTableRow with fallback colors for action.selected and action.hover
 */
const StyledTableRow = styled(TableRow)(({ theme, ...props }) => ({
  cursor: "pointer",
  backgroundColor: props.selected 
    ? (theme.palette.action?.selected || "rgba(0, 0, 0, 0.04)") 
    : "#FFFFFF",
  "&:hover": {
    backgroundColor: theme.palette.action?.hover || "rgba(0, 0, 0, 0.08)",
  },
}));

const TeacherRanking = () => {
  const [countData, setCountData] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [topTeachers, setTopTeachers] = useState({});
  const [teacherID, setTeacherID] = useState(null);
  const [loading, setLoading] = useState(true);
  const t=useTranslations();

  // On mount, fetch the list of top teachers.
  useEffect(() => {
    fetchTopTeachers();
  }, []);

  const fetchTopTeachers = async () => {
    setLoading(true);
    try {
      const response = await getTopTeachers();
      if (response?.success) {
        setTopTeachers(response.data);

        // Automatically select the first teacher in the list (if exists).
        const teachersArray = Object.values(response.data);
        if (teachersArray.length > 0) {
          const firstId = teachersArray[0]["Organizer ID"];
          setTeacherID(firstId);
          await fetchTeacherDetails(firstId);
        }
      }
    } catch (err) {
      console.error("Error fetching top teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  // When a specific teacher is clicked/selected, fetch their lecture & watchtime data.
  const fetchTeacherDetails = async (id) => {
    try {
      const [lectureResp, watchResp] = await Promise.all([
        getTeacherLectureCompletion(id),
        getWatchtimeComparison(id),
      ]);

      if (lectureResp?.success) {
        setCountData(lectureResp.data);
      } else {
        setCountData([]);
      }

      if (watchResp?.success) {
        setWatchData(watchResp.data);
      } else {
        setWatchData([]);
      }
    } catch (err) {
      console.error("Error fetching teacher details:", err);
      setCountData([]);
      setWatchData([]);
    }
  };

  // Handler for clicking on a teacher row.
  const handleTeacherSelect = (id) => {
    if (id === teacherID) return; // If clicking the same teacher, do nothing.
    setTeacherID(id);
    fetchTeacherDetails(id);
  };

  // Convert topTeachers object into an array for mapping.
  const topTeachersArray = Object.values(topTeachers);

  return (
    <Box
      sx={{
        backgroundColor: "#F5F7FA",
        borderRadius: 2,
        p: 2,
        width: "100%",
      }}
    >
      <Grid container spacing={2}>
        {/* ========================== */}
        {/*      LEFT: TEACHERS TABLE  */}
        {/* ========================== */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 2, height: "100%", overflow: "visible" }}>
            <CardHeader
              sx={{
                backgroundColor: "#FFF",
                borderBottom: "1px solid #E0E0E0",
                "& .MuiCardHeader-title": {
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                },
              }}
              avatar={
                <Box sx={{ width: 36, height: 36 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21.6602 10.4395L20.6802 14.6195C19.8402 18.2295 18.1802 19.6895 15.0602 19.3895C14.5602 19.3495 14.0202 19.2595 13.4402 19.1195L11.7602 18.7195C7.59018 17.7295 6.30018 15.6695 7.28018 11.4895L8.26018 7.29952C8.46018 6.44952 8.70018 5.70952 9.00018 5.09952C10.1702 2.67952 12.1602 2.02952 15.5002 2.81952L17.1702 3.20952C21.3602 4.18952 22.6402 6.25952 21.6602 10.4395Z"
                      stroke="#3B3D3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.0599 19.3896C14.4399 19.8096 13.6599 20.1596 12.7099 20.4696L11.1299 20.9896C7.15985 22.2696 5.06985 21.1996 3.77985 17.2296L2.49985 13.2796C1.21985 9.30961 2.27985 7.20961 6.24985 5.92961L7.82985 5.40961C8.23985 5.27961 8.62985 5.16961 8.99985 5.09961C8.69985 5.70961 8.45985 6.44961 8.25985 7.29961L7.27985 11.4896C6.29985 15.6696 7.58985 17.7296 11.7599 18.7196L13.4399 19.1196C14.0199 19.2596 14.5599 19.3496 15.0599 19.3896Z"
                      stroke="#3B3D3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.6401 8.53027L17.4901 9.76027"
                      stroke="#3B3D3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.6602 12.4004L14.5602 13.1404"
                      stroke="#3B3D3B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              }
              title="All Teachers"
            />
            {loading ? (
              <Box sx={{ p: 2 }}>
                <TeacherTableSkeleton row={4} />
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  maxHeight: topTeachersArray.length > 5 ? 440 : "auto",
                  borderRadius: 0,
                  backgroundColor: "transparent",
                  overflow: "visible", // Allow arrow to be visible
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: "#F3F5F7" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#3B3D3B",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Profile
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3B3D3B",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Teacher
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3B3D3B",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                       {t(" Total Lectures")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3B3D3B",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Completed Lectures
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#3B3D3B",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Average Rating
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topTeachersArray.map((teacher, idx) => {
                      const isSelected = teacherID === teacher["Organizer ID"];
                      return (
                        <StyledTableRow
                          key={idx}
                          hover
                          selected={isSelected}   // pass the boolean here
                          onClick={() => handleTeacherSelect(teacher["Organizer ID"])}
                        >
                          <TableCell>
                            <AvatarWrapper>
                              <Image
                                src={
                                  teacher["Profile Pic"]
                                    ? `${BASE_URL_MEET}/media/${teacher["Profile Pic"]}`
                                    : "/TopTeachers.png"
                                }
                                width={50}
                                height={50}
                                alt="Teacher pic"
                                style={{ objectFit: "cover" }}
                              />
                            </AvatarWrapper>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                fontFamily: "Inter, sans-serif",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 140,
                              }}
                            >
                              {teacher.Name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {teacher["Total Lectures"]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {teacher["Completed Lectures"] || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ position: "relative" }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              {parseFloat(teacher["Average Feedback"] || 0).toFixed(2)}
                            </Typography>
                            {isSelected && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  right: -15,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: 0,
                                  height: 0,
                                  borderTop: "10px solid transparent",
                                  borderBottom: "10px solid transparent",
                                  borderLeft: "15px solid rgba(7, 18, 27, 0.08)",
                                  zIndex: 1000,
                                }}
                              />
                            )}
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>

        {/* =============================================== */}
        {/*      RIGHT: SELECTED TEACHER – CHARTS SECTION     */}
        {/* =============================================== */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* Lecture Completion Chart */}
            {teacherID && countData.length > 0 && (
              <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <Box sx={{ p: 2, borderBottom: "1px solid #E0E0E0" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 24, height: 24 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4.26172 11.0204V15.9904C4.26172 17.8104 4.26172 17.8104 5.98172 18.9704L10.7117 21.7004C11.4217 22.1104 12.5817 22.1104 13.2917 21.7004L18.0217 18.9704C19.7417 17.8104 19.7417 17.8104 19.7417 15.9904V11.0204C19.7417 9.20043 19.7417 9.20043 18.0217 8.04043L13.2917 5.31043C12.5817 4.90043 11.4217 4.90043 10.7117 5.31043L5.98172 8.04043C4.26172 9.20043 4.26172 9.20043 4.26172 11.0204Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5 7.63V5C17.5 3 16.5 2 14.5 2H9.5C7.5 2 6.5 3 6.5 5V7.56"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.6317 10.99L13.2017 11.88C13.2917 12.02 13.4917 12.16 13.6417 12.2L14.6617 12.46C15.2917 12.62 15.4617 13.16 15.0517 13.66L14.3817 14.47C14.2817 14.6 14.2017 14.83 14.2117 14.99L14.2717 16.04C14.3117 16.69 13.8517 17.02 13.2517 16.78L12.2717 16.39C12.1217 16.33 11.8717 16.33 11.7217 16.39L10.7417 16.78C10.1417 17.02 9.68173 16.68 9.72173 16.04L9.78173 14.99C9.79173 14.83 9.71173 14.59 9.61173 14.47L8.94173 13.66C8.53173 13.16 8.70173 12.62 9.33173 12.46L10.3517 12.2C10.5117 12.16 10.7117 12.01 10.7917 11.88L11.3617 10.99C11.7217 10.45 12.2817 10.45 12.6317 10.99Z"
                          stroke="#292D32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Lecture Completion
                    </Typography>
                  </Stack>
                </Box>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
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
                </CardContent>
              </Paper>
            )}

            {/* Lecture Watch‐time Chart */}
            {teacherID && watchData.length > 0 && (
              <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <Box sx={{ p: 2, borderBottom: "1px solid #E0E0E0" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 24, height: 24 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
                          stroke="#3B3D3B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V13"
                          stroke="#3B3D3B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 2H15"
                          stroke="#3B3D3B"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Lecture Watch‐time
                    </Typography>
                  </Stack>
                </Box>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
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
                        name="Avg Lecture Watchtime"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Paper>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherRanking;