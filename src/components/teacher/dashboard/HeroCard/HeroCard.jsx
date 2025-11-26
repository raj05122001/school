import { Box } from "@mui/material";
import React from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import SubjectCompletion from "../SubjectCompletion/SubjectCompletion";
import LectureDuration from "../LectureDuration/LectureDuration";

function HeroCard({ averageDuration }) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: "auto",
        height: { xs: "auto", md: "316px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        flexShrink: 0,
        borderRadius: "20px",
        p: { xs: 1.5, md: "15px 0px 0px 16px" },
        background: "var(--Green-dark-2, #174321)",
        boxSizing: "border-box",
        gap: { xs: 1.5, md: 0 },
        overflow: "hidden", // ✅ image bahar nahi jayegi
      }}
    >
      {/* LEFT SIDE */}
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
            mt: { xs: 1.5, md: 0 },
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box
            sx={{
              flex: "0 0 auto",
              mx: { xs: 0.5, md: 0 },
              display: "flex",
              justifyContent: "center",
              transform: {
                xs: "scale(0.75)",
                sm: "scale(0.85)",
                md: "scale(1)",
              },
              transformOrigin: "center",
            }}
          >
            <LectureDuration averageDuration={averageDuration} />
          </Box>

          <Box
            sx={{
              flex: "0 0 auto",
              mx: { xs: 0.5, md: 0 },
              display: "flex",
              justifyContent: "center",
              transform: {
                xs: "scale(0.75)",
                sm: "scale(0.85)",
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
          display: { xs: "none", sm: "none", md: "flex" },
          justifyContent: "flex-end",
          alignItems: "center",
          width: { md: "40%", lg: "45%" },
          pr: { md: 2, lg: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "280px",
            position: "relative",
            pt: "70%", // aspect-ratio type
            borderRadius: "20px",
            overflow: "hidden",
            backgroundImage: 'url("/banner 1_illustration 1.png")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right bottom",
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroCard;
