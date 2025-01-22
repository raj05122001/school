import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { GiDuration } from "react-icons/gi";

function LectureDuration({ averageDuration }) {
  const avgDuration = averageDuration
  console.log("average duration", avgDuration)
  return (
    <Card
      sx={{
        maxWidth: "137.50px",
        width: "100%",
        height: "138.51px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        p: 2,
        fill: "var(--Secondary_Black, #141514)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "100%",
        backgroundColor: "rgba(20, 21, 20, 0.15)"
      }}
    >
      {/* Card Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Teacher Name */}
        <Box
          sx={{
            width: "24px",
            height: "24px",
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M21.1299 13.25C21.1299 18.08 17.2099 22 12.3799 22C7.54988 22 3.62988 18.08 3.62988 13.25C3.62988 8.42 7.54988 4.5 12.3799 4.5C17.2099 4.5 21.1299 8.42 21.1299 13.25Z"
              stroke="#FCFBFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.3799 8V13"
              stroke="#FCFBFA"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.37988 2H15.3799"
              stroke="#FCFBFA"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Box>
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          Avergae Duration
        </Typography>

        {/* Class and Department */}
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "24px",
          }}
        >
          {averageDuration} mins
        </Typography>
      </Box>
    </Card>
  );
}

export default LectureDuration;
