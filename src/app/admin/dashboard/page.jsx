"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Autocomplete, TextField, Typography } from "@mui/material";
import GreetingCard from "@/components/admin/dashboard/GreetingCard/GreetingCard";
import ClassWiseStudentRanking from "@/components/admin/dashboard/ClassWiseStudentRanking/ClassWiseStudentRanking";
import ClassAssignment from "@/components/admin/dashboard/ClassAssignment/ClassAssignment";
import StudentAssignment from "@/components/admin/dashboard/StudentAssignment/StudentAssignment";
import { getTeacherStudentCount, getAllSubject } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import StudentCount from "@/components/admin/dashboard/StudentCount/StudentCount";
import TeacherCount from "@/components/admin/dashboard/TeacherCount/TeacherCount";
import TeacherRanking from "@/components/admin/dashboard/TeacherRanking/TeacherRanking";
import TotalLectures from "@/components/admin/dashboard/TotalLectures/TotalLectures";
import AverageLectureDuration from "@/components/admin/dashboard/AverageLectureDuration/AverageLectureDuration";

const Page = () => {
  const { isDarkMode } = useThemeContext();
  const [classOptions, setClassOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [countData, setCountData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassOptions();
    fetchCountData();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const subjectResponse = await getAllSubject();
      setClassOptions(subjectResponse?.data?.data);
      setSelectedOptions(subjectResponse?.data?.data?.[1]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountData = async () => {
    setLoading(true)
    try {
      const response = await getTeacherStudentCount();
      if (response?.success) {
        setCountData(response?.data);
      }
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false)
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

  const greetingCard = useMemo(() => <GreetingCard />, []);
  const totalLectures = useMemo(
    () => <TotalLectures countData={countData} loading={loading}/>,
    [countData, loading]
  );
  const averageLectureDuration = useMemo(
    () => <AverageLectureDuration countData={countData} loading={loading} />,
    [countData, loading]
  );
  const studentCount = useMemo(
    () => <StudentCount countData={countData} loading={loading} />,
    [countData, loading]
  );
  const teacherCount = useMemo(
    () => <TeacherCount countData={countData} loading={loading} />,
    [countData, loading]
  );
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
    () => <ClassWiseStudentRanking selectedOptions={selectedOptions} />,
    [selectedOptions]
  );

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      {/* Greeting Card */}
      <Box>{greetingCard}</Box>

      {/* Profile, Lecture Duration, Subject Completion */}
      <Grid container spacing={1} mt={3}>
        <Grid item xs={12} sm={6} lg={3}>
          {totalLectures}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {averageLectureDuration}
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {studentCount}
        </Grid>
        <Grid item xs={12} lg={3}>
          {teacherCount}
        </Grid>
      </Grid>
      <Grid item xs={12} md={9} mt={4}>
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
            options={classOptions?.map((option) => option?.name)}
            value={selectedOptions?.name || ""} // Set value to the class name only
            onChange={(event, newValue) => {
              const selected = classOptions.find(
                (option) => option.name === newValue
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
