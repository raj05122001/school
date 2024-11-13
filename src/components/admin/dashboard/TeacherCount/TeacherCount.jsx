import React from "react";
import { Box, Typography } from "@mui/material";
import { GiTeacher } from "react-icons/gi";

const TeacherCount = ({ countData }) => {
  const teacherCount = countData?.total_teachers;
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
        <GiTeacher style={{ marginRight: "2px" }} />
        <b>Teachers Count</b>
      </Typography>
      <Typography variant="h2" sx={{ color: "#36454F" }}>
        {teacherCount}
      </Typography>
    </Box>
  );
};

export default TeacherCount;
