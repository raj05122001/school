import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Badge,
  IconButton,
  Avatar,
} from "@mui/material";
import { FaBell } from "react-icons/fa";
import DarkMode from "@/components/DarkMode/DarkMode";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { capitalizeWords } from "@/helper/Helper";
import { AppContextProvider } from "@/app/main";
import { useRouter } from "next/navigation";
import UserImage from "@/commonComponents/UserImage/UserImage";

function GreetingCard() {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const { handleCreateLecture } = useContext(AppContextProvider);
  const router = useRouter();

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleRoute = () => {
    router.push(`/admin/lecture-listings/`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        padding: 2,
        boxSizing: "border-box",
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Slightly transparent white
        backdropFilter: "blur(10px)", // Adds the glass blur effect
        borderRadius: "16px", // Rounded corners for a smooth card look
        border: "1px solid rgba(255, 255, 255, 0.3)", // Adds a subtle border
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Light shadow for depth
        backgroundImage: "url('/CoverBG.jpg')", // Add background image
        backgroundSize: "cover", // Ensure the image covers the entire page
        backgroundPosition: "center", // Center the image
        height: "100%",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4" sx={{ textAlign: "left", color: "white" }}>
            {getGreeting()} {capitalizeWords(userDetails?.full_name)}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "left", color: "white" }}
          >
            Have a nice day!
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <DarkMode />
          {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <FaBell size={24} color="#ffffff" />
            </Badge>
          </IconButton> */}
          <UserImage width={40} height={40} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFD700", // Gold
              transition: "all 150ms ease-in-out",
              color: "#003366", // Dark blue for text

              ":hover": {
                backgroundColor: "#FFC107", // Slightly darker gold on hover
                boxShadow: "0 0 10px 0 #FFC107 inset, 0 0 10px 4px #FFC107", // Matching hover color with gold shade
              },
            }}
            onClick={() => handleRoute()}
          >
            Watch Lecture
          </Button>

          <Button
            variant="contained"
            onClick={()=>router.push(`/admin/lecture-schedule`)}
            sx={{
              backgroundColor: "#90EE90",
              ":hover": {
                backgroundColor: "#3CB371",
                boxShadow: "0 0 10px 0 #3CB371 inset, 0 0 10px 4px #3CB371",
              },
              color: "#006400",
              
            }}
          >
            Upload Syllabus
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default GreetingCard;
