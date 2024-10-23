import React from "react";
import { BiErrorCircle } from "react-icons/bi";
import { MdCheckCircle } from "react-icons/md"; // Added icon for success
import { CircularProgress, Box, Typography } from "@mui/material";

const RecorderErrorMessage = ({
  lectureStoped,
  error,
  recordingData,
  uploadedChunk,
  timeRemaining,
  uploadSpeed,
}) => {
  // Function to format the time remaining
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const sec = secs > 0 ? secs : 1;

    return `${hrs > 0 ? `${hrs}h ` : ""}${mins > 0 ? `${mins}m ` : ""}${sec}s`;
  };

  return (
    <Box>
      {lectureStoped?.isProccess &&
        !lectureStoped?.submit &&
        !lectureStoped?.isError && (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CircularProgress size={80} sx={{ color: "#66FF00" }} />
                {uploadedChunk > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "gray",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      {uploadedChunk?.toFixed()}%
                    </Typography>
                  </Box>
                )}
              </Box>
              {uploadedChunk > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#66FF00",
                      fontSize: "1rem",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Upload Speed:{" "}
                    <span style={{ color: "gray", fontWeight: "500" }}>
                      {uploadSpeed} MB/s
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      color: "#66FF00",
                      fontSize: "1rem",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Time Remaining:{" "}
                    <span style={{ color: "gray", fontWeight: "500" }}>
                      {formatTime(timeRemaining)}
                    </span>
                  </Typography>
                </Box>
              )}
            </Box>
            <Box textAlign="center">
              <Typography
                sx={{ color: "#66FF00", fontSize: "1rem", fontWeight: "600" }}
              >
                Your lecture recording is being uploaded.
              </Typography>
              <Typography sx={{ color: "gray", fontSize: "0.875rem", pt: 2 }}>
                This may take a while. Do not close the browser window.
              </Typography>
            </Box>
          </Box>
        )}
      {lectureStoped?.isProccess &&
        lectureStoped?.submit &&
        !lectureStoped?.isError && (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <MdCheckCircle
                style={{ fontSize: "4rem", color: "#66FF00" }} // Success icon
              />
            </Box>
            <Typography
              sx={{
                color: "primary.main",
                fontSize: "1rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Your lecture has been recorded and saved successfully. You will be
              notified with an email when the Minutes of the Lecture (MoL) is
              ready to view.
            </Typography>
          </Box>
        )}
      {lectureStoped?.isProccess &&
        !lectureStoped?.submit &&
        lectureStoped?.isError && (
          <Box
            sx={{
              height: "80%",
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <BiErrorCircle style={{ fontSize: "4rem", color: "#e53935" }} />
            </Box>
            <Box textAlign="center">
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {error?.audioProcess?.status !== "Network Error" ? (
                  <>
                    <p>{error?.audioProcess?.status}</p>
                    <p>{error?.audioProcess?.errorMessage}</p>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                      color: "#e53935",
                    }}
                  >
                    <Typography sx={{ fontWeight: "500" }}>
                      {error?.audioProcess?.errorMessage}
                    </Typography>
                    <Typography sx={{ fontWeight: "600" }}>
                      ALTERNATIVELY
                    </Typography>
                    <Typography sx={{ fontWeight: "500" }}>
                      {`You can also upload this audio file ( ${recordingData?.title} video.mp4 )`}
                    </Typography>
                  </Box>
                )}
              </Typography>
              {error.audioProcess?.status !== "Network Error" && (
                <Typography
                  sx={{
                    color: "#434954",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    pt: 2,
                  }}
                >
                  Please Try again
                </Typography>
              )}
            </Box>
          </Box>
        )}
    </Box>
  );
};

export default RecorderErrorMessage;
