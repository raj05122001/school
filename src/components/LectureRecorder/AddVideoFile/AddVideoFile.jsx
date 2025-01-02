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

  const handleOpen = () => setOpen(!open);
  const handleClose = () => {
    setOpen(false);
    setAudioAttachment([]);
    setVideoAttachment([]);
    setZipFile(null);
    if (inputVideoRef.current) inputVideoRef.current.value = null;
    onRemoveVideoFile();
  };

  const handleVideoFile = (e) => {
    setError({});
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      removeCameraAccess();
      setVideoAttachment([selectedFile]);
    }
  };

  const handleZipFile = (e) => {
    const file = e.target.files[0];
    setZipFile(file);
    extractFiles(file);
    removeCameraAccess();
  };

  const extractFiles = async (file) => {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);

    zipData.forEach(async (relativePath, zipEntry) => {
      if (zipEntry.name.endsWith(".mp4")) {
        const videoBlob = await zipEntry.async("blob");
        const videoFile = new File([videoBlob], zipEntry.name, {
          type: "video/mp4",
        });
        setVideoAttachment([videoFile]);
      } else if (zipEntry.name.endsWith(".wav")) {
        const audioBlob = await zipEntry.async("blob");
        const audioFile = new File([audioBlob], zipEntry.name, {
          type: "audio/wav",
        });
        setAudioAttachment([audioFile]);
      }
    });
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
    if (inputVideoRef.current) inputVideoRef.current.value = null;
    if (inputZipRef.current) inputZipRef.current.value = null;
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
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "#f7f9fc",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Add Video or ZIP File
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload video files directly or a ZIP file containing video and
              audio.
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Select Video Source:
            </Typography>
            <FormControl component="fieldset" sx={{ marginTop: 2 }}>
              <RadioGroup
                row
                value={selectedOption}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  handleChangeValue();
                }}
              >
                <FormControlLabel
                  value="vidya"
                  control={<Radio />}
                  label="Vidya AI ZIP"
                />
                {/* <FormControlLabel value="youtube" control={<Radio />} label="YouTube Link" /> */}
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Video Upload"
                />
              </RadioGroup>
            </FormControl>

            {selectedOption === "youtube" && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">Link* (coming soon)</Typography>
                <input
                  disabled
                  type="text"
                  value="https://youtu.be/5_5oE5lgrhw?si=uxXmH"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid gray",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                />
              </Box>
            )}

            {selectedOption === "other" && (
              <Box sx={{ marginTop: 2 }}>
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
                    }}
                  >
                    <FaVideo size={22} style={{ marginRight: 8 }} />
                    Add Video File
                  </Typography>
                </label>
                {videoAttachment?.length > 0 && (
                  <Box sx={{ marginTop: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {videoAttachment[0]?.name.length > 30
                          ? `${videoAttachment[0]?.name.slice(0, 30)}...`
                          : videoAttachment[0]?.name}
                      </Typography>
                      <IoIosCloseCircle
                        size={26}
                        color="red"
                        onClick={removeVideoFile}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {selectedOption === "vidya" && (
              <Box sx={{ marginTop: 2 }}>
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
                    }}
                  >
                    <FiFile size={22} style={{ marginRight: 8 }} />
                    Add ZIP File
                  </Typography>
                </label>
                {zipFile && (
                  <Box sx={{ marginTop: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {zipFile?.name.length > 30
                          ? `${zipFile?.name.slice(0, 30)}...`
                          : zipFile?.name}
                      </Typography>
                      <IoIosCloseCircle
                        size={26}
                        color="red"
                        onClick={removeZipFile}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save
            </Button>
          </CardActions>
        </Card>
      </Dialog>
      <Tooltip
        title={
          videoAttachment?.length ? videoAttachment[0]?.name : "Add Video File"
        }
      >
        <Box
          style={{
            borderRadius: "16px",
            padding: "8px",
            backgroundColor: "#F5F7F9",
            cursor: videoAttachment?.length ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
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
                {videoAttachment[0]?.name.length > 18
                  ? `${videoAttachment[0]?.name.slice(0, 16)}...`
                  : videoAttachment[0]?.name}
              </Typography>
              <IoIosCloseCircle
                size={26}
                color="red"
                onClick={removeVideoFile}
                style={{ cursor: "pointer" }}
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
