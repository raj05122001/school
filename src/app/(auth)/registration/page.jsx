"use client";
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import AccessKey from "@/components/Registration/AccessKey";
import VerifyOtp from "@/components/Registration/VerifyOtp";
import UserData from "@/components/Registration/UserData";
import { useMediaQuery } from "@mui/material";
import Logo from "@/commonComponents/Logo/Logo";

// Keyframes for the text animation
const textAnimation = {
  "@keyframes slideFade": {
    "0%": {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

const RegistationPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const accesskey = searchParams.get("accesskey");
  const verifyotp = searchParams.get("verifyotp");
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
      }}
    >
      {/* Left Side Login Form */}
      {accesskey && email && verifyotp ? (
        <UserData />
      ) : accesskey && email ? (
        <VerifyOtp />
      ) : (
        <AccessKey />
      )}
      {/* Right Side Login Design */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            display: "inline-flex",
            // padding: "247px 32px 231px 31px",
            flexDirection: "column",
            // justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              backgroundColor: "#fff",
              // marginTop: "247px",
              // marginBotton: "231px",
              // marginLeft: "31px",
              // maginRight: "32px",
              margin: "auto",
            }}
          >
            {/* Image 1: Takes 50% of the width */}
            <Box
              sx={{
                width: "388px",
                height: "546px",
                aspectRatio: "194 / 273",
                background:
                  'url("/Illustration_indian 1.png") lightgray 50% / cover no-repeat',
                flexShrink: 0,
                backgroundColor: "#fff",
              }}
            />
            {/* Images 2 and 3: Stack vertically and take remaining 50% */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  width: "253px",
                  height: "259px",
                  aspectRatio: "253 / 259",
                  background:
                    'url("/Illustration_euro 1.png") lightgray 50% / cover no-repeat',
                  flexShrink: 0,
                  backgroundColor: "#fff",
                }}
              />

              <Box
                sx={{
                  width: "253px",
                  height: "259px",
                  aspectRatio: "253 / 259",
                  background:
                    'url("/Illustration_arabic 1.png") lightgray 50% / cover no-repeat',
                  flexShrink: 0,
                  backgroundColor: "#fff",
                }}
              />
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default RegistationPage;
