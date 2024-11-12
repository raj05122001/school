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

import StrugglingExcelling from "@/components/teacher/dashboard/StrugglingExcelling/StrugglingExcelling";
import OverallClassPerformance from "@/components/teacher/dashboard/OverallClassPerformance/OverallClassPerformance";
import GreetingCard from "@/components/admin/dashboard/GreetingCard/GreetingCard";
import ProfileCard from "@/components/teacher/dashboard/ProfileCard/ProfileCard";
import ClassWiseStudentRanking from "@/components/admin/dashboard/ClassWiseStudentRanking/ClassWiseStudentRanking";
import ClassAssignment from "@/components/admin/dashboard/ClassAssignment/ClassAssignment";
import StudentAssignment from "@/components/admin/dashboard/StudentAssignment/StudentAssignment";
import { getteacherClass, getTeacherStudentCount } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import StudentCount from "@/components/admin/dashboard/StudentCount/StudentCount";
import TeacherCount from "@/components/admin/dashboard/TeacherCount/TeacherCount";
import TeacherRanking from "@/components/admin/dashboard/TeacherRanking/TeacherRanking";

const Page = () => {
  const { isDarkMode } = useThemeContext();
  const [classOptions, setClassOptions] = useState([]);
  const [averageDuration, setAverageDuration] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [countData, setCountData] = useState({});

  useEffect(() => {
    fetchClassOptions();
    fetchCountData();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const response = await getteacherClass();
      setClassOptions(response?.data?.data?.class_subject_list);
      setSelectedOptions(response?.data?.data?.class_subject_list?.[0]);
      setAverageDuration(response?.data?.data?.avg_duration);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountData = async () => {
    try {
      const response = await getTeacherStudentCount();
      if (response?.success) {
        setCountData(response?.data);
      }
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
  const studentCount = useMemo(() => <StudentCount countData={countData}/>, [countData]);
  const teacherCount = useMemo(() => <TeacherCount countData={countData}/>, [countData]);
  const teacherRanking = useMemo(() => <TeacherRanking />, []);

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
      <Grid container spacing={1} mt={3}>
        <Grid item xs={12} sm={6} lg={5}>
          {profileCard}
        </Grid>
        <Grid item xs={12} sm={6} lg={3.5}>
          {studentCount}
        </Grid>
        <Grid item xs={12} lg={3.5}>
          {teacherCount}
        </Grid>
      </Grid>
      <Grid item xs={12} md={9} mt={2}>
        {teacherRanking}
      </Grid>

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
            <Tab label={`Overall Class`} />
            <Tab label={`My Class`} />
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
    </Box>
  );
};

export default Page;
