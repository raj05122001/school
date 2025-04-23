import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getLectureSummary, getLectureHighlights } from "@/api/apiHelper";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import SummaryComponent from "./SummaryComponent";
import HighlightsComponent from "./HighlightsComponent";
import { useThemeContext } from "@/hooks/ThemeContext";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";

const window = global?.window || {};

const LectureOverview = ({
  lectureId,
  isEdit = false,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [summaryId, setSummaryId] = useState("");
  const { isDarkMode } = useThemeContext();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const summaryComponent = useMemo(
    () => (
      <SummaryComponent
        lectureId={lectureId}
        isDarkMode={isDarkMode}
        isEdit={isEdit}
        marksData={marksData}
        isStudent={isStudent}
        setMarksData={setMarksData}
      />
    ),
    [marksData, lectureId, isDarkMode]
  );

  const highlightsComponent = useMemo(
    () => (
      <HighlightsComponent
        lectureId={lectureId}
        isDarkMode={isDarkMode}
        marksData={marksData}
        isStudent={isStudent}
        setMarksData={setMarksData}
      />
    ),
    [marksData, lectureId, isDarkMode]
  );

  return (
    <Box
      sx={{
        alignSelf: "stretch",
        borderRadius: "0px 0px 16px 16px",
        background: "#fff",
        borderRadius: "16px",
      }}
    >
      <Typography
        sx={{
          color: "#3B3D3B",
          fontFamily: "Inter",
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: "700",
          lineHeight: "normal",
          padding: "21px 0px 6px 20px",
        }}
      >
        Lecture Overview
        <br />
        <span
          style={{
            fontSize: "12px",
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

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="lecture overview tabs"
        indicatorColor="none"
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
        <Tab label="Summary" />
        <Tab label="Highlights" />
      </Tabs>

      {/* Render tab content conditionally based on selected tab */}
      {value === 0 && summaryComponent}
      {value === 1 && highlightsComponent}
    </Box>
  );
};

export default LectureOverview;
