import React, { useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { FunnelChart, Funnel, LabelList } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiBallPyramid } from "react-icons/gi";

function MyRank() {
  const [subject, setSubject] = useState("Math");
  const [myScore, setMyScore] = useState(68); // Dummy score percentage
  const { isDarkMode } = useThemeContext();

  // Dummy data for funnel categories with specific colors
  const data = [
    { name: "Grade A (75-100%)", value: 25, fill: "#228B22" }, // Green
    { name: "Grade B (50-75%)", value: 50, fill: "#F4BB44" }, // Yellow
    { name: "Grade C (25-50%)", value: 20, fill: "#FF7518" }, // Orange
    { name: "Grade D (0-25%)", value: 5, fill: "#E35335" }, // Red
  ];

  // Determine the grade based on myScore
  const getMyGrade = (score) => {
    if (score >= 75) return { label: "Grade A (75-100%)", color: "#228B22" };
    if (score >= 50) return { label: "Grade B (50-75%)", color: "#F4BB44" };
    if (score >= 25) return { label: "Grade C (25-50%)", color: "#FF7518" };
    return { label: "Grade D (0-25%)", color: "#E35335" };
  };

  const { label: gradeLabel, color: gradeColor } = getMyGrade(myScore);

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
    // Update the `myScore` for selected subject if using actual data
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
      >
        <GiBallPyramid style={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }} />{" "}
        My Rank
      </Typography>

      <Box
        sx={{
          display: "flex",
          mb: 2,
          flexDirection:"row",
          justifyContent:"space-between"
        }}
      >
        <Box display="flex" alignItems="center" ml={4}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%", // Circle shape; use `borderRadius: 0` for square
              backgroundColor: gradeColor,
              mr: 1,
            }}
          />
          <Typography
            textAlign={"center"}
            variant="body1"
            sx={{
              color: isDarkMode ? "#F0EAD6" : "#36454F",
              fontWeight: "bold",
            }}
          >
            My Grade: {myScore}% - {gradeLabel}
          </Typography>
        </Box>
        <Select
          value={subject}
          onChange={handleSubjectChange}
          sx={{
            marginRight: 2,
            color: isDarkMode ? "#d7e4fc" : "", // Sets the selected value text color to white
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkMode ? "#d7e4fc" : "", // Changes the border color to white
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkMode ? "#d7e4fc" : "", // Keeps the border white when focused
            },
            "& .MuiSvgIcon-root": {
              color: isDarkMode ? "#d7e4fc" : "", // Changes the dropdown icon color to white
            },
          }}
        >
          <MenuItem value="Math">Math</MenuItem>
          <MenuItem value="Science">Science</MenuItem>
          <MenuItem value="English">English</MenuItem>
          {/* Add more subjects as needed */}
        </Select>
      </Box>

      <FunnelChart width={400} height={300}>
        <Funnel dataKey="value" data={data} isAnimationActive width={350}>
          <LabelList
            position="right"
            fill={isDarkMode ? "#F0EAD6" : "#36454F"}
            stroke="none"
            dataKey="name"
            offset={15}
          />
        </Funnel>
      </FunnelChart>
    </Box>
  );
}

export default MyRank;
