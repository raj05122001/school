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
  Stack,
  CardMedia,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { AiOutlineDownload } from "react-icons/ai";
import { useThemeContext } from "@/hooks/ThemeContext";
import { updateAssignment, getStudentAssignmentComment } from "@/api/apiHelper";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { FaPenNib } from "react-icons/fa";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import dayjs from "dayjs";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";

const CheckAssignment = ({ assignment, index, fetchAssignmentAnswer }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [grades, setGrades] = useState(assignment?.marks_obtained || 0);
  const [comment, setComment] = useState(assignment?.comment_by_teacher || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({});
  const [open, setOpen] = useState(false);

  const isChecked = assignment?.is_checked || false;
  const answeredBy = assignment?.answer_by?.id;

  const getFileIcon = (url) => {
    const extension = url?.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <BsFiletypePdf size={24} />;
      case "doc":
      case "docx":
        return <BsFiletypeDoc size={24} />;
      case "txt":
        // Add a suitable icon for text files
        return <AiOutlineDownload size={24} />;
      case "xls":
      case "xlsx":
        // Add a suitable icon for Excel files
        return <AiOutlineDownload size={24} />;
      default:
        // Fallback icon for unknown file types
        return <AiOutlineDownload size={24} />;
    }
  };

  console.log("assignment : ", assignment);

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
    } catch (error) {
      console.error(error);
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

  const renderAnswerContent = useCallback((assignment) => {
    const { answer_type, answer_link } = assignment;

    if (answer_type === "IMAGE" && answer_link) {
      return (
        <CardMedia
          component="img"
          image={answer_link}
          alt="Answer Image"
          sx={{ height: 300, objectFit: "contain", mt: 2 }}
        />
      );
    } else if (answer_type === "VIDEO" && answer_link) {
      return (
        <CardMedia component="video" controls sx={{ height: 300, mt: 2 }}>
          <source src={answer_link} type="video/mp4" />
          Your browser does not support the video tag.
        </CardMedia>
      );
    } else if (answer_type === "AUDIO" && answer_link) {
      return (
        <CardMedia component="audio" controls sx={{ mt: 2 }}>
          <source src={answer_link} type="audio/mpeg" />
          Your browser does not support the audio element.
        </CardMedia>
      );
    } else if (answer_link) {
      return (
        <Box
          mt={2}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            padding: 2,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              backgroundColor: "primary.light",
              borderRadius: "50%",
              color: "primary.contrastText",
            }}
          >
            {getFileIcon(answer_link)}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              wordBreak: "break-word",
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            {replaceString(answer_link)}
          </Typography>
        </Box>
      );
    }

    return null;
  }, []);

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        boxShadow: isDarkMode
          ? "0px 6px 15px rgba(0, 0, 0, 0.4)"
          : "0px 4px 10px #ADD8E6",
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "white",
        mb: 3,
      }}
    >
      <MathJax.Context input="tex">
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => setOpen((prev) => !prev)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 4,
                ml: 2,
              }}
            >
              <BiSolidRightArrowCircle size={24} />
              <Typography
                variant="h6"
                fontWeight={"bold"}
                sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
              >
                Question {index + 1}:
              </Typography>
            </Box>
            <Box mr={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: ".9rem", fontWeight: 500 }}>
                {dayjs(assignment?.updated_at).format("DD-MM-YYYY hh:mm")}
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
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography variant="h6" gutterBottom color={primaryColor}>
                  <TextWithMath
                    text={assignment.assignment_que.assignment_text}
                  />
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
              >
                <i>Total Marks:</i> {assignment.assignment_que.assignment_mark}
              </Typography>
              <Typography
                variant="h6"
                fontWeight={"bold"}
                mt={4}
                sx={{ color: isDarkMode ? "#F9F6EE" : "#353935" }}
              >
                <FaPenNib style={{ marginRight: "4px" }} />
                Submission :
              </Typography>
              {assignment?.answer_description && (
                <Typography
                  variant="body1"
                  color={secondaryColor}
                  sx={{ mt: 2 }}
                >
                  <strong style={{ color: primaryColor }}>Answer: </strong>
                  {assignment?.answer_description}
                </Typography>
              )}

              {renderAnswerContent(assignment)}

              <Box
                component="form"
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {error && <Alert severity="error">{error}</Alert>}
                <Grid
                  container
                  spacing={2}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Marks Obtained"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={grades}
                      onChange={(e) => setGrades(e.target.value)}
                      // disabled={isChecked}
                      InputLabelProps={{
                        style: { color: isDarkMode ? "#d7e4fc" : "" },
                      }}
                      InputProps={{
                        sx: {
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          "& .MuiOutlinedInput-notchedOutline": {},
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9} maxWidth={"full"}>
                    <TextField
                      label="Comment"
                      variant="outlined"
                      multiline
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      // disabled={isChecked}
                      InputLabelProps={{
                        style: { color: isDarkMode ? "#d7e4fc" : "" },
                      }}
                      InputProps={{
                        sx: {
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          "& .MuiOutlinedInput-notchedOutline": {},
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGradeSubmission}
                  sx={{ mt: 2 }}
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
                    <CircularProgress size={24} />
                  ) : isChecked ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>
            </CardContent>
          ) : (
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography variant="h6" gutterBottom color={primaryColor}>
                  <TextWithMath
                    text={assignment.assignment_que.assignment_text?.slice(
                      0,
                      200
                    )}
                  />
                </Typography>
              </Box>
            </CardContent>
          )}
        </>
      </MathJax.Context>
    </Card>
  );
};

CheckAssignment.propTypes = {
  assignment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default CheckAssignment;
