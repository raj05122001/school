import React from "react";
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
import { styled } from "@mui/system";
import { CiStar } from "react-icons/ci";
import { TbTrendingUp } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";

// Sample data for illustration
const topTeachers = [
  { name: "John Doe", subject: "Mathematics", rating: 4.9 },
  { name: "Jane Smith", subject: "Physics", rating: 4.8 },
  { name: "Mark Johnson", subject: "Chemistry", rating: 4.7 },
];

const otherTeachers = [
    { name: "Alice Brown", subject: "Biology", rating: 4.5, department: "Science", experience: "5 years" },
    { name: "Michael Lee", subject: "English", rating: 4.4, department: "Languages", experience: "4 years" },
    { name: "Emily Davis", subject: "History", rating: 4.3, department: "Social Studies", experience: "3 years" },
    { name: "David Smith", subject: "Mathematics", rating: 4.2, department: "Math", experience: "2 years" },
    { name: "Sarah Johnson", subject: "Chemistry", rating: 4.1, department: "Science", experience: "1 year" },
    { name: "Thomas Miller", subject: "Physics", rating: 4.0, department: "Science", experience: "6 years" },
    { name: "Olivia Wilson", subject: "Art", rating: 4.9, department: "Arts", experience: "7 years" },
    { name: "Benjamin Carter", subject: "Music", rating: 4.8, department: "Arts", experience: "8 years" },
    { name: "Sophia Taylor", subject: "Geography", rating: 4.7, department: "Social Studies", experience: "9 years" },
    { name: "William Anderson", subject: "Computer Science", rating: 4.6, department: "Technology", experience: "10 years" },
    { name: "Ava Clark", subject: "Spanish", rating: 4.5, department: "Languages", experience: "5 years" },
    { name: "Ethan Mitchell", subject: "French", rating: 4.4, department: "Languages", experience: "4 years" },
    { name: "Mia Rose", subject: "Psychology", rating: 4.3, department: "Social Studies", experience: "3 years" },
    { name: "Noah James", subject: "Sociology", rating: 4.2, department: "Social Studies", experience: "2 years" },
    { name: "Ella Bennett", subject: "Economics", rating: 4.1, department: "Social Studies", experience: "1 year" },
    { name: "Liam Cooper", subject: "Philosophy", rating: 4.0, department: "Humanities", experience: "6 years" },
    { name: "Charlotte King", subject: "Religion", rating: 4.9, department: "Humanities", experience: "7 years" },
    { name: "Oliver Harris", subject: "Literature", rating: 4.8, department: "Humanities", experience: "8 years" },
    { name: "Amelia Scott", subject: "Drama", rating: 4.7, department: "Arts", experience: "9 years" },
    { name: "Jacob Thompson", subject: "Dance", rating: 4.6, department: "Arts", experience: "10 years" }
  ];

const StarRating = styled(CiStar)({
  color: "#FFD700",
  marginBottom: "4px",
});

const TeacherRanking = () => {
  const { isDarkMode } = useThemeContext();
  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        margin: "0 auto",
        height:"800px",
        color: isDarkMode ? "#FFF8DC" : "#36454F",
        background: isDarkMode ? "" : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      }}
      className="blur_effect_card"
    >
      <Typography variant="h4" align="left" gutterBottom>
        <TbTrendingUp style={{ marginRight: "2px", marginTop: "2px" }} />
        Trending Teachers
      </Typography>

      <Box sx={{ display: "flex" }}>
        {/* Top 3 Teachers on the Left */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "30%",
            marginRight: "16px",
          }}
        >
          {topTeachers.map((teacher, index) => (
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
                boxShadow: isDarkMode ? "0 6px 10px #D3D3D3" : "0 6px 10px #FBCEB1",
                margin: "8px 0",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Avatar sx={{ width: 56, height: 56, marginBottom: "8px" }}>
                {teacher.name[0]}
              </Avatar>
              <Typography variant="h6">{teacher.name}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {teacher.subject}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                <StarRating />
                <Typography variant="body2">{teacher.rating}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Teachers Table on the Right */}
        <Box sx={{ width: "70%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            <FaChalkboardTeacher /> Other Teachers
          </Typography>

          <TableContainer component={Paper} className="blur_effect_card" sx={{ margin: '0 auto', maxHeight: "40%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Experience</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherTeachers.map((teacher, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ marginRight: "8px" }}>
                          {teacher.name[0]}
                        </Avatar>
                        <Typography>{teacher.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.rating}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{teacher.experience}</TableCell>
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
