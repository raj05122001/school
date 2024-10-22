"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css'; // Import styles for CircularProgressBar
import { MdOutlineTrackChanges } from "react-icons/md";

const dummyLectures = {
  UPCOMING: [
    {
      name: "Lecture 1",
      type: "Online",
      date: "2024-10-25",
      time: "10:00 AM",
      professor: "Prof. A",
      semester: "Fall 2024",
      subjectName: "Mathematics",
      chapter: "Algebra",
      topics: "Linear Equations",
    },
    {
      name: "Lecture 2",
      type: "Offline",
      date: "2024-10-26",
      time: "11:00 AM",
      professor: "Prof. B",
      semester: "Fall 2024",
      subjectName: "Physics",
      chapter: "Mechanics",
      topics: "Newton's Laws",
    },
    {
      name: "Lecture 3",
      type: "Online",
      date: "2024-10-27",
      time: "12:00 PM",
      professor: "Prof. C",
      semester: "Fall 2024",
      subjectName: "Chemistry",
      chapter: "Organic",
      topics: "Hydrocarbons",
    },
  ],
  COMPLETED: [
    {
      name: "Lecture 4",
      type: "Online",
      date: "2024-09-20",
      time: "10:00 AM",
      professor: "Prof. D",
      semester: "Fall 2024",
      subjectName: "Biology",
      chapter: "Cell Biology",
      topics: "Cell Structure",
    },
    {
      name: "Lecture 5",
      type: "Offline",
      date: "2024-09-21",
      time: "11:00 AM",
      professor: "Prof. E",
      semester: "Fall 2024",
      subjectName: "History",
      chapter: "World War II",
      topics: "Causes and Effects",
    },
    {
      name: "Lecture 6",
      type: "Online",
      date: "2024-09-22",
      time: "12:00 PM",
      professor: "Prof. F",
      semester: "Fall 2024",
      subjectName: "Geography",
      chapter: "Maps",
      topics: "Types of Maps",
    },
  ],
  MISSED: [
    {
      name: "Lecture 7",
      type: "Online",
      date: "2024-09-15",
      time: "10:00 AM",
      professor: "Prof. G",
      semester: "Fall 2024",
      subjectName: "Economics",
      chapter: "Microeconomics",
      topics: "Supply and Demand",
    },
    {
      name: "Lecture 8",
      type: "Offline",
      date: "2024-09-16",
      time: "11:00 AM",
      professor: "Prof. H",
      semester: "Fall 2024",
      subjectName: "Political Science",
      chapter: "Governance",
      topics: "Types of Government",
    },
    {
      name: "Lecture 9",
      type: "Online",
      date: "2024-09-17",
      time: "12:00 PM",
      professor: "Prof. I",
      semester: "Fall 2024",
      subjectName: "Sociology",
      chapter: "Social Institutions",
      topics: "Family and Education",
    },
  ],
  CANCELLED: [
    {
      name: "Lecture 10",
      type: "Online",
      date: "2024-09-12",
      time: "10:00 AM",
      professor: "Prof. J",
      semester: "Fall 2024",
      subjectName: "Mathematics",
      chapter: "Calculus",
      topics: "Limits",
    },
    {
      name: "Lecture 11",
      type: "Offline",
      date: "2024-09-13",
      time: "11:00 AM",
      professor: "Prof. K",
      semester: "Fall 2024",
      subjectName: "Physics",
      chapter: "Thermodynamics",
      topics: "Laws of Thermodynamics",
    },
    {
      name: "Lecture 12",
      type: "Online",
      date: "2024-09-14",
      time: "12:00 PM",
      professor: "Prof. L",
      semester: "Fall 2024",
      subjectName: "Chemistry",
      chapter: "Inorganic",
      topics: "Periodic Table",
    },
  ],
};

const LectureTabs = () => {
  const [currentTab, setCurrentTab] = useState("UPCOMING");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLectures();
  }, [currentTab, searchTerm, selectedMonth]);

  const fetchLectures = () => {
    setLoading(true);
    const filteredLectures = dummyLectures[currentTab].filter((lecture) =>
      lecture.name.toLowerCase().includes(searchTerm)
    );
    setLectures(filteredLectures);
    setLoading(false);
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

  // Calculate completion percentage (dummy values for demonstration)
  const getLectureCount = (status) => dummyLectures[status].length;
  const getCompletionPercentage = () => {
    const totalLectures = Object.values(dummyLectures).reduce(
      (sum, lectures) => sum + lectures.length,
      0
    );
    const completedLectures = getLectureCount("COMPLETED");
    return totalLectures
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundImage:
          "url('/lectureTracking.jpg')" /* Replace with your image path */,
        backgroundSize: "cover" /* Ensures the image covers the whole area */,
        backgroundPosition: "center" /* Centers the image */,
        backgroundRepeat: "no-repeat" /* Prevents the image from repeating */,
        height: "100vh" /* Makes the background cover the full height */,
      }}
    >
      {/* Top Controls: Search, Month Selector */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        sx={{ marginBottom: 2 }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h4" color={"white"}><MdOutlineTrackChanges style={{marginRight:"2px", paddingTop:"2px"}}/>Lecture Tracking</Typography>
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
          {/* Search Bar */}
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={handleSearchChange}
            sx={{ marginRight: 2 }}
          />

          {/* Month Selector */}
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Month"
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
        {["COMPLETED", "UPCOMING", "MISSED", "CANCELLED"].map((status) => (
          <Grid item xs={3} key={status}>
            <Card
              onClick={() => handleTabClick(status)}
              className="blur_effect_card"
              sx={{
                color: "white",
                cursor: "pointer",
                padding: 2,
                textAlign: "center",
                position: "relative",
                background:
                  "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)",
              }}
            >
              <Typography variant="h6">{status}</Typography>
              <Typography variant="body1">
                {getLectureCount(status)} Lectures
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="white"
                  sx={{ position: "absolute" }}
                >
                  {getCompletionPercentage()}%
                </Typography>
                <Box sx={{ width: 50, height: 50, margin: "0 auto" }}>
                <CircularProgressbar value={getCompletionPercentage(status)} text={`${getCompletionPercentage(status)}%`} />
              </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} className="blur_effect_card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Type</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Time</TableCell>
              <TableCell sx={{ color: "white" }}>Professor</TableCell>
              <TableCell sx={{ color: "white" }}>Semester</TableCell>
              <TableCell sx={{ color: "white" }}>Subject Name</TableCell>
              <TableCell sx={{ color: "white" }}>Chapter</TableCell>
              <TableCell sx={{ color: "white" }}>Topics</TableCell>
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
              lectures.map((lecture, index) => (
                <TableRow key={index} sx={{ color: "white" }}>
                  <TableCell sx={{ color: "white" }}>{lecture.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>{lecture.type}</TableCell>
                  <TableCell sx={{ color: "white" }}>{lecture.date}</TableCell>
                  <TableCell sx={{ color: "white" }}>{lecture.time}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {lecture.professor}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {lecture.semester}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {lecture.subjectName}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {lecture.chapter}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {lecture.topics}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LectureTabs;
