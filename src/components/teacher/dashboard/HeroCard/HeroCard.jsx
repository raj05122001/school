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
        flexShrink: 0,
        borderRadius: "20px",
        padding: "15px 0px 0px 16px",
        background: "var(--Green-dark-2, #174321);",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "440px",
          height: "100%",
          flexShrink: 0,
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
          justifyContent: "flex-start",
          alignItems: "center",
          width: "275px",
          height: "100%",
          flexShrink: 1,
          overflow: "hidden",
          maxWidth: "100%",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            width: "297px",
            height: "253px",
            aspectRatio: "33 / 28",
            background:
              'url("/banner 1_illustration 1.png") lightgray 50% / cover no-repeat',
            backgroundColor: "var(--Green-dark-2, #174321);",
            marginTop: "48px",
            marginRight: "2px",
            // borderRadius: "8px",
          }}
        />
        {/* <Image
          src={"/banner 1_illustration 1.png"}
          alt="Sitting Image"
          width={257}
          height={250}
          style={{ flexShrink: 0, marginTop: "48px", marginRight: "0.46px" }}
        /> */}
      </Box>
    </Box>
  );
}

export default HeroCard;
