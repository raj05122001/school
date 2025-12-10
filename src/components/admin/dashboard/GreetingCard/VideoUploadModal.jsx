"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  LinearProgress,
} from "@mui/material";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import axios from "axios";
import { createInstantLecture } from "@/api/apiHelper";
const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function VideoUploadModal({
  open,
  onClose,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // 0–100
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const videoFileName = file.name;

      await createInstantLecture(videoFileName);

      if (onSuccess) onSuccess({ video_file_name: videoFileName });

      setIsUploading(false);
      setFile(null);
      setUploadProgress(100);
      onClose?.();
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      setError("Upload failed. Please try again.");
    }
  };



  const handleClose = () => {
    if (isUploading) return;
    setFile(null);
    setUploadProgress(0);
    setError("");
    onClose?.();
  };

  // ---- custom circle progress values ----
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.min(Math.max(uploadProgress, 0), 100);
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "8px 8px 16px",
          background: "linear-gradient(135deg, #0F172A, #111827)",
          color: "#E5E7EB",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Upload Lecture Video
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isUploading}
          sx={{ color: "#9CA3AF" }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 1,
        }}
      >
        {/* Upload Area */}
        <Box
          sx={{
            borderRadius: "12px",
            border: "1px dashed rgba(156,163,175,0.7)",
            padding: "20px",
            textAlign: "center",
            background:
              "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 60%)",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              background:
                "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(14,165,233,0.1))",
            }}
          >
            <FiUpload size={28} />
          </Box>

          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            Select a video to upload
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#9CA3AF",
              mb: 2,
            }}
          >
            MP4 / MKV preferred. Max size as per your backend limit.
          </Typography>

          <input
            id="video-upload-input"
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            component="label"
            htmlFor="video-upload-input"
            variant="outlined"
            disabled={isUploading}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              py: 1,
              borderColor: "rgba(156,163,175,0.7)",
              color: "#E5E7EB",
              "&:hover": {
                borderColor: "#60A5FA",
                background: "rgba(37,99,235,0.08)",
              },
            }}
          >
            Choose Video
          </Button>
        </Box>

        {/* Selected File Info */}
        {file && (
          <Box
            sx={{
              mt: 2,
              borderRadius: "12px",
              border: "1px solid rgba(55,65,81,0.9)",
              background:
                "linear-gradient(135deg, rgba(31,41,55,0.9), rgba(17,24,39,0.95))",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "rgba(55,65,81,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiFile />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={file.name}
              >
                {file.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                }}
              >
                {formatFileSize(file.size)}
              </Typography>
            </Box>

            {/* RIGHT-SIDE CIRCLE PROGRESS (SVG based) */}
            {safeProgress > 0 && (
              <Box
                sx={{
                  position: "relative",
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  mr: 0.5,
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 40 40"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  {/* background track */}
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke="rgba(75,85,99,0.7)"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* progress arc */}
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke={safeProgress === 100 ? "#22C55E" : "#60A5FA"}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "8px",
                      fontWeight: 600,
                      color: "#E5E7EB",
                    }}
                  >
                    {safeProgress}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Bottom bar progress */}
        {/* {isUploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={safeProgress}
              sx={{
                height: 6,
                borderRadius: 999,
                backgroundColor: "#111827",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                color: "#9CA3AF",
                mt: 0.5,
              }}
            >
              Uploading… please don’t close this window.
            </Typography>
          </Box>
        )} */}

        {/* Error Text */}
        {error && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "12px",
              color: "#FCA5A5",
            }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isUploading}
          sx={{
            textTransform: "none",
            color: "#9CA3AF",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || isUploading}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            px: 3,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
          }}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VideoUploadModal;
