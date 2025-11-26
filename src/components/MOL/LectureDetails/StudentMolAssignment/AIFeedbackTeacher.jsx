import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  LinearProgress,
  linearProgressClasses,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { GiBullseye } from "react-icons/gi";
import { GrScorecard } from "react-icons/gr";
import { PiChalkboardTeacher } from "react-icons/pi";
import { styled } from "@mui/material/styles";
import AssignmentTextFormat from "@/commonComponents/TextWithMath/AssignmentTextFormat";
import {
  VscActivateBreakpoints,
  VscFeedback,
  VscWarning,
} from "react-icons/vsc";
import { getStudentAssignmentComment } from "@/api/apiHelper";

const ColorLinearProgress = styled(LinearProgress)(({ theme, value }) => {
  let color = "#FF0000"; // Default: Red for low scores
  if (value >= 75) {
    color = "#4CAF50"; // Green for high scores
  } else if (value >= 50) {
    color = "#FFEB3B"; // Yellow for mid-range scores
  }

  return {
    height: 10,
    borderRadius: 5,
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: color,
    },
  };
});

const AIFeedbackTeacher = ({ assignment, answered_by, totalMarks }) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  // const fetchAssessmentResultTeacher = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getStudentAssignmentComment(
  //       assignment?.assignment_que?.id,
  //       answered_by
  //     );
  //     const data = response?.data;
  //     setResult(data); // Store parsed data
  //   } catch (error) {
  //     console.error("Error fetching result", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    let pollingInterval = null;
    const pollAssessmentResult = async () => {
      setLoading(true);
      try {
        const response = await getStudentAssignmentComment(
          assignment?.assignment_que?.id,
          answered_by
        );
        const data = response?.data;
        setResult(data); // Store parsed data
        if (data?.assessment_status !== "STARTED") {
          clearInterval(pollingInterval); // Stop polling when assessment is done
        }
      } catch (error) {
        console.error("Error fetching result", error);
      } finally {
        setLoading(false);
      }
    };
    pollAssessmentResult();
    pollingInterval = setInterval(pollAssessmentResult, 5000);
    return () => clearInterval(pollingInterval);
  }, []);

  const AIFeedbackTitleStyle = {
    color: "#3D3D3D",
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: "Aptos",
    fontSize: "clamp(14px, 3.2vw, 16px)",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "1.2",
  };

  const AIFeedbackTextStyle = {
    color: "#3D3D3D",
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: "Aptos",
    fontSize: "clamp(12px, 2.8vw, 14px)",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "1.3",
  };

  const jsonData = (value) => {
    function CircularProgressWithLabel({ value }) {
      return (
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={value}
            size={40}
            thickness={3}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography sx={{ fontSize: "12px", fontFamily: "Inter" }}>
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        </Box>
      );
    }

    try {
      const data = value ? JSON.parse(value) : value;
      return (
        <Box sx={{ my: 2, width: "100%" }}>
          {data?.plagiarism_detection_result && (
            <Box
              sx={{
                backgroundColor: "#fff",
                color: "#4A0033",
                borderRadius: 4,
                p: { xs: 1.5, sm: 2 },
                border: "0.568px solid #E0E0E0",
                fontSize: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  ...AIFeedbackTitleStyle,
                }}
              >
                <VscWarning style={{ marginRight: 4 }} />
                Plagiarism Detection Result
              </Typography>
              {data?.plagiarism_detection_result?.title && (
                <Typography sx={AIFeedbackTextStyle}>
                  Title: {data?.plagiarism_detection_result?.title}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 2, sm: 3 },
                  justifyContent: "space-around",
                  mt: 1,
                  width: "100%",
                }}
              >
                {data?.plagiarism_detection_result
                  ?.detection_probability !== undefined &&
                  data?.plagiarism_detection_result
                    ?.detection_probability !== null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "45%", sm: "auto" },
                      }}
                    >
                      <Box>
                        <CircularProgressWithLabel
                          value={
                            data?.plagiarism_detection_result
                              ?.detection_probability
                          }
                        />
                      </Box>
                      <Typography sx={AIFeedbackTextStyle}>
                        Detection Probability
                      </Typography>
                    </Box>
                  )}
                {data?.plagiarism_detection_result
                  ?.human_percentage_detected !== undefined &&
                  data?.plagiarism_detection_result
                    ?.human_percentage_detected !== null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "45%", sm: "auto" },
                      }}
                    >
                      <Box>
                        <CircularProgressWithLabel
                          value={
                            data?.plagiarism_detection_result
                              ?.human_percentage_detected
                          }
                        />
                      </Box>
                      <Typography sx={AIFeedbackTextStyle}>
                        Human-Like Content
                      </Typography>
                    </Box>
                  )}
                {data?.plagiarism_detection_result
                  ?.ai_percentage_detected !== undefined &&
                  data?.plagiarism_detection_result
                    ?.ai_percentage_detected !== null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "45%", sm: "auto" },
                      }}
                    >
                      <Box>
                        <CircularProgressWithLabel
                          value={
                            data?.plagiarism_detection_result
                              ?.ai_percentage_detected
                          }
                        />
                      </Box>
                      <Typography sx={AIFeedbackTextStyle}>
                        AI-Like Content:
                      </Typography>
                    </Box>
                  )}
                {data?.plagiarism_detection_result?.plagiarism_score !==
                  undefined &&
                  data?.plagiarism_detection_result?.plagiarism_score !==
                    null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: { xs: "45%", sm: "auto" },
                      }}
                    >
                      <Box>
                        <CircularProgressWithLabel
                          value={
                            data?.plagiarism_detection_result?.plagiarism_score
                          }
                        />
                      </Box>
                      <Typography sx={AIFeedbackTextStyle}>
                        Plagiarism Score
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              mt: 1,
              gap: { xs: 2, sm: 3 },
              width: "100%",
            }}
          >
            {data?.overall_feedback && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#1d1924",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                  border: "0.568px solid #E0E0E0",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                }}
              >
                <Typography sx={AIFeedbackTitleStyle}>
                  <VscFeedback style={{ marginRight: 4 }} />
                  Overall Feedback
                </Typography>
                <AssignmentTextFormat text={data?.overall_feedback} />
              </Box>
            )}
            {data?.feedback_points?.length > 0 && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#1d1924",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                  border: "0.568px solid #E0E0E0",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                }}
              >
                <Typography sx={AIFeedbackTitleStyle}>
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Feedback Points
                </Typography>
                <ul style={{ lineHeight: "1.2", paddingLeft: "18px" }}>
                  {data?.feedback_points?.map((point, index) => (
                    <li key={index}>
                      <AssignmentTextFormat text={point} />
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            {data?.improvement_points?.length > 0 && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#1d1924",
                  borderRadius: 4,
                  p: { xs: 1.5, sm: 2 },
                  border: "0.568px solid #E0E0E0",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                }}
              >
                <Typography sx={AIFeedbackTitleStyle}>
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Improvement Points
                </Typography>
                <ul style={{ lineHeight: "1.2", paddingLeft: "18px" }}>
                  {data?.improvement_points?.map((point, index) => (
                    <li key={index}>
                      <AssignmentTextFormat text={point} />
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        </Box>
      );
    } catch (error) {
      return (
        <Typography variant="subtitle2" sx={{ fontSize: "15px" }}>
          <AssignmentTextFormat text={value} />
        </Typography>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: { xs: 1, sm: 2 },
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        alignSelf: "stretch",
        width: "100%",
      }}
    >
      {/* Top green info bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          borderRadius: "10px",
          p: { xs: 1, sm: 1.5 },
          backgroundColor: "#174321",
          color: "#fff",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        <Box
          sx={{
            mr: { xs: 0, sm: 1 },
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <GiBullseye style={{ marginRight: 3, fontSize: "22px" }} />
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "#FFF",
            fontFamily: "Inter",
            fontSize: { xs: "13px", sm: "16px" },
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "1.3",
            letterSpacing: "0.32px",
          }}
        >
          AI assessed result
          <br />
          <i
            style={{
              fontSize: "11px",
              fontWeight: 400,
              opacity: 0.9,
              display: "block",
              marginTop: 2,
            }}
          >
            (This is an AI based result for your improvement. The final score
            will be provided by the teacher post resubmission.)
          </i>
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : result?.data?.assessment_status === "STARTED" ? (
          <Typography
            sx={{
              fontStyle: "italic",
              color: "#8a6d3b",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            AI Assessed Result is under processing...
          </Typography>
        ) : result?.data?.assessment_status === "FAILED" ? (
          <Typography sx={{ color: "#a94442", fontSize: { xs: "14px", sm: "16px" } }}>
            AI ASSESSED Result failed.
          </Typography>
        ) : (
          <>
            <Typography
              sx={{
                mt: 2,
                color: "#3D3D3D",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Aptos",
                fontSize: { xs: "14px", sm: "16px" },
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "19px",
                mb: "2px",
              }}
            >
              <GrScorecard style={{ marginRight: "4px" }} />
              <strong>Marks Scored:</strong>
              <span
                style={{
                  fontSize: "20px",
                  marginLeft: "4px",
                }}
              >
                {result?.data?.score}/{totalMarks}
              </span>
            </Typography>
            {result?.data?.score !== undefined && totalMarks && (
              <ColorLinearProgress
                variant="determinate"
                sx={{ height: "6px", width: "100%" }}
                value={(result?.data?.score / totalMarks) * 100}
              />
            )}
            <Typography
              sx={{
                mt: 2,
                color: "#3D3D3D",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Aptos",
                fontSize: { xs: "14px", sm: "16px" },
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "19px",
                mb: "2px",
              }}
            >
              <strong>
                <PiChalkboardTeacher style={{ marginRight: "4px" }} />
                Comments
              </strong>
              <br />
            </Typography>
            {jsonData(result?.data?.comment)}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AIFeedbackTeacher;
