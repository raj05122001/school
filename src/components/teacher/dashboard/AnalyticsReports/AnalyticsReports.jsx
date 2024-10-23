import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { FaBullhorn, FaPaperclip } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";

const cardStyle = {
  padding: 2,
  textAlign: "center",
  minWidth: "400px",
  minHeight: "350px", // Set same height for both cards
};

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
};

const AnalyticsReports = () => {
  const { isDarkMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUploadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileSelect = (fileType) => {
    // Logic to handle the file selection (e.g., open file dialog)
    handleClose();
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
        color: isDarkMode ? "#FFF" : "#000",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaBullhorn style={{ marginRight: 8 }} />
        Announcements
      </Typography>

      {/* TextField with Upload Button */}
      <Box sx={{ position: "relative", mt: 2, mb: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Enter your announcement here..."
          multiline
          rows={8}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: isDarkMode ? "#FFF" : "#000", // Apply text color
              "& fieldset": {
                borderColor: isDarkMode ? "#FFF" : "#000", // Border color
              },
              "&:hover fieldset": {
                borderColor: isDarkMode ? "#FFF" : "#000", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: isDarkMode ? "#FFF" : "#000", // Border color when focused
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleUploadClick}
                sx={{ position: "absolute", right: 10, bottom: 10 }}
              >
                <FaPaperclip style={{ color: isDarkMode ? "#FFF" : "#000" }} />
              </IconButton>
            ),
          }}
        />

        {/* Upload Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => handleFileSelect("document")}>
            Upload Document
          </MenuItem>
          <MenuItem onClick={() => handleFileSelect("photo")}>
            Upload Photo
          </MenuItem>
          <MenuItem onClick={() => handleFileSelect("video")}>
            Upload Video
          </MenuItem>
          <MenuItem onClick={() => handleFileSelect("audio")}>
            Upload Audio
          </MenuItem>
        </Menu>
      </Box>

      {/* Post Announcement Button */}
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            backgroundColor: isDarkMode ? "#0A84FF" : "#1976d2",
          }}
        >
          Post Announcement
        </Button>
      </Box>
    </Box>
  );
};

export default AnalyticsReports;
