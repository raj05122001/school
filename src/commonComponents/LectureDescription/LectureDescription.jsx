import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  useTheme,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell, FaUpload, FaDownload } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import React from "react";
import { useThemeContext } from "@/hooks/ThemeContext";
import { MdPublishedWithChanges, MdUnpublished } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import { deleteCompletedLecture } from "@/api/apiHelper";
import { useRouter } from "next/navigation";

const LectureDescription = ({ lectureData, isShowPic = false, loading }) => {
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "N/A";
    return text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  };

  const valCSS = {
    color: "#3B3D3B",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "18px",
    letterSpacing: "-0.42px",
  };

  const keyCSS = {
    color: "#3B3D3B",
    fontFamily: "Inter",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "18px",
    letterSpacing: "-0.42px",
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: " 13px 0px 6px 20px",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
        borderRadius: "16px",
        borderBottom: " 0.5px solid var(--Stroke_1, #C1C1C1)",
        background: "#fff",
      }}
    >
    <Box sx={{ flex: 1 }}>
      {/* Lecture Topic and Details Layout */}
      {loading ? (
        <Skeleton width="100%" height={50} />
      ) : (
        <Typography
          sx={{
            color: "#3B3D3B",
            fontFamily: "Inter",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "normal",
          }}
        >
          {lectureData?.title || "Lecture Topic"}
          <span
            style={{
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
              fontStyle: "italic",
              fontWeight: "400",
              marginLeft: "4px",
            }}
          >
            (facilitated by VidyaAI)
          </span>
        </Typography>
      )}
    </Box>
      

      <Box sx={{ flex: 2, width:"95%" }}>
        <Box sx={{ mb: 1 }}>
          {loading ? (
            <Skeleton width="80%" height={30} />
          ) : (
            <Typography sx={keyCSS}>
              Description:{" "}
              <Tooltip
                title={lectureData?.description || "Description not available"}
              >
                <span
                  style={{
                    color: "#3B3D3B",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "18px",
                    letterSpacing: "-0.42px",
                  }}
                >
                  {truncateText(lectureData?.description || "N/A")}
                </span>
              </Tooltip>
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          {loading ? (
            <>
              <Skeleton width="20%" height={30} />
              <Skeleton width="20%" height={30} />
              <Skeleton width="20%" height={30} />
            </>
          ) : (
            <>
              <Typography sx={keyCSS}>
                Batch:{" "}
                <Tooltip
                  title={
                    lectureData?.lecture_class?.name ||
                    "Class name not available"
                  }
                >
                  <span style={valCSS}>
                    {truncateText(lectureData?.lecture_class?.name) || "N/A"}
                  </span>
                </Tooltip>
              </Typography>
              <Typography sx={keyCSS}>
                Course:{" "}
                <Tooltip
                  title={
                    lectureData?.chapter?.subject?.name ||
                    "Subject name not available"
                  }
                >
                  <span style={valCSS}>
                    {truncateText(lectureData?.chapter?.subject?.name || "N/A")}
                  </span>
                </Tooltip>
              </Typography>
              <Typography sx={keyCSS}>
                Module:{" "}
                <Tooltip
                  title={
                    lectureData?.chapter?.chapter ||
                    "Chapter name not available"
                  }
                >
                  <span style={valCSS}>
                    {truncateText(lectureData?.chapter?.chapter || "N/A")}
                  </span>
                </Tooltip>
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex",
            justifyContent: "space-between",
            mb: 1,}}>
          {loading ? (
            <>
              <Skeleton width="20%" height={30} />
              <Skeleton width="20%" height={30} />
              <Skeleton width="20%" height={30} />
            </>
          ) : (
            <>
              <Typography sx={keyCSS}>
                Duration:{" "}
                <span style={valCSS}>
                  {lectureData?.duration
                    ? formatDuration(lectureData?.duration)
                    : "N/A"}
                </span>
              </Typography>
              <Typography sx={keyCSS}>
                Scheduled Date:{" "}
                <span style={valCSS}>
                  {lectureData?.schedule_date || "N/A"}
                </span>
              </Typography>
              <Typography sx={keyCSS}>
                Scheduled Time:{" "}
                <span style={valCSS}>
                  {lectureData?.schedule_time || "N/A"}
                </span>
              </Typography>
            </>
          )}
        </Box>

        {isShowPic && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {loading ? (
              <>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton width="30%" height={30} />
              </>
            ) : (
              <>
                <UserImage
                  profilePic={lectureData?.organizer?.profile_pic}
                  name={lectureData?.organizer?.full_name}
                />
                <Typography>{lectureData?.organizer?.full_name}</Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LectureDescription;
