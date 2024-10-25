import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import LectureOverviewSkeleton from "./LectureOverviewSkeleton";

const LectureOverview = ({ isDarkMode }) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay, e.g., fetching data
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
        <Box sx={{ p: 3, width: "100%", color: isDarkMode ? "#F0EAD6": "#36454F", background: !isDarkMode && "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)" }}>
          <Typography>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Typography>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ p: 3, width: "100%", color: isDarkMode ? "#F0EAD6": "#36454F", background: !isDarkMode && "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)" }}>
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
