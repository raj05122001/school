"use client";
import React from "react";
import { Box, Grid } from "@mui/material";
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
import StudentQueries from "@/components/teacher/dashboard/StudentQueries/StudentQueries";

const Page = () => {
  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      {/* Greeting Card */}
      <Box>
        <GreetingCard />
      </Box>

      {/* Profile, Lecture Duration, Subject Completion */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} lg={5}>
          <ProfileCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <LectureDuration />
        </Grid>
        <Grid item xs={12} lg={4}>
          <SubjectCompletion />
        </Grid>
      </Grid>

      {/* Overview and Calendar */}
      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={9}>
          <OverviewSection />
          <Box mt={4}>
            <CalendarComponent />
          </Box>
        </Grid>
        <Grid item xs={12} md={3} mt={9}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <StrugglingExcelling />
            </Grid>
            <Grid item xs={12}>
              <OverallClassPerformance />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Student Queries, Analytics Reports, and Class Statistics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={4}>
          <StudentQueries />
        </Grid>
        <Grid item xs={12} md={4}>
          <AnalyticsReports />
        </Grid>
        <Grid item xs={12} md={4}>
          <ClassStatistics />
        </Grid>
      </Grid>

      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={6}>
          <LectureAnalytics />
        </Grid>
        <Grid item xs={12} md={6}>
          <SubjectAnalytics />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
