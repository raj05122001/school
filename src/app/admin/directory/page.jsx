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
  Pagination,
  Stack,
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import DarkMode from "@/components/DarkMode/DarkMode";
import { getAllTeachers, getAllStudent } from "@/api/apiHelper";
import Image from "next/image";
import { BASE_URL_MEET } from "@/constants/apiconfig";

const Page = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dropdownValue, setDropdownValue] = useState("");
  const [teacherData, setTeacherData] = useState([]);
  const [filteredTeacherData, setFilteredTeacherData] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  // Fetch Teacher Data
  const fetchTeacherData = async (page = 1, size = 10) => {
    try {
      const response = await getAllTeachers("", "", "", "", "", page, size);
      const teacherList = response?.data?.data?.data || [];
      const total = response?.data?.data?.count || 0;
      
      setTeacherData(teacherList);
      setFilteredTeacherData(teacherList);
      setTotalTeachers(total);

      const uniqueDepartments = Array.from(
        new Set(teacherList?.map((item) => item.department?.name || ""))
      );
      setDepartmentOptions(uniqueDepartments);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Student Data
  const fetchStudentData = async (page = 1, size = 10) => {
    try {
      const response = await getAllStudent("", "", "", "", "", page, size);
      const studentList = response?.data?.data?.data || [];
      const total = response?.data?.data?.count || 0;
      
      setStudentData(studentList);
      setFilteredStudentData(studentList);
      setTotalStudents(total);

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
    setCurrentPage(1); // Reset to first page when filtering

    if (tabValue === 0) {
      const filteredData = studentData?.filter(
        (student) => student.user_class?.name === newValue
      );
      setFilteredStudentData(newValue ? filteredData : studentData);
    } else {
      const filteredData = teacherData?.filter(
        (teacher) => teacher.department?.name === newValue
      );
      setFilteredTeacherData(newValue ? filteredData : teacherData);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1); // Reset to first page when switching tabs
    setDropdownValue(""); // Reset filter when switching tabs
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchStudentData(currentPage, pageSize);
    } else {
      fetchTeacherData(currentPage, pageSize);
    }
  }, [tabValue, currentPage, pageSize]);

  const { isDarkMode } = useThemeContext();

  const studentHeaders = ["Student", "Class", "Email", "Batch Year"];
  const teacherHeaders = [
    "Teacher",
    "Lectures Done",
    "Total Lectures",
    "Email",
    "Experience",
    "Rating",
  ];

  const dropdownOptions = tabValue === 0 ? classOptions : departmentOptions;
  
  // Calculate total pages
  const totalPages = tabValue === 0 
    ? Math.ceil(totalStudents / pageSize)
    : Math.ceil(totalTeachers / pageSize);

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
            onChange={handleTabChange}
            indicatorColor="none"
            textColor="primary"
            centered
            sx={{
              ".MuiTabs-flexContainer": {
                gap: 2,
                padding: "8px 496px 8px 20px",
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
            overflowX: "auto",
          }}
        >
          <Table sx={{ border: "none", minWidth: 1000 }}>
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
                    width: "80px",
                  }}
                ></TableCell>
                {(tabValue === 0 ? studentHeaders : teacherHeaders)?.map(
                  (header, index) => (
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
                        width: 
                          header === "Email" ? "200px" :
                          header === "Teacher" || header === "Student" ? "150px" :
                          header === "Experience" ? "100px" :
                          header === "Rating" ? "80px" :
                          header === "Lectures Done" ? "120px" :
                          header === "Total Lectures" ? "120px" :
                          "auto",
                        borderTopRightRadius:
                          index === (tabValue === 0 ? studentHeaders : teacherHeaders).length - 1 ? "10px" : "0px",
                        borderBottomRightRadius:
                          index === (tabValue === 0 ? studentHeaders : teacherHeaders).length - 1 ? "10px" : "0px",
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
                    <TableCell sx={{ width: "80px" }}>
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
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
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
                        }}
                        noWrap
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
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={student?.user?.email}
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
                    <TableCell sx={{ width: "80px" }}>
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
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#3B3D3B",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          lineHeight: "normal",
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={teacher?.user.full_name}
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
                          textAlign: "center",
                        }}
                      >
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
                          textAlign: "center",
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
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={teacher?.user?.email}
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
                          textAlign: "center",
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
                          textAlign: "center",
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

        {/* Pagination Component */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 3,
            gap: 2
          }}
        >
          <Typography
            sx={{
              color: "#3B3D3B",
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Total: {tabValue === 0 ? totalStudents : totalTeachers} {tabValue === 0 ? 'Students' : 'Teachers'}
          </Typography>
          
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#3B3D3B',
                fontFamily: 'Inter',
                '&:hover': {
                  backgroundColor: 'rgba(59, 61, 59, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                },
              },
            }}
          />
          
          <Typography
            sx={{
              color: "#3B3D3B",
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Page {currentPage} of {totalPages}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Page;