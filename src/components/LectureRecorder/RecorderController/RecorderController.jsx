import React from "react";
import { MdOutlinePause, MdOutlineStop } from "react-icons/md"; // Stop icon
import { BsFillPlayFill, BsFillRecordFill } from "react-icons/bs"; // Record icon
import { Box, Typography, IconButton } from "@mui/material";

const RecorderController = ({
  startRecordingBtn,
  timer,
  handleVideoPlayPause,
  isPaused,
  stopRecording,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {startRecordingBtn && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Timer Display */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: "white",
              color: "black",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "6px solid red",
              }}
            />
            <Typography variant="body2">{formatTime(timer)}</Typography>
          </Box>

          {/* Play/Pause Button */}
          <Box
            onClick={handleVideoPlayPause}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: "white",
              color: "black",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: 1,
            }}
          >
            {isPaused ? (
              <BsFillPlayFill size={20} color="black" />
            ) : (
              <MdOutlinePause size={20} color="black" />
            )}
            <Typography variant="body2">
              {isPaused ? "Play" : "Pause"}
            </Typography>
          </Box>

          {/* Stop Button */}
          <Box
            onClick={stopRecording}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              bgcolor: "white",
              color: "black",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: 1,
            }}
          >
            {startRecordingBtn ? (
              <MdOutlineStop size={20} color="black" />
            ) : (
              <BsFillRecordFill size={20} color="black" />
            )}
            <Typography variant="body2">
              {startRecordingBtn ? "Stop" : "Start"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RecorderController;

export const formatTime = (timeInMS) => {
  const timeInSeconds = Math.floor(timeInMS / 1000);
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};