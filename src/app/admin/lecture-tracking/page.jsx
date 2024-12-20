"use client";
import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Skeleton,
} from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getAllLectureCount,
  getMyLectures,
  getLectureTracking,
} from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import { BiSolidDownArrow } from "react-icons/bi";
import LectureType from "@/commonComponents/LectureType/LectureType";
import { MdOutlineEmergencyRecording } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { AppContextProvider } from "@/app/main";
import TableSkeleton from "@/commonComponents/Skeleton/TableSkeleton/TableSkeleton";

import { MdOutlineTrackChanges } from "react-icons/md";
import AdminFilters from "@/components/teacher/lecture-listings/Filters/AdminFilters";

const Page = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const {
    openRecordingDrawer,
    openCreateLecture,
    handleCreateLecture,
    handleLectureRecord,
  } = useContext(AppContextProvider);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const status = searchParams.get("status") || "COMPLETED";
  const [lectureCount, setLectureCount] = useState({});
  const [tabLoader, setTabLoader] = useState(false);
  const [lectureData, setLectureData] = useState([]);

  const classValue = searchParams.get("class") || "";
  const subject = searchParams.get("subject") || "";
  const searchQuery = searchParams.get("globalSearch") || "";
  const month = searchParams.get("month") || "";
  const lectureType = searchParams.get("lectureType") || "";
  const activePage = parseInt(searchParams.get("activePage")) || 1;

  const encodeURI = (value) => {
    return encodeURIComponent(value);
  };

  useEffect(() => {
    fetchAllLectureCount();
  }, []);

  useEffect(() => {
    fetchLectureData();
  }, [
    searchQuery,
    month,
    lectureType,
    status,
    activePage,
    subject,
    classValue,
  ]);

  const fetchAllLectureCount = async () => {
    try {
      setTabLoader(true);
      const response = await getAllLectureCount();
      setLectureCount(response?.data?.data);
      setTabLoader(false);
    } catch (error) {
      setTabLoader(false);
      console.error(error);
    }
  };

  const fetchLectureData = async () => {
    try {
      setLoading(true);
      const response = await getLectureTracking(
        status,
        searchQuery,
        lectureType ? lectureType : "",
        activePage,
        10,
        month,
        subject,
        classValue
      );

      setLectureData(response?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const mapData = {
    COMPLETED: "completed_lectures",
    UPCOMMING: "upcomming_lectures",
    MISSED: "missed_lectures",
    CANCELLED: "cancelled_lectures",
  };

  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    paginationItemColor: "#ffffff",
    paginationBg: "#333333",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    paginationItemColor: "#000000",
    paginationBg: "#f0f0f0",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  const handleChange = (value, parameterTypes) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(parameterTypes, value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const filters = useMemo(
    () => (
      <AdminFilters
        classValue={classValue}
        subject={subject}
        searchQuery={searchQuery}
        month={month}
        lectureType={lectureType}
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MdOutlineTrackChanges size={30} color={primaryColor} />
            <Typography variant="h4" color={isDarkMode ? "#E5E4E2" : "#36454F"}>
              Lecture Tracking
            </Typography>
          </Box>
        }
      />
    ),
    [classValue, subject, searchQuery, month, lectureType]
  );

  return (
    <Box
      sx={{
        padding: 2,
        height: "100%",
        minHeight: "100vh",
      }}
    >
      {filters}

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        {["COMPLETED", "UPCOMMING", "MISSED", "CANCELLED"]?.map((value) =>
          tabLoader ? (
            <Grid item xs={3} key={value} sx={{ position: "relative" }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: 10,
                  background: isDarkMode
                    ? "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)"
                    : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
                }}
                width="100%"
                height={100}
              />
            </Grid>
          ) : (
            <Grid item xs={3} key={value} sx={{ position: "relative" }}>
              <Card
                onClick={() => handleChange(value, "status")}
                className="blur_effect_card"
                sx={{
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                  cursor: "pointer",
                  padding: 2,
                  textAlign: "center",
                  position: "relative",
                  background: isDarkMode
                    ? "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)"
                    : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6">{value}</Typography>
                  <Typography variant="body1">
                    {lectureCount[mapData[value]]?.count || 0} Lectures
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <FacebookCircularProgress
                    value={lectureCount[mapData[value]]?.percent || 0}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
                    >{`${
                      lectureCount[mapData[value]]?.percent || 0
                    }%`}</Typography>
                  </Box>
                </Box>
              </Card>
              {status === value && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -23,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <BiSolidDownArrow size={30} color="#e9f1f8" />
                </Box>
              )}
            </Grid>
          )
        )}
      </Grid>

      {/* Table */}
      {loading ? (
        <Box sx={{ mt: 4 }}>
          <TableSkeleton row={9} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className="blur_effect_card"
          sx={{
            maxHeight: 420,
            mt: 4,
            background: isDarkMode
              ? ""
              : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
          }}
        >
          <Table className="blur_effect_card">
            <TableHead>
              <TableRow
                className="blur_effect_card"
                sx={{
                  background: isDarkMode
                    ? "radial-gradient(circle at 10% 20%, rgb(87, 108, 117) 0%, rgb(37, 50, 55) 100.2%)"
                    : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Time
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Class
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Subject Name
                </TableCell>
                <TableCell
                  sx={{
                    color: isDarkMode ? "#F9F6EE" : "#353935",
                    position: "sticky",
                  }}
                >
                  Chapter
                </TableCell>
                {status === "UPCOMMING" && (
                  <TableCell
                    sx={{
                      color: isDarkMode ? "#F9F6EE" : "#353935",
                      position: "sticky",
                    }}
                  >
                    Action
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: isDarkMode ? "#36454F" : "#FFFFF0" }}>
              {lectureData?.data?.length > 0 ? (
                lectureData?.data?.map((lecture, index) => (
                  <TableRow
                    key={index}
                    sx={{ color: isDarkMode ? "#36454F" : "#FFFFF0" }}
                  >
                    <TableCell sx={{}}>{lecture.title}</TableCell>
                    <TableCell sx={{}}>
                      <LectureType lectureType={lecture?.type} />
                    </TableCell>
                    <TableCell sx={{}}>{lecture.schedule_date}</TableCell>
                    <TableCell sx={{}}>{lecture.schedule_time}</TableCell>
                    <TableCell sx={{}}>
                      {lecture?.lecture_class?.name}
                    </TableCell>
                    <TableCell sx={{}}>
                      {lecture?.chapter?.subject?.name}
                    </TableCell>
                    <TableCell sx={{}}>{lecture?.chapter?.chapter}</TableCell>
                    {status === "UPCOMMING" && (
                      <TableCell sx={{}}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <MdOutlineEmergencyRecording
                            size={22}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleLectureRecord(lecture)}
                          />
                          <GrEdit
                            size={18}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCreateLecture(lecture, true)}
                          />
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {lectureData?.data?.length > 0 && lectureData?.total > 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Pagination
            page={Number(activePage)}
            onChange={(event, value) => handleChange(value, "activePage")}
            count={lectureData?.total}
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
              },
              "& .Mui-selected": {
                backgroundColor: isDarkMode
                  ? darkModeStyles.paginationSelectedBg
                  : lightModeStyles.paginationSelectedBg,
                color: isDarkMode
                  ? darkModeStyles.paginationSelectedColor
                  : lightModeStyles.paginationSelectedColor,
              },
            }}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Page;

export function FacebookCircularProgress(value) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: theme.palette.grey[200],
          ...theme.applyStyles("dark", {
            color: theme.palette.grey[800],
          }),
        })}
        size={55}
        thickness={4}
        {...value}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={(theme) => ({
          color: "#1a90ff",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#308fe8",
          }),
        })}
        size={55}
        thickness={4}
        {...value}
        value={Number(value?.value)}
      />
    </Box>
  );
}
