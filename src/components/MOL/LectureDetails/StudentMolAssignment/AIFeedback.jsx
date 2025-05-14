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

  const jsonData = (value) => {
    try {
      const data = value ? JSON.parse(value) : value;
      return (
        <>
          {data?.plagiarism_detection_result && (
            <>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginTop: 2,
                  marginBottom: 2,
                  textAlign: "center",
                  color: "#831843",
                  fontFamily: "Inter",
                }}
              >
                <VscWarning style={{ marginRight: 4 }} />
                Plagiarism Detection Result
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#FFF0F5",
                  color: "#4A0033",
                  padding: 4,
                  borderRadius: 4,
                  boxShadow: "0px 2px 8px #f084bc",
                  fontSize: "15px",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {data.plagiarism_detection_result.title}
                </Typography>
                <Typography>
                  <strong>Detection Probability:</strong>{" "}
                  {data.plagiarism_detection_result.detection_probability}%
                </Typography>
                <Typography>
                  <strong>Human-Like Content:</strong>{" "}
                  {data.plagiarism_detection_result.human_percentage_detected}%
                </Typography>
                <Typography>
                  <strong>AI-Like Content:</strong>{" "}
                  {data.plagiarism_detection_result.ai_percentage_detected}%
                </Typography>
              </Box>
            </>
          )}

          <Box sx={{ display: "flex" }}>
            {data?.overall_feedback && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    marginBottom: 2,
                    textAlign: "center",
                    color: "#04052e",
                    fontFamily: "Inter",
                    marginTop: 2,
                  }}
                >
                  <VscFeedback style={{ marginRight: 4 }} />
                  Overall Feedback
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#E0F0FE",
                    color: "#1d1924",
                    padding: 4,
                    borderRadius: 4,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 2px 8px #1389f0",
                    fontSize: "15px",
                  }}
                >
                  <AssignmentTextFormat text={data?.overall_feedback} />
                </Box>
              </Box>
            )}
            {data?.feedback_points?.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    marginTop: 4,
                    textAlign: "center",
                    marginBottom: 2,
                    color: "#04052e",
                    fontFamily: "Inter",
                  }}
                >
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Feedback Points
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#edfced",
                    color: "#174d17",
                    padding: 4,
                    borderRadius: 4,
                    boxShadow: "0px 4px 10px #21ed21",
                    fontSize: "15px",
                  }}
                >
                  <ul style={{ lineHeight: "1.8" }}>
                    {data?.feedback_points?.map((point, index) => (
                      <li key={index}>
                        <AssignmentTextFormat text={point} />
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}
            {data?.improvement_points?.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    marginTop: 4,
                    textAlign: "center",
                    marginBottom: 2,
                    color: "#04052e",
                    fontFamily: "Inter",
                  }}
                >
                  <VscActivateBreakpoints style={{ marginRight: 4 }} />
                  Improvement Points
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#EADDCA",
                    color: "#4A0404",
                    padding: 4,
                    borderRadius: 4,
                    boxShadow: "0px 4px 10px #a1865d",
                    fontSize: "15px",
                  }}
                >
                  <ul style={{ lineHeight: "1.8" }}>
                    {data?.improvement_points?.map((point, index) => (
                      <li key={index}>
                        <AssignmentTextFormat text={point} />
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}
          </Box>
        </>
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
      <Box sx={{ display: "flex", backgroundColor:"red", width:"100%", borderRadius:"6px", p:1, backgroundColor:"#174321", color:"#fff" }}>
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
                  letterSpacing: "0.32px"
                }}
        >
          AI Assessed Result
          <br />
          <i style={{ fontSize: "12px", fontWeight:400 }}>
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
            <Typography>
              <GrScorecard style={{ marginRight: "4px" }} />
              <strong>Marks Scored:</strong> {result?.data?.score}/
              {assignment.assignment_mark}
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
            <Typography
              variant="subtitle1"
              sx={{ marginTop: 2, fontSize: "18px" }}
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

export default AIFeedback;
