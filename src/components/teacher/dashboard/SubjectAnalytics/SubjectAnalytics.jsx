import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { subject: "English", time: 40 },
  { subject: "Maths", time: 36 },
  { subject: "Science", time: 87 },
  { subject: "Hindi", time: 42 },
  { subject: "Physics", time: 49 },
  { subject: "Visual arts", time: 90 },
];

const SubjectAnalytics = () => {
  return (
    <Box
      sx={{
        width: "100%", // Use 100% width to fill parent
        maxWidth: "600px", // Set a max width for the box
        p: 4,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        height: "400px", // Set a fixed height for the chart container
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Watch Time by Subject</Typography>
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
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" />
            <YAxis dataKey="subject" type="category" scale="band" />
            <Tooltip />
            <Legend />
            <Bar dataKey="time" fill="#413ea0" />
            {/* Optional: You can add more types of charts here, like Line or Area */}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SubjectAnalytics;
