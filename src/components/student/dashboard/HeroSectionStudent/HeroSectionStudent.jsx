import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { capitalizeWords } from "@/helper/Helper";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { Paper, Grid } from "@mui/material";
import { getMyAssignmentAnalytics } from "@/api/apiHelper";

function HeroSectionStudent() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [myScores, setMyScores] = useState({});

  const fetchMyScores = async () => {
    try {
      const response = await getMyAssignmentAnalytics();
      if (response.success) {
        setMyScores(response?.data);
      }
    } catch (error) {
      console.error("Error fetching your score", error);
    }
  };

  useEffect(() => {
    fetchMyScores();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "304px",
        display: "flex",
        flexShrink: 0,
        borderRadius: "20px",
        background: "var(--Green-dark-2, #E7002A);",
        // gap:"30px"
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "60%",
          height: "100%",
          flexShrink: 0,
          gap: "37px",
        }}
      >
        <Box sx={{ marginTop: "15px", marginLeft: "16px" }}>
          <Box
            sx={{
              maxWidth: "249px",
              width: "100%",
              height: "49px",
              // position: "relative",
              display: "flex",
              alignItems: "center",
              p: "4px",
              border: "0.5px solid var(--Gradient-1, #1F8505)",
              background: "rgba(255, 255, 255, 0.20)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "55px",
              flexShrink: 0,
              gap: "12px",
            }}
          >
            {/* Edit Button */}
            {/* {userDetails?.role !== "STUDENT" && (
    <IconButton
      aria-label="edit"
      sx={{ position: "absolute", top: 8, right: 8 }}
      onClick={() => router.push("/teacher/myprofile")}
    >
      <FaEdit style={{ color: "white" }} />
    </IconButton>
  )} */}

            {/* Profile Picture */}
            {userDetails?.profile_pic ? (
              <Image
                src={`${BASE_URL_MEET}${userDetails?.profile_pic}`}
                alt="Profile"
                width={100}
                height={100}
                style={{ borderRadius: "50%", marginRight: 2 }}
              />
            ) : (
              <Box sx={{}}>
                <UserImage
                  width={40}
                  height={40}
                  name={userDetails?.full_name}
                />
              </Box>
            )}

            {/* Card Content */}
            <Box sx={{}}>
              {/* Teacher Name */}
              <Typography
                sx={{
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "14.99px",
                  alignSelf: "stretch",
                }}
              >
                {capitalizeWords(userDetails?.full_name)}
              </Typography>

              {/* Class and Department */}
              {/* <Typography variant="body2" color={"white"}>
        Experience: {userDetails?.exp}
      </Typography> */}

              {userDetails?.role === "STUDENT" ? (
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "14.99px",
                    alignSelf: "stretch",
                  }}
                >
                  {userDetails?.class_name}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "14.99px",
                    alignSelf: "stretch",
                  }}
                >
                  {userDetails?.department}
                </Typography>
              )}
            </Box>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1"
              height="29"
              viewBox="0 0 1 29"
              fill="none"
            >
              <path
                d="M0.376953 0.755737V28.2442"
                stroke="white"
                stroke-width="0.624738"
              />
            </svg>
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  alignSelf: "stretch",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: 400,
                  fontStyle: "normal",
                  lineHeight: "14.99px",
                }}
              >
                {userDetails?.role &&
                  `${userDetails?.role
                    .charAt(0)
                    .toUpperCase()}${userDetails?.role.slice(1).toLowerCase()}`}
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  alignSelf: "stretch",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontStyle: "normal",
                  lineHeight: "14.99px",
                }}
              >
                Vidya AI
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginLeft: "16px",
            height: "100%",
            // maxWidth:"636px"
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "12px",
              padding: "14px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={"/note-2.png"}
                style={{ width: "24px", height: "24px" }}
              />
              <Typography fontWeight={600} color={"#3B3D3B"}>
                Average Score %
              </Typography>
            </Box>
            <Typography variant="h5" color={"#3B3D3B"} fontWeight={700}>
              {myScores?.average_scored_percentage}%
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ScoreCard
                bgColor="#e2dbff"
                dotColor="#3e34c7"
                value={myScores?.my_assignment_in_which_i_got_less_than_50}
                Range={"0-50%"}
              />
            </Grid>
            <Grid item xs={4}>
              <ScoreCard
                bgColor="#FFF3E0"
                dotColor="#FFCC00"
                value={myScores?.my_assignment_in_which_i_got_between_than_50_to_80}
                Range={"50%-80%"}
              />
            </Grid>
            <Grid item xs={4}>
              <ScoreCard
                bgColor="#FBEDEE"
                dotColor="#FF3B30"
                value={myScores?.my_assignment_in_which_i_got_between_than_80_to_100}
                Range={"80%-100%"}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "20%",
          height: "100%",
          flexShrink: 1,
          overflow: "hidden",
          maxWidth: "100%",
          borderRadius: "20px",
          minWidth: "336px",
        }}
      >
        <Box
          sx={{
            width: "336px",
            height: "304px",
            aspectRatio: "33 / 28",
            background:
              'url("/banner 3_illustration 1.png") lightgray 50% / cover no-repeat',
            backgroundColor: "var(--Green-dark-2, #E7002A);",
            marginRight: "2px",
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroSectionStudent;

const ScoreCard = ({ bgColor, dotColor, value, Range }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: bgColor,
        p: 2,
        borderRadius: "12px",
        minWidth: 100,
        minHeight: 70,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontSize="16px" fontWeight={600} color="text.primary">
            Assignment
          </Typography>
          <Typography fontSize="16px" fontWeight={600} color="text.primary">
            Range {Range}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: dotColor,
            width: "16px",
            height: "16px",
            borderRadius: "100%",
          }}
        />
      </Box>
      <Typography fontSize="24px" fontWeight={600} mt={1}>
        {value}
      </Typography>
    </Paper>
  );
};