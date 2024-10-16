import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Box, Typography, Grid, Button } from "@mui/material";

// Data for the pie chart
const data = [
  { name: "Advanced", value: 50, color: "#00b894" },
  { name: "Intermediate", value: 30, color: "#ff7675" },
  { name: "Proficient", value: 20, color: "#0984e3" },
  { name: "Basic", value: 10, color: "#fdcb6e" },
];

// Function to render the label showing percentage
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

// OverallClassPerformance Component
const OverallClassPerformance = () => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto", // Center the component on the page
        height:'100%'
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" whiteSpace="nowrap">
          Overall Class Performance
        </Typography>
        {/* <Button variant="text" sx={{ textTransform: "none" }}>
          View Details &gt;
        </Button> */}
      </Box>

      {/* Pie Chart and Legend */}
      {/* <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        > */}
          {/* Pie Chart using Recharts */}
          <Box sx={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel} // Use the custom label renderer
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        {/* </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        > */}
          {/* Custom Legend */}
          <Grid container spacing={2}>
            {data.map((entry) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{ display: "flex", alignItems: "center" }}
                key={entry.name}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: entry.color,
                    mr: 1,
                  }}
                />
                <Box>
                  <Typography>{entry.name}</Typography>
                  <Typography sx={{ ml: "auto", fontWeight: "bold" }}>
                    {entry.value}%
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

        {/* </Grid>
      </Grid> */}
    </Box>
  );
};

export default OverallClassPerformance;
