import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { GiDuration } from "react-icons/gi";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";

function LectureDuration({ averageDuration }) {
  const perc =
    (averageDuration?.total_duration * averageDuration?.avg_duration) / 100;
  return (
    <Box sx={{ position: "relative" }}>
      <FacebookCircularProgress value={perc} />
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          top: "49%",
          left: "59%",
          transform: "translate(-50%, -50%)",
        }}
      >
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
            backgroundColor: "#16AA54",
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
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M21.1299 13.4033C21.1299 18.2333 17.2099 22.1533 12.3799 22.1533C7.54988 22.1533 3.62988 18.2333 3.62988 13.4033C3.62988 8.57332 7.54988 4.65332 12.3799 4.65332C17.2099 4.65332 21.1299 8.57332 21.1299 13.4033Z"
                  stroke="#FCFBFA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.3799 8.15332V13.1533"
                  stroke="#FCFBFA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.37988 2.15332H15.3799"
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
              Average Duration
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
              {averageDuration?.avg_duration || 0} mins
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default LectureDuration;

function FacebookCircularProgress({ value = 0 }) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: "#12DD00",
          ...theme.applyStyles("dark", {
            color: "#12DD00",
          }),
        })}
        size={170}
        thickness={2}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={(theme) => ({
          color: "#fff",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
          ...theme.applyStyles("dark", {
            color: "#FFFFFF",
          }),
        })}
        size={170}
        thickness={2}
        value={value}
      />
    </Box>
  );
}
