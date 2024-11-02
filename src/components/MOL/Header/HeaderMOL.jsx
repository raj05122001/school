import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  useTheme,
} from "@mui/material";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell, FaDownload } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import React from "react";
import { useThemeContext } from "@/hooks/ThemeContext";

const HeaderMOL = ({
  lectureData,
  isEdit = false,
  isShowPic = false,
}) => {
  const { isDarkMode } = useThemeContext();
  const theme = useTheme();

  // Helper function to convert duration from milliseconds to hours and minutes
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box
      sx={{
        padding: 3,
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 4,
          paddingBottom: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={<FaDownload size={22} />}
            sx={{
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "#fff" : theme.palette.primary.main,
            }}
          >
            Download
          </Button>

          <DarkMode />

          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <FaBell size={24} />
            </Badge>
          </IconButton>

          <UserImage width={40} height={40} />
        </Box>
      </Box>

      {/* Lecture Topic and Details Layout */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {/* Left: Lecture Title with Border on Right */}
        <Box
          sx={{
            flex: 1,
            borderRight: `2px solid ${
              isDarkMode ? theme.palette.grey[300] : "#6495ED"
            }`,
            paddingRight: 2,
          }}
        >
          <Typography
            variant="h4"
            fontFamily={"monospace"}
            sx={{ fontWeight: "bold" }}
          >
            {lectureData?.title || "Lecture Topic"}
            <br />
            <span style={{ fontSize: "16px", fontStyle: "italic" }}>
              facilitated by VidyaAI
            </span>
          </Typography>
        </Box>

        {/* Right: Lecture Details */}
        <Box sx={{ flex: 2 }}>
          {/* Description Row */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1">
              <strong>Description:</strong> {lectureData?.description || "N/A"}
            </Typography>
          </Box>

          {/* Class, Subject, and Chapter Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1">
              <strong>Class:</strong>{" "}
              {lectureData?.lecture_class?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
              <strong>Subject:</strong>{" "}
              {lectureData?.chapter?.subject?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Chapter:</strong> {lectureData?.chapter?.chapter || "N/A"}
            </Typography>
          </Box>

          {/* Duration, Scheduled Date, and Scheduled Time Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1">
              <strong>Duration:</strong>{" "}
              {lectureData?.duration
                ? formatDuration(lectureData?.duration)
                : "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Scheduled Date:</strong>{" "}
              {lectureData?.schedule_date || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Scheduled Time:</strong>{" "}
              {lectureData?.schedule_time || "N/A"}
            </Typography>
          </Box>

          {isShowPic && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <UserImage
                profilePic={lectureData?.organizer?.profile_pic}
                name={lectureData?.organizer?.full_name}
              />
              <Typography>{lectureData?.organizer?.full_name}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderMOL;
