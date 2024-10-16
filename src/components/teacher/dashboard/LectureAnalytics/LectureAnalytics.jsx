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
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Video Uploaded, Views, and Comments</Typography>
        {/* <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="time-period-select-label">Time Period</InputLabel>
          <Select
            labelId="time-period-select-label"
            id="time-period-select"
            value={timePeriod}
            label="Time Period"
            onChange={handleTimePeriodChange}
          >
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl> */}
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
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="comments" fill="#8884d8" background={{ fill: "#eee" }} />
            <Bar dataKey="view" fill="#82ca9d" />
            <Bar dataKey="upload" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LectureAnalytics;
