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
  Stack,
  CardMedia,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AiOutlineDownload } from "react-icons/ai";
import { useThemeContext } from "@/hooks/ThemeContext";
import { updateAssignment } from "@/api/apiHelper";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { FaPenNib } from "react-icons/fa";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const CheckAssignment = ({ assignment, index }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [grades, setGrades] = useState(assignment?.marks_obtained || 0);
  const [comment, setComment] = useState(assignment?.comment_by_teacher || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isChecked = assignment?.is_checked || false;

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
    } catch (error) {
      console.error(error);
      setError("Failed to submit grade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [assignment, grades, comment]);

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
        <Button
          href={answer_link}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<AiOutlineDownload />}
          sx={{ mt: 2 }}
        >
          Download File
        </Button>
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
          <Typography mt={4} ml={2} variant="h6" fontWeight={"bold"}>
            <BiSolidRightArrowCircle
              style={{ marginRight: "2px", marginTop: "2px" }}
            />
            Question {index + 1}:
          </Typography>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography variant="h6" gutterBottom color={primaryColor}>
                <TextWithMath text={assignment.assignment_que.assignment_text} />
              </Typography>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  p: 0.8,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Box>
            </Box>
            <Typography variant="h6" color="textPrimary">
              <i>Total Marks:</i> {assignment.assignment_que.assignment_mark}
            </Typography>
            <Typography variant="h6" fontWeight={"bold"} mt={4}>
              <FaPenNib style={{ marginRight: "4px" }} />
              Submission :
            </Typography>
            {assignment?.answer_description && (
              <Typography variant="body1" color={secondaryColor} sx={{ mt: 2 }}>
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Marks Obtained"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={grades}
                    onChange={(e) => setGrades(e.target.value)}
                    // disabled={isChecked}
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
                    // disabled={isChecked}
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
