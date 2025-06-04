"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import OverviewSection from "@/components/teacher/dashboard/OverviewSection/OverviewSection";
import AnalyticsReports from "@/components/teacher/dashboard/AnalyticsReports/AnalyticsReports";
import CalendarComponent from "@/components/teacher/dashboard/CalendarComponent/CalendarComponent";
import LectureAnalytics from "@/components/teacher/dashboard/LectureAnalytics/LectureAnalytics";
import SubjectAnalytics from "@/components/teacher/dashboard/SubjectAnalytics/SubjectAnalytics";
import StrugglingExcelling from "@/components/teacher/dashboard/StrugglingExcelling/StrugglingExcelling";
import OverallClassPerformance from "@/components/teacher/dashboard/OverallClassPerformance/OverallClassPerformance";
import ClassStatistics from "@/components/teacher/dashboard/ClassStatistics/ClassStatistics";
// import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import LectureDuration from "@/components/teacher/dashboard/LectureDuration/LectureDuration";
import SubjectCompletion from "@/components/teacher/dashboard/SubjectCompletion/SubjectCompletion";
import StudentQueries from "@/components/teacher/dashboard/StudentQueries/StudentQueries";
import ClassWiseStudentRanking from "@/components/teacher/dashboard/ClassWiseStudentRanking/ClassWiseStudentRanking";
import ClassAssignment from "@/components/teacher/dashboard/ClassAssignment/ClassAssignment";
import StudentAssignment from "@/components/teacher/dashboard/StudentAssignment/StudentAssignment";
import { getteacherClass } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import GreetingCardNew from "@/components/admin/dashboard/GreetingCard/GreetingCardNew";
import HeroCard from "@/components/teacher/dashboard/HeroCard/HeroCard";
import ClassProf from "@/commonComponents/ClassProf/ClassProf";

const Page = () => {
  const { isDarkMode } = useThemeContext();
  const [classOptions, setClassOptions] = useState([]);
  const [averageDuration, setAverageDuration] = useState({
avg_duration:0,
total_duration:0
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
      console.log("response?.data?.data : ",response?.data?.data)
      setAverageDuration({avg_duration:response?.data?.data?.avg_duration,total_duration:response?.data?.data?.total_duration});
      console.log("Response", response?.data?.data)
    } catch (error) {
      console.error(error);
    }
  };


  
  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    inputBackgroundColor: "#ffffff",
    inputColor: "#ffffff",
    boxShadow: "0px 2px 5px rgba(255, 255, 255, 0.1)",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    color: "#000000",
    inputBackgroundColor: "#333333",
    inputColor: "#000000",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  // const greetingCard = useMemo(() => <GreetingCardNew />, []);
  const profileCard = useMemo(() => <ProfileCard />, []);
  const lectureDuration = useMemo(
    () => <LectureDuration averageDuration={averageDuration} />,
    [averageDuration]
  );
  const subjectCompletion = useMemo(() => <SubjectCompletion />, []);
  const overviewSection = useMemo(() => <OverviewSection />, []);
  const strugglingExcelling = useMemo(() => <StrugglingExcelling />, []);
  const overallClassPerformance = useMemo(
    () => <OverallClassPerformance />,
    []
  );
  const studentQueries = useMemo(() => <StudentQueries />, []);
  const analyticsReports = useMemo(() => <AnalyticsReports />, []);
  const calendarComponent = useMemo(() => <CalendarComponent />, []);
  const classStatistics = useMemo(() => <ClassStatistics />, []);
  const lectureAnalytics = useMemo(() => <LectureAnalytics />, []);
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
        selectedOptions={selectedOptions}
      />
    ),
    [selectedOptions]
  );

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={7}>
      <HeroCard averageDuration={averageDuration}/>
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

      <Box sx={{marginY:"16px", width:"100%",}}>
        {studentAssignment}
      </Box>

      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={6}>
          {/* {lectureAnalytics} */}
          {classWiseStudentRanking}
        </Grid>
        <Grid item xs={12} md={6}>
          {subjectAnalytics}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
