import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiBallPyramid } from "react-icons/gi";
import { getMyRank } from "@/api/apiHelper";

function MyRank() {
  const [subject, setSubject] = useState("Math");
  const [myScore, setMyScore] = useState(68); // Dummy score percentage
  const { isDarkMode } = useThemeContext();
  const [myGrade, setMyGrade] = useState(null);

  const fetchMyRank = async () => {
    try {
      const response = await getMyRank();
      if (response.success) {
        setMyGrade(response?.data?.grade);
      }
    } catch (error) {
      console.error("Error fetching Grade", error);
    }
  };

  useEffect(() => {
    fetchMyRank();
  }, []);

  // Dummy data for funnel categories with specific colors
  const data = [
    { name: "A (80-100%)", value: 100, fill: "#228B22" }, // Green
    { name: "B (60-80%)", value: 80, fill: "#F4BB44" }, // Yellow
    { name: "C (40-60%)", value: 60, fill: "#FF7518" }, // Orange
    { name: "D (20-40%)", value: 40, fill: "#E35335" }, // Red
    { name: "E", value: 20, fill: "#8B0000" }, // Dark Red
  ];

  // Determine the grade based on myScore
  const getMyGrade = (myGrade) => {
    if (myGrade === "A")
      return { label: "Grade A (80-100%)", color: "#228B22" };
    if (myGrade === "B") return { label: "Grade B (60-80%)", color: "#F4BB44" };
    if (myGrade === "C") return { label: "Grade C (40-60%)", color: "#FF7518" };
    if (myGrade === "D") return { label: "Grade D (20-40%)", color: "#8B0000" };
    return { label: "Grade E (0-20%)", color: "#8B0000" };
  };

  const { label: gradeLabel, color: gradeColor } = getMyGrade(myGrade);
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
      >
        <GiBallPyramid style={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }} />{" "}
        My Rank
      </Typography>

      <Box
        sx={{
          display: "flex",
          mb: 2,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" ml={4}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%", // Circle shape; use `borderRadius: 0` for square
              backgroundColor: gradeColor,
              mr: 1,
            }}
          />
          <Typography
            textAlign={"center"}
            variant="body1"
            sx={{
              color: isDarkMode ? "#F0EAD6" : "#36454F",
              fontWeight: "bold",
            }}
          >
            My Grade: {gradeLabel}
          </Typography>
        </Box>
      </Box>
      <ResponsiveContainer width="100%" height="80%">
        <FunnelChart width={450} height={300}>
          <Funnel dataKey="value" data={data} isAnimationActive width="100%">
            <LabelList
              position="outside"
              fill={isDarkMode ? "#F0EAD6" : "#F0EAD6"}
              stroke="none"
              dataKey="name"
              offset={20}
              style={{
                fontSize: "12px",
                paddingRight: "4px",
                paddingBottom: "2px",
                width: "100%",
                marginRight: "4px",
                marginBottom: "2px",
              }}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default MyRank;
