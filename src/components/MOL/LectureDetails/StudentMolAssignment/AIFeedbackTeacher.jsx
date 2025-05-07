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
import { VscActivateBreakpoints, VscFeedback } from "react-icons/vsc";
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

  const fetchAssessmentResultTeacher = async () => {
    setLoading(true);
    try {
      const response = await getStudentAssignmentComment(
        assignment?.assignment_que?.id,
        answered_by
      );
      const data = response?.data;
      setResult(data); // Store parsed data
    } catch (error) {
      console.error("Error fetching result", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentResultTeacher();
  }, []);

  const jsonData = (value) => {
    try {
      const data = value ? JSON.parse(value) : value;
      return (
        <>
          {data?.overall_feedback && (
            <>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "18px",
                  marginBottom: 2,
                  textAlign: "center",
                  color: "#04052e",
                }}
              >
                <VscFeedback style={{ marginRight: 4 }} />
                Overall Feedback
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#DAEDD5",
                  color: "#1d1924",
                  padding: 4,
                  borderRadius: 4,
                  //   backdropFilter: "blur(10px)",
                  //   boxShadow: "0px 2px 8px #DAEDD5",
                  border: "1px solid #16AA54",
                  fontSize: "15px",
                }}
              >
                <AssignmentTextFormat text={data?.overall_feedback} />
              </Box>
            </>
          )}
          {data?.feedback_points?.length > 0 && (
            <>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "18px",
                  marginTop: 4,
                  textAlign: "center",
                  marginBottom: 2,
                  color: "#04052e",
                }}
              >
                <VscActivateBreakpoints style={{ marginRight: 4 }} />
                Feedback Points
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#DAEDD5",
                  color: "#174d17",
                  padding: 4,
                  borderRadius: 4,
                  //   boxShadow: "0px 4px 10px #21ed21",
                  border: "1px solid #16AA54",
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
            </>
          )}
          {data?.improvement_points?.length > 0 && (
            <>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "18px",
                  marginTop: 4,
                  textAlign: "center",
                  marginBottom: 2,
                  color: "#04052e",
                }}
              >
                <VscActivateBreakpoints style={{ marginRight: 4 }} />
                Improvement Points
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#DAEDD5",
                  color: "#4A0404",
                  padding: 4,
                  borderRadius: 4,
                  //   boxShadow: "0px 4px 10px #a1865d",
                  border: "1px solid #16AA54",
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
            </>
          )}
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
    <Box>
      <Accordion
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          p: 1,
          mt: 1,
          borderRadius: "12px !important",
          boxShadow: "0px 4px 10px rgb(173, 255, 182)",
        }}
      >
        <AccordionSummary
          expandIcon={<FaAngleDown />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Box sx={{ display: "flex" }}>
            <GiBullseye style={{ marginRight: 3, fontSize: "24px" }} />
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                color: "#282929",
              }}
            >
              AI assessed result
              <br />
              <i style={{ fontSize: "12px" }}>
                (This is an AI based result for your imporvement. The final
                score will be provided by the teacher post resubmission.)
              </i>
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography>
                <GrScorecard style={{ marginRight: "4px" }} />
                <strong>Marks Scored:</strong> {result?.data?.score}/
                {totalMarks}
              </Typography>
              {result?.data?.score !== undefined &&
                totalMarks && (
                  <ColorLinearProgress
                    variant="determinate"
                    sx={{ height: "6px" }}
                    value={
                      (result?.data?.score / totalMarks) * 100
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AIFeedbackTeacher;
