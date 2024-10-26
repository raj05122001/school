import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getLectureSummary, getLectureHighlights } from "@/api/apiHelper";
import LectureOverviewSkeleton from "./LectureOverviewSkeleton";

const LectureOverview = ({ isDarkMode }) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [decisions, setDecisions] = useState("");
  const [decisionId, setDecisionId] = useState(null);

  const fetchSummary = async () => {
    try {
      const summaryResponse = await getLectureSummary(lectureId);
      console.log("summaryResponse", summaryResponse)
      const summaryData = summaryResponse?.data?.data;
      console.log("Summary data is", summaryData)
      if (summaryData) {
        summaryData.summary_text = summaryData.summary_text;
        setSummary(summaryData);
        const jsonData = summaryData?.summary_text ? JSON.parse(summaryData?.summary_text) : ""
        setDocxData((prev) => ({ ...prev, "summary": jsonData }));
      }
    } catch (error) {
      console.error("Error fetching API response:", error);
    }
  };

  const fetchHighlight = async () => {
    try {
      const apiResponse = await getLectureHighlights(lectureId);
      const decisionData = apiResponse?.data?.data;
      console.log("Decision data is", decisionData)
      if (decisionData) {
        setDecisionId(decisionData.id);
        const parsedData = JSON.parse(decisionData.highlight_text) || [];
        const filteredData = parsedData.filter(section =>
          section.title !== "No title found" && section.keypoints.length > 0
        );
        setDecisions(filteredData);
        const jsonData = decisionData?.highlight_text ? JSON.parse(decisionData?.highlight_text) : ""
        setDocxData((prev) => ({ ...prev, "decisions": jsonData }));
      }
    } catch (error) {
      console.error("Error fetching meeting decision:", error);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchHighlight();
  }, []);

  console.log("SUmmary is", summary.summary_text)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{marginTop:"8px"}}>
    <Typography variant="h4" fontFamily={"Nunito"} sx={{bgcolor:"", borderRadius:"8px", padding: 2, color: isDarkMode ? "#F0EAD6": "#36454F"}}>
        <b>Lecture Overview</b> 
        <br/>
        <span style={{fontSize:"16px", color: isDarkMode ? "#F0EAD6": "#36454F"}}>(<i>The summary and highlights are AI-generated. Feel free to edit them as necessary</i>)</span>
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
            background: isDarkMode && "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
            backgroundImage: isDarkMode
              ? ""
              : "url('/TabBG2.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            padding: 1,
            borderRadius: "12px",
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
        <Box sx={{ p: 3, width: "100%", borderRadius:"8px", color: isDarkMode ? "#F0EAD6": "#36454F", background: isDarkMode ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)" : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)" }}>
          <Typography>
          {summary.summary_text ? (
                      <span className='text-sm'><TextWithMath text={stringToHtml(summary?.summary_text)} /></span>
                    ) : (
                      <p className="text-sm text-primary">No summary available.</p>
                    )}
          </Typography>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 3, width: "100%", color: isDarkMode ? "#F0EAD6": "#36454F", borderRadius:"8px", background: isDarkMode ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)" : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)" }}>
          <Typography variant="h6" fontWeight="bold">
            Key points
          </Typography>
          <ul>
            <li>The lecture started with an introduction to basic concepts.</li>
            <li>In-depth discussion on the main topic followed.</li>
            <li>Q&A session at the end to clarify doubts.</li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default LectureOverview;
