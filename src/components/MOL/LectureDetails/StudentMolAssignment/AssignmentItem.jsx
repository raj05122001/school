import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FaPhotoVideo, FaFileAudio, FaRegFileVideo } from "react-icons/fa";
import { MdClose, MdDescription } from "react-icons/md";
import { uploadToS3 } from "./uploadToS3";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import FilePreview from "./FilePreview";
import {
  submitMOLAssignment,
  getStudentAssignmentComment,
} from "@/api/apiHelper";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import NeedMoreGuide from "./NeedMoreGuide";
import { FaAngleDown } from "react-icons/fa";
import { GiBullseye } from "react-icons/gi";
import { GrScorecard } from "react-icons/gr";
import { PiChalkboardTeacher } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import { VscActivateBreakpoints } from "react-icons/vsc";

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

const AssignmentItem = ({
  assignment,
  index,
  s3,
  answered_by,
  dispatch,
  isDarkMode,
  isSubmitted,
  fetchAssignmentAnswer,
  assignmentType,
}) => {
  const [answerDescription, setAnswerDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({});
  const excludedTypes = ["VIDEO", "AUDIO", "IMAGE", "LINK"];
  const shouldRenderAccordion =
    isSubmitted && !excludedTypes.includes(assignmentType);

  console.log("Assignment type", assignmentType);

  const fetchAssessmentResult = async () => {
    try {
      const response = await getStudentAssignmentComment(
        assignment?.id,
        answered_by
      );
      const data = response?.data;
      setResult(data); // Store parsed data
    } catch (error) {
      console.error("Error fetching result", error);
    }
  };

  useEffect(() => {
    fetchAssessmentResult();
  }, [isSubmitted]);

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFileType(type);

    try {
      await uploadToS3(file, type, assignment.id, s3, setUploadProgress);
      dispatch({
        type: "SET_FILE_LINK",
        payload: { assignmentId: assignment.id, file, type },
      });
    } catch (err) {
      console.error("File upload error:", err);
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          message: "File upload failed. Please try again.",
          severity: "error",
        },
      });
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileType("");
    setUploadProgress(0);
    dispatch({ type: "REMOVE_FILE_LINK", payload: assignment.id });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = {
        assignment_que: assignment.id,
        answer_by: answered_by,
        answer_link: selectedFile ? selectedFile.s3Location : null,
        answer_description: answerDescription || null,
        answer_type: fileType,
      };
      const submitResponse = await submitMOLAssignment(formData);
      if (submitResponse.data.success) {
        dispatch({ type: "SET_SUBMITTED", payload: assignment.id });
        dispatch({
          type: "SHOW_SNACKBAR",
          payload: {
            message: "Assignment submitted successfully!",
            severity: "success",
          },
        });
        fetchAssignmentAnswer();
      } else {
        console.error("Error submitting assignment:", submitResponse.message);
        dispatch({
          type: "SHOW_SNACKBAR",
          payload: {
            message: "Error submitting assignment. Please try again.",
            severity: "error",
          },
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          message: "Submission failed. Please try again.",
          severity: "error",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const jsonData = (value) => {
    try {
      const data = value ? JSON.parse(value) : value;
      return (
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
              backgroundColor: "#E0F0FE",
              color: "#1d1924",
              padding: 4,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              boxShadow: "0px 2px 8px #1389f0",
              fontSize: "15px",
            }}
          >
            {data?.overall_feedback}
          </Box>
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
              backgroundColor: "#EADDCA",
              color: "#4A0404",
              padding: 4,
              borderRadius: 4,
              boxShadow: "0px 4px 10px #a1865d",
              fontSize: "15px",
            }}
          >
            <ul style={{ lineHeight: "1.8" }}>
              {data?.feedback_points?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </Box>
        </>
      );
    } catch (error) {
      return (
        <Typography variant="subtitle2" sx={{ fontSize: "15px" }}>
          {value}
        </Typography>
      );
    }
  };

  return (
    <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex" }}>
        <Typography variant="body1">
          {String.fromCharCode(65 + index)}.&nbsp;
        </Typography>
        <Box mt={0.3}>
          <TextWithMath text={assignment.assignment_text} />
          <Button onClick={() => !open && setOpen(true)}>Need Guidance</Button>
          {open ? (
            <NeedMoreGuide
              assignmentId={assignment.id}
              open={open}
              setOpen={setOpen}
            />
          ) : (
            ""
          )}
        </Box>
      </Box>
      <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
        Total Marks: {assignment.assignment_mark}
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        {shouldRenderAccordion && (
          <Accordion
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              p: 1,
              mt: 1,
              borderRadius: "12px !important",
              boxShadow: "0px 4px 10px #adc0ff",
            }}
          >
            <AccordionSummary
              expandIcon={<FaAngleDown />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Box sx={{ display: "flex" }}>
                <GiBullseye style={{ marginRight: 3, fontSize: "24px" }} />
                <Typography variant="body1" sx={{ fontSize: "16px" }}>
                  AI assessed result
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <GrScorecard style={{ marginRight: "4px" }} />
                <strong>Marks Scored:</strong> {result?.data?.score}/{assignment.assignment_mark}
              </Typography>
              {result?.data?.score !== undefined &&
                assignment.assignment_mark && (
                  <ColorLinearProgress
                    variant="determinate"
                    sx={{height:"6px"}}
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
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {!isSubmitted && (
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Describe your answer here..."
          sx={{ mt: 2, mb: 2 }}
          onChange={(e) => setAnswerDescription(e.target.value)}
          disabled={isSubmitted}
          value={answerDescription}
        />
      )}

      {!isSubmitted && !selectedFile && (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Image">
            <IconButton
              color="primary"
              component="label"
              onChange={(e) => handleFileSelect(e, "IMAGE")}
            >
              <FaPhotoVideo />
              <input hidden accept="image/*" type="file" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Audio">
            <IconButton
              color="primary"
              component="label"
              onChange={(e) => handleFileSelect(e, "AUDIO")}
            >
              <FaFileAudio />
              <input hidden accept="audio/*" type="file" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video">
            <IconButton
              color="primary"
              component="label"
              onChange={(e) => handleFileSelect(e, "VIDEO")}
            >
              <FaRegFileVideo />
              <input hidden accept="video/*" type="file" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Document">
            <IconButton
              color="primary"
              component="label"
              onChange={(e) => handleFileSelect(e, "FILE")}
            >
              <MdDescription />
              <input
                hidden
                accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                type="file"
              />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      {selectedFile && (
        <Box
          position="relative"
          display="inline-block"
          p={1}
          mt={1}
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            overflow: "hidden",
            backgroundColor: isDarkMode ? "#424242" : "#f5f5f5",
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FilePreview file={selectedFile} fileType={fileType} />

          <Tooltip title="Remove File">
            <IconButton
              size="small"
              color="error"
              onClick={removeSelectedFile}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <MdClose size={14} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {!isSubmitted &&
        (uploadProgress === 100 || answerDescription ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            disabled={submitting || (!answerDescription && !selectedFile)}
          >
            {submitting ? "Submitting..." : "Submit Assignment"}
          </Button>
        ) : (
          <Box position="relative" width="100%" sx={{ mt: 2 }}>
            <BorderLinearProgress
              variant="determinate"
              value={uploadProgress}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body1" color="textPrimary">
                {!selectedFile && !answerDescription
                  ? "Please upload a file or enter a description to proceed."
                  : uploadProgress < 100
                  ? `Uploading... ${Math.round(uploadProgress)}%`
                  : "Upload complete! You can now submit your assignment."}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default AssignmentItem;

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 36,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));
