import { Box } from "@mui/material";
import React from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import SubjectCompletion from "../SubjectCompletion/SubjectCompletion";
import LectureDuration from "../LectureDuration/LectureDuration";

function HeroCard({ averageDuration }) {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "100%" },
        maxWidth: { xs: 420, md: "100%" },
        mx: "auto",
        height: { xs: "auto", md: "316px" }, // md पर fixed, mobile पर auto
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        flexShrink: 0,
        borderRadius: "20px",
        p: { xs: 1.5, md: "15px 0px 0px 16px" }, // 🔹 mobile padding भी थोड़ा कम
        background: "var(--Green-dark-2, #174321)",
        boxSizing: "border-box",
        gap: { xs: 1.5, md: 0 },
      }}
    >
      {/* LEFT SIDE: PROFILE + CIRCLES */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "440px" },
          height: "100%",
          flexShrink: 0,
        }}
      >
        <Box sx={{ mt: { xs: 0.5, md: 1.5 }, ml: { xs: 0, md: "16px" } }}>
          <ProfileCard />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: { xs: 1.2, sm: 3, md: "55.62px" },
            ml: { xs: 0, md: "16px" },
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: { xs: 1.5, md: 0 }, // 🔹 yaha se भी height घटेगी
          }}
        >
          {/* Lecture Duration */}
          <Box
            sx={{
              flex: "0 0 auto",
              mx: { xs: 0.5, md: 0 },
              display: "flex",
              justifyContent: "center",
              transform: {
                xs: "scale(0.5)",
                sm: "scale(0.8)",
                md: "scale(1)",
              },
              transformOrigin: "center",
            }}
          >
            <LectureDuration averageDuration={averageDuration} />
          </Box>

          {/* Subject Completion */}
          <Box
            sx={{
              flex: "0 0 auto",
              mx: { xs: 0.5, md: 0 },
              display: "flex",
              justifyContent: "center",
              transform: {
                xs: "scale(0.5)",
                sm: "scale(0.8)",
                md: "scale(1)",
              },
              transformOrigin: "center",
            }}
          >
            <SubjectCompletion />
          </Box>
        </Box>
      </Box>

      {/* RIGHT SIDE: ILLUSTRATION */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: "center",           // 🔹 flex-end → center
          width: { xs: "100%", md: "275px" },
          mt: { xs: 1, md: 0 },           // 🔹 top margin कम
          pb: { xs: 0.5, md: 0 },
        }}
      >
        <Box
  sx={{
    width: { xs: "78%", sm: "70%", md: "297px" },
    maxWidth: "297px",
    position: "relative",
    pt: { xs: 0, sm: 0, md: "65%" },
    borderRadius: "20px",
    overflow: "hidden",
    backgroundImage: {
      xs: "none",
      sm: "none",
      md: 'url("/banner 1_illustration 1.png")',
    },
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: { xs: "center bottom", md: "right bottom" },
  }}
/>

      </Box>
    </Box>
  );
}

export default HeroCard;
