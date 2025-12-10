"use client";

import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { AppContextProvider } from "@/app/main";
import VideoUploadModal from "./VideoUploadModal";

function GreetingCardNew({ onMenuClick, isSidebarOpen }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const contextValue = useContext(AppContextProvider);
  const {
    handleCreateLecture,
    toggleSidebar,
    isSidebarOpen: contextSidebarOpen,
  } = contextValue || {};

  const handleMenuClick = onMenuClick || toggleSidebar;
  const sidebarOpen =
    isSidebarOpen !== undefined ? isSidebarOpen : contextSidebarOpen;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  const userName = userDetails?.full_name?.split(" ")[0];

  const handleCreateLectureSafe = () => {
    if (handleCreateLecture) {
      handleCreateLecture("", false);
    } else {
      router.push("/teacher/lecture-create");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #C1C1C1",
          width: "100%",
          minHeight: "75px",
          padding: "13px 24px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: 0,
          }}
        >
          {isSmallScreen && (
            <IconButton
              onClick={handleMenuClick}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                border: "1px solid #E0E0E0",
                flexShrink: 0,
              }}
            >
              <HiOutlineMenu size={22} />
            </IconButton>
          )}

          <Typography
            sx={{
              fontSize: { xs: "20px", md: "28px" },
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              color: "#000",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            Welcome Back {userName}
          </Typography>
        </Box>

        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            {userDetails?.role === "ADMIN" && (
              <Button
                variant="contained"
                onClick={() => router.push(`/admin/lecture-schedule/`)}
                sx={{
                  display: "flex",
                  padding: "12px 16px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#141514",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                }}
              >
                <FiUpload style={{ fontSize: "24px" }} />
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Upload
                </Typography>
              </Button>
            )}

            {userDetails?.role === "TEACHER" && (
              <>
                {/* <Button
                  variant="contained"
                  onClick={() => setIsUploadOpen(true)}
                  sx={{
                    display: "flex",
                    padding: "12px 16px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#141514",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                    "&:hover": {
                      border: "1px solid #141514",
                      background: "#E5E5E5",
                      color: "#141514",
                    },
                  }}
                >
                  <FiUpload style={{ fontSize: "24px" }} />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: 700,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    instant lecture
                  </Typography>
                </Button> */}

                {/* TEACHER Create */}
                <Button
                  variant="contained"
                  onClick={handleCreateLectureSafe}
                  sx={{
                    display: "flex",
                    padding: "12px 16px",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "8px",
                    backgroundColor: "#141514",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                    "&:hover": {
                      border: "1px solid #141514",
                      background: "#E5E5E5",
                      color: "#141514",
                    },
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
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
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.0625 12H16.0625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.0625 16V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: 700,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Create
                  </Typography>
                </Button>
              </>
            )}

            {userDetails?.role === "STUDENT" && (
              <Button
                variant="contained"
                onClick={() => router.push(`/student/lecture-listings/`)}
                sx={{
                  display: "flex",
                  padding: "12px 16px",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "8px",
                  backgroundColor: "#141514",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  minWidth: "auto",
                }}
              >
                <IoPlayCircleOutline
                  style={{ color: "#fff", fontSize: "24px" }}
                />
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Watch
                </Typography>
              </Button>
            )}
          </Box>
        )}
      </Box>

      <VideoUploadModal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={(data) => {
          console.log("Video uploaded:", data);
        }}
      />
    </>
  );
}

export default GreetingCardNew;
