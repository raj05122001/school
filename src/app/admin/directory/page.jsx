"use client";
import React, { useEffect, useMemo, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  getAllTeachers,
  getAllStudent,
  getClassDropdown,
  grtDepartment,
} from "@/api/apiHelper";
import Image from "next/image";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import toast from "react-hot-toast";

/** Safely pull name from API item or pass-through string */
function pickName(item, fallback = "") {
  if (!item) return fallback;
  if (typeof item === "string") return item;
  return (
    item?.name ??
    item?.title ??
    item?.label ??
    item?.display_name ??
    fallback
  );
}

const Page = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // >=600
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // >=900
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg")); // >=1200
  const { isDarkMode } = useThemeContext();

  const [tabValue, setTabValue] = useState(0); // 0=Student, 1=Teacher
  const isTeacherTab = tabValue === 1;

  const [dropdownValue, setDropdownValue] = useState("");
  const [teacherData, setTeacherData] = useState([]);
  const [filteredTeacherData, setFilteredTeacherData] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]); // array<string>
  const [studentData, setStudentData] = useState([]);
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [classOptions, setClassOptions] = useState([]); // array<string>

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  /** ---------- UI polish tokens ---------- */
  const cardBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#fff";
  const chipBorder = isDarkMode ? "rgba(255,255,255,0.18)" : "#e5e7eb";
  const headerBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#F6F7F9";

  /** ---------- Dropdown loader based on tab ---------- */
  const loadFilterOptions = async () => {
    try {
      if (isTeacherTab) {
        const departmentResponse = await grtDepartment();
        const raw = departmentResponse?.data?.data ?? departmentResponse?.data ?? [];
        const names = (Array.isArray(raw) ? raw : []).map((r) => pickName(r)).filter(Boolean);
        setDepartmentOptions([...new Set(names)]);
      } else {
        const resp = await getClassDropdown();
        const raw = resp?.data ?? [];
        const names = (Array.isArray(raw) ? raw : []).map((r) => pickName(r)).filter(Boolean);
        setClassOptions([...new Set(names)]);
      }
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      toast.error("Failed to load filter options.");
    }
  };

  /** ---------- Prefetch BOTH totals on mount ---------- */
  useEffect(() => {
    const prefetchTotals = async () => {
      try {
        const [tRes, sRes] = await Promise.all([
          getAllTeachers("", "", "", "", "", 1, 1),
          getAllStudent("", "", "", "", "", 1, 1),
        ]);
        setTotalTeachers(tRes?.data?.data?.count || 0);
        setTotalStudents(sRes?.data?.data?.count || 0);
      } catch (err) {
        console.error("Prefetch totals failed:", err);
      }
    };
    prefetchTotals();
  }, []);

  /** ---------- Fetch Teacher Data ---------- */
  const fetchTeacherData = async (page = 1, size = 10) => {
    try {
      dropdownValue
      const response = await getAllTeachers("", "", "", dropdownValue, "", page, size);
      const teacherList = response?.data?.data?.data || [];
      const total = response?.data?.data?.count || 0;
      setTeacherData(teacherList);
      setFilteredTeacherData(teacherList);
      setTotalTeachers(total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load teachers.");
    }
  };

  /** ---------- Fetch Student Data ---------- */
  const fetchStudentData = async (page = 1, size = 10) => {
    try {
      const response = await getAllStudent("", "", dropdownValue, "", "", page, size);
      const studentList = response?.data?.data?.data || [];
      const total = response?.data?.data?.count || 0;
      setStudentData(studentList);
      setFilteredStudentData(studentList);
      setTotalStudents(total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students.");
    }
  };

  /** ---------- Change filter selection ---------- */
  const handleDropdownChange = (_event, newValue) => {
    const val = (newValue || "").toString().trim();
    setDropdownValue(val);
    setCurrentPage(1);
  };

  /** ---------- Pagination & tab change ---------- */
  const handlePageChange = (_, newPage) => setCurrentPage(newPage);

  const handleTabChange = async (_e, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
    setDropdownValue("");
  };

  /** ---------- Load list + filter options when tab/page changes ---------- */
  useEffect(() => {
    if (isTeacherTab) {
      fetchTeacherData(currentPage, pageSize);
    } else {
      fetchStudentData(currentPage, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, currentPage, pageSize, dropdownValue]);

  useEffect(() => {
    loadFilterOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  /** ---------- Headers with responsive visibility ---------- */
  const studentHeaders = useMemo(
    () => [
      { key: "student", label: "Student", show: true },
      { key: "class", label: "Class", show: true },
      { key: "email", label: "Email", show: isSmUp }, // hide on xs
      { key: "batch", label: "Batch Year", show: isMdUp }, // show md+
    ],
    [isSmUp, isMdUp]
  );

  const teacherHeaders = useMemo(
    () => [
      { key: "teacher", label: "Teacher", show: true },
      { key: "done", label: "Lectures Done", show: isMdUp },
      { key: "total", label: "Total Lectures", show: isMdUp },
      { key: "email", label: "Email", show: isSmUp },
      { key: "exp", label: "Experience", show: isLgUp },
      { key: "rating", label: "Rating", show: true },
    ],
    [isSmUp, isMdUp, isLgUp]
  );

  const dropdownOptions = isTeacherTab ? departmentOptions : classOptions;

  const totalPages = isTeacherTab
    ? Math.ceil((totalTeachers || 0) / pageSize)
    : Math.ceil((totalStudents || 0) / pageSize);

  return (
    <Box padding={{ xs: 1.5, sm: 2 }}>
      <Box
        sx={{
          backgroundColor: cardBg,
          borderRadius: "16px",
          p: { xs: 2, sm: 3 },
          border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "#eef0f3"}`,
          boxShadow: isDarkMode ? "none" : "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header row: Tabs + Filter */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          spacing={2}
          mb={2}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isXs ? "fullWidth" : "standard"}
            sx={{
              ".MuiTabs-flexContainer": {
                gap: 1,
                display: "flex",
                alignItems: "center",
                borderBottom: `0.5px solid ${isDarkMode ? "rgba(255,255,255,0.16)" : "#C1C1C1"}`,
              },
              ".MuiTab-root": {
                color: isDarkMode ? "#e8e8e8" : "#3B3D3B",
                px: { xs: 1.25, sm: 2.25 },
                py: 0.75,
                minHeight: 0,
                mt: 1,
                textAlign: "center",
                fontSize: { xs: "14px", sm: "16px" },
                fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
                textTransform: "none",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#eef2f7",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
                },
                "&.Mui-selected": {
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#fff",
                  color: isDarkMode ? "#fff" : "#1f2937",
                  boxShadow: isDarkMode ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "0px 6px 14px rgba(0, 0, 0, 0.08)",
                },
              },
            }}
          >
            <Tab label="Student" />
            <Tab label="Teacher" />
          </Tabs>

          <Autocomplete
            options={dropdownOptions}
            value={dropdownValue}
            onChange={handleDropdownChange}
            onInputChange={(_, newInputValue) => handleDropdownChange(null, newInputValue)}
            // Using string options; if an object sneaks in, pickName handles it.
            getOptionLabel={(opt) => pickName(opt, String(opt || ""))}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={isTeacherTab ? "Department" : "Class"}
                variant="outlined"
                InputLabelProps={{
                  style: { color: isDarkMode ? "#d7e4fc" : "" },
                }}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#fff",
                    height: 45,
                    width: { xs: "100%", sm: 240, md: 280 },
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: chipBorder,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : "#c7ccd6",
                    },
                  },
                }}
              />
            )}
            sx={{ width: { xs: "100%", md: 300 } }}
          />
        </Stack>

        {/* Totals strip */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="flex-start"
          mb={2}
        >
        {!isTeacherTab?  <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "12px",
              border: `1px solid ${chipBorder}`,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: cardBg,
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography sx={{ fontFamily: "Inter", fontWeight: 600, color: isDarkMode ? "#eaecef" : "#3B3D3B" }}>
              Total Students:
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontWeight: 800 }}>
              {totalStudents}
            </Typography>
          </Paper>
:
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1,
              borderRadius: "12px",
              border: `1px solid ${chipBorder}`,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: cardBg,
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography sx={{ fontFamily: "Inter", fontWeight: 600, color: isDarkMode ? "#eaecef" : "#3B3D3B" }}>
              Total Teachers:
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontWeight: 800 }}>
              {totalTeachers}
            </Typography>
          </Paper>}
        </Stack>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: `1px solid ${chipBorder}`,
            overflow: "hidden",
            backdropFilter: "blur(8px)",
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "#fff",
            overflowX: "auto",
          }}
        >
          <Table sx={{ border: "none", minWidth: 650 }}>
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: headerBg,
                "& .MuiTableCell-root": {
                  py: { xs: 1, sm: 1.25 },
                  fontWeight: 700,
                },
              }}
            >
              <TableRow>
                {/* Avatar spacer */}
                <TableCell
                  sx={{
                    borderBottom: "none",
                    width: { xs: 56, sm: 80 },
                  }}
                />
                {(isTeacherTab ? teacherHeaders : studentHeaders)
                  .filter((h) => h.show)
                  .map((header, idx, arr) => (
                    <TableCell
                      key={header.key}
                      sx={{
                        borderBottom: "none",
                        color: isDarkMode ? "#f2f4f7" : "#344054",
                        fontFamily: "Inter",
                        fontSize: { xs: "12px", sm: "13px" },
                        letterSpacing: 0.2,
                        whiteSpace: "nowrap",
                        ...(idx === arr.length - 1
                          ? {
                              borderTopRightRadius: "12px",
                            }
                          : {}),
                      }}
                    >
                      {header.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!isTeacherTab &&
                filteredStudentData?.map((student, rowIdx) => (
                  <TableRow
                    key={student?.id ?? rowIdx}
                    hover
                    sx={{
                      backgroundColor:
                        rowIdx % 2 === 0
                          ? "transparent"
                          : isDarkMode
                          ? "rgba(255,255,255,0.025)"
                          : "#fafbfc",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#f2f6ff",
                      },
                      transition: "background-color 140ms ease",
                    }}
                  >
                    <TableCell sx={{ width: { xs: 56, sm: 80 }, borderBottom: "none" }}>
                      <Image
                        src={
                          student?.user?.profile_pic
                            ? `${BASE_URL_MEET}${student?.user?.profile_pic.startsWith("/") ? "" : "/"}${student?.user?.profile_pic}`
                            : "/TopTeachers.png"
                        }
                        width={isXs ? 40 : 48}
                        height={isXs ? 40 : 48}
                        style={{ borderRadius: "100%", objectFit: "cover" }}
                        alt="Student pic"
                      />
                    </TableCell>

                    {/* Student */}
                    {studentHeaders.find((h) => h.key === "student")?.show && (
                      <TableCell sx={{ borderBottom: "none", maxWidth: { xs: 140, sm: 200 } }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: isDarkMode ? "#eef2f7" : "#101828",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={student?.user?.full_name}
                        >
                          {student?.user?.full_name || "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Class */}
                    {studentHeaders.find((h) => h.key === "class")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#cbd5e1" : "#344054",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student?.user_class?.name || "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Email (sm up) */}
                    {studentHeaders.find((h) => h.key === "email")?.show && (
                      <TableCell sx={{ borderBottom: "none", maxWidth: 260 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: isDarkMode ? "#cbd5e1" : "#475467",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "12px", sm: "13px" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={student?.user?.email}
                        >
                          {student?.user?.email || "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Batch Year (md up) */}
                    {studentHeaders.find((h) => h.key === "batch")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#cbd5e1" : "#344054",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student?.batch_year ?? "-"}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}

              {isTeacherTab &&
                filteredTeacherData?.map((teacher, rowIdx) => (
                  <TableRow
                    key={teacher?.user?.id ?? rowIdx}
                    hover
                    sx={{
                      backgroundColor:
                        rowIdx % 2 === 0
                          ? "transparent"
                          : isDarkMode
                          ? "rgba(255,255,255,0.025)"
                          : "#fafbfc",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#f2f6ff",
                      },
                      transition: "background-color 140ms ease",
                    }}
                  >
                    <TableCell sx={{ width: { xs: 56, sm: 80 }, borderBottom: "none" }}>
                      <Image
                        src={
                          teacher?.user?.profile_pic
                            ? `${BASE_URL_MEET}${teacher?.user?.profile_pic.startsWith("/") ? "" : "/"}${teacher?.user?.profile_pic}`
                            : "/TopTeachers.png"
                        }
                        width={isXs ? 40 : 48}
                        height={isXs ? 40 : 48}
                        style={{ borderRadius: "100%", objectFit: "cover" }}
                        alt="Teacher pic"
                      />
                    </TableCell>

                    {/* Teacher */}
                    {teacherHeaders.find((h) => h.key === "teacher")?.show && (
                      <TableCell sx={{ borderBottom: "none", maxWidth: { xs: 160, sm: 220 } }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: isDarkMode ? "#eef2f7" : "#101828",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={teacher?.user?.full_name}
                        >
                          {teacher?.user?.full_name || "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Lectures Done (md up) */}
                    {teacherHeaders.find((h) => h.key === "done")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#cbd5e1" : "#344054",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {teacher?.lectures_done ?? "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Total Lectures (md up) */}
                    {teacherHeaders.find((h) => h.key === "total")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#cbd5e1" : "#344054",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {teacher?.total_lectures ?? "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Email (sm up) */}
                    {teacherHeaders.find((h) => h.key === "email")?.show && (
                      <TableCell sx={{ borderBottom: "none", maxWidth: 260 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: isDarkMode ? "#cbd5e1" : "#475467",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "12px", sm: "13px" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={teacher?.user?.email}
                        >
                          {teacher?.user?.email || "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Experience (lg up) */}
                    {teacherHeaders.find((h) => h.key === "exp")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDarkMode ? "#cbd5e1" : "#344054",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {teacher?.experience ?? "-"}
                        </Typography>
                      </TableCell>
                    )}

                    {/* Rating (always) */}
                    {teacherHeaders.find((h) => h.key === "rating")?.show && (
                      <TableCell sx={{ borderBottom: "none" }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: isDarkMode ? "#e2e8f0" : "#111827",
                            fontFamily: "Inter, sans-serif",
                            fontSize: { xs: "13px", sm: "14px" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {Number(teacher?.avg_feedback || 0).toFixed(1)}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination / Totals (active tab) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          mt={3}
        >
          <Typography
            sx={{
              color: isDarkMode ? "#e5e7eb" : "#3B3D3B",
              fontFamily: "Inter",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 600,
            }}
          >
            Total: {isTeacherTab ? totalTeachers : totalStudents}{" "}
            {isTeacherTab ? "Teachers" : "Students"}
          </Typography>

          <Pagination
            count={Math.max(totalPages, 1)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isXs ? "small" : "medium"}
            showFirstButton={!isXs}
            showLastButton={!isXs}
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: "Inter",
                borderRadius: "10px",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                boxShadow: "0 6px 14px rgba(25, 118, 210, 0.25)",
              },
            }}
          />

          <Typography
            sx={{
              color: isDarkMode ? "#e5e7eb" : "#3B3D3B",
              fontFamily: "Inter",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 500,
            }}
          >
            Page {currentPage} of {Math.max(totalPages, 1)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Page;
