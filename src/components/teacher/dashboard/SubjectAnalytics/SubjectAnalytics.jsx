import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import { FiBarChart2 } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { watchtimeBySubject } from "@/api/apiHelper";

const SubjectAnalytics = () => {
  const { isDarkMode } = useThemeContext();
  const [data, setData] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchWatchtimeBySubject();
  }, []);

  const fetchWatchtimeBySubject = async () => {
    try {
      const response = await watchtimeBySubject();
      setData(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Prepare the data for the Radar Chart
  const radarData = data?.map((item) => ({
    subject: item.subject_name, // Full name for tooltip and internal use
    truncatedSubject:
      item.subject_name.length > 10
        ? `${item?.subject_name?.slice(0, 10)}...`
        : item?.subject_name, // Truncated name for the chart
    watchtime: item?.watchtime,
    fullMark: 5000,
  }));

  // Custom tick component for wrapping text
  const renderCustomizedTick = (props) => {
    const { x, y, payload, textAnchor } = props;
    const { value } = payload;

    const maxCharsPerLine = isSmallScreen ? 8 : 12;
    const words = value?.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill={isDarkMode ? "#fff" : "#000"}
        style={{ fontSize: isSmallScreen ? "10px" : "12px" }}
      >
        {lines?.map((line, index) => (
          <tspan key={index} x={x} dy={index * 12}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

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
          Watch Time by Subject
        </Typography>
        {isDarkMode ? (
          <MdDarkMode style={{ fontSize: "24px", color: "#f0f0f0" }} />
        ) : (
          <MdLightMode style={{ fontSize: "24px", color: "#2b2b2b" }} />
        )}
      </Box>
      <Box sx={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="truncatedSubject"
              tick={renderCustomizedTick}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tick={{ fill: isDarkMode ? "#fff" : "#000" }}
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "Watchtime") {
                  return [`${value?.toFixed(2)}`, "Watchtime"]; // Format watchtime with 2 decimal places
                }
                return null; // Skip other data keys
              }}
              labelFormatter={(label, props) => {
                // Map the truncated subject back to the full subject name
                const payload = props.find(
                  (p) => p?.payload?.truncatedSubject === label
                );
                return payload ? payload?.payload?.subject : label;
              }}
            />
            <Radar
              name="Watchtime"
              dataKey="watchtime" // Ensure this matches the field in `radarData`
              stroke={isDarkMode ? "#8884d8" : "#82ca9d"}
              fill={isDarkMode ? "#8884d8" : "#82ca9d"}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
      {/* Add caption below the chart */}
      <Typography
        sx={{
          // mt: 2,
          textAlign: "center",
          fontSize: isSmallScreen ? "8px" : "10px",
          color: isDarkMode ? "#f0f0f0" : "#2b2b2b",
        }}
      >
        This radar chart displays the watch time for each subject. Each axis
        represents a subject, and the distance from the center indicates the
        total watch time. Higher values mean more time spent watching that
        subject.
      </Typography>
    </Box>
  );
};

export default SubjectAnalytics;
