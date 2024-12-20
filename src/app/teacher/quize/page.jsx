"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  IconButton,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";

function Page() {
  const [quiz, setQuiz] = useState({
    title: "",
    subject: "",
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    points: 1,
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

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      [field]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: prevQuestion?.options?.map((option, i) =>
        i === index ? value : option
      ),
    }));
  };

  const saveQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion],
    }));

    // Reset the new question field
    setNewQuestion({
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      points: 1,
    });
  };

  const deleteQuestion = (index) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz?.questions?.filter((_, i) => i !== index),
    }));
  };

  // Filter and categorize questions into sections
  const sectionAQuestions = quiz?.questions?.filter(
    (question) => question.type === "multiple-choice"
  );
  const sectionBQuestions = quiz?.questions?.filter(
    (question) => question.type === "descriptive" && question.points <= 4
  );
  const sectionCQuestions = quiz?.questions?.filter(
    (question) => question?.type === "descriptive" && question?.points > 4
  );

  return (
    <Box p={2}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Quiz Creator
        </Typography>
        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
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
        </Box>
      </Box>

      {/* Section A: Multiple Choice Questions */}
      {sectionAQuestions.length > 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Section A - Multiple Choice Questions
          </Typography>
          <Paper
            sx={{
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {sectionAQuestions?.map((question, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Question {index + 1}: {question.text}
                </Typography>
                {question?.options?.map((option, opIndex) => (
                  <Typography key={opIndex} sx={{ ml: 2 }}>
                    {String.fromCharCode(65 + opIndex)}. {option}
                  </Typography>
                ))}
                <Typography sx={{ mt: 1 }}>
                  Points: {question.points}
                </Typography>
                <IconButton
                  onClick={() => deleteQuestion(index)}
                  color="secondary"
                >
                  <MdDeleteOutline />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* Section B: Short Answer Questions */}
      {sectionBQuestions.length > 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Section B - Short Answer Questions
          </Typography>
          <Paper
            sx={{
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {sectionBQuestions?.map((question, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Question {index + 1}: {question.text}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Points: {question.points}
                </Typography>
                <IconButton
                  onClick={() => deleteQuestion(index)}
                  color="secondary"
                >
                  <MdDeleteOutline />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* Section C: Long Answer Questions */}
      {sectionCQuestions.length > 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Section C - Long Answer Questions
          </Typography>
          <Paper
            sx={{
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {sectionCQuestions?.map((question, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  border: "1px solid #e0e0e0",
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Question {index + 1}: {question.text}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Points: {question.points}
                </Typography>
                <IconButton
                  onClick={() => deleteQuestion(index)}
                  color="secondary"
                >
                  <MdDeleteOutline />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* New Question Form */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Add New Question
        </Typography>
        <Paper
          sx={{
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={newQuestion.type}
              onChange={(e) => handleNewQuestionChange("type", e.target.value)}
              label="Question Type"
            >
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              <MenuItem value="descriptive">Descriptive</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Question"
            value={newQuestion.text}
            onChange={(e) => handleNewQuestionChange("text", e.target.value)}
            margin="normal"
            variant="outlined"
          />

          {newQuestion?.type === "multiple-choice" &&
            newQuestion?.options?.map((option, opIndex) => (
              <TextField
                key={opIndex}
                fullWidth
                label={`Option ${opIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(opIndex, e.target.value)}
                margin="normal"
                variant="outlined"
              />
            ))}

          <TextField
            type="number"
            label="Points"
            value={newQuestion.points}
            onChange={(e) => handleNewQuestionChange("points", e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={saveQuestion}
            sx={{ mt: 2 }}
          >
            Save Question
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default Page;
