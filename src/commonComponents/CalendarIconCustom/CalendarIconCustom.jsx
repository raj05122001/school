import React from "react";
import { Box, Typography } from "@mui/material";

const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


const CalendarIconCustom = ({ date }) => {
  const jsDate = new Date(date);
  const dayName = day[jsDate.getDay()];
  const dayNum = jsDate.getDate();
  const monthName = months[jsDate.getMonth()];


  return (
    <Box
      sx={{
        width: "37px",
        height: "49px", // 13 (top) + 36 (bottom)
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      {/* Top SVG (Green Header) */}
      <Box
        sx={{
          width: "36px",
          height: "12px",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex:100
        }}
        dangerouslySetInnerHTML={{
          __html: `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="13" viewBox="0 0 37 13" fill="none">
            <path d="M36.1144 12.5H0.00292969V11C0.00292969 4.92487 4.9278 0 11.0029 0H25.1144C31.1895 0 36.1144 4.92487 36.1144 11V12.5Z" fill="#16AA54"/>
          </svg>`,
        }}
      />
      {/* Bottom SVG (Light Background) */}
      <Box
        sx={{
          width: "37px",
          height: "36px",
          position: "absolute",
          top: "5px",
          left: 0,
        }}
        dangerouslySetInnerHTML={{
          __html: `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
            <rect x="0.00292969" width="36.1115" height="36" rx="11" fill="#E2FFEE"/>
          </svg>`,
        }}
      />
      {/* Day Text */}
      <Typography
        variant="caption"
        sx={{
          fontSize: "8px",
          fontWeight: 400,
          fontFamily:"Inter",
          color: "#fff",
          position: "absolute",
          top: "2.5px",
          left: "50%",
          lineHeight:"normal",
          fontStyle:"normal",
          transform: "translateX(-50%)",
          zIndex:200,
        //   width:"16px"
        }}
      >
        {monthName}
      </Typography>

      {/* Date Number */}
      <Typography
        variant="body1"
        sx={{
          fontSize: "12px",
          textAlign:"center",
          fontFamily:"Inter",
          fontStyle:"normal",
          lineHeight:"normal",
          fontWeight: 700,
          color: "#141514",
          position: "absolute",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {dayNum}
      </Typography>
    </Box>
  );
};

export default CalendarIconCustom;
