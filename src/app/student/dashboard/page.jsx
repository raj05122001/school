"use client";
import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
// import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import WatchTimeChart from "@/components/student/dashboard/WatchTimeChart/WatchTimeChart";
import MyRank from "@/components/student/dashboard/MyRank/MyRank";
import MyAssignmentAnalytics from "@/components/student/dashboard/MyAssignmentAnalytics/MyAssignmentAnalytics";
import RecentLectures from "@/components/student/dashboard/RecentLectures/RecentLectures";
import HeroSectionStudent from "@/components/student/dashboard/HeroSectionStudent/HeroSectionStudent";


const Page = () => {
  // const greetingCard = useMemo(() => <GreetingCard />, []);
  const profileCard = useMemo(() => <HeroSectionStudent />, []);
  const watchTimeChart = useMemo(()=><WatchTimeChart />, []);
  const recentLectures = useMemo(() => <RecentLectures />, []);
  const myRank = useMemo(() => <MyRank />, []);
  const myAssignmentAnalytics = useMemo(() => <MyAssignmentAnalytics />, []);

  return (
    <Box sx={{ m: 2,height:'100%',display:'flex', flexDirection:"column",gap:4 }}>
      {/* <Box>{greetingCard}</Box> */}
      {/* Overview and Calendar */}
      {profileCard}
      {recentLectures}
      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5} md={5}>
          {watchTimeChart}
        </Grid>
        <Grid item xs={12} lg={7} md={7}>
          {myRank}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
