import { Box, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

function TeacherGraph({ teacherID, countData, watchData }) {
  const t = useTranslations()
  return (
    <Box>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        {/* Line Chart for Lecture Completion Data */}
        {teacherID && countData?.length > 0 && (
          <Box
            sx={{
              marginTop: 4,
              width: "100%",
              height: "20%",
              p: 2,
              backgroundColor: "#fff",
              borderRadius: "20px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ height: "24px", width: "24px", flexShrink: 0 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4.26172 11.0204V15.9904C4.26172 17.8104 4.26172 17.8104 5.98172 18.9704L10.7117 21.7004C11.4217 22.1104 12.5817 22.1104 13.2917 21.7004L18.0217 18.9704C19.7417 17.8104 19.7417 17.8104 19.7417 15.9904V11.0204C19.7417 9.20043 19.7417 9.20043 18.0217 8.04043L13.2917 5.31043C12.5817 4.90043 11.4217 4.90043 10.7117 5.31043L5.98172 8.04043C4.26172 9.20043 4.26172 9.20043 4.26172 11.0204Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.5 7.63V5C17.5 3 16.5 2 14.5 2H9.5C7.5 2 6.5 3 6.5 5V7.56"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.6317 10.99L13.2017 11.88C13.2917 12.02 13.4917 12.16 13.6417 12.2L14.6617 12.46C15.2917 12.62 15.4617 13.16 15.0517 13.66L14.3817 14.47C14.2817 14.6 14.2017 14.83 14.2117 14.99L14.2717 16.04C14.3117 16.69 13.8517 17.02 13.2517 16.78L12.2717 16.39C12.1217 16.33 11.8717 16.33 11.7217 16.39L10.7417 16.78C10.1417 17.02 9.68173 16.68 9.72173 16.04L9.78173 14.99C9.79173 14.83 9.71173 14.59 9.61173 14.47L8.94173 13.66C8.53173 13.16 8.70173 12.62 9.33173 12.46L10.3517 12.2C10.5117 12.16 10.7117 12.01 10.7917 11.88L11.3617 10.99C11.7217 10.45 12.2817 10.45 12.6317 10.99Z"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "22px",
                  fontStyle: "normal",
                  lineHeight: "normal",
                }}
              >
                Lecture Completion
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={countData}
                margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  dy={10}
                  textAnchor="end"
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                />
                <Line
                  type="monotone"
                  dataKey="teacher_data"
                  stroke="#8884d8"
                  name="Teacher Lecture Count"
                />
                <Line
                  type="monotone"
                  dataKey="avg_data"
                  stroke="#82ca9d"
                  name="Average Lecture Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Line Chart for Lecture Watchime Data Comparison */}
        {teacherID && watchData?.length > 0 && (
          <Box
            sx={{
              marginTop: 4,
              width: "100%",
              height: "20%",
              p: 2,
              backgroundColor: "#fff",
              borderRadius: "20px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box sx={{ height: "24px", width: "24px", flexShrink: 0 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 2H15"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "22px",
                  fontStyle: "normal",
                  lineHeight: "normal",
                }}
              >
                Lecture Watch-time
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={watchData}
                margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  dy={10}
                  textAnchor="end"
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                />
                <Line
                  type="monotone"
                  dataKey="teacher_data"
                  stroke="#8884d8"
                  name={t("Watchtime")}
                />
                <Line
                  type="monotone"
                  dataKey="avg_data"
                  stroke="#82ca9d"
                  name="Average Lecture Watchtime"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
      <Typography
        sx={{
          // mt: 2,
          textAlign: "center",
          fontSize: "12px",
          color: "#2b2b2b",
        }}
      >
        Select a teacher to view detailed analytics. The charts will display
        trends over time, including the number of lectures completed and watch
        time analytics, allowing a comparison between the selected
        teacher&apos;s performance and the overall average.
      </Typography>
    </Box>
  );
}

export default TeacherGraph;
