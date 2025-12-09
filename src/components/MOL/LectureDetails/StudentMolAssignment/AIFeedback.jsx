import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  linearProgressClasses,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Divider
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
import MarkDownFormater from "@/components/formater/MarkDownFormater";
import { IoClose } from "react-icons/io5";

// ViewModel.jsx
import { BsCheckCircle, BsLightbulb, BsInfoCircle } from "react-icons/bs";

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

const AIFeedback = ({ assignment, answered_by, totalMarks, apiResult }) => {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);

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

        // yahan wahi condition rakhi jo aapka tha
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
                display: "flex",
                flexDirection: "column",
                gap: "6px",
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

              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "space-around",
                  marginTop: 1,
                }}
              >
                {data?.plagiarism_detection_result?.detection_probability !==
                  undefined &&
                  data?.plagiarism_detection_result?.detection_probability !==
                    null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
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

                {data?.plagiarism_detection_result?.ai_percentage_detected !==
                  undefined &&
                  data?.plagiarism_detection_result?.ai_percentage_detected !==
                    null && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        justifyContent: "center",
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

          <Box sx={{ display: "flex", mt: 1, gap: "8px", flexWrap: "wrap" }}>
            {data?.overall_feedback && (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  color: "#1d1924",
                  borderRadius: 4,
                  padding: 4,
                  border: "0.568px solid #E0E0E0",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                  minWidth: 0,
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
                  border: "0.568px solid #E0E0E0",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                  minWidth: 0,
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
                  border: "0.568px solid #E0E0E0",
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                  minWidth: 0,
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
          {apiResult?.message && apiResult?.message !== "Success" ? (
            <i style={{ fontSize: "12px", fontWeight: 400 }}>
              ({apiResult?.message})
            </i>
          ) : (
            <i style={{ fontSize: "12px", fontWeight: 400 }}>
              (This is an AI based result for your imporvement. The final score
              will be provided by the teacher post resubmission.)
            </i>
          )}
        </Typography>
      </Box>

      <Box sx={{width:"100%"}}>
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
            <Button
              variant="contained"
              sx={{
                background: "#174321",
                width: "100%",
                "&:hover": {
                  background: "#174321",   // SAME COLOR ON HOVER
                  opacity: 0.9,            // optional: slight hover effect
                },
              }}
              onClick={() => setOpenModel(true)}
            >
              AI Assessed Result
            </Button>

            <Dialog
              open={openModel}
              onClose={() => setOpenModel(false)}
              fullWidth
              maxWidth="md"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <DialogTitle>AI Assessed Result Details</DialogTitle>
                {/* Close button */}
                <IconButton
                  size="small"
                  onClick={() => setOpenModel(false)}
                  sx={{
                    m: 1,
                    borderRadius: "50%",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <IoClose size={16} />
                </IconButton>
              </Box>

              <DialogContent dividers>
                <ViewModel
                  result={result}
                  assignment={assignment}
                  jsonData={jsonData}
                  setOpenModel={setOpenModel}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AIFeedback;

const ViewModel = ({ result, assignment, jsonData, setOpenModel }) => {
  const score = result?.data?.score ?? 0;
  const totalMarks = assignment?.assignment_mark ?? 0;
  const rawComment = result?.data?.comment;

  // -------- try to parse JSON feedback --------
  let parsedFeedback = null;
  if (rawComment) {
    try {
      const maybeObj =
        typeof rawComment === "string" ? JSON.parse(rawComment) : rawComment;

      if (maybeObj && typeof maybeObj === "object") {
        parsedFeedback = {
          overall: maybeObj.overall_feedback,
          points: Array.isArray(maybeObj.feedback_points)
            ? maybeObj.feedback_points
            : [],
          improvements: Array.isArray(maybeObj.improvement_points)
            ? maybeObj.improvement_points
            : [],
        };
      }
    } catch (e) {
      // not JSON → ignore, we'll show raw markdown below
      parsedFeedback = null;
    }
  }

  return (
    <Box sx={{ mt: 1 }}>
      {/* Header row: Marks + Close button (agar chahiye toh yaha icon add kar sakte ho) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#3D3D3D",
            fontFamily: "Aptos",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
            mb: "2px",
          }}
        >
          <GrScorecard style={{ marginRight: 6 }} />
          Marks Scored:
          <span
            style={{
              fontSize: "20px",
              marginLeft: 6,
              fontWeight: 700,
            }}
          >
            {score}/{totalMarks}
          </span>
        </Typography>
      </Box>

      {totalMarks > 0 && (
        <ColorLinearProgress
          variant="determinate"
          sx={{ height: "6px", mt: 1, borderRadius: 999 }}
          value={(score / totalMarks) * 100}
        />
      )}

      {/* Feedback section */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "#F9FAFB",
          border: "1px solid #E5E7EB",
        }}
      >
        {parsedFeedback ? (
          <>
            {/* Overall feedback */}
            {parsedFeedback.overall && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<BsInfoCircle size={16} />}
                  label="Overall Feedback"
                  size="small"
                  sx={{
                    mb: 1,
                    bgcolor: "#EEF2FF",
                    color: "#1E1B4B",
                    fontWeight: 600,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#111827",
                    lineHeight: 1.6,
                  }}
                >
                  {parsedFeedback.overall}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1.5 }} />

            {/* Positive points */}
            {parsedFeedback.points?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<BsCheckCircle size={16} />}
                  label="What you did well"
                  size="small"
                  sx={{
                    mb: 1,
                    bgcolor: "#ECFDF5",
                    color: "#065F46",
                    fontWeight: 600,
                  }}
                />
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {parsedFeedback.points.map((p, idx) => (
                    <Typography
                      key={idx}
                      component="li"
                      sx={{
                        fontSize: 14,
                        color: "#111827",
                        lineHeight: 1.5,
                        mb: 0.5,
                      }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            {/* Improvement points */}
            {parsedFeedback.improvements?.length > 0 && (
              <Box>
                <Chip
                  icon={<BsLightbulb size={16} />}
                  label="How to improve"
                  size="small"
                  sx={{
                    mb: 1,
                    bgcolor: "#FEF3C7",
                    color: "#92400E",
                    fontWeight: 600,
                  }}
                />
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {parsedFeedback.improvements.map((p, idx) => (
                    <Typography
                      key={idx}
                      component="li"
                      sx={{
                        fontSize: 14,
                        color: "#111827",
                        lineHeight: 1.5,
                        mb: 0.5,
                      }}
                    >
                      {p}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </>
        ) : (
          // Fallback: comment JSON nahi hai to markdown jaisa hai vaisa dikhao
          <MarkDownFormater data={rawComment} />
        )}
      </Box>
    </Box>
  );
};

