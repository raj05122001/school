"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tab,
  Tabs,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import DarkMode from "@/components/DarkMode/DarkMode";
import { getAllTeachers, getAllStudent } from "@/api/apiHelper";

const Page = () => {
  const [tabValue, setTabValue] = useState(0); // Track the selected tab (0 for Student, 1 for Teacher)
  const [dropdownValue, setDropdownValue] = useState("");
  const [teacherData, setTeacherData] = useState([]);
  const [filteredTeacherData, setFilteredTeacherData] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);

  // Fetch Teacher Data
  const fetchTeacherData = async () => {
    try {
      const response = await getAllTeachers("", "", "", "", "", 1, 10);
      const teacherList = response?.data?.data?.data || [];
      setTeacherData(teacherList);
      setFilteredTeacherData(teacherList);

      const uniqueDepartments = Array.from(
        new Set(teacherList?.map((item) => item.department?.name || ""))
      );
      setDepartmentOptions(uniqueDepartments);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Student Data
  const fetchStudentData = async () => {
    try {
      const response = await getAllStudent("", "", "", "", "", 1, 10);
      const studentList = response?.data?.data?.data || [];
      setStudentData(studentList);
      setFilteredStudentData(studentList);

      const uniqueClasses = Array.from(
        new Set(studentList?.map((item) => item.user_class?.name || ""))
      );
      setClassOptions(uniqueClasses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropdownChange = (event, newValue) => {
    setDropdownValue(newValue);

    if (tabValue === 0) {
      // Filter Student Data
      const filteredData = studentData?.filter(
        (student) => student.user_class?.name === newValue
      );
      setFilteredStudentData(newValue ? filteredData : studentData);
    } else {
      // Filter Teacher Data
      const filteredData = teacherData?.filter(
        (teacher) => teacher.department?.name === newValue
      );
      setFilteredTeacherData(newValue ? filteredData : teacherData);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchStudentData();
    } else {
      fetchTeacherData();
    }
  }, [tabValue]);

  const { isDarkMode } = useThemeContext();

  const studentHeaders = [
    "Student",
    "Class",
    "Email",
    "Batch Year",
  ];
  const teacherHeaders = [
    "Teacher",
    "Lectures Done",
    "Allotted Lecture Hours",
    "Total Lectures",
    "Email",
    "Experience",
    "Rating",
  ];

  const dropdownOptions = tabValue === 0 ? classOptions : departmentOptions;

  return (
    <Box padding={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          indicatorColor="none"
          textColor="primary"
          centered
          sx={{
            ".MuiTabs-flexContainer": {
              gap: 2,
              background: isDarkMode
                ? "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)"
                : "radial-gradient(circle at 10% 20%, rgb(239, 246, 249) 0%, rgb(206, 239, 253) 90%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: 1,
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            },
            ".MuiTab-root": {
              color: "#333",
              padding: "10px 20px",
              minHeight: 0,
              marginTop: "8px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              },
              "&.Mui-selected": {
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
              },
            },
          }}
        >
          <Tab label="Student" />
          <Tab label="Teacher" />
        </Tabs>

        <Box display="flex" alignItems="center" gap={2}>
          <Autocomplete
            freeSolo
            options={dropdownOptions}
            value={dropdownValue}
            onChange={handleDropdownChange}
            onInputChange={(event, newInputValue) => handleDropdownChange(null, newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={tabValue === 0 ? "Class" : "Department"}
                variant="outlined"
                InputLabelProps={{
                  style: { color: isDarkMode ? "#d7e4fc" : "" },
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              />
            )}
            sx={{ minWidth: 200 }}
          />
          <DarkMode />
        </Box>
      </Box>

      <TableContainer component={Box} borderRadius={1} className="blur_effect_card">
        <Table>
          <TableHead>
            <TableRow>
              {(tabValue === 0 ? studentHeaders : teacherHeaders)?.map((header) => (
                <TableCell key={header} sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{tabValue === 0 &&
              filteredStudentData?.map((student) => (
                <TableRow key={student?.id}>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {student?.user?.full_name}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {student?.user_class?.name}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {student?.user?.email}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {student?.batch_year}
                  </TableCell>
                </TableRow>
              ))}
            {tabValue === 1 &&
              filteredTeacherData?.map((teacher) => (
                <TableRow key={teacher?.user?.id}>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.user.full_name}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.lectures_done}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.alloted_lecturehour}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.total_lectures}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.user?.email}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.experience}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                    {teacher?.avg_feedback?.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Page;
