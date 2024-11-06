import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { getLectureQuestion } from "@/api/apiHelper";
import MathJax from "react-mathjax2";

const LectureQuestions = ({ id, isDarkMode }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getLectureQuestion(id);
        let lectureQuestion = data?.data?.question_text;

        // Parse the question_text field
        const parsedQuestions = JSON.parse(lectureQuestion);
        setQuestionsData(parsedQuestions);
      } catch (error) {
        console.error("Error fetching lecture questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const displayedQuestion = questionsData.slice(0, visibleCount);

  // if (loading) {
  //   return (
  //     <Box sx={{ p: 3, width: "100%" }}>
  //       <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
  //       {[...Array(7)].map((_, index) => (
  //         <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
  //       ))}
  //     </Box>
  //   );
  // }

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
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
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
        </Box>
      ) : (
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
      )}
    </Box>
  );
};

export default LectureQuestions;
