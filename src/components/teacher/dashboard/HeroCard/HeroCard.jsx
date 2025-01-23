import { Box } from "@mui/material";
import React from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import SubjectCompletion from "../SubjectCompletion/SubjectCompletion";
import LectureDuration from "../LectureDuration/LectureDuration";
import Image from "next/image";

function HeroCard({ averageDuration }) {
  return (
    <Box
      sx={{
        width: "715px",
        height: "316px",
        display: "flex",
        gap: "34.5px",
        flexShrink: 0,
        borderRadius: "20px",
        background: "linear-gradient(244deg, #12DD00 -6.52%, #16AA54 110.91%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <Box sx={{ marginTop: "15px", marginLeft: "16px" }}>
          <ProfileCard />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "55.62px",
            // marginTop: "94.22px",
            // marginBottom: "53.79px",
            marginLeft: "16px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <LectureDuration averageDuration={averageDuration} />
          <SubjectCompletion />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Image
          src={"/heroImage.png"}
          alt="Sitting Image"
          width={260.45}
          height={208}
          style={{ flexShrink: 0, marginTop: "48px", marginRight: "0.46px" }}
        />
      </Box>
    </Box>
  );
}

export default HeroCard;
