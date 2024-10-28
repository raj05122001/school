"use client";
import React, { useState, useEffect, useContext } from "react";
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
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Pagination,
} from "@mui/material";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { MdOutlineTrackChanges } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllLectureCount, getMyLectures } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import DarkMode from "@/components/DarkMode/DarkMode";
import { MdArrowDropDown } from "react-icons/md";
import { BiSolidDownArrow } from "react-icons/bi";
import LectureType from "@/commonComponents/LectureType/LectureType";
import { MdOutlineEmergencyRecording } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { AppContextProvider } from "@/app/main";

const LectureTabs = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const {
    openRecordingDrawer,
    openCreateLecture,
    handleCreateLecture,
    handleLectureRecord,
  } = useContext(AppContextProvider);
  const [currentTab, setCurrentTab] = useState("UPCOMMING");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();

  const searchQuery = searchParams.get("search")
    ? searchParams.get("search").replace(/-/g, " ")
    : "";
  const status = searchParams.get("status") || "COMPLETED";
  const getDate = searchParams.get("dateFilter") || null;
  const selectedType = searchParams.get("meetingType") || null;
  const activePage = searchParams.get("activePage") || 1;
  const [searchData, setSearchData] = useState(searchQuery);
  const [lectureCount, setLectureCount] = useState({});
  const [tabLoader, setTabLoader] = useState(false);
  const [lectureData, setLectureData] = useState([]);

  console.log("lectureData,", lectureData);

  useEffect(() => {
    fetchAllLectureCount();
  }, []);

  useEffect(() => {
    fetchLectureData();
  }, [searchQuery, getDate, selectedType, status, activePage]);

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
      const response = await getMyLectures(
        status,
        selectedType ? selectedType : "",
        searchQuery,
        activePage,
        10,
        getDate
      );
      setLectureData(response?.data?.data?.lecture_data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleTabClick = (status) => {
    setCurrentTab(status);
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

  return (
    <Box
      sx={{
        padding: 2,
        // backgroundImage: "url('/lectureTracking.jpg')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      {/* Top Controls: Search, Month Selector */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        sx={{ marginBottom: 2 }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <MdOutlineTrackChanges size={30} color={primaryColor} />
          <Typography variant="h4" color={primaryColor}>
            Lecture Tracking
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >
          <DarkMode />
          {/* Search Bar */}
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={handleSearchChange}
            sx={{
              marginRight: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // sets the outline color to white
                },
                "&:hover fieldset": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // sets the outline color to white on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // keeps the outline color white when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: isDarkMode ? "#F9F6EE" : "#353935", // sets the label color to white
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: isDarkMode ? "#F9F6EE" : "#353935", // keeps the label color white when focused
              },
            }}
          />

          {/* Month Selector */}
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Month"
              sx={{
                color: isDarkMode ? "#F9F6EE" : "#353935", // changes the selected text color to white
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // changes the outline color to white
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // keeps the outline color white on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#F9F6EE" : "#353935", // keeps the outline color white when focused
                },
                "& .MuiSvgIcon-root": {
                  color: isDarkMode ? "#F9F6EE" : "#353935", // changes the dropdown icon color to white
                },
                "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#F9F6EE" : "#353935", // Label color
                    },
                "& .MuiInputBase-input": {
                      color: isDarkMode ? "#F9F6EE" : "#353935", // Input text (date value) color
                },
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Cards representing tabs */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        {["COMPLETED", "UPCOMMING", "MISSED", "CANCELLED"].map((value) => (
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
                <BiSolidDownArrow size={30} color="#5F7182" />
              </Box>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Table */}
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
        <Table>
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
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              lectureData?.data?.length > 0 &&
              lectureData?.data?.map((lecture, index) => (
                <TableRow key={index} sx={{ color: secondaryColor }}>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture.title}
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    <LectureType lectureType={lecture?.type} />
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture.schedule_date}
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture.schedule_time}
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture?.lecture_class?.name}
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture?.chapter?.subject?.name}
                  </TableCell>
                  <TableCell sx={{ color: secondaryColor }}>
                    {lecture?.chapter?.chapter}
                  </TableCell>
                  {status === "UPCOMMING" && (
                    <TableCell sx={{ color: secondaryColor }}>
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
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default LectureTabs;

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
