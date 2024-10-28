import React, { useEffect, useState } from "react";
import { meetingAnalytics } from "@/api/apiHelper";
import { BsInfoCircle } from "react-icons/bs";
import { Box, Typography, IconButton, Tooltip, Paper } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const LectureAnalytics = ({ lectureId }) => {
  const [analytics, setAnalytics] = useState({});
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];
  const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')} ${monthNames[currentDate.getMonth()]}`;

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

  const renderPercentage = (title, percentage) => (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
          {title}
        </Typography>
        <Tooltip title="Information about this metric" arrow>
          <IconButton size="small" sx={{ ml: 1, color: "primary.main" }}>
            <BsInfoCircle fontSize={12} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: "600", color: "primary.main" }}>
          {percentage ? `${percentage.toFixed(0)}%` : "0%"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated on {formattedDate}
        </Typography>
      </Box>
    </Box>
  );

  const sentimentAnalytics = analytics?.sentiment_analytics || {};

  return (
    <Paper sx={{ p: 3,  boxShadow: 3 }} className="blur_effect_card">
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
        Lecture Analytics
      </Typography>

      {analytics?.overall_health_score && renderPercentage("Overall Health Score", analytics?.overall_health_score)}

      {analytics?.topics_distribution && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Topics Distribution
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "12px" }}>
                  This pie chart displays the percentage distribution of different topics discussed during the lecture.
                </Typography>
              }
              arrow
            >
              <IconButton size="small" sx={{ ml: 1, color: "primary.main" }}>
                <BsInfoCircle fontSize={12} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ height: 200, width: 200, mx: "auto", mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={Object.entries(analytics.topics_distribution)} dataKey="1" nameKey="0" innerRadius="35%" outerRadius="75%">
                  {Object.entries(analytics.topics_distribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}

      {analytics?.attendance_metric && renderPercentage("Attendance Metric", analytics?.attendance_metric)}
      {analytics?.participation_engagement && renderPercentage("Lecture Engagement", analytics?.participation_engagement)}
      {analytics?.reaction_analytics && renderPercentage("Reaction Analytics", analytics?.reaction_analytics)}

      {sentimentAnalytics && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Sentiment Analytics
            </Typography>
            <Tooltip
              title={
                <Typography sx={{ fontSize: "12px" }}>
                  This section shows the percentage distribution of positive, neutral, and negative sentiments.
                </Typography>
              }
              arrow
            >
              <IconButton size="small" sx={{ ml: 1, color: "primary.main" }}>
                <BsInfoCircle fontSize={12} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
            <Box sx={{ textAlign: "center", color: "success.main" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.positive ? `${sentimentAnalytics.positive.toFixed(0)}%` : "0%"}
              </Typography>
              <Typography variant="body2">Positive</Typography>
            </Box>
            <Box sx={{ textAlign: "center", color: "text.primary" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.neutral ? `${sentimentAnalytics.neutral.toFixed(0)}%` : "0%"}
              </Typography>
              <Typography variant="body2">Neutral</Typography>
            </Box>
            <Box sx={{ textAlign: "center", color: "info.main" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {sentimentAnalytics?.negative ? `${sentimentAnalytics.negative.toFixed(0)}%` : "0%"}
              </Typography>
              <Typography variant="body2">Negative</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
            Last updated on {formattedDate}
          </Typography>
        </Box>
      )}

      {analytics?.language_monitoring && renderPercentage("Language Monitoring", analytics?.language_monitoring)}
    </Paper>
  );
};

export default LectureAnalytics;
