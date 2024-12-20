"use client";
import React, { useState, useCallback } from "react";
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
  Paper
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

const CheckAssignment = ({ assignment, index, fetchAssignmentAnswer }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [grades, setGrades] = useState(assignment?.marks_obtained || 0);
  const [comment, setComment] = useState(assignment?.comment_by_teacher || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const isChecked = assignment?.is_checked || false;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const getFileIcon = (url) => {
    const extension = url?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <BsFiletypePdf size={24} />;
      case "doc":
      case "docx":
        return <BsFiletypeDoc size={24} />;
      case "txt":
        return <BsFiletypeTxt size={24} />;
      case "xls":
      case "xlsx":
        return <BsFiletypeXls size={24} />;
      case "ppt":
      case "pptx":
        return <BsFiletypePpt size={24} />;
      default:
        return <AiOutlineDownload size={24} />;
    }
  };

  const getFileColor = (url) => {
    const extension = url?.split(".").pop()?.toLowerCase();
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
  }, [assignment, grades, comment]);

  const replaceString = (value) => {
    try {
      const val = value?.split("/");
      return decodeURIComponent(val?.[val?.length - 1]);
    } catch (error) {
      return value;
    }
  };

  const renderAnswerContent = useCallback(
    (assignment) => {
      const { answer_type, answer_link } = assignment;

      if (!answer_link) return null;

      if (answer_type === "IMAGE") {
        return (
          <CardMedia
            component="img"
            image={answer_link}
            alt="Answer Image"
            sx={{ height: 300, objectFit: "contain", mt: 2, borderRadius: 2 }}
            onClick={() => setSelectedFile(answer_link)}
          />
        );
      } else if (answer_type === "VIDEO") {
        return (
          <CardMedia component="video" controls sx={{ height: 300, mt: 2 }}>
          <source src={answer_link} type="video/mp4" />
          Your browser does not support the video tag.
        </CardMedia>
        );
      } else if (answer_type === "AUDIO") {
        return (
          <Box mt={2}>
            <AudioPlayer audio={answer_link} isShowBrekpoint={false} />
          </Box>
        );
      } else {
        // Generic fallback for files
        return (
          <Box
            mt={2}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              border: "1px solid",
              borderColor: isDarkMode ? "grey.700" : "divider",
              borderRadius: 2,
              padding: 2,
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "background.paper",
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.2)"
                  : "action.hover",
                cursor: "pointer",
              },
            }}
            onClick={() => setSelectedFile(answer_link)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                backgroundColor: getFileColor(answer_link),
                borderRadius: "50%",
                color: "white",
              }}
            >
              {getFileIcon(answer_link)}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "#F9F6EE" : "text.primary",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {replaceString(answer_link)}
            </Typography>
          </Box>
        );
      }
    },
    [getFileIcon, isDarkMode]
  );

  const renderFileOverlay = () => {
    if (!selectedFile) return null;

    const extension = selectedFile?.split(".").pop()?.toLowerCase();
    let content;

    if (extension === "pdf") {
      content = (
        <Box sx={{ height: "90%", width: "90%"}}>
          <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
            <Viewer fileUrl={selectedFile} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </Box>
      );
    } else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
      content = (
        <Box sx={{ height: "90%", width: "90%"}}>
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              selectedFile
            )}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
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
      // Unknown format - just show a link to download
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
          <span style={{fontSize:"16px"}}>X</span>
        </IconButton>
        {content}
      </Box>
    );
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: isChecked ? ("0px 2px 10px #38ba47"):("0px 2px 10px #ff9b85"),
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
          mb: 3,
        }}
      >
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
            <BiSolidRightArrowCircle size={24} color={primaryColor} />
            <Typography
              variant="h6"
              fontWeight={"bold"}
              sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
            >
              Question {index + 1}:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              sx={{
                fontSize: ".9rem",
                fontWeight: 500,
                color: isDarkMode ? "#e0e0e0" : "text.secondary",
              }}
            >
             <i>Submission Date:</i> {dayjs(assignment?.updated_at).format("DD-MM-YYYY hh:mm A")}
            </Typography>
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" gutterBottom color={primaryColor} sx={{ fontWeight: 600 }}>
                <TextWithMath text={assignment.assignment_que.assignment_text} />
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ color: isDarkMode ? "#F9F6EE" : "#353935", mt: 1 }}
            >
              <i>Total Marks:</i>{" "}
              <span style={{ fontWeight: 600, color: primaryColor }}>
                {assignment.assignment_que.assignment_mark}
              </span>
            </Typography>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              mt={3}
              sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
            >
              <FaPenNib style={{ marginRight: "4px" }} />
              Submission :
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

            {renderAnswerContent(assignment)}

            <Paper
              elevation={isDarkMode ? 3 : 0}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 2,
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>
                Grade & Comment
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Marks Obtained"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={grades}
                    onChange={(e) => setGrades(e.target.value)}
                    InputLabelProps={{
                      style: { color: isDarkMode ? "#d7e4fc" : "" },
                    }}
                    InputProps={{
                      sx: {
                        backdropFilter: "blur(10px)",
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0,0,0,0.05)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    label="Comment"
                    variant="outlined"
                    multiline
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    InputLabelProps={{
                      style: { color: isDarkMode ? "#d7e4fc" : "" },
                    }}
                    InputProps={{
                      sx: {
                        backdropFilter: "blur(10px)",
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0,0,0,0.05)",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={handleGradeSubmission}
                sx={{ mt: 3, width: "fit-content" }}
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
              <Typography variant="body1" gutterBottom color={primaryColor} sx={{ fontWeight: 600}}>
                <TextWithMath
                  text={
                    assignment.assignment_que.assignment_text?.length > 200
                      ? `${assignment.assignment_que.assignment_text?.slice(0, 200)}...`
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
