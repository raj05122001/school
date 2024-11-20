import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { PiStudentBold } from "react-icons/pi";

const AverageLectureDuration = ({ countData, loading }) => {
  const durationCount = countData?.Average_lecture_duration;
  return (
    <Box
      sx={{
        maxWidth: "full",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        background:
          "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <Typography variant="h6" sx={{ color: "#708090" }}>
        <PiStudentBold style={{ marginRight: "2px" }} />
        <b>Average Duration</b>
      </Typography>
      {loading ? (
        <Typography variant="h2" sx={{ color: "#36454F" }}>
          <Skeleton variant="circular" width={100} height={100} />
        </Typography>
      ) : (
        <Typography variant="h2" sx={{ color: "#36454F" }}>
          {durationCount}
        </Typography>
      )}
    </Box>
  );
};

export default AverageLectureDuration;
