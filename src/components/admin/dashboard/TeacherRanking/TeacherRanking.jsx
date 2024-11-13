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
} from "@mui/material";
import { borderRadius, styled } from "@mui/system";
import { CiStar } from "react-icons/ci";
import { TbTrendingUp } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getTopTeachers } from "@/api/apiHelper";
import { BASE_URL_MEET } from "@/constants/apiconfig";

// Sample data for illustration
const topTeachers = [
  { name: "John Doe", subject: "Mathematics", rating: 4.9 },
  { name: "Jane Smith", subject: "Physics", rating: 4.8 },
  { name: "Mark Johnson", subject: "Chemistry", rating: 4.7 },
];

const otherTeachers = [
  {
    name: "Alice Brown",
    subject: "Biology",
    rating: 4.5,
    department: "Science",
    experience: "5 years",
  },
  {
    name: "Michael Lee",
    subject: "English",
    rating: 4.4,
    department: "Languages",
    experience: "4 years",
  },
  {
    name: "Emily Davis",
    subject: "History",
    rating: 4.3,
    department: "Social Studies",
    experience: "3 years",
  },
  {
    name: "David Smith",
    subject: "Mathematics",
    rating: 4.2,
    department: "Math",
    experience: "2 years",
  },
  {
    name: "Sarah Johnson",
    subject: "Chemistry",
    rating: 4.1,
    department: "Science",
    experience: "1 year",
  },
  {
    name: "Thomas Miller",
    subject: "Physics",
    rating: 4.0,
    department: "Science",
    experience: "6 years",
  },
  {
    name: "Olivia Wilson",
    subject: "Art",
    rating: 4.9,
    department: "Arts",
    experience: "7 years",
  },
  {
    name: "Benjamin Carter",
    subject: "Music",
    rating: 4.8,
    department: "Arts",
    experience: "8 years",
  },
  {
    name: "Sophia Taylor",
    subject: "Geography",
    rating: 4.7,
    department: "Social Studies",
    experience: "9 years",
  },
  {
    name: "William Anderson",
    subject: "Computer Science",
    rating: 4.6,
    department: "Technology",
    experience: "10 years",
  },
  {
    name: "Ava Clark",
    subject: "Spanish",
    rating: 4.5,
    department: "Languages",
    experience: "5 years",
  },
  {
    name: "Ethan Mitchell",
    subject: "French",
    rating: 4.4,
    department: "Languages",
    experience: "4 years",
  },
  {
    name: "Mia Rose",
    subject: "Psychology",
    rating: 4.3,
    department: "Social Studies",
    experience: "3 years",
  },
  {
    name: "Noah James",
    subject: "Sociology",
    rating: 4.2,
    department: "Social Studies",
    experience: "2 years",
  },
  {
    name: "Ella Bennett",
    subject: "Economics",
    rating: 4.1,
    department: "Social Studies",
    experience: "1 year",
  },
  {
    name: "Liam Cooper",
    subject: "Philosophy",
    rating: 4.0,
    department: "Humanities",
    experience: "6 years",
  },
  {
    name: "Charlotte King",
    subject: "Religion",
    rating: 4.9,
    department: "Humanities",
    experience: "7 years",
  },
  {
    name: "Oliver Harris",
    subject: "Literature",
    rating: 4.8,
    department: "Humanities",
    experience: "8 years",
  },
  {
    name: "Amelia Scott",
    subject: "Drama",
    rating: 4.7,
    department: "Arts",
    experience: "9 years",
  },
  {
    name: "Jacob Thompson",
    subject: "Dance",
    rating: 4.6,
    department: "Arts",
    experience: "10 years",
  },
];

const StarRating = styled(CiStar)({
  color: "#FFD700",
  marginBottom: "4px",
});

const TeacherRanking = () => {
  const { isDarkMode } = useThemeContext();
  const [topTeacher, setTopTeachers] = useState({});

  const fetchTopTeachers = async () => {
    try {
      const response = await getTopTeachers();
      if (response?.success) {
        setTopTeachers(response?.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchTopTeachers();
  }, []);

  const topTeachersArray = Object.values(topTeacher);
  console.log("Top Teacher data", topTeacher);
  {
    topTeachersArray.map((teacher, index = 1) => {
      console.log("Teacher num 1 is", teacher);
    });
  }

  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        margin: "0 auto",
        height: "800px",
        color: isDarkMode ? "#FFF8DC" : "#36454F",
        background: isDarkMode
          ? ""
          : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      }}
      className="blur_effect_card"
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width:"50%"}}>
          <Typography variant="h4" align="left" gutterBottom>
            <TbTrendingUp style={{ marginRight: "2px", marginTop: "2px" }} />
            Trending Teachers
          </Typography>
          {/* Top 3 Teachers on the Left */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent:"center",
              alignItems: "center",
              width: "50%",
              marginLeft:"16px"             
            }}
          >
            {topTeachersArray?.map((teacher, index) => (
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
                <img
                  src={
                    teacher?.["Profile Pic"]
                      ? `${BASE_URL_MEET}/media/${teacher?.["Profile Pic"]}`
                      : "/TopTeachers.png"
                  }
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
                    {parseFloat(teacher["Average Feedback"]).toFixed(2) || 0}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Teachers Table on the Right */}
        <Box sx={{ width: "70%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            <FaChalkboardTeacher /> All Teachers
          </Typography>

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
                {topTeachersArray.map((teacher, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={
                            teacher?.["Profile Pic"]
                              ? `${BASE_URL_MEET}/media/${teacher?.["Profile Pic"]}`
                              : "/TopTeachers.png"
                          }
                          width={50}
                          height={50}
                          style={{ borderRadius: "100%" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{teacher?.Name}</TableCell>
                    <TableCell>{teacher["Total Lectures"] || 0}</TableCell>
                    <TableCell>{teacher["Completed Lectures"] || 0}</TableCell>
                    <TableCell>
                      {parseFloat(teacher["Average Feedback"]).toFixed(2) || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherRanking;
