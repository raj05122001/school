"use client";
import React, { useState, useContext, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaGraduationCap,
  FaEdit,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import { AppContextProvider } from "@/app/main";
import { FaBookOpen } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { uploadS3Video } from "@/api/apiHelper";
import { IoIosCloseCircle } from "react-icons/io";

const day = [
  "Upload File",
  "Record or Upload Video",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const settings = ["Upload File", "Record or Upload Video"];

const LectureCard = ({ lecture }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [open, setOpen] = useState(false);
  const {
    openRecordingDrawer,
    openCreateLecture,
    handleCreateLecture,
    handleLectureRecord,
  } = useContext(AppContextProvider);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event?.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();

  console.log("open ", open);

  const lectureCardStyle = {
    position: "relative",
    display: "flex",
    padding: "16px",
    borderRadius: "12px",
    background: isDarkMode
      ? "linear-gradient(to top, #09203f 0%, #537895 100%)"
      : "#ffffff",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      backgroundColor: isDarkMode ? "#424242" : "#f5f5f5",
    },
    height: "100%",
    width: "100%",
  };

  const dateSectionStyle = {
    minWidth: "80px",
    backgroundColor: isDarkMode ? "#041E42" : "#e0f7fa",
    borderRadius: "12px 0 0 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    textAlign: "center",
  };

  const lectureInfoStyle = {
    flexGrow: 1,
    paddingLeft: "16px",
  };

  const iconStyle = {
    marginRight: "8px",
    color: isDarkMode ? primaryColor : "#00796b",
  };

  const textStyle = {
    color: isDarkMode ? "#ffffff" : "#000000",
  };

  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  const handleRoute = (id) => {
    router.push(`/student/lecture-listings/${id}`);
  };

  return (
    <>
      <Paper
        sx={lectureCardStyle}
        onClick={
          userDetails?.role !== "STUDENT"
            ? (event) => handleOpenUserMenu(event)
            : () => handleRoute(lecture?.id)
        }
        // onClick={(event)=>handleOpenUserMenu(event)}
      >
        <Box sx={dateSectionStyle}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: textStyle.color }}
          >
            {new Date(lecture?.schedule_date).getDate()}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: isDarkMode ? primaryColor : "#00796b" }}
          >
            {day[new Date(lecture?.schedule_date).getDay()]}
          </Typography>
        </Box>
        <Box sx={lectureInfoStyle}>
          <Tooltip title={lecture?.title || ""} arrow placement="top-start">
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 1, color: textStyle.color }}
              noWrap
            >
              {lecture?.title?.length > 24
                ? `${lecture?.title?.slice(0, 24)}...`
                : lecture?.title}
            </Typography>
          </Tooltip>

          <Box display="flex" alignItems="center" mb={1}>
            <FaCalendarAlt style={iconStyle} />
            <Typography variant="body2" sx={{ color: textStyle.color }}>
              {lecture?.schedule_date}
            </Typography>
            <FaClock style={{ ...iconStyle, marginLeft: "16px" }} />
            <Typography variant="body2" sx={{ color: textStyle.color }}>
              {lecture?.schedule_time}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <FaGraduationCap style={iconStyle} />
            <Typography variant="body2" sx={{ color: textStyle.color }}>
              {lecture?.lecture_class?.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <FaBook style={iconStyle} />
            <Typography variant="body2" sx={{ color: textStyle.color }}>
              {lecture?.chapter?.subject?.name}
            </Typography>
          </Box>
          <Tooltip
            title={lecture?.chapter?.chapter || ""}
            arrow
            placement="top-start"
          >
            <Box display="flex" alignItems="center" mb={1}>
              <FaBookOpen style={iconStyle} />
              <Typography variant="body2" sx={{ color: textStyle.color }}>
                {lecture?.chapter?.chapter}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        {/* Edit button on the top-right corner */}
        {userDetails?.role !== "STUDENT" && (
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Record Or Upload">
                <IconButton onClick={() => handleOpenUserMenu()} sx={{ p: 0 }}>
                  <FaCloudUploadAlt
                    style={{
                      color: isDarkMode ? primaryColor : "#00796b",
                      cursor: "pointer",
                    }}
                    size={23}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={(e) => {
                  e.stopPropagation();
                  handleCloseUserMenu(e);
                }}
              >
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorElUser(null);
                    setOpen(true);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Upload File
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLectureRecord(lecture);
                    setAnchorElUser(null);
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Record or Upload Video
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Tooltip title="Edit Lecture">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Stop the click from bubbling up to the parent
                  handleCreateLecture(lecture, true);
                }}
                sx={{ p: 0 }}
              >
                <FaEdit
                  style={{
                    color: isDarkMode ? primaryColor : "#00796b",
                    cursor: "pointer",
                  }}
                  size={20}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
      <BasicModal open={open} setOpen={setOpen} id={lecture?.id} />
    </>
  );
};

export default LectureCard;

export function BasicModal({ open, setOpen, id }) {
  const inputVideoRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = (event) => {
    event.stopPropagation();
    if (!loading) {
      setOpen(false);
      resetStates();
    }
  };

  const resetStates = () => {
    setFile(null);
    setFileName("");
    setError("");
    setLoading(false);
    if (inputVideoRef.current) inputVideoRef.current.value = null;
  };

  const handleFileChange = (e) => {
    setError("");
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a valid PDF file.");
        setFile(null);
        setFileName("");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("No file selected. Please choose a PDF to upload.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video_src", "PDF");
      formData.append("pdf", file);
      await uploadS3Video(id, formData);
      resetStates();
      setOpen(false);
    } catch (error) {
      console.error(error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-dialog-title"
      aria-describedby="upload-dialog-description"
      PaperProps={{
        sx: {
          bgcolor: "#333",
          color: "#fff",
          borderRadius: "12px",
          width: 400,
          minHeight: 350,
          boxShadow: "0px 6px 10px rgba(0,0,0,0.5)",
        },
      }}
    >
      <DialogContent>
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <MdFileUpload
          size="60"
          style={{ color: "#E0E0E0", marginBottom: 20 }}
        />
        <Typography variant="h6" sx={{ mb: 2 }} id="upload-dialog-title">
          Upload File
        </Typography>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "primary.main",
            }}
          />
        )}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, width: "100%", bgcolor: "darkred", color: "white" }}
          >
            {error}
          </Alert>
        )}

        {fileName ? (
          <Box
            sx={{
              borderRadius: "16px",
              padding: "8px",
              backgroundColor: "#444",
              cursor: "default",
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "white" ,pl:2}}>
              {fileName.length > 18 ? `${fileName.slice(0, 16)}...` : fileName}
            </Typography>
            <IoIosCloseCircle
              size={26}
              color="red"
              onClick={resetStates}
              style={{ cursor: "pointer" }}
            />
          </Box>
        ) : (
          <Button
            variant="contained"
            component="label"
            disabled={loading}
            sx={{
              mb: 2,
              bgcolor: "grey",
              color: "white",
              ":hover": { bgcolor: "#555" },
            }}
          >
            Select PDF
            <input
              type="file"
              hidden
              ref={inputVideoRef}
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>
        )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "white", borderColor: "grey" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !file}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              ":hover": { bgcolor: "primary.dark" },
            }}
          >
            Upload
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
