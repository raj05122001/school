import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getLectureSummary, getLectureHighlights } from "@/api/apiHelper";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import SummaryComponent from "./SummaryComponent";
import HighlightsComponent from "./HighlightsComponent";
import { useThemeContext } from "@/hooks/ThemeContext";

const LectureOverview = ({ lectureId, isEdit = false }) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [summaryId, setSummaryId] = useState("");
  const { isDarkMode } = useThemeContext();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        <b>Lecture Overview</b>
        <br />
        <span
          style={{
            fontSize: "16px",
            color: isDarkMode ? "#F0EAD6" : "#36454F",
          }}
        >
          (
          <i>
            The summary and highlights are AI-generated. Feel free to edit them
            as necessary
          </i>
          )
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
            background:
              isDarkMode &&
              "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
            backgroundImage: isDarkMode ? "" : "url('/TabBG2.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            padding: 1,
            // borderRadius: "12px",
            borderTopLeftRadius:"12px",
            borderTopRightRadius:"12px",
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
        <Tab label="Summary" />
        <Tab label="Highlights" />
      </Tabs>

      {/* Render tab content conditionally based on selected tab */}
      {value === 0 && (
        <SummaryComponent
          lectureId={lectureId}
          isDarkMode={isDarkMode}
          isEdit={isEdit}
        />
      )}
      {value === 1 && (
        <HighlightsComponent lectureId={lectureId} isDarkMode={isDarkMode} />
      )}
    </Box>
  );
};

export default LectureOverview;
