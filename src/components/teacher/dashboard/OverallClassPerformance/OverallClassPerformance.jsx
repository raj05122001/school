import React, { useEffect, useState } from "react";
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
import { getRatingsCount } from "@/api/apiHelper";

function OverallClassPerformance() {
  const [data, setData] = useState([]);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    fetchRatingsCount();
  }, []);

  const fetchRatingsCount = async () => {
    try {
      const response = await getRatingsCount();
      console.log("response fetchgetRatingsCount", response);

      // Transform the data structure to an array format for the chart
      const transformedData = [
        { rating: "5 Stars", count: response?.data?.data?.count_of_5 || 0 },
        { rating: "4 Stars", count: response?.data?.data?.count_of_4 || 0 },
        { rating: "3 Stars", count: response?.data?.data?.count_of_3 || 0 },
        { rating: "2 Stars", count: response?.data?.data?.count_of_2 || 0 },
        { rating: "1 Star", count: response?.data?.data?.count_of_1 || 0 },
      ];

      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        mt: 5,
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        textAlign={"center"}
        fontWeight={"bold"}
        p={2}
        sx={{ color: isDarkMode ? "#FFFFF0" : "#36454F" }}
      >
        Overall Rating
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rating"
            tick={{ fill: isDarkMode ? "#FFFFF0" : "#36454F" }}
          />
          <YAxis tick={{ fill: isDarkMode ? "#FFFFF0" : "#36454F" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default OverallClassPerformance;
