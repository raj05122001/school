import React, { useEffect, useState } from "react";
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
import { commentWatchtimeGraph } from "@/api/apiHelper";

const LectureAnalytics = () => {
  const { isDarkMode } = useThemeContext();
  const [timePeriod, setTimePeriod] = useState("week");
  const [data, setData] = useState([]);
console.log("data data",data)
  useEffect(() => {
    fetchCommentWatchtimeGraph();
  }, []);

  const fetchCommentWatchtimeGraph = async () => {
    try {
      const response = await commentWatchtimeGraph("");
      const transformedData = response?.data?.data.map((item) => ({
        ...item,
        watchtime_count: (item.watchtime_count / 60).toFixed(2), // Convert to minutes
      }));
      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
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
            <XAxis dataKey="x_data" stroke={isDarkMode ? "#FFF" : "#000"} />
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
              dataKey="comments_count"
              name="Comments"
              fill="#8884d8"
              background={{ fill: "#eee" }}
            />
            <Bar dataKey="watchtime_count" name="Watchtime (Minutes)" fill="#82ca9d" />
            <Bar dataKey="upload_count" name="Upload" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LectureAnalytics;
