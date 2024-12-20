import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, List, ListItem, Button, Skeleton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { getLectureQuiz, submitQuiz, getQuizResponse } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const StudentMCQ = ({ id, isDarkMode }) => {
  const [quizData, setQuizData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [quizResponses, setQuizResponses] = useState({});
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls


  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const studentID = userDetails?.student_id

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getLectureQuiz(id); // Fetching quiz data using the provided id
        if (response.success) {
          setQuizData(response?.data); // Set the fetched data to state
        }
        const quizResponse = await getQuizResponse(id);
        if (quizResponse?.success) {
            // Store already answered quiz IDs
            const answeredQuestions = quizResponse?.data?.answered_quiz?.reduce((acc, item) => {
              acc[item?.quiz?.id] = {
                yourAnswer: item?.your_answer,
                correctAnswer: item?.quiz?.answer,
                isCorrect: item?.is_correct,
              };
              return acc;
            }, {});
            setSubmittedAnswers(answeredQuestions);
          }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchQuizData();
    }
  }, [id]);

  const parseOptions = (options) => {
    try {
      // First, convert the single quotes around the array to double quotes
      let validJson = options
        ?.replace(/^\[|\]$/g, '') // Remove the surrounding brackets temporarily
        ?.split(',') // Split each option by commas
        ?.map(option => option?.trim()?.replace(/^'/, '"')?.replace(/'$/, '"')) // Replace single quotes around each option with double quotes
        ?.join(','); // Join the items back into a comma-separated string
  
      // Wrap the modified string back into an array format
      validJson = `[${validJson}]`;

      return JSON.parse(validJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };
  

  const getLabel = (index) => {
    const labels = ["a)", "b)", "c)", "d)", "e)"];
    return labels[index] || `${index + 1})`; 
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitAnswer = async (questionId) => {
    try {
      const formData = [{
        your_answer: selectedAnswers[questionId],
        lecture: id,
        answered_by: studentID,
        quiz: questionId,
      }];
      await submitQuiz(formData, id);

      const response = await getQuizResponse(id);
      if (response.success) {
        const quizResponse = await getQuizResponse(id);
        if (quizResponse?.success) {
            const responseData = quizResponse?.data?.answered_quiz?.reduce((acc, item) => {
              acc[item?.quiz?.id] = {
                yourAnswer: item?.your_answer,
                correctAnswer: item?.quiz?.answer,
                isCorrect: item?.is_correct,
              };
              return acc;
            }, {});
            setSubmittedAnswers((prev) => ({ ...prev, ...responseData }));
          }
        }
    } catch (error) {
      console.error("Error submitting answer or fetching response:", error);
    }
  };

  const displayedNotes = quizData?.slice(0, visibleCount);

  if (loading) {
    return (
      <Box sx={{ p: 3, width: "100%" }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(7)]?.map((_, index) => (
          <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

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
        maxHeight: 500,
        width: "100%",
      }}
    >
      <MathJax.Context input="tex">
        <>
          <List>
            {displayedNotes?.map((item, questionIndex) => (
              <ListItem
                key={item.id}
                sx={{
                  flexDirection: "column",
                  mb: 2,
                  alignItems: "flex-start",
                }}
              >
                <Box display="flex" alignItems="center" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                  <Typography sx={{ textAlign: "left", marginRight: 1 }}>
                    {questionIndex + 1}.
                  </Typography>
                  <TextWithMath text={item?.question} />
                </Box>
                <RadioGroup
                  value={selectedAnswers[item?.id] || ""}
                  onChange={(e) => handleOptionChange(item?.id, e.target.value)}
                >
                  {parseOptions(item?.options)?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center" sx={{ fontSize: "14px" }}>
                          {/* <Typography variant="body2" sx={{ textAlign: "left" }}>
                            {getLabel(index)}
                          </Typography> */}
                          {/* <MathJax.Text text={option} inline/> */}
                          <TextWithMath text={option} />
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
                {!submittedAnswers[item?.id] && (
                  <Button
                    variant="outlined"
                    onClick={() => handleSubmitAnswer(item?.id)}
                    sx={{ mt: 1 }}
                  >
                    Submit
                  </Button>
                )}
                {submittedAnswers[item.id] && (
                  <Box display="flex" alignItems="center" marginTop={"4px"} sx={{ fontSize: "16px" }}>
                    <Typography sx={{ fontWeight: "bold", textAlign: "left", fontSize: "16px" }}>
                      Your Answer: &nbsp;
                    </Typography>
                    <TextWithMath text={submittedAnswers[item?.id].yourAnswer} />
                    <Typography sx={{ fontWeight: "bold", textAlign: "left", fontSize: "16px", ml: 2 }}>
                      Correct Answer: &nbsp;
                    </Typography>
                    <TextWithMath text={submittedAnswers[item?.id]?.correctAnswer} />
                  </Box>
                )}
              </ListItem>
            ))}
            {visibleCount < quizData.length && (
              <Button
                variant="contained"
                onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
                sx={{ mt: 2 }}
              >
                Need More
              </Button>
            )}
          </List>
        </>
      </MathJax.Context>
    </Box>
  );
};

export default StudentMCQ;