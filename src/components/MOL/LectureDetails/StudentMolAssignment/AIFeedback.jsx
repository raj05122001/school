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
import { textAlign } from "@mui/system";

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

const AIFeedback = ({ assignment, answered_by, totalMarks }) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let pollingInterval = null;
    const pollAssessmentResult = async () => {
      setLoading(true);
      try {
        const response = await getStudentAssignmentComment(
          assignment?.id,
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
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "18.712px",
  };

  const AIFeedbackTextStyle = {
    color: "#3D3D3D",
    fontFeatureSettings: "'liga' off, 'clig' off",
    fontFamily: "Aptos",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "18.712px",
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
        <Box sx={{ marginY: 2 }}>
          {data?.plagiarism_detection_result && (
            <Box
              sx={{
                backgroundColor: "#fff",
                color: "#4A0033",
                borderRadius: 4,
                padding: "4px",
                border: "0.568px solid #E0E0E0",
                fontSize: "15px",
                p: 2,
                display:"flex",
                flexDirection:"column",
                gap:'6px'
              }}
            >
              <Typography sx={{ textAlign: "center", ...AIFeedbackTitleStyle }}>
                <VscWarning style={{ marginRight: 4 }} />
                Plagiarism Detection Result
              </Typography>
              {data?.plagiarism_detection_result?.title && (
                <Typography sx={AIFeedbackTextStyle}>
                  Title: {data?.plagiarism_detection_result?.title}
                </Typography>
              )}
              <Box sx={{display:"flex", gap:"8px", justifyContent:"space-around", marginTop: 1}}>
                {data?.plagiarism_detection_result?.detection_probability && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    justifyContent:"center",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <CircularProgressWithLabel
                      value={
                        data?.plagiarism_detection_result?.detection_probability
                      }
                    />
                  </Box>
                  <Typography sx={AIFeedbackTextStyle}>
                    Detection Probability
                  </Typography>
                </Box>
              )}
              {data?.plagiarism_detection_result?.human_percentage_detected && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    justifyContent:"center",
                    alignItems: "center",
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
              {data?.plagiarism_detection_result?.ai_percentage_detected && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    justifyContent:"center",
                    alignItems: "center",
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
              {data?.plagiarism_detection_result?.plagiarism_score && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    justifyContent:"center",
                    alignItems: "center",
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
                  Plagiarism Score:
                </Typography>
                </Box>
              )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", mt:1, gap:"8px" }}>
            {data?.overall_feedback && (
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    color: "#1d1924",
                    borderRadius: 4,
                    padding: 4,
                    // backdropFilter: "blur(10px)",
                    // boxShadow: "0px 2px 8px #1389f0",
                    border: "0.568px solid #E0E0E0",
                    fontSize: "12px",
                    display:"flex",
                    flexDirection:"column",
                    gap:"4px",
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
                    padding: 4,
                    borderRadius: 4,
                    // boxShadow: "0px 4px 10px #21ed21",
                    border: "0.568px solid #E0E0E0",
                    fontSize: "12px",
                    display:"flex",
                    flexDirection:"column",
                    gap:"4px",
                  }}
                >

                <Typography sx={AIFeedbackTitleStyle}>
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Feedback Points
                </Typography>
                  <ul style={{ lineHeight: "0.8" }}>
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
                    padding: 4,
                    borderRadius: 4,
                    // boxShadow: "0px 4px 10px #a1865d",
                    border: "0.568px solid #E0E0E0",
                    fontSize: "15px",
                    display:"flex",
                    flexDirection:"column",
                    gap:"4px",
                  }}
                >
                <Typography sx={AIFeedbackTitleStyle}>
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Improvement Points
                </Typography>
                  <ul style={{ lineHeight: "0.8" }}>
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
        padding: "12px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: "red",
          width: "100%",
          borderRadius: "6px",
          p: 1,
          backgroundColor: "#174321",
          color: "#fff",
        }}
      >
        <GiBullseye style={{ marginRight: 3, fontSize: "24px" }} />
        <Typography
          sx={{
            color: "#FFF",
            // leadingTrim: "both",
            // textEdge: "cap",
            fontFamily: "Inter",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "19px",
            letterSpacing: "0.32px",
          }}
        >
          AI Assessed Result
          <br />
          <i style={{ fontSize: "12px", fontWeight: 400 }}>
            (This is an AI based result for your imporvement. The final score
            will be provided by the teacher post resubmission.)
          </i>
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : result?.data?.assessment_status === "STARTED" ? (
          <Typography
            sx={{ fontStyle: "italic", color: "#8a6d3b", fontSize: "16px" }}
          >
            AI Assessed Result is under processing...
          </Typography>
        ) : result?.data?.assessment_status === "FAILED" ? (
          <Typography sx={{ color: "#a94442", fontSize: "16px" }}>
            AI ASSESSED Result failed.
          </Typography>
        ) : (
          <>
            <Typography
              sx={{
                marginTop: 2,
                color: "#3D3D3D",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Aptos",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "19px",
                marginBottom: "2px",
              }}
            >
              <GrScorecard style={{ marginRight: "4px" }} />
              <strong>Marks Scored:</strong>
              <span style={{ fontSize: "20px", marginLeft: "4px" }}>
                {result?.data?.score}/{assignment.assignment_mark}
              </span>
            </Typography>
            {result?.data?.score !== undefined &&
              assignment.assignment_mark && (
                <ColorLinearProgress
                  variant="determinate"
                  sx={{ height: "6px" }}
                  value={
                    (result?.data?.score / assignment.assignment_mark) * 100
                  }
                />
              )}
            {/* <Typography
              sx={{
                marginTop: 2,
                color: "#3D3D3D",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Aptos",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "19px",
                marginBottom: "2px",
              }}
            >
              <strong>
                <PiChalkboardTeacher style={{ marginRight: "4px" }} />
                Comments
              </strong>
              <br />
            </Typography> */}
            {jsonData(result?.data?.comment)}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AIFeedback;
