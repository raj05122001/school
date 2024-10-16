import React from "react";
import { Box, Typography, LinearProgress, Grid, Button } from "@mui/material";
import { FaTrophy, FaBookReader, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";
import { border, borderRadius } from "@mui/system";

const ClassStatistics = () => {
  const totalStudents = 100;
  const struggling = 40;
  const excelling = 60;
  const progress = 30; // progress in percentage

  return (
    <Box
      sx={{
        padding: "20px",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        maxWidth: 400,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Class Statistics
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          April 2022
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={4} align="center">
          <Image
            src={"/total-student.jpg"}
            alt="total student"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6">{totalStudents}</Typography>
          <Typography variant="body2">Total Students</Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Image
            src={"/struggling.jpg"}
            alt="total student"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6">{struggling}</Typography>
          <Typography variant="body2">Struggling</Typography>
        </Grid>

        <Grid item xs={4} align="center">
          <Image
            src={"/excelling1.jpg"}
            alt="total student"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="h6">{excelling}</Typography>
          <Typography variant="body2">Excelling</Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          marginTop: 4,
          backgroundColor: "#E3F2FD",
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
            art="board"
            width={80}
            height={80}
            style={{ borderRadius: 20 }}
          />
        </Box>
        <Box sx={{ width: "100%", height: "100%" }}>
          <Typography variant="body2" gutterBottom>
            Class Progress
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" sx={{ marginTop: 1, color: "black" }}>
            {progress}% of the progress
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ClassStatistics;
