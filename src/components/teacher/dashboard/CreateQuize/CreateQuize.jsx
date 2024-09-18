import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  TextField,
  Paper,
  Typography,
  Grid,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Fade,
  Zoom,
} from "@mui/material";
import {
  MdOutlineOpenInNew,
  MdDeleteOutline,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";

function CreateQuiz() {
  const [open, setOpen] = useState(false);

  // Initialize with 5 quizzes and 10 questions
  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    questions: Array.from({ length: 10 }, () => ({
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      points: 1,
    })),
  });

  const handleTitleChange = (event) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      title: event.target.value,
    }));
  };

  const handleSubjectChange = (event) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      subject: event.target.value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        {
          type: "multiple-choice",
          text: "",
          options: ["", "", "", ""],
          points: 1,
        },
      ],
    }));
  };

  const handleQuestionTypeChange = (index, value) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question, i) =>
        i === index ? { ...question, type: value } : question
      ),
    }));
  };

  const handleQuestionChange = (index, value) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question, i) =>
        i === index ? { ...question, text: value } : question
      ),
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) =>
                j === optionIndex ? value : option
              ),
            }
          : question
      ),
    }));
  };

  const handlePointsChange = (index, value) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.map((question, i) =>
        i === index ? { ...question, points: Number(value) } : question
      ),
    }));
  };

  const deleteQuestion = (index) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<MdOutlineOpenInNew />}
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#3f51b5",
          color: "#fff",
          padding: "10px 20px",
          "&:hover": {
            backgroundColor: "#303f9f",
            transform: "scale(1.05)",
          },
          transition: "transform 0.3s ease-in-out",
        }}
      >
        Open Quiz Creator
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        // maxWidth="3xl"
        maxWidth={false}
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={500}
        PaperProps={{
            sx: {
              width: "100%", // Set the width of the Paper component to 100%
              maxWidth: "none", // Remove any default maxWidth constraint
            },
          }}
      >
        <DialogTitle>
          <Typography variant="h4" gutterBottom>
            Quiz Creator
          </Typography>
          <Box sx={{ display: "flex", gap: 4 ,alignItems:'center'}}>
            <TextField
              fullWidth
              label="Quiz Title"
              value={quiz.title}
              onChange={handleTitleChange}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2, maxWidth: "300px" }}
            />
            <TextField
              fullWidth
              label="Subject"
              value={quiz.subject}
              onChange={handleSubjectChange}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2, maxWidth: "300px" }}
            />
            <Button
              onClick={addQuestion}
              variant="contained"
              color="primary"
              sx={{
                whiteSpace: "nowrap",
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#388e3c",
                  transform: "scale(1.1)",
                },
                transition: "transform 0.2s ease-in-out",
                padding: "12px",
                margin: 0,
                height: "fit-content",
                width: "auto", // If you want the button to adjust its width based on the text
              }}
            >
              Add Question
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Zoom in={open} style={{ transitionDelay: open ? "100ms" : "0ms" }}>
            <Container>
              <Paper
                sx={{
                  padding: "30px",
                  mt: 3,
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {quiz.questions.map((question, index) => (
                  <Fade
                    in={true}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    key={index} // Ensuring a unique key for each question
                  >
                    <Box
                      sx={{
                        mb: 3,
                        border: "1px solid #e0e0e0",
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Question Type</InputLabel>
                            <Select
                              value={question.type}
                              onChange={(e) =>
                                handleQuestionTypeChange(index, e.target.value)
                              }
                              label="Question Type"
                            >
                              <MenuItem value="multiple-choice">
                                Multiple Choice
                              </MenuItem>
                              <MenuItem value="descriptive">
                                Descriptive
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            fullWidth
                            label={`Question ${index + 1}`}
                            value={question.text}
                            onChange={(e) =>
                              handleQuestionChange(index, e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        {question.type === "multiple-choice" &&
                          question.options.map((option, opIndex) => (
                            <Grid item xs={3} key={opIndex}>
                              <TextField
                                fullWidth
                                label={`Option ${opIndex + 1}`}
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    opIndex,
                                    e.target.value
                                  )
                                }
                                margin="normal"
                                variant="outlined"
                              />
                            </Grid>
                          ))}
                        <Grid item xs={2}>
                          <TextField
                            type="number"
                            label="Points"
                            value={question.points}
                            onChange={(e) =>
                              handlePointsChange(index, e.target.value)
                            }
                            margin="normal"
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            onClick={() => deleteQuestion(index)}
                            color="secondary"
                          >
                            <MdDeleteOutline />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                ))}
              </Paper>
            </Container>
          </Zoom>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            startIcon={<MdThumbDown />}
            color="error"
            sx={{
              backgroundColor: "#e57373",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            startIcon={<MdThumbUp />}
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateQuiz;
