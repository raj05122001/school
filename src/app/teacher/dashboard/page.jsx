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
import GreetingCard from "@/components/teacher/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import LectureDuration from "@/components/teacher/dashboard/LectureDuration/LectureDuration";
import SubjectCompletion from "@/components/teacher/dashboard/SubjectCompletion/SubjectCompletion";
import StudentQueries from "@/components/teacher/dashboard/StudentQueries/StudentQueries";
import ClassWiseStudentRanking from "@/components/teacher/dashboard/ClassWiseStudentRanking/ClassWiseStudentRanking";
import ClassAssignment from "@/components/teacher/dashboard/ClassAssignment/ClassAssignment";
import StudentAssignment from "@/components/teacher/dashboard/StudentAssignment/StudentAssignment";
import { getteacherClass } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";

const Page = () => {
  const { isDarkMode } = useThemeContext();
  const [classOptions, setClassOptions] = useState([]);
  const [averageDuration, setAverageDuration] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchClassOptions();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const response = await getteacherClass();
      setClassOptions(response?.data?.data?.class_subject_list);
      setSelectedOptions(response?.data?.data?.class_subject_list?.[0])
      setAverageDuration(response?.data?.data?.avg_duration);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const greetingCard = useMemo(() => <GreetingCard />, []);
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
  const classAssignment = useMemo(
    () => <ClassAssignment selectedOptions={selectedOptions} />,
    [selectedOptions]
  );
  const studentAssignment = useMemo(
    () => <StudentAssignment selectedOptions={selectedOptions} />,
    [selectedOptions]
  );
  const classWiseStudentRanking = useMemo(
    () => (
      <ClassWiseStudentRanking
        selectedOptions={selectedOptions}
        isMyClass={tabValue}
      />
    ),
    [selectedOptions, tabValue]
  );

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      {/* Greeting Card */}
      <Box>{greetingCard}</Box>

      {/* Profile, Lecture Duration, Subject Completion */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} lg={5}>
          {profileCard}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {lectureDuration}
        </Grid>
        <Grid item xs={12} lg={4}>
          {subjectCompletion}
        </Grid>
      </Grid>

      {/* Overview and Calendar */}
      <Grid container direction="row" spacing={2} mt={2}>
        <Grid item xs={12} md={9}>
          {overviewSection}
          <Box mt={4}>{calendarComponent}</Box>
        </Grid>
        <Grid item xs={12} md={3} mt={9}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              {strugglingExcelling}
              {/* <ClassWiseStudentRanking /> */}
            </Grid>
            <Grid item xs={12}>
              {overallClassPerformance}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Student Queries, Analytics Reports, and Class Statistics */}
      {/* <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={4}>
          {studentQueries}
        </Grid>
        <Grid item xs={12} md={4}>
          {analyticsReports}
        </Grid>
        <Grid item xs={12} md={4}>
          {classStatistics}
        </Grid>
      </Grid> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography
          variant="h4"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Class Proficiency
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Autocomplete
            freeSolo
            id="class"
            disableClearable
            options={classOptions?.map((option) => option.class_name)}
            value={selectedOptions?.class_name || ""} // Set value to the class name only
            onChange={(event, newValue) => {
              const selected = classOptions.find(
                (option) => option.class_name === newValue
              );
              setSelectedOptions(selected || null); // Set selected option object
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Class"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: currentStyles.inputColor,
                    height: 45,
                    width: 200,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                }}
                sx={{
                  boxShadow: currentStyles.boxShadow,
                  borderRadius: 10,
                }}
              />
            )}
          />

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="lecture overview tabs"
            indicatorColor="none"
            sx={{
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ".MuiTabs-flexContainer": {
                padding: "1px 10px",
              },
              ".MuiTab-root": {
                color: "#333",
                padding: "10px 10px",
                minHeight: 0,
                textAlign: "center",
                color: isDarkMode && "#F0EAD6",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  borderRadius: "10px",
                  color: "black",
                },
                "&.Mui-selected": {
                  backgroundColor: "#e0e0e0",
                  color: "#000",
                  borderRadius: "10px",
                },
              },
            }}
          >
            <Tab label={`All Subject`} />
            <Tab label={`My Subject`} />
          </Tabs>
        </Box>
      </Box>
      <Grid container direction="row" spacing={2} mt={1}>
        <Grid
          item
          xs={9}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {classAssignment}
          {studentAssignment}
        </Grid>
        <Grid item xs={3}>
          {classWiseStudentRanking}
        </Grid>
      </Grid>

      {/* Lecture and Subject Analytics */}
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={6}>
          {lectureAnalytics}
        </Grid>
        <Grid item xs={12} md={6}>
          {subjectAnalytics}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;
