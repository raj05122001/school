import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaVideo, FaEye, FaCommentDots } from "react-icons/fa"; // Import icons
import { useThemeContext } from "@/hooks/ThemeContext";

const data = [
  {
    name: "1",
    view: 40,
    comments: 24,
    upload: 9,
  },
  {
    name: "2",
    view: 30,
    comments: 13,
    upload: 7,
  },
  {
    name: "3",
    view: 20,
    comments: 98,
    upload: 15,
  },
  {
    name: "4",
    view: 27,
    comments: 39,
    upload: 10,
  },
  {
    name: "5",
    view: 18,
    comments: 48,
    upload: 3,
  },
  {
    name: "6",
    view: 23,
    comments: 38,
    upload: 2,
  },
  {
    name: "7",
    view: 34,
    comments: 43,
    upload: 2,
  },
];

const LectureAnalytics = () => {
  const { isDarkMode } = useThemeContext();
  const [timePeriod, setTimePeriod] = useState("week");

  // Handle the time period change
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
    // Update your data or call API here based on the selected time period
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 4,
        maxHeight: "420px",
        height: "100%",
        color: isDarkMode ? "#fff" : "#000",
      }}
      className="blur_effect_card"
    >
      <Box sx={{ display: "flex", mb: 2, alignItems: "center", gap: 1 }}>
        <FaVideo size={22} />
        <Typography
          variant="h6"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          sx={{ fontWeight: "bold" }}
        >
          Video Uploaded, Views, and Comments
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={40} // Adjust bar size for better visibility
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? "#555" : "#ccc"}
            />
            <XAxis dataKey="name" stroke={isDarkMode ? "#FFF" : "#000"} />
            <YAxis stroke={isDarkMode ? "#FFF" : "#000"} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#444" : "#fff",
                borderColor: isDarkMode ? "#555" : "#ddd",
                color: isDarkMode ? "#fff" : "#000",
              }}
            />
            <Legend
              wrapperStyle={{
                color: isDarkMode ? "#FFF" : "#000",
              }}
              iconType="square"
            />

            {/* Adding icons to bars */}
            <Bar
              dataKey="comments"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
            <Bar dataKey="view" fill="#82ca9d" />
            <Bar dataKey="upload" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LectureAnalytics;
