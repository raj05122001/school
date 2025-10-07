"use client";
import React, { useContext, useRef, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FiFile } from "react-icons/fi";
import JSZip from "jszip";
import {
  Button,
  Dialog,
  Card,
  CardContent,
  CardActions,
  Typography,
  Tooltip,
  Radio,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Box,
  Alert,
} from "@mui/material";
import { AppContextProvider } from "@/app/main";

const AddVideoFile = ({
  videoAttachment,
  setVideoAttachment,
  onRemoveVideoFile,
  removeCameraAccess,
  audioAttachment,
  setAudioAttachment,
  selectedOption,
  setSelectedOption,
}) => {
  const { isTrialAccount } = useContext(AppContextProvider);

  const inputVideoRef = useRef(null);
  const inputZipRef = useRef(null);

  const [zipFile, setZipFile] = useState(null);
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);

  // outer button drag state (no UI message/visuals)
  const [dragOuter, setDragOuter] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleClose = () => {
    setOpen(false);
    setAudioAttachment([]);
    setVideoAttachment([]);
    setZipFile(null);
    setError({});
    if (inputVideoRef.current) inputVideoRef.current.value = null;
    if (inputZipRef.current) inputZipRef.current.value = null;
    onRemoveVideoFile();
  };

  const handleVideoFile = (e) => {
    setError({});
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleZipFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setError({});
      processFile(file);
    }
  };

  const extractFiles = async (file) => {
    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      let foundVideo = false;
      let foundAudio = false;

      const entries = [];
      zipData.forEach((_, zipEntry) => entries.push(zipEntry));

      for (const zipEntry of entries) {
        const name = zipEntry.name.toLowerCase();
        if (!foundVideo && name.endsWith(".mp4")) {
          const videoBlob = await zipEntry.async("blob");
          const videoFile = new File([videoBlob], zipEntry.name, {
            type: "video/mp4",
          });
          setVideoAttachment([videoFile]);
          foundVideo = true;
        } else if (!foundAudio && name.endsWith(".wav")) {
          const audioBlob = await zipEntry.async("blob");
          const audioFile = new File([audioBlob], zipEntry.name, {
            type: "audio/wav",
          });
          setAudioAttachment([audioFile]);
          foundAudio = true;
        }
      }

      if (!foundVideo) setError({ message: "ZIP me .mp4 video file nahi mila." });
      setZipFile(file);
    } catch (err) {
      setError({
        message: "ZIP file read karte samay error aaya. Please valid ZIP upload karein.",
      });
      setZipFile(null);
    }
  };

  const removeZipFile = () => {
    setZipFile(null);
    setVideoAttachment([]);
    setAudioAttachment([]);
    onRemoveVideoFile();
    if (inputZipRef.current) inputZipRef.current.value = null;
  };

  const removeVideoFile = () => {
    setVideoAttachment([]);
    onRemoveVideoFile();
    if (inputVideoRef.current) inputVideoRef.current.value = null;
  };

  const handleChangeValue = () => {
    setAudioAttachment([]);
    setVideoAttachment([]);
    setZipFile(null);
    setError({});
    if (inputVideoRef.current) inputVideoRef.current.value = null;
    if (inputZipRef.current) inputZipRef.current.value = null;
  };

  // Dialog drop handlers (silent—no message/visuals)
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Outer button drop handlers (silent)
  const onOuterDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOuter(true);
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };
  const onOuterDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOuter(true);
  };
  const onOuterDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOuter(false);
  };
  const onOuterDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOuter(false);

    if (isTrialAccount) {
      alert("You don't have access. This is a trial account.");
      return;
    }
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Unified file processor
  const processFile = (file) => {
    setError({});
    removeCameraAccess();

    const nameLower = (file.name || "").toLowerCase();
    const typeLower = (file.type || "").toLowerCase();

    const isZip = nameLower.endsWith(".zip") || typeLower === "application/zip";
    const isVideo =
      typeLower.startsWith("video/") ||
      nameLower.endsWith(".mp4") ||
      nameLower.endsWith(".mkv") ||
      nameLower.endsWith(".mov") ||
      nameLower.endsWith(".webm");

    if (selectedOption === "vidya") {
      if (!isZip) {
        setError({ message: "Vidya AI ke liye sirf .zip file drag/drop karein." });
        return;
      }
      extractFiles(file);
      return;
    }

    if (selectedOption === "other") {
      if (!isVideo) {
        setError({
          message: "Video Upload ke liye sirf video file (e.g. .mp4, .mkv) drag/drop karein.",
        });
        return;
      }
      setVideoAttachment([file]);
      setZipFile(null);
      return;
    }

    setError({ message: "Unsupported file for selected source." });
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { borderRadius: "16px" } }}
      >
        <Card
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#f7f9fc",
            maxWidth: 560,
          }}
        >
          <CardContent>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              Add Video or ZIP File
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload video files directly or a ZIP file containing video and audio.
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold">
              Select Video Source:
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup
                row
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  handleChangeValue();
                }}
              >
                <FormControlLabel value="other" control={<Radio />} label="Video Upload" />
                <FormControlLabel value="vidya" control={<Radio />} label="Vidya AI ZIP" />
              </RadioGroup>
            </FormControl>

            {error?.message && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error" variant="outlined">
                  {error.message}
                </Alert>
              </Box>
            )}

            {selectedOption === "other" && (
              <Box
                sx={{ mt: 2, py: 2 }}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file"
                  accept="video/*,.mkv"
                  multiple
                  ref={inputVideoRef}
                  onChange={handleVideoFile}
                  style={{ display: "none" }}
                  id="videoattachment"
                />
                <label htmlFor="videoattachment" style={{ cursor: "pointer" }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": { color: "primary.main" },
                      mt: 1.5,
                    }}
                  >
                    <FaVideo size={22} style={{ marginRight: 8 }} />
                    Choose Video File
                  </Typography>
                </label>

                {videoAttachment?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {videoAttachment[0]?.name?.length > 30
                          ? `${videoAttachment[0]?.name.slice(0, 30)}...`
                          : videoAttachment[0]?.name}
                      </Typography>
                      <IoIosCloseCircle
                        size={26}
                        color="red"
                        onClick={removeVideoFile}
                        style={{ cursor: "pointer" }}
                        title="Remove"
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {selectedOption === "vidya" && (
              <Box
                sx={{ mt: 2 }}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  type="file"
                  accept=".zip"
                  ref={inputZipRef}
                  onChange={handleZipFile}
                  style={{ display: "none" }}
                  id="zipAttachment"
                />
                <label htmlFor="zipAttachment" style={{ cursor: "pointer" }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": { color: "primary.main" },
                      mt: 1.5,
                    }}
                  >
                    <FiFile size={22} style={{ marginRight: 8 }} />
                    Choose ZIP File
                  </Typography>
                </label>

                {zipFile && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {zipFile?.name?.length > 30
                          ? `${zipFile?.name.slice(0, 30)}...`
                          : zipFile?.name}
                      </Typography>
                      <IoIosCloseCircle
                        size={26}
                        color="red"
                        onClick={removeZipFile}
                        style={{ cursor: "pointer" }}
                        title="Remove"
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save
            </Button>
          </CardActions>
        </Card>
      </Dialog>

      {/* OUTER “Add Video File” button (silent drag & drop) */}
      <Tooltip
        title={videoAttachment?.length ? videoAttachment[0]?.name : "Add Video File"}
      >
        <Box
          onDragOver={onOuterDragOver}
          onDragEnter={onOuterDragEnter}
          onDragLeave={onOuterDragLeave}
          onDrop={onOuterDrop}
          style={{
            borderRadius: "16px",
            padding: "8px",
            backgroundColor: "#F5F7F9", // no drag highlight
            cursor: videoAttachment?.length ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            transition: "all .15s ease",
          }}
          onClick={(event) => {
            if (isTrialAccount) {
              alert("You don't have access. This is a trial account.");
            } else {
              if (!videoAttachment?.length) {
                handleOpen(event);
              }
            }
          }}
        >
          {videoAttachment?.length > 0 ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="body2">
                {videoAttachment[0]?.name?.length > 18
                  ? `${videoAttachment[0]?.name.slice(0, 16)}...`
                  : videoAttachment[0]?.name}
              </Typography>
              <IoIosCloseCircle
                size={26}
                color="red"
                onClick={(e) => {
                  e.stopPropagation(); // prevent dialog opening
                  removeVideoFile();
                }}
                style={{ cursor: "pointer" }}
                title="Remove"
              />
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FaVideo size={22} style={{ marginRight: 8 }} />
              Add Video File
            </Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default AddVideoFile;
