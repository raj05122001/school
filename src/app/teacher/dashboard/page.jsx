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
import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import LectureDuration from "@/components/teacher/dashboard/LectureDuration/LectureDuration";
import SubjectCompletion from "@/components/teacher/dashboard/SubjectCompletion/SubjectCompletion";

const Page = () => {
  return (
    <Box sx={{ flexGrow: 1, m: 2, marginLeft: 4 }}>
      <Box sx={{}}>
        <GreetingCard/>         
      </Box>
      <Box sx={{ marginTop: 3, display: "flex", gap: 2, }}>
        <Box sx={{ flexBasis: '50%'}}>
          <ProfileCard />
        </Box>
        <Box>
          <LectureDuration />
        </Box>
        <Box>
          <SubjectCompletion />
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
        </Grid>
        <Grid
          xs={12}
          sm={2.8}
          ml={2}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
      <Grid container mt={4} spacing={4}>
        <Grid item xs={12} sm={12}>
          <StrugglingExcelling />
        </Grid>
        <Grid item xs={12} sm={12}>
          <OverallClassPerformance />
        </Grid>
      </Grid>
        </Grid>
      </Grid>

      <Grid container direction={"row"} mt={4} spacing={4}>
        <Grid item xs={12} sm={8}>
        <AnalyticsReports />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ClassStatistics />
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
