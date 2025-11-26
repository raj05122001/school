"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid } from "@mui/material";
import OverviewSection from "@/components/teacher/dashboard/OverviewSection/OverviewSection";
import SubjectAnalytics from "@/components/teacher/dashboard/SubjectAnalytics/SubjectAnalytics";
import OverallClassPerformance from "@/components/teacher/dashboard/OverallClassPerformance/OverallClassPerformance";
import ClassWiseStudentRanking from "@/components/teacher/dashboard/ClassWiseStudentRanking/ClassWiseStudentRanking";
import StudentAssignment from "@/components/teacher/dashboard/StudentAssignment/StudentAssignment";
import { getteacherClass } from "@/api/apiHelper";
import HeroCard from "@/components/teacher/dashboard/HeroCard/HeroCard";
import ClassProf from "@/commonComponents/ClassProf/ClassProf";
import EngagementSection from "./EngagementSection";


const Page = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [averageDuration, setAverageDuration] = useState({
    avg_duration: 0,
    total_duration: 0
  });
  const [selectedOptions, setSelectedOptions] = useState(null);

  useEffect(() => {
    fetchClassOptions();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const response = await getteacherClass();
      setClassOptions(response?.data?.data?.class_subject_list);
      setSelectedOptions(response?.data?.data?.class_subject_list?.[0])
      setAverageDuration({ avg_duration: response?.data?.data?.avg_duration, total_duration: response?.data?.data?.total_duration });
    } catch (error) {
      console.error(error);
    }
  };


  const overviewSection = useMemo(() => <OverviewSection />, []);
  const overallClassPerformance = useMemo(
    () => <OverallClassPerformance />,
    []
  );
  const subjectAnalytics = useMemo(() => <SubjectAnalytics />, []);
  // const classAssignment = useMemo(
  //   () => <ClassAssignment selectedOptions={selectedOptions} />,
  //   [selectedOptions]
  // );
  const studentAssignment = useMemo(
    () => <StudentAssignment />,
    [selectedOptions]
  );
  const classWiseStudentRanking = useMemo(
    () => (
      <ClassWiseStudentRanking
        classOptions={classOptions}
      />
    ),
    [classOptions]
  );

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={7}>
          <HeroCard averageDuration={averageDuration} />
        </Grid>
        <Grid item xs={12} md={5}>
          <ClassProf />
        </Grid>
      </Grid>

      {/* Overview and Calendar */}
      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={9}>
            {overviewSection}
          {/* <Box mt={4}>{calendarComponent}</Box> */}
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid item xs={12}>
            {overallClassPerformance}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ marginY: "16px", width: "100%", }}>
        {studentAssignment}
      </Box>

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={6}>
          {/* {lectureAnalytics} */}
          {classWiseStudentRanking}
        </Grid>
        <Grid item xs={12} md={6}>
          {subjectAnalytics}
        </Grid>
      </Grid>
      <EngagementSection />
    </Box>
  );
};

export default Page;
