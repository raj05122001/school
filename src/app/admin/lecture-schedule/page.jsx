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
import LectureScheduleTable from "@/components/LectureSchedule/LectureScheduleTable";
import DarkMode from "@/components/DarkMode/DarkMode";

const Page = () => {
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
      height="100%"
      minHeight="100vh"
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
                  color: "#00adb5"
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
                <MdAdd fontSize={16} size={22} style={{marginRight:2}} /> New Lecture
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
                <MdDownloadForOffline size={22} style={{marginRight:2}}/> Download Format
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
                <MdUpload size={22} style={{marginRight:2}}/>
                Upload
              </Button>
              {open && <CreateLectureSchedule open={open} setOpen={setOpen} />}
            </Box>
          </Grid>
        </Grid>
        {/* Tabs for switching between views */}
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              ".MuiTabs-flexContainer": {
                gap: 2,
                background: isDarkMode
                  ? "linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)"
                  : "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%)",
                padding: 1,
                borderRadius: "12px",
                justifyContent: "center",
              },
              ".MuiTab-root": {
                // backgroundColor: "#f0f0f0",
                color: "#333",
                padding: "10px 20px",
                // height:10,
                minHeight: 0,
                "&.MuiTabs-indicator": {
                  display: "none",
                },
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                },
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  color: "#000",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
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
          {tabValue === 0 && <CalendarComponent maxHeight={"100%"} />}
          {tabValue === 1 && <LectureScheduleTable />}
        </Grid>
      </Grid>
      <CreatingLecture open={openDialog} handleClose={handleCloseDialog} />
    </Grid>
  );
};

export default Page;
