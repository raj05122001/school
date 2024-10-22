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
    view: 4000,
    comments: 2400,
    upload: 2400,
  },
  {
    name: "2",
    view: 3000,
    comments: 1398,
    upload: 2210,
  },
  {
    name: "3",
    view: 2000,
    comments: 9800,
    upload: 2290,
  },
  {
    name: "4",
    view: 2780,
    comments: 3908,
    upload: 2000,
  },
  {
    name: "5",
    view: 1890,
    comments: 4800,
    upload: 2181,
  },
  {
    name: "6",
    view: 2390,
    comments: 3800,
    upload: 2500,
  },
  {
    name: "7",
    view: 3490,
    comments: 4300,
    upload: 2100,
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
