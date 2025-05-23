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

function ProfileCardAdmin() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
//   const [myScores, setMyScores] = useState({});

//   const fetchMyScores = async () => {
//     try {
//       const response = await getMyAssignmentAnalytics();
//       if (response.success) {
//         setMyScores(response?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching your score", error);
//     }
//   };

//   useEffect(() => {
//     fetchMyScores();
//   }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);
  return (
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
  );
}

export default ProfileCardAdmin;
