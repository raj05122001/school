import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import { FiBarChart2 } from "react-icons/fi"; // Bar chart icon from react-icons
import { MdDarkMode, MdLightMode } from "react-icons/md"; // Icons for dark and light mode
import { light } from "@mui/material/styles/createPalette";

// Sample data
const data = [
  { subject: "English", time: 40 },
  { subject: "Maths", time: 36 },
  { subject: "Science", time: 87 },
  { subject: "Hindi", time: 42 },
  { subject: "Physics", time: 49 },
  { subject: "Visual arts", time: 90 },
];

const MyAssignmentAnalytics = () => {
  const { isDarkMode } = useThemeContext();

  return (
    <Box
      sx={{
        width: "100%",
        p: 4,
        maxHeight: "420px",
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          variant="h6"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        >
          <FiBarChart2 size={22} style={{ marginRight: "8px" }} />
          My Assignment Analytics
        </Typography>
        {isDarkMode ? (
          <MdDarkMode style={{ fontSize: "24px", color: "#f0f0f0" }} />
        ) : (
          <MdLightMode style={{ fontSize: "24px", color: "#2b2b2b" }} />
        )}
      </Box>
      <Box sx={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke={isDarkMode ? "#444444" : "#e0e0e0"} />
            <XAxis type="number" stroke={isDarkMode ? "#f0f0f0" : "#2b2b2b"} />
            <YAxis
              dataKey="subject"
              type="category"
              scale="band"
              stroke={isDarkMode ? "#f0f0f0" : "#2b2b2b"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#444444" : "#fff",
                color: isDarkMode ? "#f0f0f0" : "#2b2b2b",
              }}
            />
            <Legend
              wrapperStyle={{ color: isDarkMode ? "#f0f0f0" : "#2b2b2b" }}
            />
            <Bar dataKey="time" fill={isDarkMode ? "#82ca9d" : "#413ea0"} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default MyAssignmentAnalytics;
