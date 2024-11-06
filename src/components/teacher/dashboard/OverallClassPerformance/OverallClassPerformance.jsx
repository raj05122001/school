import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

function OverallClassPerformance() {
  // Dummy data for ratings
  const data = [
    { rating: "5 Stars", count: 12 },
    { rating: "4 Stars", count: 8 },
    { rating: "3 Stars", count: 5 },
    { rating: "2 Stars", count: 3 },
    { rating: "1 Star", count: 2 },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
      }}
      className="blur_effect_card"
    >
    <Typography variant="h6" textAlign={"center"} fontWeight={"bold"}>Overall Rating</Typography>
      <BarChart
        width={300} // Set a fixed width
        height={400} // Set a fixed height
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </Box>
  );
}

export default OverallClassPerformance;
