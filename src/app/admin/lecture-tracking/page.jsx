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
  LinearProgress,
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
import SearchWithFilter from "@/components/teacher/Assignment/SearchWithFilter";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations()
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

  const statusColorMap = {
    COMPLETED: "#2ecc71", // green
    UPCOMMING: "#3498db", // blue
    MISSED: "#f1c40f", // yellow
    CANCELLED: "#e74c3c", // red
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
              {t("Lecture Tracking")}
            </Typography>
          </Box>
        }
      />
    ),
    [classValue, subject, searchQuery, month, lectureType]
  );

  const tableCellStyle = {
    fontWeight: 700,
    color: "#3B3D3B",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontStyle: "normal",
    lineHeight: "normal",
  };

  return (
    <Box
      sx={{
        padding: 2,
        height: "100%",
        minHeight: "100vh",
      }}
    >
      {/* {filters} */}

      {/* <Grid container spacing={2} sx={{ marginBottom: 2 }}>
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
      </Grid> */}

      <Box
        sx={{
          borderRadius: "20px",
          backgroundColor: "#fff",
          padding: "32px",
          // maxWidth: "1300px",
          // margin: "0 auto",
          display: "flex",
          alignItems: "center",
          alignSelf: "stretch",
          // gap: "16px",
        }}
      >
        <Grid container spacing={8}>
          {["COMPLETED", "UPCOMMING", "MISSED", "CANCELLED"]?.map((value) =>
            tabLoader ? (
              <Grid item xs={12} sm={6} md={3} key={value}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: 2,
                    height: 80,
                  }}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={3} key={value}>
                <Card
                  onClick={() => handleChange(value, "status")}
                  className="blur_effect_card"
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "50px",
                    padding: "5.5px 9px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "7px",
                    border: "0.5px solid #C1C1C1",
                    cursor: "pointer",
                    gap: "10px",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      // variant="subtitle2"
                      sx={{
                        color: "#3B3D3B",
                        fontFeatureSettings: "'liga' off, 'clig' off",
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: "600",
                        lineHeight: "19px",
                        marginBottom: "4px",
                      }}
                    >
                      {value.charAt(0) + value.slice(1).toLowerCase()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={lectureCount[mapData[value]]?.percent || 0}
                      sx={{
                        height: 7,
                        borderRadius: 5,
                        [`& .MuiLinearProgress-bar`]: {
                          backgroundColor: statusColorMap[value],
                        },
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      color: "#3B3D3B",
                      leadingTrim: "both",
                      textEdge: "cap",
                      fontFeatureSettings: "'liga' off, 'clig' off",
                      fontFamily: "Inter",
                      fontSize: "18.192px",
                      fontStyle: "normal",
                      fontWeight: "600",
                      lineHeight: "18.712px",
                    }}
                  >{`${
                    lectureCount[mapData[value]]?.percent || 0
                  }%`}</Typography>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Box>

      <SearchWithFilter />

      {/* Table */}
      <Box
        sx={{
          display: "flex",
          padding: "24px 32px 32px 32px",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch",
          borderRadius: "20px",
          background: "#fff",
          marginTop: "10px",
          height: "75vh",
        }}
      >
        {loading ? (
          <Box sx={{ mt: 4 }}>
            <TableSkeleton row={9} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              height: lectureData?.data?.length > 4 ? "100%" : "auto",
              overflowY: lectureData?.data?.length > 4 ? "scroll" : "visible",
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
              <TableHead sx={{
                  backgroundColor: "#F3F5F7",
                  borderRadius: "10px",
                  border: "none",
                }}>
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#F3F5F7",
                  }}
                >
                <TableCell sx={{
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      border: "none",
                      color: "#3B3D3B",
                      fontFamily: "Inter",
                      fontWeight: "600",
                      fontStyle: "normal",
                      lineHeight: "normal",
                      fontSize: "14px",
                    }}></TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: "#3B3D3B",
                      fontFamily: "Inter",
                      fontWeight: "600",
                      fontStyle: "normal",
                      lineHeight: "normal",
                      fontSize: "14px",
                      position: "sticky",
                    }}
                  >
                    {t("Name")}
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
                      position: "sticky",
                    }}
                  >
                    Type
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
                      position: "sticky",
                    }}
                  >
                    Date
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
                      position: "sticky",
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
                      position: "sticky",
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
                      position: "sticky",
                    }}
                  >
                    Subject Name
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
                      position: "sticky",
                    }}
                  >
                    Chapter
                  </TableCell>
                  {status === "UPCOMMING" && (
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
                    >
                    <TableCell><CalendarIconCustom date={lecture.schedule_date} /></TableCell>
                    
                      <TableCell sx={tableCellStyle}>{lecture.title}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        <LectureType lectureType={lecture?.type} />
                      </TableCell>
                      <TableCell sx={tableCellStyle}>{lecture.schedule_date}</TableCell>
                      <TableCell sx={tableCellStyle}>{lecture.schedule_time}</TableCell>
                      <TableCell sx={tableCellStyle}>
                        {lecture?.lecture_class?.name}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {lecture?.chapter?.subject?.name}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>{lecture?.chapter?.chapter}</TableCell>
                      {status === "UPCOMMING" && (
                        <TableCell sx={{}}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
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
                      {t("No Data Available")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

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
