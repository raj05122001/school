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

import { FiCopy, FiCheck } from "react-icons/fi";

const LectureDescription = ({ lectureData, isShowPic = false, loading, videoTimeStamp = 0 }) => {
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

  const [copied, setCopied] = useState(false);

  const handleCopyShareUrl = async () => {
    try {
      // build a clean URL with ?timestamp=...
      const url = new URL(window.location.href);
      url.searchParams.set("timestamp", Math.floor(videoTimeStamp || 0));

      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      // (optional) subtle haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(10);

      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Could not copy text:", err);
      // briefly show an error state too, if you want:
      setCopied(false);
    }
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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // mobile = column
          justifyContent: "space-between",
          alignItems: { xs: "center", sm: "center" }, // mobile me center
          gap: { xs: 1.5, sm: 0 },
        }}
      >

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
              flex: 1, // title jitni jagah chahiye le sakta hai
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

        <Button
          onClick={handleCopyShareUrl}
          variant="outlined"
          startIcon={copied ? <FiCheck /> : <FiCopy />}
          sx={{
            mr: { xs: 0, sm: 2 },
            mt: { xs: 1, sm: 0 },                 // mobile: title ke niche thoda gap
            alignSelf: { xs: "center", sm: "auto" }, // mobile: center, full width nahi
            px: { xs: 2, sm: 2.5 },               // width control
            py: { xs: 0.6, sm: 0.5 },             // height control
            minWidth: { xs: 170, sm: 190 },       // button ka fixed-ish width
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            borderRadius: 999,                    // thoda pill look
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy Share URL"}
        </Button>

      </Box>



      <Box sx={{ flex: 2, width: "95%" }}>
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
                Class:{" "}
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
                Subject:{" "}
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
                Chapter:{" "}
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

        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
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
                  width={40}
                  height={40}
                />
                <Typography sx={{
                  color: "#3B3D3B",
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "normal",
                }}>{lectureData?.organizer?.full_name}</Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LectureDescription;
