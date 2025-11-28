import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Grid,
} from "@mui/material";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { capitalizeWords } from "@/helper/Helper";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { getMyAssignmentAnalytics } from "@/api/apiHelper";

function HeroSectionStudent() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [myScores, setMyScores] = useState({});

  const fetchMyScores = async () => {
    try {
      const response = await getMyAssignmentAnalytics();
      if (response?.success) {
        setMyScores(response?.data || {});
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
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: "20px",
        background: "var(--Green-dark-2, #174321)",
        flexShrink: 0,
        boxSizing: "border-box",
        p: { xs: 2, md: 0 },
        gap: { xs: 2, md: 0 },
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 0",
          minWidth: 0,
          height: { xs: "auto", md: "304px" },
          gap: { xs: 2, md: "37px" },
        }}
      >
        {/* PROFILE CHIP */}
        <Box sx={{ mt: { xs: 0.5, md: "15px" }, ml: { xs: 0, md: "16px" } }}>
          <Box
            sx={{
              maxWidth: "100%",
              width: { xs: "100%", sm: "320px", md: "249px" },
              minHeight: "49px",
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
            {/* Profile Picture */}
            {userDetails?.profile_pic ? (
              <Image
                src={`${BASE_URL_MEET}${userDetails?.profile_pic}`}
                alt="Profile"
                width={42}
                height={42}
                style={{ borderRadius: "50%", marginRight: 2 }}
              />
            ) : (
              <Box>
                <UserImage
                  width={40}
                  height={40}
                  name={userDetails?.full_name}
                />
              </Box>
            )}

            {/* Name + class/department */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Name with truncate + tooltip */}
              {userDetails?.full_name?.length > 10 ? (
                <Tooltip title={userDetails?.full_name}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#fff",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "14.99px",
                      alignSelf: "stretch",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userDetails?.full_name?.length > 12
                      ? `${capitalizeWords(
                          userDetails.full_name.slice(0, 12)
                        )}...`
                      : capitalizeWords(userDetails?.full_name)}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "14.99px",
                    alignSelf: "stretch",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {capitalizeWords(userDetails?.full_name)}
                </Typography>
              )}

              {/* Class / Department */}
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

            {/* Divider */}
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
                strokeWidth="0.624738"
              />
            </svg>

            {/* Role + brand */}
            <Box sx={{ pr: 1 }}>
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
                    .toUpperCase()}${userDetails?.role
                    .slice(1)
                    .toLowerCase()}`}
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

        {/* SCORES AREA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            mx: { xs: 0, md: "16px" },
            mt: { xs: 2, md: 0 },
            pb: { xs: 1.5, md: 0 },
            flex: 1,
          }}
        >
          {/* Average Score Card */}
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "12px",
              padding: "14px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
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
            <Typography
              variant="h5"
              color={"#3B3D3B"}
              fontWeight={700}
              sx={{ fontSize: { xs: "20px", sm: "22px", md: "24px" } }}
            >
              {myScores?.average_scored_percentage ?? 0}%
            </Typography>
          </Box>

          {/* Range score cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ScoreCard
                bgColor="#DBFFDC"
                dotColor="#34C759"
                value={
                  myScores?.my_assignment_in_which_i_got_less_than_50 ?? 0
                }
                Range={"0-50%"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ScoreCard
                bgColor="#FFF3E0"
                dotColor="#FFCC00"
                value={
                  myScores?.my_assignment_in_which_i_got_between_than_50_to_80 ??
                  0
                }
                Range={"50%-80%"}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <ScoreCard
                bgColor="#FBEDEE"
                dotColor="#FF3B30"
                value={
                  myScores?.my_assignment_in_which_i_got_between_than_80_to_100 ??
                  0
                }
                Range={"80%-100%"}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* RIGHT SIDE ILLUSTRATION */}
      <Box
        sx={{
          flex: { xs: "0 0 auto", md: "0 0 35%" },
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          alignItems: "center",
          mt: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "336px" },
            maxWidth: "336px",
            height: { xs: 200, sm: 230, md: 304 },
            background:
              'url("/banner 3_illustration 1.png") lightgray 50% / cover no-repeat',
            backgroundColor: "var(--Green-dark-2, #174321)",
            borderRadius: { xs: "16px", md: "20px" },
            overflow: "hidden",
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
        minWidth: 0,
        width: "100%",
        minHeight: 70,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontSize="16px"
            fontWeight={600}
            color="text.primary"
            sx={{ whiteSpace: "nowrap" }}
          >
            Assignment
          </Typography>
          <Typography
            fontSize="16px"
            fontWeight={600}
            color="text.primary"
            sx={{ whiteSpace: "nowrap" }}
          >
            Range {Range}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: dotColor,
            width: "16px",
            height: "16px",
            borderRadius: "100%",
            flexShrink: 0,
          }}
        />
      </Box>
      <Typography
        fontSize="24px"
        fontWeight={600}
        mt={1}
        sx={{ wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Paper>
  );
};
