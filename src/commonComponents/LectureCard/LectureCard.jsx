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
  TableRow,
  TableCell,
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
import { MdFileUpload, MdRemoveCircleOutline } from "react-icons/md";
import { uploadS3Video } from "@/api/apiHelper";
import { IoIosCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import CalendarIconCustom from "../CalendarIconCustom/CalendarIconCustom";

const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const settings = ["Upload File", "Record or Upload Video"];

const LectureCard = ({ lecture, getAllLecture = () => {} }) => {
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
    backgroundColor: isDarkMode ? "#041E42" : "#d9ffd6",
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
    color: isDarkMode ? primaryColor : "#4bb344",
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
      <TableRow
        hover
        sx={{
          cursor: "pointer",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        }}
        onClick={
          userDetails?.role !== "STUDENT"
            ? (event) => handleOpenUserMenu(event)
            : () => handleRoute(lecture?.id)
        }
      >
        <TableCell>
          <CalendarIconCustom date={lecture?.schedule_date} />
        </TableCell>
        <TableCell>
          <Tooltip
            title={`Title: ${lecture?.title || ""}`}
            arrow
            placement="top-start"
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#3B3D3B",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                lineHeight: "normal",
                width: "105px",
              }}
              noWrap
            >
              {lecture?.title?.length > 24
                ? `${lecture?.title?.slice(0, 24)}...`
                : lecture?.title}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip
            title={`Institute: ${lecture?.lecture_class?.name || ""}`}
            arrow
            placement="top-start"
          >
            <span
              style={{
                fontWeight: 700,
                color: "#3B3D3B",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                lineHeight: "normal",
                width: "131px",
                height: "18px",
                flexShrink: 0,
              }}
            >
              {lecture?.lecture_class?.name}
            </span>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#3B3D3B",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              lineHeight: "normal",
              width: "41px",
              height: "18px",
              flexShrink: 0,
            }}
          >
            {lecture?.schedule_time}
          </Typography>
        </TableCell>
        <TableCell>
          <Tooltip
            title={`Class: ${lecture?.chapter?.subject?.name || ""}`}
            arrow
            placement="top-start"
          >
            <span
              style={{
                fontWeight: 700,
                color: "#3B3D3B",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                lineHeight: "normal",
                width: "105px",
              }}
            >
              {lecture?.chapter?.subject?.name?.length > 20
                ? `${lecture?.chapter?.subject?.name.slice(0, 20)}...`
                : lecture?.chapter?.subject?.name}
            </span>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip
            title={`Subject: ${lecture?.chapter?.chapter || ""}`}
            arrow
            placement="top-start"
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: "#3B3D3B",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                lineHeight: "normal",
                width: "105px",
              }}
            >
              {lecture?.chapter?.chapter?.length > 20
                ? `${lecture?.chapter?.chapter.slice(0, 20)}...`
                : lecture?.chapter?.chapter}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ position: "relative" }}>
          {userDetails?.role !== "STUDENT" && (
            <Box
              sx={{
                position: "absolute",
                top: "20px",
                right: "8px",
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Record Or Upload">
                  <IconButton
                    onClick={() => handleOpenUserMenu()}
                    sx={{}}
                  >
                    <FaCloudUploadAlt
                      style={{
                        color: "#4bb344",
                        cursor: "pointer",
                      }}
                      size={24}
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
                      color: "#4bb344",
                      cursor: "pointer",
                    }}
                    size={20}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </TableCell>
      </TableRow>
      <BasicModal
        open={open}
        setOpen={setOpen}
        id={lecture?.id}
        getAllLecture={getAllLecture}
      />
    </>
  );
};

export default LectureCard;

export function BasicModal({ open, setOpen, id, getAllLecture = () => {} }) {
  const { isTrialAccount } = useContext(AppContextProvider);
  const inputVideoRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (event) => {
    event.stopPropagation();
    if (!loading) {
      setOpen(false);
      resetStates();
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles?.filter((_, idx) => idx !== index));
  };

  const resetStates = () => {
    setFiles([]);
    setError("");
    setLoading(false);
    if (inputVideoRef.current) inputVideoRef.current.value = null;
  };

  const handleFileChange = (e) => {
    if (isTrialAccount) {
      alert("You don't have access. This is a trial account.");
    } else {
      setError("");
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError("No file selected. Please choose a Files to upload.");
      return;
    }
     if (files.length>5) {
      setError("You can upload a maximum of 5 files.");
      return;
    }
    
    setIsLoading(true);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video_src", "PDF");
      files.forEach((file) => {
        formData.append("pdf", file);
      });
      const response = await uploadS3Video(id, formData);
      console.log("response : ",response)
      toast.success("Lecture has been uploaded");
      resetStates();
      getAllLecture();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create lecture");
      console.error(error);
      setError("Failed to upload files");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Box className="overlay">
      <Box className="loader"></Box>
    </Box>
  ) : (
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
            Upload Files
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {files?.map((file, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "white", flexGrow: 1, mr: 2 }}
                >
                  {file.name}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  sx={{ color: "red" }}
                >
                  <MdRemoveCircleOutline />
                </IconButton>
              </Box>
            ))}
          </Box>
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
            Select Files
            <input
              type="file"
              multiple
              hidden
              ref={inputVideoRef}
              accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain,.zip,.rar,.ppt,.pptx"
              onChange={handleFileChange}
            />
          </Button>
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
            disabled={loading || !files.length}
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
