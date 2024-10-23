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
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getMyLectures } from "@/api/apiHelper";
import { AiOutlineExclamationCircle } from "react-icons/ai";

// Sample lecture data
const sampleLectures = [
  {
    title: "Introduction to AI",
    date: "2024-10-23",
    class: "10th Grade",
    subject: "Computer Science",
    chapter: "Basics of AI",
    topics: "History, Applications",
    academicYear: "2024-2025",
    startingTime: "10:00 AM",
    allottedHr: 2,
  },
  {
    title: "Data Structures",
    date: "2024-10-24",
    class: "12th Grade",
    subject: "Mathematics",
    chapter: "Trees and Graphs",
    topics: "Binary Trees, Graph Traversals",
    academicYear: "2024-2025",
    startingTime: "1:00 PM",
    allottedHr: 1.5,
  },
  {
    title: "Modern Physics",
    date: "2024-10-25",
    class: "11th Grade",
    subject: "Physics",
    chapter: "Quantum Mechanics",
    topics: "Photoelectric Effect, Wave-Particle Duality",
    academicYear: "2024-2025",
    startingTime: "9:00 AM",
    allottedHr: 2,
  },
  {
    title: "Organic Chemistry",
    date: "2024-10-26",
    class: "12th Grade",
    subject: "Chemistry",
    chapter: "Hydrocarbons",
    topics: "Alkanes, Alkenes, Alkynes",
    academicYear: "2024-2025",
    startingTime: "11:00 AM",
    allottedHr: 1,
  },
  {
    title: "Introduction to Programming",
    date: "2024-10-27",
    class: "10th Grade",
    subject: "Computer Science",
    chapter: "Basics of Programming",
    topics: "Variables, Control Structures",
    academicYear: "2024-2025",
    startingTime: "2:00 PM",
    allottedHr: 1.5,
  },
];

const TABLE_HEAD = [
  "Title",
  "Date",
  "Class",
  "Subject",
  "Chapter",
  "Topics",
  "Academic Year",
  "Starting Time",
  "Allotted hr",
];

const LectureScheduleTable = () => {
  const { isDarkMode, primaryColor } = useThemeContext();
  const [lectureData, setLectureData] = useState([]);

  const fetchLectureData = async () => {
    try {
      const response = await getMyLectures("UPCOMMING");
      setLectureData(response?.data?.data?.lecture_data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLectureData();
  }, []);

  console.log("Lecture Data incoming", lectureData);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${adjustedHours}:${minutes} ${period}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      {lectureData?.data?.length > 0 ? (
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
                {TABLE_HEAD.map((head) => (
                  <TableCell
                    key={head}
                    sx={{color:isDarkMode ? "white":"black"}}
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
                    {lecture?.topics}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.academic_year}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "white" : "black" }}>
                    {lecture?.schedule_time ? formatTime(lecture?.schedule_time) : "-"}
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
          height="100vh"
        >
          <AiOutlineExclamationCircle
            style={{ fontSize: "48px", color: "#b0bec5" }}
          />
          <Typography variant="h6" color="textSecondary">
            No lecture found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LectureScheduleTable;
