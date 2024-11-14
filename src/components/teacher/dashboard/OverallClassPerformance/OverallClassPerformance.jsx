import React from "react";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function OverallClassPerformance() {
  // Dummy data for ratings
  const data = [
    { rating: "5 Stars", count: 5 },
    { rating: "4 Stars", count: 2},
    { rating: "3 Stars", count: 2 },
    { rating: "2 Stars", count: 1 },
    { rating: "1 Star", count: 0 },
  ];

  const { isDarkMode } = useThemeContext();

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        mt:5
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        textAlign={"center"}
        fontWeight={"bold"}
        p={2}
        sx={{color: isDarkMode ? "#FFFFF0" : "#36454F"}}
      >
        Overall Rating
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" tick={{ fill: isDarkMode ? "#FFFFF0" : "#36454F" }}/>
          <YAxis tick={{ fill: isDarkMode ? "#FFFFF0" : "#36454F" }}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default OverallClassPerformance;
