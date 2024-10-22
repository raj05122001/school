import React from "react";
import { Box, Typography, LinearProgress, Grid } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import Image from "next/image";
import { SiGoogleclassroom } from "react-icons/si";

const ClassStatistics = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const totalStudents = 100;
  const struggling = 40;
  const excelling = 60;
  const progress = 30; // progress in percentage

  // Define dark mode and light mode styles
  const cardBgColor = isDarkMode ? "#333" : "#f5f5f5";
  const textColor = isDarkMode ? "#fff" : "#000";
  const secondaryTextColor = isDarkMode ? "#b3b3b3" : "#666";
  const progressBarColor = isDarkMode ? "#1976d2" : "#4caf50";

  return (
    <Box
      sx={{
        padding: "20px",
        width: "100%",
        height: "100%",
        borderRadius: 4,
      }}
      className="blur_effect_card"
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            color: textColor,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SiGoogleclassroom size={22} />
          <Typography
            variant="h6"
            className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          >
            Class Statistics
          </Typography>
        </Box>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: secondaryTextColor }}
        >
          April 2022
        </Typography>
      </Box>

      {/* Statistics Section */}
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={4} align="center">
          <Image
            src={"/total-student.jpg"}
            alt="total student"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6" sx={{ color: textColor }}>
            {totalStudents}
          </Typography>
          <Typography variant="body2" sx={{ color: secondaryTextColor }}>
            Total Students
          </Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Image
            src={"/struggling.jpg"}
            alt="struggling students"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6" sx={{ color: textColor }}>
            {struggling}
          </Typography>
          <Typography variant="body2" sx={{ color: secondaryTextColor }}>
            Struggling
          </Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Image
            src={"/excelling1.jpg"}
            alt="excelling students"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6" sx={{ color: textColor }}>
            {excelling}
          </Typography>
          <Typography variant="body2" sx={{ color: secondaryTextColor }}>
            Excelling
          </Typography>
        </Grid>
      </Grid>

      {/* Progress Section */}
      <Box
        sx={{
          marginTop: 4,
          backgroundColor: isDarkMode ? "#444" : "#E3F2FD",
          borderRadius: 5,
          padding: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Image
            src={"/a-to-z-board.jpg"}
            alt="board"
            width={80}
            height={80}
            style={{ borderRadius: 20 }}
          />
        </Box>
        <Box sx={{ width: "100%", height: "100%" }}>
          <Typography variant="body2" gutterBottom sx={{ color: textColor }}>
            Class Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: isDarkMode ? "#555" : "#d9d9d9",
              "& .MuiLinearProgress-bar": {
                backgroundColor: progressBarColor,
              },
            }}
          />
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ marginTop: 1, color: textColor }}
          >
            {progress}% of the progress
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ClassStatistics;
