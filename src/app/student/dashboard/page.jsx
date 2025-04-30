"use client";
import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
// import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import WatchTimeChart from "@/components/student/dashboard/WatchTimeChart/WatchTimeChart";
import MyRank from "@/components/student/dashboard/MyRank/MyRank";
import MyAssignmentAnalytics from "@/components/student/dashboard/MyAssignmentAnalytics/MyAssignmentAnalytics";
import RecentLectures from "@/components/student/dashboard/RecentLectures/RecentLectures";


const Page = () => {
  // const greetingCard = useMemo(() => <GreetingCard />, []);
  const profileCard = useMemo(() => <ProfileCard />, []);
  const watchTimeChart = useMemo(()=><WatchTimeChart />, []);
  const recentLectures = useMemo(() => <RecentLectures />, []);
  const myRank = useMemo(() => <MyRank />, []);
  const myAssignmentAnalytics = useMemo(() => <MyAssignmentAnalytics />, []);

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      {/* <Box>{greetingCard}</Box> */}
      {/* Overview and Calendar */}
      {profileCard}
      <Grid container direction="row" spacing={2} mt={1}>
        <Grid item xs={12} sm={8}>
          {recentLectures}
          {/* <Box mt={4}>{calendarComponent}</Box> */}
        </Grid>
      </Grid>
      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={4}>
          {watchTimeChart}
        </Grid>
        <Grid item xs={12} md={8}>
          {myRank}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
