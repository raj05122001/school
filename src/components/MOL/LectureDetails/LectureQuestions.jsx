import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { getLectureQuestion } from "@/api/apiHelper";
import MathJax from "react-mathjax2";

const LectureQuestions = ({ id, isDarkMode }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getLectureQuestion(id); // Assuming lecture ID is 2 for now
        console.log(data, "Question Data");
        let lectureQuestion = data?.data?.question_text;

        // Parse the question_text field
        const parsedQuestions = JSON.parse(lectureQuestion);
        setQuestionsData(parsedQuestions);
      } catch (error) {
        console.error("Error fetching lecture questions:", error);
      }
    };

    fetchQuestions();
  }, [id]);

  const displayedQuestion = questionsData.slice(0, visibleCount);

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        borderRadius: "8px",
        background: isDarkMode
          ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
          : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 450,
        width: "100%",
      }}
    >
      <MathJax.Context input="tex">
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Lecture Questions
          </Typography>
          {displayedQuestion?.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                <MathJax.Text text={item.title} />
              </Typography>
              <ul>
                {item.questions.map((question, qIndex) => (
                  <li key={qIndex}>
                    <Typography variant="body2">
                      <MathJax.Text text={question} />
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
          {visibleCount < questionsData.length && (
            <Button
              variant="contained"
              onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
              sx={{ mt: 2 }}
            >
              Need More
            </Button>
          )}
        </>
      </MathJax.Context>
    </Box>
  );
};

export default LectureQuestions;
