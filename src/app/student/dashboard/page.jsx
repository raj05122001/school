"use client";
import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import WatchTimeChart from "@/components/student/dashboard/WatchTimeChart/WatchTimeChart";
import OverviewSection from "@/components/teacher/dashboard/OverviewSection/OverviewSection";
import SubjectAnalytics from "@/components/teacher/dashboard/SubjectAnalytics/SubjectAnalytics";
import MyRank from "@/components/student/dashboard/MyRank/MyRank";
import MyAssignmentAnalytics from "@/components/student/dashboard/MyAssignmentAnalytics/MyAssignmentAnalytics";


const Page = () => {
  const greetingCard = useMemo(() => <GreetingCard />, []);
  const profileCard = useMemo(() => <ProfileCard />, []);
  const watchTimeChart = useMemo(()=><WatchTimeChart />, []);
  const overviewSection = useMemo(() => <OverviewSection />, []);
  const myRank = useMemo(() => <MyRank />, []);
  const myAssignmentAnalytics = useMemo(() => <MyAssignmentAnalytics />, []);

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Box>{greetingCard}</Box>
      {/* Overview and Calendar */}
      <Grid container direction="row" spacing={2} mt={1}>
        <Grid item xs={12} md={3} mt={2}>
          <Grid container direction="column" spacing={1}>
            <Grid item xs={12}>
              {profileCard}
              {/* <ClassWiseStudentRanking /> */}
            </Grid>
            <Grid item xs={12}>
              {watchTimeChart}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={9}>
          {overviewSection}
          {/* <Box mt={4}>{calendarComponent}</Box> */}
        </Grid>
      </Grid>
      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={6}>
          {myRank}
        </Grid>
        <Grid item xs={12} md={6}>
          {myAssignmentAnalytics}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
