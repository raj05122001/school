import React, { useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiSandsOfTime } from "react-icons/gi";

function WatchTimeChart() {
  const [selectedSubject, setSelectedSubject] = useState("Math");
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  // Dummy data for watched and pending lectures per subject
  const lectureData = {
    Math: { watched: 15, pending: 5 },
    Science: { watched: 10, pending: 10 },
    English: { watched: 8, pending: 12 },
  };

  const handleChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // Prepare data for the PieChart component
  const data = [
    { name: "Watched Lectures", value: lectureData[selectedSubject].watched, color: "#4caf50" },
    { name: "Pending Lectures", value: lectureData[selectedSubject].pending, color: "#f44336" },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        sx={{ marginBottom: "4px" }}
      >
        <GiSandsOfTime style={{ color: isDarkMode ? "dark-heading" : "light-heading" }} />{" "}
        Lecture Watch Time
      </Typography>

      {/* Dropdown and Legends Row */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        {/* Dropdown */}
        <Select
          value={selectedSubject}
          onChange={handleChange}
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
          {Object.keys(lectureData).map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>

        {/* Legends */}
        <Box
          display="flex"
          alignItems="center"
          ml={2}
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        >
          <Box display="flex" alignItems="center" mr={2}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                marginRight: 0.5,
              }}
            />
            <Typography variant="body2">Watched</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#f44336",
                borderRadius: "50%",
                marginRight: 0.5,
              }}
            />
            <Typography variant="body2">Pending</Typography>
          </Box>
        </Box>
      </Box>

      {/* Donut Chart */}
      <Box width="300px" height="200px">
        <PieChart width={300} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={0.5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>
    </Box>
  );
}

export default WatchTimeChart;
