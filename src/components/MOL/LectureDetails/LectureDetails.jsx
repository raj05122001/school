import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import LectureNotes from "./LectureNotes";
import LectureMCQ from "./LectureMCQ";
import LectureQuestions from "./LectureQuestions";
import LectureAssignment from "./LectureAssignment";
import LectureReferrence from "./LectureReferrence";
import { useThemeContext } from "@/hooks/ThemeContext";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import StudentMCQ from "./StudentMCQ";
import StudentMOLAssignment from "./StudentMOLAssignment";

const window = global?.window || {};

const LectureDetails = ({
  id,
  classID,
  marksData = {},
  isStudent = false,
  setMarksData,
  isAdmin = false,
  isEdit = false,
}) => {
  const { isDarkMode } = useThemeContext();
  const [value, setValue] = useState(0);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  const class_ID = classID;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* ---------- memoized contents ---------- */
  const memoizedLectureNotes = useMemo(
    () => (
      <LectureNotes
        id={id}
        isDarkMode={isDarkMode}
        marksData={marksData}
        isStudent={isStudent}
        setMarksData={setMarksData}
        isEdit={isEdit}
      />
    ),
    [id, isDarkMode, marksData, isStudent, setMarksData, isEdit]
  );

  const memoizedLectureMCQ = useMemo(
    () => <LectureMCQ id={id} isDarkMode={isDarkMode} isEdit={isEdit} />,
    [id, isDarkMode, isEdit]
  );

  const memoizedStudentMCQ = useMemo(
    () => <StudentMCQ id={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );

  const memoizedStudentMOLAssignment = useMemo(
    () => (
      <StudentMOLAssignment id={id} isDarkMode={isDarkMode} class_ID={class_ID} />
    ),
    [id, isDarkMode, class_ID]
  );

  const memoizedLectureQuestions = useMemo(
    () => <LectureQuestions id={id} isDarkMode={isDarkMode} isEdit={isEdit} />,
    [id, isDarkMode, isEdit]
  );

  const memoizedLectureAssignment = useMemo(
    () => (
      <LectureAssignment
        id={id}
        isDarkMode={isDarkMode}
        class_ID={class_ID}
        isEdit={true}
        isAdmin={isAdmin}
      />
    ),
    [id, isDarkMode, class_ID, isAdmin]
  );

  const memoizedLectureReferrence = useMemo(
    () => <LectureReferrence id={id} isDarkMode={isDarkMode} isEdit={isEdit} />,
    [id, isDarkMode, isEdit]
  );

  return (
    <Box
      sx={{
        alignSelf: "stretch",
        borderRadius: "16px",
        background: "#fff",
        width: "100%",
        maxHeight: { xs: "none", md: 680 }, // desktop pe hi max-height
        overflowY: { xs: "visible", md: "auto" },
      }}
    >
      {/* --------- Heading --------- */}
      <Typography
        sx={{
          color: "#3B3D3B",
          fontFamily: "Inter",
          fontSize: { xs: "16px", sm: "18px", md: "20px" },
          fontStyle: "normal",
          fontWeight: "700",
          lineHeight: "normal",
          padding: {
            xs: "14px 12px 4px 12px",
            sm: "16px 16px 6px 16px",
            md: "21px 20px 6px 20px",
          },
        }}
      >
        Lecture Details
        <br />
        <span
          style={{
            fontSize: "11px",
            fontFamily: "Inter, sans-serif",
            fontStyle: "italic",
            fontWeight: "400",
          }}
        >
          {userDetails?.role === "STUDENT" ? (
            <i>(This is an AI generated content.)</i>
          ) : (
            <i>
              (This is an AI generated content. The teacher should verify it.)
            </i>
          )}
        </span>
      </Typography>

      {/* --------- Tabs --------- */}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="lecture details tabs"
        indicatorColor="none"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          width: "100%",
          minHeight: 0,
          ".MuiTabs-scroller": {
            overflowX: "auto !important",
          },
          ".MuiTabs-flexContainer": {
            gap: { xs: 1, md: 2 },
            padding: {
              xs: "4px 8px 4px 12px",
              md: "8px 20px 8px 20px",
            },
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid var(--Stroke-Color-1, #C1C1C1)",
            flexWrap: { xs: "wrap", sm: "nowrap" }, // chhoti screen pe wrap allowed
          },
          ".MuiTab-root": {
            color: "#3B3D3B",
            padding: { xs: "6px 10px", md: "10px 20px" },
            minHeight: 0,
            marginTop: { xs: "4px", md: "8px" },
            textAlign: "center",
            fontSize: { xs: "13px", md: "16px" },
            fontFamily: "Aptos",
            textTransform: "none",
            minWidth: { xs: "auto", md: "120px" },
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
        <Tab label="Notes" />
        <Tab label="MCQ" />
        <Tab label="Questions" />
        <Tab label="Assignment" />
        <Tab label="Reference" />
      </Tabs>

      {/* --------- Tab content --------- */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          pt: { xs: 1.5, sm: 2 },
          pb: { xs: 1.5, sm: 2.5 },
        }}
      >
        {value === 0 && memoizedLectureNotes}

        {value === 1 &&
          (userDetails?.role === "STUDENT"
            ? memoizedStudentMCQ
            : memoizedLectureMCQ)}

        {value === 2 && memoizedLectureQuestions}

        {value === 3 &&
          (userDetails?.role === "STUDENT"
            ? memoizedStudentMOLAssignment
            : memoizedLectureAssignment)}

        {value === 4 && memoizedLectureReferrence}
      </Box>
    </Box>
  );
};

export default LectureDetails;
