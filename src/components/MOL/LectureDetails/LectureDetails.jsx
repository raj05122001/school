import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getLectureSummary, getLectureHighlights } from "@/api/apiHelper";
import LectureNotes from "./LectureNotes";
import LectureMCQ from "./LectureMCQ";
import LectureQuestions from "./LectureQuestions";
import LectureAssignment from "./LectureAssignment";
import LectureReferrence from "./LectureReferrence";
import { useThemeContext } from "@/hooks/ThemeContext";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import StudentMCQ from "./StudentMCQ";

const LectureDetails = ({
  id,
  classID,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const { isDarkMode } = useThemeContext();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [decisionId, setDecisionId] = useState(null);

  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  const class_ID = classID;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const memoizedLectureNotes = useMemo(
    () => (
      <LectureNotes
        id={id}
        isDarkMode={isDarkMode}
        marksData={marksData}
        isStudent={isStudent}
        setMarksData={setMarksData}
      />
    ),
    [id, isDarkMode, marksData]
  );

  const memoizedLectureMCQ = useMemo(
    () => <LectureMCQ id={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );

  const memoizedStudentMCQ = useMemo(
    () => <StudentMCQ id={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );

  const memoizedLectureQuestions = useMemo(
    () => <LectureQuestions id={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );
  const memoizedLectureAssignment = useMemo(
    () => (
      <LectureAssignment id={id} isDarkMode={isDarkMode} class_ID={class_ID} />
    ),
    [id, isDarkMode, class_ID]
  );
  const memoizedLectureReferrence = useMemo(
    () => <LectureReferrence id={id} isDarkMode={isDarkMode} />,
    [id, isDarkMode]
  );

  return (
    <Box sx={{ marginTop: "8px" }}>
      <Typography
        variant="h4"
        fontFamily={"Nunito"}
        sx={{
          bgcolor: "",
          borderRadius: "8px",
          padding: 2,
          color: isDarkMode ? "#F0EAD6" : "#36454F",
        }}
      >
        <b>Lecture Details</b>
        <br />
      </Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="lecture overview tabs"
        indicatorColor="none"
        sx={{
          ".MuiTabs-flexContainer": {
            gap: 2,
            // background: isDarkMode
            //   ? "linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)"
            //   : "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%)",
            background:
              isDarkMode &&
              "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
            backgroundImage: isDarkMode ? "" : "url('/TabBG2.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            padding: 1,
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
        <Tab label="Notes" />
        <Tab label="MCQ" />
        <Tab label="Questions" />
        <Tab label="Assignment" />
        <Tab label="Referrence" />
      </Tabs>

      {/* Render tab content conditionally based on selected tab */}
      {value === 0 && memoizedLectureNotes}
      {value === 1 &&
        (userDetails?.role === "STUDENT"
          ? memoizedStudentMCQ
          : memoizedLectureMCQ)}
      {value === 2 && memoizedLectureQuestions}
      {value === 3 && memoizedLectureAssignment}
      {value === 4 && memoizedLectureReferrence}
    </Box>
  );
};

export default LectureDetails;
