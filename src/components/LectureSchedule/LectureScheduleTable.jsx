import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Skeleton,
  Pagination
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getMyLectures ,getLectureTracking} from "@/api/apiHelper";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useSearchParams, useRouter } from "next/navigation";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const TABLE_HEAD = [
  "Title",
  "Date",
  "Class",
  "Subject",
  "Chapter",
  "Academic Year",
  "Starting Time",
  "Allotted hr",
];

const LectureScheduleTable = () => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode, primaryColor } = useThemeContext();
  const [lectureData, setLectureData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const activePage = parseInt(searchParams.get("activePage")) || 1;

  const fetchLectureData = async (page = 1) => {
    try {
      setLoading(true); // Start loading
      if(userDetails?.role==="TEACHER"){
        const response = await getMyLectures("UPCOMMING", "", "", page);
        console.log("Response for table", response)
        setLectureData(response?.data?.data?.lecture_data);
      }else{
        const response = await getLectureTracking("UPCOMMING", "", "", page);
        setLectureData(response?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };
  
  useEffect(() => {
    fetchLectureData(activePage);
  }, [activePage]);

  const formatTime = (time) => {
    const [hours, minutes] = time?.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const handleChange = (event, value) => {
    console.log("Value", value)
    router.push(`/teacher/lecture-schedule?activePage=${value}`);
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

  return (
    <Box sx={{ p: 2, height:"100%", width:"100%" }} >
      {/* Show skeleton loader when loading */}
      {loading ? (
        <TableContainer component={Paper} className="blur_effect_card">
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: isDarkMode
                    ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
                    : "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)",
                }}
              >
                {TABLE_HEAD?.map((head, index) => (
                  <TableCell
                    key={index}
                    sx={{ color: isDarkMode ? "white" : "black" }}
                    className="px-6 py-3 text-left text-base font-medium uppercase tracking-wider"
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)]?.map((_, index) => (
                <TableRow key={index}>
                  {TABLE_HEAD?.map((_, idx) => (
                    <TableCell key={idx}>
                      <Skeleton
                        variant="text"
                        width="100%"
                        height={30}
                        sx={{
                          backgroundColor: isDarkMode ? "#616161" : "#f0f0f0",
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : lectureData?.data?.length > 0 ? (
        <TableContainer component={Paper} className="blur_effect_card">
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: isDarkMode
                    ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
                    : "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)",
                }}
              >
                {TABLE_HEAD?.map((head) => (
                  <TableCell
                    key={head}
                    sx={{ color: isDarkMode ? "white" : "#B2BEB5" }}
                    className="px-6 py-3 text-left text-base font-medium uppercase tracking-wider"
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lectureData?.data?.map((lecture, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.title}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.schedule_date ?? "-"}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.lecture_class?.name}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.chapter?.subject?.name}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.chapter?.chapter}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.academic_year}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.schedule_time
                      ? formatTime(lecture?.schedule_time)
                      : "-"}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.duration ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          // height="100vh"
          width="100%"
          height="60%"
        >
          <AiOutlineExclamationCircle
            style={{ fontSize: "48px", color: "#b0bec5" }}
          />
          <Typography variant="h6" color="textSecondary">
            No lecture found
          </Typography>
        </Box>
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
            page={activePage}
            onChange={handleChange}
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

export default LectureScheduleTable;
