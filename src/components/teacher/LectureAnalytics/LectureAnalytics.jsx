import React, { useEffect, useState } from "react";
import { meetingAnalytics } from "@/api/apiHelper";
import { BsInfoCircle } from "react-icons/bs";
import { Box, Typography, IconButton, Paper, useTheme } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF5733",
  "#36A2EB",
  "#FF9F40",
];

const LectureAnalytics = ({ lectureId }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const theme = useTheme();
  const [analytics, setAnalytics] = useState({});
  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")} ${
    monthNames[currentDate.getMonth()]
  }`;

  useEffect(() => {
    fetchData();
  }, [lectureId]);

  const fetchData = async () => {
    try {
      const response = await meetingAnalytics(lectureId);
      setAnalytics(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        className="text-sm"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(10px)",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            color: "black",
            fontWeight: "bold",
          }}
        >
          <p style={{ margin: 0 }}>{`${payload[0].name}`}</p>
        </div>
      );
    }
    return null;
  };

  const createData = (activities) => {
    const activityPercentage = {};

    try {
      if (activities.trim() !== "") {
        const parsedActivities = JSON.parse(activities);
        if (Array.isArray(parsedActivities)) {
          parsedActivities.forEach((activity) => {
            activityPercentage[activity.title] = activity.percentage;
          });
        }
      }
    } catch (error) {
      console.error("Error parsing activities:", error);
    }

    return activityPercentage;
  };

  const renderPercentage = (title, percentage) => (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", color: primaryColor }}
        >
          {title}
        </Typography>
        <Tooltip title="Information about this metric" arrow>
          <IconButton
            size="small"
            sx={{ ml: 1, color: theme.palette.primary.main }}
          >
            <BsInfoCircle fontSize={12} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "600", color: theme.palette.primary.main }}
        >
          {percentage ? `${percentage.toFixed(0)}%` : "0%"}
        </Typography>
        <Typography variant="caption" color={secondaryColor}>
          Last updated on {formattedDate}
        </Typography>
      </Box>
    </Box>
  );

  const sentimentAnalytics = analytics?.sentiment_analytics || {};

  return (
    <Box
      sx={{
        p: 3,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
      className="blur_effect_card"
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", color:primaryColor }}>
        Lecture Analytics
      </Typography>
      {analytics?.overall_health_score &&
        renderPercentage(
          "Overall Health Score",
          analytics?.overall_health_score
        )}
      {analytics?.topics_distribution && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: primaryColor }}
            >
              Topics Distribution
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "12px" }}>
                  This pie chart displays the percentage distribution of
                  different topics discussed during the lecture.
                </Typography>
              }
              arrow
            >
              <IconButton
                size="small"
                sx={{ ml: 1, color: theme.palette.primary.main }}
              >
                <BsInfoCircle fontSize={12} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ height: 200, width: 200, mx: "auto", mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(
                    createData(analytics.topics_distribution)
                  )}
                  dataKey="1"
                  nameKey="0"
                  innerRadius="35%"
                  outerRadius="75%"
                  labelLine={false}
                  cx="50%"
                  cy="50%"
                  label={renderCustomizedLabel}
                >
                  {Object.entries(
                    createData(analytics.topics_distribution)
                  )?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
      {analytics?.attendance_metric &&
        renderPercentage("Attendance Metric", analytics?.attendance_metric)}
      {analytics?.participation_engagement &&
        renderPercentage(
          "Lecture Engagement",
          analytics?.participation_engagement
        )}
      {analytics?.reaction_analytics &&
        renderPercentage("Reaction Analytics", analytics?.reaction_analytics)}
      {sentimentAnalytics && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: primaryColor}}
            >
              Sentiment Analytics
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "12px" }}>
                  This section shows the percentage distribution of positive,
                  neutral, and negative sentiments.
                </Typography>
              }
              arrow
            >
              <IconButton
                size="small"
                sx={{ ml: 1, color: theme.palette.primary.main }}
              >
                <BsInfoCircle fontSize={12} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
            <Box
              sx={{ textAlign: "center", color: theme.palette.success.main }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.positive
                  ? `${sentimentAnalytics.positive.toFixed(0)}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2">Positive</Typography>
            </Box>
            <Box
              sx={{ textAlign: "center", color: theme.palette.text.primary }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.neutral
                  ? `${sentimentAnalytics.neutral.toFixed(0)}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2">Neutral</Typography>
            </Box>
            <Box sx={{ textAlign: "center", color: theme.palette.info.main }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.negative
                  ? `${sentimentAnalytics.negative.toFixed(0)}%`
                  : "0%"}
              </Typography>
              <Typography variant="body2">Negative</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color={secondaryColor} sx={{ pt: 1 }}>
            Last updated on {formattedDate}
          </Typography>
        </Box>
      )}
      {analytics?.language_monitoring &&
        renderPercentage("Language Monitoring", analytics?.language_monitoring)}
      {analytics?.main_topics?.length > 0 && (
        <Typography variant="h6" color={primaryColor}>Main Topics</Typography>
      )}
      {analytics?.main_topics?.length > 0 && (
        <Box maxHeight={300} sx={{ overflowY: "auto" }}>
          {analytics?.main_topics?.map((val, index) => (
            <Typography
              key={index}
              variant="span"
              style={{
                display: "inline-block",
                padding: "6px 12px",
                margin: "4px",
                border: "1px solid #1976d2", // Use primary color or any color you prefer
                borderRadius: "4px",
                backgroundColor: "#e3f2fd", // Light background color for button-like effect
                color: "#1976d2", // Primary color for text
                cursor: "pointer", // Makes it feel clickable
                fontSize: "14px", // Adjust font size if needed
                fontWeight: "500", // Slightly bold text
              }}
            >
              {val}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default LectureAnalytics;
