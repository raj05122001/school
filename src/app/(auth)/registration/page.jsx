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
      {/* Left Side with Gradient Background */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            // background: "linear-gradient(to bottom right, #1976d2, #00c853)",
            backgroundImage: "url('/loginBG3.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            position: "relative", // Ensures the overlay text is positioned correctly
          }}
        >
          {/* Overlay Text */}
          <Box
            sx={{
              position: "absolute",
              top: "25%",
              left: "25%",
              // transform: "translate(-50%, -50%)",
              color: "#fff",
              textAlign: "left",
              animation: "slideFade 1s ease-in-out",
              ...textAnimation,
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "#EDEADE" }}
            >
              Welcome to
              <br />
              <Box sx={{ p: 1 }}>
                <Logo />
              </Box>
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, color: "#191970" }}>
              Your AI-powered Learning Companion
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Right Side Login Form */}
      {accesskey && email && verifyotp ? (
        <UserData />
      ) : accesskey && email ? (
        <VerifyOtp />
      ) : (
        <AccessKey />
      )}
    </Grid>
  );
};

export default RegistationPage;
