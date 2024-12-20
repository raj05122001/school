import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Skeleton,
} from "@mui/material";
import { getLectureQuiz } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const LectureMCQ = ({ id, isDarkMode }) => {
  const [quizData, setQuizData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getLectureQuiz(id); // Fetching quiz data using the provided id
        if (response.success) {
          setQuizData(response.data); // Set the fetched data to state
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
  

  // Function to generate alphabetical labels
  const getLabel = (index) => {
    const labels = ["a)", "b)", "c)", "d)", "e)"];
    return labels[index] || `${index + 1})`; // Fallback for more than 10 options
  };

  const displayedNotes = quizData.slice(0, visibleCount);

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
        maxHeight: 500,
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
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    sx={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    <Typography  >
                      {questionIndex + 1}.&nbsp;
                    </Typography>
                    <Typography
                     sx={{marginTop:0.2}}
                      variant="span"
                    >
                    <TextWithMath text={item.question} />{" "}
                    </Typography>
                  </Box>
                  <List sx={{ padding: 0 }}>
                    {" "}
                    {/* Remove padding for nested list */}
                    {parseOptions(item?.options)?.map((option, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        {" "}
                        {/* Remove padding for nested items */}
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ fontSize: "14px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ textAlign: "left" }}
                          >
                            {getLabel(index)}&nbsp;&nbsp;
                          </Typography>
                          <MathJax.Text text={option} />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                  <Box
                    display="flex"
                    // alignItems="center"
                    marginTop={"4px"}
                    sx={{ fontSize: "16px" }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        fontSize: "16px",
                      }}
                    >
                      Answer:&nbsp;
                    </Typography>

                    <Typography
                     sx={{marginTop:0.4}}
                      variant="span"
                    >
                    <MathJax.Text text={item?.answer} />
                    </Typography>

                  </Box>
                </ListItem>
              ))}
              {visibleCount < quizData?.length && (
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
      )}
    </Box>
  );
};

export default LectureMCQ;
