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
  Paper,
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import DarkMode from "@/components/DarkMode/DarkMode";
import { getAllTeachers, getAllStudent } from "@/api/apiHelper";
import Image from "next/image";
import { BASE_URL_MEET } from "@/constants/apiconfig";

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

  const studentHeaders = ["Student", "Class", "Email", "Batch Year"];
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
    <Box padding={2}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "24px 32px 32px 32px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            indicatorColor="none"
            textColor="primary"
            centered
            sx={{
              ".MuiTabs-flexContainer": {
                gap: 2,

                padding: "8px 496px 8px 20px",
                // borderRadius: "12px",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                display: "flex",
                alignItems: "center",
                borderBottom: "0.5px solid var(--Stroke-Color-1, #C1C1C1)",
              },
              ".MuiTab-root": {
                color: "#3B3D3B",
                padding: "10px 20px",
                minHeight: 0,
                marginTop: "8px",
                textAlign: "center",
                fontSize: "16px",
                fontFamily: "Aptos",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  color: "#3B3D3B",
                },
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  color: "#3B3D3B",
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
              onInputChange={(event, newInputValue) =>
                handleDropdownChange(null, newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tabValue === 0 ? "Class" : "Department"}
                  variant="outlined"
                  InputLabelProps={{
                    style: { color: isDarkMode ? "#d7e4fc" : "" },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                    sx: {
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      height: 45,
                      width: 200,
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #d3d3d3",
                      },
                    },
                  }}
                />
              )}
              sx={{ minWidth: 200 }}
            />
            {/* <DarkMode /> */}
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "10px",
            border: "none",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Table sx={{ border: "none" }}>
            <TableHead
              sx={{
                backgroundColor: "#F3F5F7",
                borderRadius: "10px",
                border: "none",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    border: "none",
                    color: "#3B3D3B",
                    fontFamily: "Inter",
                    fontWeight: "600",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    fontSize: "14px",
                  }}
                ></TableCell>
                {(tabValue === 0 ? studentHeaders : teacherHeaders)?.map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        border: "none",
                        color: "#3B3D3B",
                        fontFamily: "Inter",
                        fontWeight: "600",
                        fontStyle: "normal",
                        lineHeight: "normal",
                        fontSize: "14px",
                        borderTopRightRadius:
                          header === "Batch Year" ||
                          (header === "rating" && "10px"),
                        borderBottomRightRadius:
                          header === "Batch Year" ||
                          (header === "rating" && "10px"),
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody sx={{ borderBottom: "none" }}>
              {tabValue === 0 &&
                filteredStudentData?.map((student) => (
                  <TableRow key={student?.id}>
                    <TableCell>
                      <Image
                        src={
                          student?.user?.profile_pic
                            ? `${BASE_URL_MEET}${student?.user?.profile_pic.startsWith("/") ? "" : "/"}${student?.user?.profile_pic}`
                            : "/TopTeachers.png"
                        }
                        width={50}
                        height={50}
                        style={{ borderRadius: "100%" }}
                        alt="Student pic"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {" "}
                        {student?.user?.full_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "41px",
                          height: "18px",
                          flexShrink: 0,
                        }}
                        nowrap
                      >
                        {student?.user_class?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {student?.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {student?.batch_year}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              {tabValue === 1 &&
                filteredTeacherData?.map((teacher) => (
                  <TableRow key={teacher?.user?.id}>
                    <TableCell>
                      <Image
                        src={
                          teacher?.user?.profile_pic
                            ? `${BASE_URL_MEET}${teacher?.user?.profile_pic.startsWith("/") ? "" : "/"}${teacher?.user?.profile_pic}`
                            : "/TopTeachers.png"
                        }
                        width={50}
                        height={50}
                        style={{ borderRadius: "100%" }}
                        alt="Teacher pic"
                      />
                    </TableCell>
                    <TableCell
                      sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.user.full_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {" "}
                        {teacher?.lectures_done}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.alloted_lecturehour}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.total_lectures}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.user?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.experience}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          width: "105px",
                        }}
                      >
                        {teacher?.avg_feedback?.toFixed(1)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Page;
