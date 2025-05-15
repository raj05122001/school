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
  CircularProgress,
} from "@mui/material";
import { FaPhotoVideo, FaFileAudio, FaRegFileVideo } from "react-icons/fa";
import { MdClose, MdDescription } from "react-icons/md";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import FilePreview from "./FilePreview";
import {
  submitMOLAssignment,
  getStudentAssignmentComment,
  getAnswerStatus,
  reSubmitAssignment,
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
import { BASE_URL_MEET } from "@/constants/apiconfig";
import { BsDownload } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import AssignmentTextFormat from "@/commonComponents/TextWithMath/AssignmentTextFormat";
import usePresignedUrl from "@/hooks/usePresignedUrl";
import useFileUploader from "@/hooks/usefileUploader";
import AIFeedback from "./AIFeedback";

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
  answered_by,
  dispatch,
  isDarkMode,
  isSubmitted,
  fetchAssignmentAnswer,
  assignmentType,
  isSubmit,
  marksObtained,
  teacherComments,
  fetchAssignments,
}) => {
  const { fetchPresignedUrl } = usePresignedUrl();
  const { uploadVideoToS3, uploadProgress } = useFileUploader();

  const [openAccordian, setOpenAccordian] = useState(false);
  const [answerDescription, setAnswerDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState({});
  const excludedTypes = ["VIDEO", "AUDIO", "IMAGE", "LINK"];
  const [assignmentStatus, setAssignmentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [s3Location, setS3Location] = useState("");
  const shouldRenderAccordion =
    assignmentStatus === "data-found" &&
    !excludedTypes.includes(assignmentType);

  const fetchAssessmentResult = async () => {
    setLoading(true);
    try {
      const response = await getStudentAssignmentComment(
        assignment?.id,
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
    fetchAssessmentResult();
  }, [isSubmitted]);

  const handleFileSelect = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setFileType(type);

    try {
      const fileConfigs = {
        IMAGE: {
          Key: `assignment/lecture_${assignment.id}/images/`,
          ContentType: file.type,
        },
        VIDEO: {
          Key: `assignment/lecture_${assignment.id}/videos/`,
          ContentType: file.type,
        },
        AUDIO: {
          Key: `assignment/lecture_${assignment.id}/audios/`,
          ContentType: file.type,
        },
        FILE: {
          Key: `assignment/lecture_${assignment.id}/documents/`,
          ContentType: file.type,
        },
      };

      const data = {
        file_name: file.name,
        file_type: fileConfigs[type]?.ContentType,
        operation: "upload",
        folder: fileConfigs[type]?.Key,
      };

      const signedUrl = await fetchPresignedUrl(data);

      const xhr = await uploadVideoToS3(file, signedUrl);
      const responseURL = xhr?.responseURL?.split("?")[0];

      setS3Location(responseURL);

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

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await getAnswerStatus(assignment?.id);
      setAssignmentStatus(response?.data?.data?.message);
    } catch (error) {
      console.error("Error Fetching Status", error);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileType("");
    dispatch({ type: "REMOVE_FILE_LINK", payload: assignment.id });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          message: "Please upload a file before submitting your assignment.",
          severity: "error",
        },
      });
      return;
    }
    setSubmitting(true);
    try {
      const formData = {
        assignment_que: assignment.id,
        answer_by: answered_by,
        answer_link: selectedFile ? s3Location : null,
        answer_description: answerDescription || null,
        answer_type: fileType,
      };
      const submitResponse = await submitMOLAssignment(formData);
      fetchAssignments();
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
        fetchAssessmentResult();
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

  const handleReSubmit = async () => {
    if (!selectedFile) {
      dispatch({
        type: "SHOW_SNACKBAR",
        payload: {
          message: "Please upload a file before resubmitting your assignment.",
          severity: "error",
        },
      });
      return;
    }
    setSubmitting(true);
    try {
      const formData = {
        is_submitted: true,
        answer_link: selectedFile ? s3Location : null,
      };
      const submitResponse = await reSubmitAssignment(assignment?.id, formData);
      if (submitResponse.data.success) {
        dispatch({ type: "SET_SUBMITTED", payload: assignment.id });
        dispatch({
          type: "SHOW_SNACKBAR",
          payload: {
            message: "Assignment re-submitted successfully!",
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

  const getFileName = (path = "") => {
    const pathSplited = path?.split("/");
    return pathSplited?.pop();
  };

  const downloadFile = (path) => {
    const downloadPath = path?.startsWith("http")
      ? path
      : `${BASE_URL_MEET}${path}`;
    const link = document?.createElement("a");
    link.href = downloadPath;
    link.target = "_blank";
    link.download = getFileName(path);
    document.body.appendChild(link);
    link.click();
    document?.body?.removeChild(link);
  };
  return (
    <>
      {openAccordian ? (
        <Box
          sx={{
            mb: 4,
            display: "flex",
            // position: "relative",
            borderRadius: 2,
            flexDirection: "column",
            // backgroundColor:
            //   isSubmit === true
            //     ? "#ACE1AF"
            //     : shouldRenderAccordion
            //     ? "#e8e2c3"
            //     : "#ffe0e0",
            // boxShadow:
            //   isSubmit === true
            //     ? "0px 2px 10px #38ba47"
            //     : shouldRenderAccordion
            //     ? "0px 2px 10px #151bb3"
            //     : "0px 2px 10px #ba5038",
            justifyContent: "space-between",
            border: "1px solid #000000",
          }}
        >
          {/* <label
            style={{
              position: "absolute",
              backgroundColor: "red",
              color: "white",
              top: "-10px",
              right: "10px",
              backgroundColor:
                isSubmit === true
                  ? "#38ba47"
                  : shouldRenderAccordion
                  ? "#494ee9"
                  : "#ba5038",
              color: "white",
              width: "150px",
              textAlign: "center",
              height: "30px",
              padding: "6px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {isSubmit === true
              ? "Fully Submitted"
              : shouldRenderAccordion
              ? "Re-submit to Teacher"
              : "Not Attempted"}
          </label> */}
          <Box
            sx={{
              backgroundColor:
                isSubmit === true
                  ? " #16AA54"
                  : shouldRenderAccordion
                  ? " #0088FE"
                  : " #FF3B30",
              p: 1,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Question {String.fromCharCode(65 + index)}.&nbsp;
            </Typography>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                display: "flex",
                // padding: "8px 12px",
                alignItems: "center",
                gap: "6px",
                alignSelf: "stretch",
              }}
            >
              <IconButton onClick={() => setOpenAccordian(false)}>
                <IoIosArrowUp
                  style={{ color: isDarkMode ? "#fff" : "#000000" }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box mt={0.3} sx={{ p: 1 }}>
            <AssignmentTextFormat text={assignment.assignment_text} />
          </Box>

          {/* <hr /> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              p: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "8px 14px",
                alignItems: "center",
                gap: "6px",
                alignSelf: "stretch",
                borderRadius: "6px",
                backgroundColor: "#174321",
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  leadingTrim: "both",
                  textEdge: "cap",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                Total Marks: {assignment.assignment_mark}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {assignment.assignment_attachment && (
                <Button
                  variant="contained"
                  startIcon={<BsDownload style={{ padding: 1 }} />}
                  sx={{
                    color: isDarkMode ? "#fff" : "#000",
                    backgroundColor: isDarkMode ? "#507dba" : "#89CFF0",
                    p: 1,
                    fontSize: "12px",
                    ":hover": {
                      color: "#fff",
                    },
                  }}
                  onClick={() => downloadFile(assignment.assignment_attachment)}
                >
                  Download
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => !open && setOpen(true)}
                sx={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  // justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "stretch",
                  gap: "6px",
                  textTransform: "none",
                  borderRadius: "6px",
                  backgroundColor: "#090909",
                  "&:hover": {

                    backgroundColor: "#090909",

                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                  >
                    <path
                      d="M6.5 1.5V3.75"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 1.5V3.75"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.125 6.81641H15.875"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.9083 11.8262L12.2533 14.4812C12.1483 14.5862 12.0508 14.7812 12.0283 14.9237L11.8858 15.9363C11.8333 16.3038 12.0883 16.5588 12.4558 16.5063L13.4683 16.3638C13.6108 16.3413 13.8133 16.2437 13.9108 16.1387L16.5658 13.4838C17.0233 13.0263 17.2408 12.4938 16.5658 11.8188C15.8983 11.1513 15.3658 11.3687 14.9083 11.8262Z"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.5234 12.207C14.7484 13.017 15.3784 13.647 16.1884 13.872"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 16.5H6.5C3.875 16.5 2.75 15 2.75 12.75V6.375C2.75 4.125 3.875 2.625 6.5 2.625H12.5C15.125 2.625 16.25 4.125 16.25 6.375V9"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.49588 10.2734H9.50262"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.72244 10.2734H6.72918"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.72244 12.5234H6.72918"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Box>
                <Typography
                  sx={{
                    color: "#FFF",
                    leadingTrim: "both",
                    textEdge: "cap",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Need Guidance
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M6.4668 2.7193L10.8135 7.06596C11.3268 7.5793 11.3268 8.4193 10.8135 8.93263L6.4668 13.2793"
                      stroke="#EBEDF0"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Box>
              </Button>
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

          <Box sx={{ marginTop: 2 }}>
            {shouldRenderAccordion && (
              <AIFeedback assignment={assignment} answered_by={answered_by} />
            )}
          </Box>
          {isSubmit === false &&
            (uploadProgress === 100 || answerDescription ? (
              <Button
                variant="contained"
                color="primary"
                onClick={
                  assignmentStatus === "data-found"
                    ? handleReSubmit
                    : handleSubmit
                }
                sx={{ mt: 2 }}
                disabled={submitting || (!answerDescription && !selectedFile)}
              >
                {submitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            ) : (
              <Box position="relative" width="100%" sx={{ mt: 2, padding:"6px" }}>
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
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#10120f",
                      textAlign: "center",
                      padding: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {!selectedFile && !answerDescription
                      ? isSubmitted
                        ? "Please re-upload a file or enter a description to proceed for resubmitting."
                        : "Please upload a file or enter a description to proceed. (AI-assessment will only be done for documents)"
                      : uploadProgress < 100
                      ? `Uploading... ${Math.round(uploadProgress)}%`
                      : "Upload complete! You can now submit your assignment."}
                  </Typography>
                </Box>
              </Box>
            ))}

          {isSubmit === false && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Describe about your assignment here..."
              sx={{
                mb: 0.5,
                mt:0.5,
                p:1,
                "& .MuiOutlinedInput-root": {
                  color: isDarkMode ? "#fff" : "#000000",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: isDarkMode ? "#fff" : "#000000", // Alternative placeholder styling
                },
              }}
              onChange={(e) => setAnswerDescription(e.target.value)}
              disabled={isSubmit}
              value={answerDescription}
            />
          )}
          {isSubmit == -false && (
            <Typography sx={{ fontStyle: "italic", fontSize: "14px", p:1 }}>
              <i>*Please upload file(s) while giving description.</i>
            </Typography>
          )}

          {isSubmit === false && !selectedFile && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Image">
                <IconButton
                  color="primary"
                  component="label"
                  onChange={(e) => handleFileSelect(e, "IMAGE")}
                >
                  <FaPhotoVideo color="#16AA54" />
                  <input hidden accept="image/*" type="file" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Audio">
                <IconButton
                  color="primary"
                  component="label"
                  onChange={(e) => handleFileSelect(e, "AUDIO")}
                >
                  <FaFileAudio color="#16AA54" />
                  <input hidden accept="audio/*" type="file" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video">
                <IconButton
                  color="primary"
                  component="label"
                  onChange={(e) => handleFileSelect(e, "VIDEO")}
                >
                  <FaRegFileVideo color="#16AA54" />
                  <input hidden accept="video/*" type="file" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Document">
                <IconButton
                  color="primary"
                  component="label"
                  onChange={(e) => handleFileSelect(e, "FILE")}
                >
                  <MdDescription color="#16AA54" />
                  <input
                    hidden
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.pptx"
                    type="file"
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          {isSubmit === false && selectedFile && (
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
          {isSubmit === true &&
            teacherComments !== null &&
            marksObtained !== null && (
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
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: isDarkMode ? "#f0f1f2" : "#282929",
                      }}
                    >
                      Teacher Assessed Result
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <GrScorecard style={{ marginRight: "4px" }} />
                    <strong>Marks Scored:</strong> {marksObtained}/
                    {assignment?.assignment_mark}
                  </Typography>
                  {marksObtained !== undefined &&
                    assignment?.assignment_mark && (
                      <ColorLinearProgress
                        variant="determinate"
                        sx={{ height: "6px" }}
                        value={
                          (marksObtained / assignment?.assignment_mark) * 100
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
                  <AssignmentTextFormat text={teacherComments} />
                </AccordionDetails>
              </Accordion>
            )}
        </Box>
      ) : (
        <Box
          sx={{
            // position: "relative",
            mb: 4,
            display: "flex",
            borderRadius: 2,
            flexDirection: "column",
            // boxShadow:
            //   isSubmit === true
            //     ? "0px 2px 10px #38ba47"
            //     : shouldRenderAccordion
            //     ? "0px 2px 10px #151bb3"
            //     : "0px 2px 10px #ba5038",
            // pl: 2,
            justifyContent: "space-between",
            border: "1px solid #000000",
          }}
          onClick={() => setOpenAccordian(true)}
        >
          {/* <label
            style={{
              position: "absolute",
              color: "white",
              top: "-10px",
              right: "10px",
              backgroundColor:
                isSubmit === true
                  ? "#38ba47"
                  : shouldRenderAccordion
                  ? "#494ee9"
                  : "#ba5038",
              color: "white",
              width:"150px",
              textAlign:"center",
              height:"30px",
              padding: "6px 6px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {isSubmit === true
              ? "Fully Submitted"
              : shouldRenderAccordion
              ? "Re-submit to Teacher"
              : "Not Attempted"}
          </label> */}
          <Box
            sx={{
              backgroundColor:
                isSubmit === true
                  ? " #16AA54"
                  : shouldRenderAccordion
                  ? " #0088FE"
                  : " #FF3B30",
              p: 1,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Question {String.fromCharCode(65 + index)}.&nbsp;
            </Typography>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "6px",
                display: "flex",
                // padding: "8px 12px",
                alignItems: "center",
                gap: "6px",
                alignSelf: "stretch",
              }}
            >
              <IconButton>
                <IoIosArrowDown
                  style={{ color: isDarkMode ? "#fff" : "#000000" }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box mt={0.3} sx={{ p: 1 }}>
            <AssignmentTextFormat
              text={
                assignment.assignment_text?.length > 200
                  ? `${assignment.assignment_text?.slice(0, 200)}...`
                  : assignment.assignment_text
              }
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AssignmentItem;

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 64,
  borderRadius: 8,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#DAEDD5", // Light blue for light mode
    ...theme.applyStyles("dark", {
      backgroundColor: "#003366", // Navy blue for dark mode
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
