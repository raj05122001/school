"use client";
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  CardMedia,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import { AiOutlineDownload } from "react-icons/ai";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { FaPenNib } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeTxt,
  BsFiletypeXls,
  BsFiletypePpt,
} from "react-icons/bs";
import dayjs from "dayjs";
import { useThemeContext } from "@/hooks/ThemeContext";
import { updateAssignment } from "@/api/apiHelper";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import AssignmentTextFormat from "@/commonComponents/TextWithMath/AssignmentTextFormat";
import usePresignedUrl from "@/hooks/usePresignedUrl";
import getFileIcon from "@/commonComponents/FileIcon/FileIcon";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import AIFeedback from "@/components/MOL/LectureDetails/StudentMolAssignment/AIFeedback";
import AIFeedbackTeacher from "@/components/MOL/LectureDetails/StudentMolAssignment/AIFeedbackTeacher";

const CheckAssignment = ({ assignment, index, fetchAssignmentAnswer }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  // === Local state for grading/commenting ===
  const [grades, setGrades] = useState(assignment?.marks_obtained || 0);
  const [comment, setComment] = useState(assignment?.comment_by_teacher || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Local state for expand/collapse ===
  const [open, setOpen] = useState(false);

  // === Local state for previewing the student’s submitted file ===
  // When the teacher clicks on “download” or the preview, we set selectedFile to a presigned URL
  const [selectedFile, setSelectedFile] = useState(null);

  // === New state: presigned URL of the student’s answer for inline rendering ===
  const [answerSignedUrl, setAnswerSignedUrl] = useState("");

  const { fetchPresignedUrl } = usePresignedUrl();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const answered_by = Number(assignment?.answer_by?.id);
  const isChecked = assignment?.is_checked || false;

  const getExtensionFromUrl = (url) => {
    try {
      const cleanUrl = url.split("?")[0];
      return cleanUrl.split(".").pop()?.toLowerCase();
    } catch {
      return "";
    }
  };

  const getFileColor = (url) => {
    const extension = getExtensionFromUrl(url);
    switch (extension) {
      case "pdf":
        return "#d32f2f";
      case "doc":
      case "docx":
        return "#1565c0";
      case "txt":
        return "#616161";
      case "xls":
      case "xlsx":
        return "#2e7d32";
      case "ppt":
      case "pptx":
        return "#e65100";
      default:
        return "#454545";
    }
  };

  // === Fetch presigned URL for the student's answer once assignment.answer_link is known ===
  useEffect(() => {
    async function fetchAnswerUrl() {
      if (!assignment?.answer_link) {
        setAnswerSignedUrl("");
        return;
      }

      try {
        const fileLink = assignment.answer_link;
        console.log("fileLink : ",fileLink)
        const keyPath = new URL(fileLink).pathname.slice(1);
        const decodeKey = decodeURIComponent(keyPath);
        const idx = decodeKey.lastIndexOf("/");
        const folder = decodeKey.substring(0, idx + 1);
        const fileName = decodeKey.substring(idx + 1);

        const data = {
          file_name: fileName,
          file_type: "",
          operation: "download",
          folder: folder,
        };

        const signed = await fetchPresignedUrl(data);
        setAnswerSignedUrl(signed?.presigned_url || "");
        console.log("signed?.presigned_url: ",signed?.presigned_url)
      } catch (err) {
        console.error("Error fetching answer URL:", err);
        setAnswerSignedUrl("");
      }
    }

    fetchAnswerUrl();
  }, [assignment.answer_link, fetchPresignedUrl]);

  // === When teacher clicks on a file icon to preview the submission ===
  const handleSelectFile = async (fileLink) => {
    try {
      const keyPath = new URL(fileLink).pathname.slice(1);
      const decodeKey = decodeURIComponent(keyPath);
      const idx = decodeKey.lastIndexOf("/");
      const folder = decodeKey.substring(0, idx + 1);
      const fileName = decodeKey.substring(idx + 1);

      const data = {
        file_name: fileName,
        file_type: "",
        operation: "download",
        folder: folder,
      };

      const signedUrl = await fetchPresignedUrl(data);
      setSelectedFile(signedUrl?.presigned_url || null);
    } catch (err) {
      console.error(err);
    }
  };

  // === Grade submission (or update) ===
  const handleGradeSubmission = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = {
        answer_by: assignment?.answer_by?.id,
        marks_obtained: Number(grades),
        comment_by_teacher: comment,
        is_checked: true,
      };
      await updateAssignment(assignment?.assignment_que?.id, formData);
      fetchAssignmentAnswer();
    } catch (e) {
      console.error(e);
      setError("Failed to submit grade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [assignment, grades, comment, fetchAssignmentAnswer]);

  // === Helper to strip query params and decode filename ===
  const replaceString = (value) => {
    try {
      const val = value.split("/");
      return decodeURIComponent(val[val.length - 1]);
    } catch {
      return value;
    }
  };

  // === Overlay that shows when “selectedFile” is set ===
  const renderFileOverlay = () => {
    if (!selectedFile) return null;
    const extension = getExtensionFromUrl(selectedFile);
    let content = null;

    if (extension === "pdf") {
      content = (
        <Box sx={{ height: "90%", width: "90%" }}>
          <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
            <Viewer
              fileUrl={selectedFile}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </Box>
      );
    } else if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)
    ) {
      content = (
        <Box sx={{ height: "90%", width: "90%" }}>
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              selectedFile
            )}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </Box>
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      content = (
        <Box
          component="img"
          src={selectedFile}
          alt="Preview"
          sx={{ maxHeight: "90%", maxWidth: "90%", borderRadius: 2 }}
        />
      );
    } else {
      content = (
        <Typography variant="h6" sx={{ color: "#fff" }}>
          <a href={selectedFile} download style={{ color: "#fff" }}>
            Download File
          </a>
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          position: "fixed",
          zIndex: 2000,
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          bgcolor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          p: 2,
        }}
      >
        <IconButton
          onClick={() => setSelectedFile(null)}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            color: "white",
            fontSize: "2rem",
            bgcolor: "rgba(0,0,0,0.4)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.6)",
            },
            width: 40,
            height: 40,
          }}
        >
          <span style={{ fontSize: "16px" }}>X</span>
        </IconButton>
        {content}
      </Box>
    );
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: isChecked
            ? "0px 2px 10px #38ba47"
            : "0px 2px 10px #ff9b85",
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
          mb: 3,
        }}
      >
        {/* === Header: Question number + icons + expand/collapse === */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            p: 2,
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
            >
              Question {index + 1}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: "#DCF9E8",
                borderRadius: "4px",
                padding: "4px",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <MdOutlineWatchLater color="#1F6F2C" />
              <Typography
                sx={{ fontWeight: 400, fontSize: "18px", color: "#1F6F2C" }}
              >
                {dayjs(assignment?.updated_at).format("DD-MM-YYYY")}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "#DCF9E8",
                borderRadius: "4px",
                padding: "4px",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <IoCalendarClearOutline color="#1F6F2C" />
              <Typography
                sx={{ fontWeight: 400, fontSize: "18px", color: "#1F6F2C" }}
              >
                {dayjs(assignment?.updated_at).format("hh:mm A")}
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "#174321",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                padding: "6px",
                gap: "6px",
              }}
            >
              <img
                src="/task-square.png"
                style={{ width: "18px", height: "18px" }}
              />
              <Typography
                sx={{ color: "white", fontWeight: 400, fontSize: "18px" }}
              >
                <i>Total Marks:</i>{" "}
                <span style={{ fontWeight: 600, color: "white" }}>
                  {assignment.assignment_que.assignment_mark}
                </span>
              </Typography>
            </Box>

            {open ? (
              <IconButton>
                <IoIosArrowUp />
              </IconButton>
            ) : (
              <IconButton>
                <IoIosArrowDown />
              </IconButton>
            )}
          </Box>
        </Box>

        {open ? (
          <CardContent sx={{ pt: 0 }}>
            <Divider sx={{ mb: 2 }} />

            {/* === Full question text === */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="body1"
                gutterBottom
                color={primaryColor}
                sx={{ fontWeight: 600 }}
              >
                <AssignmentTextFormat
                  text={assignment.assignment_que.assignment_text}
                />
              </Typography>
            </Box>

            {/* === Student Submission Section === */}
            <Box
              sx={{
                backgroundColor: "#DCF9E8",
                borderRadius: "12px",
                padding: "12px",
                mt: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={"bold"}
                sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
              >
                Submission
              </Typography>

              {assignment?.answer_description && (
                <Typography
                  variant="body1"
                  color={secondaryColor}
                  sx={{ mt: 2, lineHeight: 1.6 }}
                >
                  <strong style={{ color: primaryColor }}>Answer: </strong>
                  {assignment?.answer_description}
                </Typography>
              )}

              {/* === Inline rendering based on answer type === */}
              {assignment.answer_type === "IMAGE" && answerSignedUrl && (
                <CardMedia
                  component="img"
                  image={answerSignedUrl}
                  alt="Answer Image"
                  sx={{ height: 300, objectFit: "contain", mt: 2, borderRadius: 2 }}
                  onClick={() => handleSelectFile(assignment.answer_link)}
                />
              )}

              {assignment.answer_type === "VIDEO" && answerSignedUrl && (
                <CardMedia component="video" controls sx={{ height: 300, mt: 2 }}>
                  <source src={answerSignedUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </CardMedia>
              )}

              {assignment.answer_type === "AUDIO" && answerSignedUrl && (
                <Box mt={2}>
                  <AudioPlayer audio={answerSignedUrl} isShowBrekpoint={false} />
                </Box>
              )}

              {["IMAGE", "VIDEO", "AUDIO"].indexOf(assignment.answer_type) < 0 && assignment.answer_link && answerSignedUrl && (
                // Generic fallback for other files (PDF, DOCX, etc.)
                <Box
                  mt={2}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: isDarkMode ? "grey.700" : "divider",
                    borderRadius: "8px",
                    padding: "8px",
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "background.paper",
                    boxShadow: 2,
                    width: "287px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectFile(assignment.answer_link)}
                >
                  <Box>
                    {getFileIcon(assignment.answer_link, {
                      style: {
                        fontSize: "24px",
                        marginRight: "8px",
                        color: getFileColor(assignment.answer_link),
                      },
                    })}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? "#F9F6EE" : "text.primary",
                      fontWeight: 500,
                      wordBreak: "break-word",
                    }}
                  >
                    {replaceString(assignment.answer_link)}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* === AI Feedback (Teacher version) === */}
            <Box sx={{ marginTop: 1 }}>
              <AIFeedbackTeacher
                assignment={assignment}
                answered_by={answered_by}
                totalMarks={assignment.assignment_que.assignment_mark}
              />
            </Box>

            {/* === Grading & Comments Section === */}
            <Paper
              elevation={isDarkMode ? 3 : 0}
              sx={{
                mt: 4,
                p: "12px",
                borderRadius: "12px",
                backgroundColor: "#F3F5F7",
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#141514",
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    Marks Obtained
                  </Typography>
                  <Tooltip
                    title={
                      Number(grades) > assignment.assignment_que.assignment_mark
                        ? "Marks obtained should not exceed total marks"
                        : ""
                    }
                    open={
                      Number(grades) > assignment.assignment_que.assignment_mark
                    }
                    placement="bottom-start"
                    arrow
                  >
                    <TextField
                      hiddenLabel={true}
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={grades}
                      onChange={(e) => setGrades(e.target.value)}
                      InputLabelProps={{
                        style: {
                          color: isDarkMode ? "#d7e4fc" : "",
                          borderRadius: "12px",
                        },
                      }}
                      InputProps={{
                        sx: {
                          backdropFilter: "blur(10px)",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "12px",
                        },
                      }}
                    />
                  </Tooltip>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#141514",
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    Comments
                  </Typography>
                  <TextField
                    hiddenLabel={true}
                    variant="outlined"
                    multiline
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    InputLabelProps={{
                      style: {
                        color: isDarkMode ? "#d7e4fc" : "",
                        borderRadius: "12px",
                      },
                    }}
                    InputProps={{
                      sx: {
                        backdropFilter: "blur(10px)",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleGradeSubmission}
                  sx={{
                    mt: 3,
                    width: "fit-content",
                    backgroundColor: "#141514",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  aria-label="Submit Grade"
                  disabled={
                    (isChecked &&
                      comment === assignment?.comment_by_teacher &&
                      Number(grades) === Number(assignment?.marks_obtained)) ||
                    isLoading ||
                    (!comment && !grades)
                  }
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : isChecked ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>
            </Paper>
          </CardContent>
        ) : (
          <CardContent sx={{ pt: 0 }}>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => setOpen(true)}
            >
              <Typography
                variant="body1"
                gutterBottom
                color={primaryColor}
                sx={{ fontWeight: 600 }}
              >
                <AssignmentTextFormat
                  text={
                    assignment.assignment_que.assignment_text?.length > 200
                      ? `${assignment.assignment_que.assignment_text.slice(
                          0,
                          200
                        )}...`
                      : assignment.assignment_que.assignment_text
                  }
                />
              </Typography>
            </Box>
          </CardContent>
        )}
      </Card>

      {renderFileOverlay()}
    </>
  );
};

CheckAssignment.propTypes = {
  assignment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  fetchAssignmentAnswer: PropTypes.func.isRequired,
};

export default CheckAssignment;
