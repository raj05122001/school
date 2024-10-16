"use client";
import React from "react";
import { Box, Grid, Button } from "@mui/material";
import OverviewSection from "@/components/teacher/dashboard/OverviewSection/OverviewSection";
import AnalyticsReports from "@/components/teacher/dashboard/AnalyticsReports/AnalyticsReports";
import CalendarComponent from "@/components/teacher/dashboard/CalendarComponent/CalendarComponent";
import LectureAnalytics from "@/components/teacher/dashboard/LectureAnalytics/LectureAnalytics";
import SubjectAnalytics from "@/components/teacher/dashboard/SubjectAnalytics/SubjectAnalytics";
import StrugglingExcelling from "@/components/teacher/dashboard/StrugglingExcelling/StrugglingExcelling";
import OverallClassPerformance from "@/components/teacher/dashboard/OverallClassPerformance/OverallClassPerformance";
import ClassStatistics from "@/components/teacher/dashboard/ClassStatistics/ClassStatistics";

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
            Create Quiz
          </Button>
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
            <AnalyticsReports />
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={2.8}
          ml={2}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        ></Grid>
      </Grid>

      <Grid container direction={"row"} mt={4} spacing={4}>
        <Grid item xs={12} sm={8}>
          <CalendarComponent />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ClassStatistics />
        </Grid>
      </Grid>

      <Grid container direction={"row"} mt={4} spacing={4}>
        <Grid item xs={12} sm={6}>
          <StrugglingExcelling />
        </Grid>
        <Grid item xs={12} sm={6}>
          <OverallClassPerformance />
        </Grid>
      </Grid>

      <Grid container direction={"row"} mt={4} spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <LectureAnalytics />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <SubjectAnalytics />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
