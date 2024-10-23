"use client";
import React, { useState } from "react";
import { Grid, Button, Typography, Box, Tabs, Tab } from "@mui/material";
import CalendarComponent from "@/components/teacher/dashboard/CalendarComponent/CalendarComponent";
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";
import { useThemeContext } from "@/hooks/ThemeContext";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { downloadExcelFile, uploadExcelFile } from "@/api/apiHelper";
import { MdAdd, MdDownloadForOffline, MdUpload } from "react-icons/md";
import CreateLectureSchedule from "@/components/LectureSchedule/CreateLectureSchedule";
import LectureScheduleList from "@/components/LectureSchedule/LectureScheduleList";
import LectureScheduleTable from "@/components/LectureSchedule/LectureScheduleTable";
import DarkMode from "@/components/DarkMode/DarkMode";

const LectureManager = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { isDarkMode, primaryColor } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // State for controlling tabs

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const downloadExcel = async () => {
    try {
      const response = await downloadExcelFile();
      const downloadLink = response?.data?.data["Download Link"];

      if (downloadLink) {
        const link = document.createElement("a");
        link.href = downloadLink;
        link.setAttribute("download", "format.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid
      container
      direction="column"
      justifyItems={"center"}
      spacing={3}
      height="100vh"
      padding={2}
      sx={{
        background: isDarkMode
          ? "linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)"
          : "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%);",
        overflow: "hidden", // Add this line
      }}
    >
      {/* Heading and Buttons */}
      <Grid item xs={12} style={{ width: "100%" }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Box display="flex" alignItems="center" justifyContent="center">
              <RiCalendarScheduleLine
                size={30}
                style={{
                  marginRight: 8,
                  marginBottom: 8,
                  color: isDarkMode ? "white" : "black",
                }}
              />
              <Typography
                sx={{ color: isDarkMode ? "white" : "black" }}
                variant="h4"
                component="h1"
                gutterBottom
              >
                Lecture Schedule
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" gap={2}>
              <DarkMode />
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: "#B9D9EB",
                  transition: "all 150ms ease-in-out",
                  color: "#003366", // Dark blue for text

                  ":hover": {
                    backgroundColor: "#6699CC", // Slightly darker
                    boxShadow: "0 0 10px 0 #6699CC inset, 0 0 10px 4px #6699CC", // Matching hover color
                  },
                }}
              >
                <MdAdd fontSize={16} /> New Lecture
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => downloadExcel()}
                sx={{
                  backgroundColor: "#B9D9EB",
                  transition: "all 150ms ease-in-out",
                  color: "#003366", // Dark blue for text

                  ":hover": {
                    backgroundColor: "#6699CC", // Slightly darker
                    boxShadow: "0 0 10px 0 #6699CC inset, 0 0 10px 4px #6699CC", // Matching hover color
                  },
                }}
              >
                <MdDownloadForOffline /> Download
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(true)}
                sx={{
                  backgroundColor: "#B9D9EB",
                  transition: "all 150ms ease-in-out",
                  color: "#003366", // Dark blue for text

                  ":hover": {
                    backgroundColor: "#6699CC", // Slightly darker
                    boxShadow: "0 0 10px 0 #6699CC inset, 0 0 10px 4px #6699CC", // Matching hover color
                  },
                }}
              >
                <MdUpload />
                Upload
              </Button>
              {open && <CreateLectureSchedule open={open} setOpen={setOpen} />}
            </Box>
          </Grid>
        </Grid>
        {/* Tabs for switching between views */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="lecture views"
            sx={{
              ".MuiTabs-flexContainer": {
        borderBottom: "none",
        gap: 2, // Add some spacing between the tabs
        background: isDarkMode
          ? "linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)"
          : "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%);",
        padding: 2,
        borderRadius:"12px",
        width:"600px",
        justifyContent:"center",
        alignItems:"center"
      },
      ".MuiTab-root": {
        backgroundColor: "#e0dcdd", // Default background for unselected tabs
        color: "black", // Text color for unselected tabs
        border: "1px solid transparent", // Invisible border for unselected tabs
        borderRadius: "16px", // Fully rounded corners
        padding: "8px 16px", // Add padding inside tabs
        minHeight: "auto", // Adjust tab height if necessary
        "&.Mui-selected": {
          backgroundColor: "#FAF9F6", // White background for selected tab
        color: "black", // Text color for selected tab
        borderBottom: "none", // No border on the bottom
        borderRadius: "16px", // Fully rounded corners for selected tab
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Add shadow effect
        },
      },
            }}
          >
            <Tab label="Calendar View" />
            <Tab label="Table View" />
          </Tabs>
        </Box>

        {/* Content based on selected tab */}
        <Grid marginTop={2} height={"100%"}>
          {tabValue === 0 && <CalendarComponent />}
          {tabValue === 1 && <LectureScheduleTable />}
        </Grid>
      </Grid>
      <CreatingLecture open={openDialog} handleClose={handleCloseDialog} />
    </Grid>
  );
};

export default LectureManager;
