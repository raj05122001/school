"use client";
import React from "react";
import { Box, Grid, Button } from "@mui/material";
import OverviewSection from "@/components/teacher/dashboard/OverviewSection/OverviewSection";
import ClassPerformance from "@/components/teacher/dashboard/ClassPerformance/ClassPerformance";
import AssignmentQuizManagement from "@/components/teacher/dashboard/AssignmentQuizManagement/AssignmentQuizManagement";
import LectureManagement from "@/components/teacher/dashboard/LectureManagement/LectureManagement";
import StudentEngagement from "@/components/teacher/dashboard/StudentEngagement/StudentEngagement";
import ResourceManagement from "@/components/teacher/dashboard/ResourceManagement/ResourceManagement";
import CommunicationTools from "@/components/teacher/dashboard/CommunicationTools/CommunicationTools";
import AnalyticsReports from "@/components/teacher/dashboard/AnalyticsReports/AnalyticsReports";
import CalendarComponent from "@/components/teacher/dashboard/CalendarComponent/CalendarComponent";
import CreateQuiz from "@/components/teacher/dashboard/CreateQuize/CreateQuize";

const Page = () => {
  return (
    <Box sx={{ flexGrow: 1, m: 2, marginLeft: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00adb5",
              ":hover": {
                backgroundColor: "#007a7f",
              },
            }}
          >
            Create Lecture
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00adb5",
              ":hover": {
                backgroundColor: "#007a7f",
              },
            }}
          >
            Create Quize
          </Button>
          <CreateQuiz />
        </Box>
      </Box>
      <Grid container direction={"row"} mt={4} spacing={2}>
        <Grid
          container
          xs={12}
          sm={9}
          direction={"row"}
          sx={{ display: "flex", flexDirection: "row", gap: 2 }}
        >
          {/* First Row */}
          <Grid item xs={12}>
            <OverviewSection />
          </Grid>

          {/* Second Row */}
          <Grid item xs={12}>
            <CalendarComponent />
          </Grid>

          {/* <Grid item xs={12}>
            <ResourceManagement />
          </Grid> */}

          {/* Fifth Row */}
          <Grid item xs={12}>
            <CommunicationTools />
          </Grid>
          <Grid item xs={12}>
            <AnalyticsReports />
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={2.8}
          ml={2}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Grid>
            <AssignmentQuizManagement />
          </Grid>
          <Grid item xs={12}>
            <LectureManagement />
          </Grid>
          <Grid>
            <ClassPerformance />
          </Grid>

          <Grid item xs={12}>
            <StudentEngagement />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
