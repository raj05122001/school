import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { GiDuration } from "react-icons/gi";

function LectureDuration({ averageDuration }) {
  return (
    <Card
      sx={{
        maxWidth: "full",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        p: 2,
        background:
          "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      {/* Profile Picture */}
      <GiDuration
        style={{
          width: "50px",
          height: "50px",
          position: "absolute",
          top: 3,
          left: 3,
        }}
      />

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Teacher Name */}
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          align="center"
          fontWeight={"bold"}
        >
          Average Duration
        </Typography>

        {/* Class and Department */}
        <Typography variant="body1" color="text.primary" align="center">
          {averageDuration} mins
        </Typography>
      </CardContent>
    </Card>
  );
}

export default LectureDuration;
