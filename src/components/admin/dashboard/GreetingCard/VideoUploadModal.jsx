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
  // LinearProgress, // abhi use nahi ho raha
} from "@mui/material";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import { createInstantLecture } from "@/api/apiHelper";

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function VideoUploadModal({ open, onClose, onSuccess }) {
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
    setUploadProgress(10);

    const start = Date.now();
    const MIN_DURATION = 2000;

    try {
      const videoFileName = file.name;

      await createInstantLecture(videoFileName);

      const elapsed = Date.now() - start;
      if (elapsed < MIN_DURATION) {
        await new Promise((res) => setTimeout(res, MIN_DURATION - elapsed));
      }

      setUploadProgress(100);

      if (onSuccess) onSuccess({ video_file_name: videoFileName });

      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        setUploadProgress(0);
        onClose?.();
      }, 300);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      setUploadProgress(0);
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
          backgroundColor: "#FFFFFF",
          color: "#141514",
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
            color: "#141514",
          }}
        >
          Upload Lecture Video
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isUploading}
          sx={{ color: "#6B7280" }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 1,
        }}
      >
        <Box
          sx={{
            borderRadius: "12px",
            border: "1px dashed rgba(16,185,129,0.5)",
            padding: "20px",
            textAlign: "center",
            background:
              "radial-gradient(circle at top, rgba(18,221,0,0.06), rgba(255,255,255,1) 70%)",
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
                "linear-gradient(135deg, rgba(18,221,0,0.25), rgba(34,197,94,0.1))",
            }}
          >
            <FiUpload size={28} color="#16AA54" />
          </Box>

          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              mb: 0.5,
              color: "#111827",
            }}
          >
            Select a video to upload
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "#6B7280",
              mb: 2,
            }}
          >
            MP4 / MKV preferred. 
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
              borderColor: "#16AA54",
              color: "#16AA54",
              "&:hover": {
                borderColor: "#16AA54",
                background: "rgba(22,163,74,0.08)",
              },
            }}
          >
            Choose Video
          </Button>
        </Box>

        {file && (
          <Box
            sx={{
              mt: 2,
              borderRadius: "12px",
              border: "1px solid rgba(209,213,219,0.9)",
              background: "#F9FAFB",
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
                background: "#E5F9E7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiFile color="#16A34A" />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#111827",
                }}
                title={file.name}
              >
                {file.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7280",
                }}
              >
                {formatFileSize(file.size)}
              </Typography>
            </Box>

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
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke="rgba(209,213,219,0.9)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke="#16AA54"
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
                      color: "#111827",
                    }}
                  >
                    {safeProgress}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Error Text */}
        {error && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "12px",
              color: "#DC2626",
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
            color: "#6B7280",
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

            color: "#FFFFFF",
            background: "linear-gradient(135deg, #12DD00, #16A34A)",

            "&:hover": {
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #16A34A, #15803D)",
            },

            "&.Mui-disabled": {
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #16A34A, #15803D)",
              opacity: 0.7,
            },
          }}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>


      </DialogActions>
    </Dialog>
  );
}

export default VideoUploadModal;
