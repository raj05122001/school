import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";

// Data for the pie chart
const data = [
  { name: "Advanced", value: 45, color: "#00b894" },
  { name: "Intermediate", value: 24, color: "#ff7675" },
  { name: "Proficient", value: 18, color: "#0984e3" },
  { name: "Basic", value: 13, color: "#fdcb6e" },
];

// Function to render the label showing percentage
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// OverallClassPerformance Component
const OverallClassPerformance = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        margin: "0 auto", // Center the component on the page
        height: "100%",
      }}
      className="blur_effect_card"
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography
          className={`${isDarkMode ? "dark-heading" : "light-heading"} h6`}
          whiteSpace="nowrap"
        >
          Overall Class Performance
        </Typography>
      </Box>

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
              <Typography sx={{ color: primaryColor }}>{entry.name}</Typography>
              <Typography
                sx={{ ml: "auto", fontWeight: "bold", color: secondaryColor }}
              >
                {entry.value}%
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

    </Box>
  );
};

export default OverallClassPerformance;
