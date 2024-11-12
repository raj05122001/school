"use client";
import React, { useState } from "react";
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

const Page = () => {
  const [tabValue, setTabValue] = useState(0); // Track the selected tab (0 for Student, 1 for Teacher)
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { isDarkMode } = useThemeContext();

  const studentHeaders = [
    "Student",
    "Roll No",
    "Course",
    "Department",
    "Class",
    "Email",
    "Batch_year",
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

  // Options for dropdowns
  const academicYearOptions = ["2023", "2024", "2025"];
  const departmentOptions = ["Science", "Arts", "Commerce"];

  return (
    <Box padding={3}>
      {/* Tabs for switching between Student and Teacher Table */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="none"
        textColor="primary"
        centered
        sx={{
          ".MuiTabs-flexContainer": {
            gap: 2,
            background:
              isDarkMode &&
              "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
            backgroundImage: isDarkMode ? "" : "url('/TabBG2.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            padding: 1,
            // borderRadius: "12px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          },
          ".MuiTab-root": {
            color: "#333",
            padding: "10px 20px",
            minHeight: 0,
            marginTop: "8px",
            textAlign: "center",
            color: isDarkMode && "#F0EAD6",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              color: "black",
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
        <DarkMode />
      </Tabs>

      {/* Dropdowns for Academic Year and Department */}
      <Box display="flex" gap={2} marginBottom={3} marginTop={2}>
        <Autocomplete
          freeSolo
          options={academicYearOptions}
          value={academicYear}
          onChange={(event, newValue) => setAcademicYear(newValue)}
          onInputChange={(event, newInputValue) =>
            setAcademicYear(newInputValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Academic Year"
              variant="outlined"
              InputLabelProps={{
                style: { color: isDarkMode ? "#d7e4fc" : "" },
              }}
              InputProps={{
                ...params.InputProps,
                type: "search",
                sx: {
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  "& .MuiOutlinedInput-notchedOutline": {},
                },
              }}
            />
          )}
          fullWidth
        />

        <Autocomplete
          freeSolo
          options={departmentOptions}
          value={department}
          onChange={(event, newValue) => setDepartment(newValue)}
          onInputChange={(event, newInputValue) => setDepartment(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Department"
              variant="outlined"
              InputLabelProps={{
                style: { color: isDarkMode ? "#d7e4fc" : "" },
              }}
              InputProps={{
                ...params.InputProps,
                type: "search",
                sx: {
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  "& .MuiOutlinedInput-notchedOutline": {},
                },
              }}
            />
          )}
          fullWidth
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Box}
        borderRadius={1}
        className="blur_effect_card"
      >
        <Table>
          <TableHead>
            <TableRow>
              {(tabValue === 0 ? studentHeaders : teacherHeaders).map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {header}
                    </Typography>
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Sample data rows */}
            {tabValue === 0 ? (
              // Student data row
              <TableRow>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  John Doe
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  12345
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  BSc
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  Science
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  12
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  johndoe@example.com
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  2023
                </TableCell>
              </TableRow>
            ) : (
              // Teacher data row
              <TableRow>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  Jane Smith
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  30
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  40
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  70
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  janesmith@example.com
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  5 Years
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }}>
                  4.5
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Page;
