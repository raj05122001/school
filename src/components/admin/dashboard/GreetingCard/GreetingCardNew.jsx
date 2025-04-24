import { Badge, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { GoBell } from "react-icons/go";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { AppContextProvider } from "@/app/main";

function GreetingCardNew() {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const { handleCreateLecture } = useContext(AppContextProvider);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  const userName = userDetails?.full_name?.split(" ")[0];

  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: "1px solid var(--Stroke-Color-1, #C1C1C1)",
        width: "100%",
        height: "75px",
        padding: "13px 6px",
        justifyContent:'space-between'
      }}
    >
      <Typography
        sx={{
          height: "48px",
          fontSize: "28px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          paddingLeft: "12px",
          flexShrink: 0,
        }}
      >
        Welcome Back {userName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight:"12px",
          gap: "12px",
        }}
      >

        {userDetails?.role === "ADMIN" && (
          <Button
            variant="contained"
            onClick={() => router.push(`/admin/lecture-schedule/`)}
            sx={{
              display: "flex",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              backgroundColor: "#141514",
              textTransform: "none",
            }}
          >
            <FiUpload style={{fontSize:"24px"}}/>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                lineHeight: "24px",
              }}
            >
              Upload
            </Typography>
          </Button>
          
        )}  
        {userDetails?.role === "TEACHER" && (
          <Button
            variant="contained"
            onClick={() => handleCreateLecture("", false)}
            sx={{
              display: "flex",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              backgroundColor: "#141514",
              textTransform: "none",
              "&:hover": {
                    border: "1px solid #141514",
                    background: "#E5E5E5",
                    color: "#141514",
                  },
            }}
          >
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "24px",
                height: "24px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M12.0625 22C17.5625 22 22.0625 17.5 22.0625 12C22.0625 6.5 17.5625 2 12.0625 2C6.5625 2 2.0625 6.5 2.0625 12C2.0625 17.5 6.5625 22 12.0625 22Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.0625 12H16.0625"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.0625 16V8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontSize: "20px",
                fontStyle: "normal",
                fontFamily: "Inter Tight, sans-serif",
                fontWeight: 700,
                lineHeight: "24px",
                "&:hover": {
                    color: "#141514",
                  },
              }}
            >
              Create
            </Typography>
          </Button>
        )} 
        {userDetails?.role==="STUDENT" && (
          <Button
            variant="contained"
            onClick={()=>router.push(`/student/lecture-listings/`)}
            sx={{
              display: "flex",
              padding: "12px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              backgroundColor: "#141514",
              textTransform: "none",
            }}
          >
            <IoPlayCircleOutline style={{color:"#fff", fontSize:"24px"}}/>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Watch
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default GreetingCardNew;
