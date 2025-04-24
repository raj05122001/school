import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { getLectureQuestion } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const LectureQuestions = ({ id, isDarkMode }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls

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

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchQuestions();
    }
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
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
        color: "#3B3D3B",
        backgroundColor: "#fff",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 500,
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
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
            <Typography
              sx={{
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "20px",
                letterSpacing: "-0.48px",
              }}
              gutterBottom
            >
              Lecture Questions
            </Typography>
            {displayedQuestion?.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography>
                  <TextWithMath
                    text={item.title}
                    textStyle={{
                      color: "#3B3D3B",
                      fontFamily: "Inter",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: "600",
                      lineHeight: "20px",
                      letterSpacing: "-0.48px",
                    }}
                  />
                </Typography>
                <ul>
                  {item?.questions?.map((question, qIndex) => (
                    <li key={qIndex}>
                      <Typography>
                        <TextWithMath text={question} />
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
                sx={{
                  mt: 2,
                  fontFamily: "Inter",
                  fontSize: "14px",
                  backgroundColor: "#E7002A",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "#E7002A", // customize these shades as needed
                  },
                }}
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
