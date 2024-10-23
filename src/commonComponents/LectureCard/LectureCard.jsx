"use client";
import React, { useState ,useContext} from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaGraduationCap,
  FaEdit,
} from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import { AppContextProvider } from "@/app/main";

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";

const LectureCard = ({ lecture }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const {
    openRecordingDrawer,
    setRecordingData,
    setOpenRecordingDrawer,
  } = useContext(AppContextProvider);

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

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const handleEditClick = (lecture) => {
    setSelectedLecture(lecture); // Pass the clicked lecture data
    setEditMode(true); // Set to edit mode
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedLecture(null);
  };

  const handleOpenRecorder=()=>{
    setRecordingData(lecture)
    setOpenRecordingDrawer(true)
  }
  return (
    <Paper sx={lectureCardStyle} onClick={()=>handleOpenRecorder()}>
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
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, color: textStyle.color }}
        >
          {lecture?.chapter?.subject?.name}
        </Typography>
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
            {lecture?.topics}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar
            src={lecture?.organizer?.user?.profile_pic}
            alt={lecture?.organizer?.user?.full_name}
            sx={{ width: 24, height: 24, marginRight: "8px" }}
          />
          <Typography variant="body2" sx={{ color: textStyle.color }}>
            {lecture?.organizer?.user?.full_name}
          </Typography>
        </Box>
      </Box>
      {/* Edit button on the top-right corner */}
      <Box sx={{ position: "absolute", top: "8px", right: "8px" }}>
        <FaEdit
          style={{ color: isDarkMode ? primaryColor : "#00796b" }}
          onClick={() => handleEditClick(lecture)}
        />
        <CreatingLecture
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          lecture={selectedLecture} // Pass the selected lecture details
          isEditMode={editMode} // Indicate whether it's edit mode
        />
      </Box>
    </Paper>
  );
};

export default LectureCard;