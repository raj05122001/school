"use client";
import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Box, Tabs, Tab } from "@mui/material";
import CalendarComponent from "@/components/teacher/dashboard/CalendarComponent/CalendarComponent";
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";
import { useThemeContext } from "@/hooks/ThemeContext";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { downloadExcelFile, uploadExcelFile } from "@/api/apiHelper";
import { MdDownloadForOffline, MdUpload } from "react-icons/md";
import CreateLectureSchedule from "@/components/LectureSchedule/CreateLectureSchedule";
import LectureScheduleTable from "@/components/LectureSchedule/LectureScheduleTable";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const LectureManager = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { isDarkMode } = useThemeContext();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialView = (searchParams.get("view") || "calendar").toLowerCase();
  const [tabValue, setTabValue] = useState(initialView === "table" ? 1 : 0);

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

  const handleTabChange = (_event, newValue) => {
    setTabValue(newValue);
    const view = newValue === 1 ? "table" : "calendar";
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const v = (searchParams.get("view") || "calendar").toLowerCase();
    const next = v === "table" ? 1 : 0;
    setTabValue((prev) => (prev === next ? prev : next));
  }, [searchParams]);

  return (
    <Grid
      container
      direction="column"
      spacing={3}
      height="100%"
      padding={{ xs: 1.5, sm: 2, md: 3 }}
      marginTop={0.5}
      sx={{
        background: "#F3F5F7",
      }}
    >
      {/* Heading and Buttons */}
      <Grid item xs={12} sx={{ width: "100%" }}>
        <Grid
          container
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          direction={{ xs: "column", sm: "row" }} // ✅ mobile: column, desktop: row
        >
          {/* Left: Title */}
          <Grid item>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              sx={{ mb: { xs: 1, sm: 0 } }}
            >
              <RiCalendarScheduleLine
                size={28}
                style={{
                  marginRight: 8,
                  marginBottom: 4,
                  color: "#448234",
                }}
              />
              <Typography
                sx={{
                  color: isDarkMode ? "white" : "black",
                  fontSize: { xs: "20px", sm: "24px", md: "28px" },
                  fontWeight: 700,
                }}
                component="h1"
                gutterBottom={false}
              >
                Lecture Schedule
              </Typography>
            </Box>
          </Grid>

          {/* Right: Buttons */}
          <Grid item sx={{ width: "100%" }}>
            <Box
              display="flex"
              gap={{ xs: 1, sm: 2 }}
              flexDirection="row"                     // ✅ mobile + desktop: same row
              alignItems="center"
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              flexWrap={{ xs: "nowrap", sm: "nowrap" }} // ✅ try to keep them in one row
            >
              {/* Download Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadExcel}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  width: "auto",                        // ✅ no full-width, so row me aa jayenge
                  display: "inline-flex",
                  padding: "10px 20px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  textTransform: "none",
                  borderRadius: "8px",
                  background: "#141514",
                  color: "#FFF",
                  textAlign: "center",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontFamily: "Aptos",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "20px",
                  "&:hover": {
                    border: "1px solid #141514",
                    background: "#E5E5E5",
                    color: "#141514",
                  },
                }}
              >
                <MdDownloadForOffline size={20} style={{ marginRight: 2 }} />
                Download Format
              </Button>

              {/* Upload Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(true)}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  width: "auto",                        // ✅ same here
                  display: "inline-flex",
                  padding: "10px 20px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  textTransform: "none",
                  borderRadius: "8px",
                  background: "#141514",
                  color: "#FFF",
                  textAlign: "center",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontFamily: "Aptos",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "20px",
                  "&:hover": {
                    border: "1px solid #141514",
                    background: "#E5E5E5",
                    color: "#141514",
                  },
                }}
              >
                <MdUpload size={20} style={{ marginRight: 2 }} />
                Upload
              </Button>

              {open && <CreateLectureSchedule open={open} setOpen={setOpen} />}
            </Box>
          </Grid>
        </Grid>

        {/* Tabs for switching between views */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "500px" },
              ".MuiTabs-flexContainer": {
                gap: 2,
                px: { xs: 1.5, sm: 2, md: 3 }, // ✅ responsive padding
                py: 1,
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                display: "flex",
                alignItems: "center",
                borderBottom: "0.5px solid var(--Stroke-Color-1, #C1C1C1)",
              },
              ".MuiTab-root": {
                color: "#3B3D3B",
                padding: "8px 16px",
                minHeight: 0,
                marginTop: "4px",
                textAlign: "center",
                fontSize: "14px",
                fontFamily: "Aptos",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  color: "#3B3D3B",
                },
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  color: "#3B3D3B",
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

        <Grid marginTop={2} height={"100%"}>
          {tabValue === 0 && <CalendarComponent maxHeight={"100%"} />}
          {tabValue === 1 && <LectureScheduleTable />}
        </Grid>
      </Grid>

      <CreatingLecture open={openDialog} handleClose={handleCloseDialog} />
    </Grid>
  );
};

export default LectureManager;
