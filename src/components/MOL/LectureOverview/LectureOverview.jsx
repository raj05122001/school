import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getLectureAudio } from "@/api/apiHelper";
import SummaryComponent from "./SummaryComponent";
import HighlightsComponent from "./HighlightsComponent";
import { useThemeContext } from "@/hooks/ThemeContext";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import { BASE_URL } from "@/constants/apiconfig";
import { FaVolumeUp } from "react-icons/fa";

const window = global?.window || {};

const LectureOverview = ({
  lectureId,
  isEdit = false,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const [value, setValue] = useState(0);
  const { isDarkMode } = useThemeContext();
  const [userDetails, setUserDetails] = useState(null);
  const [audioUrl, setAudioUrl] = useState({
    highlight: "",
    summary: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
    fetchAudio();
  }, [lectureId]);

  const fetchAudio = async () => {
    try {
      const response = await getLectureAudio(lectureId);
      console.log("audio response : ", response);
      const { highlight_audio_path, summary_audio_path } = response.data;
      const summary_audio = summary_audio_path?.replace("/edutech", BASE_URL);
      const highlight_audio = highlight_audio_path?.replace(
        "/edutech",
        BASE_URL
      );

      setAudioUrl({
        highlight: highlight_audio,
        summary: summary_audio,
      });
    } catch (error) {
      console.error(error);
    }
  };

  console.log("audioUrl : ",audioUrl)

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
        audioUrl={audioUrl?.summary}
      />
    ),
    [marksData, lectureId, isDarkMode, audioUrl?.summary]
  );

  const highlightsComponent = useMemo(
    () => (
      <HighlightsComponent
        lectureId={lectureId}
        isDarkMode={isDarkMode}
        marksData={marksData}
        isStudent={isStudent}
        setMarksData={setMarksData}
        audioUrl={audioUrl?.highlight}
      />
    ),
    [marksData, lectureId, isDarkMode, audioUrl?.highlight]
  );

  return (
    <Box
      sx={{
        alignSelf: "stretch",
        borderRadius: "0px 0px 16px 16px",
        background: "#fff",
        borderRadius: "16px",
        maxHeight: 680,
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

            padding: "8px 16px 8px 20px",
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

      {audioUrl?.highlight && value === 1 && (
              <Box
                sx={{
                  // mb: 2,
                  p: 2,
                  backgroundColor: "#fff",
                  borderBottomLeftRadius:"16px",
                  borderBottomRightRadius:"16px",
                  // border: "1px solid #e9ecef",
                  borderTop: "1px solid #e9ecef"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <FaVolumeUp size={16} color="#666" />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Highlight Audio
                  </Typography>
                </Box>
                <audio
                  controls
                  style={{
                    width: "100%",
                    height: "35px",
                  }}
                  preload="metadata"
                >
                  <source src={audioUrl?.highlight} type="audio/mpeg" />
                  <source src={audioUrl?.highlight} type="audio/wav" />
                  <source src={audioUrl?.highlight} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}

                  {audioUrl?.summary && value === 0 && (
              <Box
                sx={{
                  // mb: 2,
                  p: 2,
                  backgroundColor: "#fff",
                  borderBottomLeftRadius:"16px",
                  borderBottomRightRadius:"16px",
                  // border: "1px solid #e9ecef",
                  borderTop: "1px solid #e9ecef"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <FaVolumeUp size={16} color="#666" />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Summary Audio
                  </Typography>
                </Box>
                <audio
                  controls
                  style={{
                    width: "100%",
                    height: "35px",
                  }}
                  preload="metadata"
                >
                  <source src={audioUrl?.summary} type="audio/mpeg" />
                  <source src={audioUrl?.summary} type="audio/wav" />
                  <source src={audioUrl?.summary} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
    </Box>
  );
};

export default LectureOverview;
