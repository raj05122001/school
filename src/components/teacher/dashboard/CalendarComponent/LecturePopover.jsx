import React, { useState, useEffect, useContext } from "react";
import {
  Popover,
  Tooltip,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Box,
  Grow,
} from "@mui/material";
import { formatTime, getInitials } from "@/helper/Helper";
import { format } from "date-fns";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineEdit,
} from "react-icons/ai";
import { FaGraduationCap, FaBook } from "react-icons/fa";
import { RiBookOpenLine } from "react-icons/ri";
import stc from "string-to-color";
import { AppContextProvider } from "@/app/main";

const LecturePopover = ({ data, isOrganizer }) => {
  const {
    openRecordingDrawer,
    openCreateLecture,
    handleCreateLecture,
    handleLectureRecord,
  } = useContext(AppContextProvider);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleTriggerMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setIsHovered(true);
  };

  const handleTriggerMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePopoverMouseEnter = () => {
    setIsHovered(true);
  };

  const handlePopoverMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (!isHovered) {
      const timer = setTimeout(() => {
        setAnchorEl(null);
      }, 100); // Small delay to prevent flickering
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  const open = Boolean(anchorEl);

  const {
    schedule_date,
    title,
    lecture_class,
    chapter,
    topics,
    organizer,
    schedule_time,
  } = data.event.extendedProps;

  const formattedStartTime = formatTime(schedule_time);
  const formattedDate = schedule_date && format(new Date(schedule_date), "PP");
  const initials = getInitials(chapter?.subject?.name);
  const color = stc(initials);

  return (
    <>
      <Box
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        elevation={2}
        sx={{
          padding: "12px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        style={{
          width: "100%",
          backgroundColor: "[color]", // Replace [color] with your desired color
          padding: "0.25rem 0.5rem", // Equivalent to px-2 py-1
          borderRadius: "0.125rem", // Equivalent to rounded-sm
          transition: "background-color 0.2s ease-in-out",
          cursor: "pointer", // Optional, to indicate it's interactive
        }}
      >
        <h2
          style={{
            color: "var(--primary-color)", // Replace with your primary color
            margin: 0, // Equivalent to my-0
            fontWeight: 600, // Equivalent to font-semibold
            fontSize: "0.75rem", // Equivalent to text-xs
            whiteSpace: "nowrap", // Prevent text wrapping
            overflow: "hidden", // Hide overflowing text
            textOverflow: "ellipsis", // Show ellipsis for overflowing text
          }}
        >
          {data.event.title}
        </h2>
        <p
          style={{
            color: "var(--primary-color)", // Replace with your primary color
            fontSize: "0.75rem", // Equivalent to text-xs
            fontWeight: 400, // Equivalent to font-normal
          }}
        >
          {formattedStartTime}
        </p>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        // anchorOrigin={{
        //   vertical: "bottom",
        //   horizontal: "left",
        // }}
        // transformOrigin={{
        //   vertical: "top",
        //   horizontal: "left",
        // }}
        disableRestoreFocus
        PaperProps={{
          onMouseEnter: handlePopoverMouseEnter,
          onMouseLeave: handlePopoverMouseLeave,
        }}
      >
        <Grow in={open} timeout={400}>
          <Card sx={{ width: "360px", padding: "16px" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {data.event.title}
                  </Typography>

                  <Grid container spacing={1} sx={{ marginBottom: 2 }}>
                    {formattedDate && (
                      <Grid item>
                        <Tooltip title="Scheduled Date">
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <AiOutlineCalendar size={18} />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {formattedDate}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    )}
                    {formattedStartTime && (
                      <Grid item>
                        <Tooltip title="Start Time">
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <AiOutlineClockCircle size={18} />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {formattedStartTime}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    )}
                    {lecture_class?.name && (
                      <Grid item>
                        <Tooltip title={`Semester: ${lecture_class.name}`}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <FaGraduationCap size={18} />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {lecture_class.name.length > 25
                                  ? `${lecture_class.name.slice(0, 25)}...`
                                  : lecture_class.name}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    )}
                    {chapter && (
                      <Grid item>
                        <Tooltip title={`Chapter: ${chapter.chapter}`}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <FaBook size={16} />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {chapter.chapter.length > 25
                                  ? `${chapter.chapter.slice(0, 25)}...`
                                  : chapter.chapter}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    )}
                    {topics && (
                      <Grid item>
                        <Tooltip title={`Topics: ${topics}`}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <RiBookOpenLine size={18} />
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                {topics.length > 25
                                  ? `${topics.slice(0, 25)}...`
                                  : topics}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                {isOrganizer && (
                  <Grid item xs={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      // Uncomment and pass relevant function
                      onClick={(event) =>
                        handleCreateLecture(data.event.extendedProps, true)
                      }
                    >
                      <AiOutlineEdit size={20} />
                    </IconButton>
                  </Grid>
                )}
                {/* <Grid item xs={4}>
                  {organizer && (
                    <Grid container direction="column" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Professor
                      </Typography>
                      <Avatar
                        alt={organizer.user.full_name}
                        src={organizer.user.profile_pic}
                        sx={{ width: 48, height: 48, marginTop: 1 }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {organizer.user.full_name}
                      </Typography>
                    </Grid>
                  )}
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grow>
      </Popover>
    </>
  );
};

export default LecturePopover;
