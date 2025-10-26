import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Skeleton,
  Radio,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { deleteMCQ, getLectureQuiz, updateMCQ } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { MdEdit, MdSave, MdCancel, MdDelete } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";

const LectureMCQ = ({ id, isDarkMode, isEdit=false }) => {
  console.log("LectureMCQ isEdit : ",isEdit)
  const [quizData, setQuizData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls


  const [selectedOptions, setSelectedOptions] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [editingQuiz, setEditingQuiz] = useState({});
  const [editedQuizData, setEditedQuizData] = useState({});
  const [savingMCQ, setSavingMCQ] = useState(false);
  const [deletingMCQ, setDeletingMCQ] = useState({});

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
        ?.replace(/^\[|\]$/g, "") // Remove the surrounding brackets temporarily
        ?.split(",") // Split each option by commas
        ?.map((option) =>
          option?.trim()?.replace(/^'/, '"')?.replace(/'$/, '"')
        ) // Replace single quotes around each option with double quotes
        ?.join(","); // Join the items back into a comma-separated string

      // Wrap the modified string back into an array format
      validJson = `[${validJson}]`;

      return JSON.parse(validJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };

    const handleOptionChange = (qId, idx) => {
    setSelectedOptions(prev => ({ ...prev, [qId]: idx }));
  };

  const handleSubmit = (qId) => {
    setShowAnswers(prev => ({ ...prev, [qId]: true }));
  };

  // Edit handlers
  const handleEditMCQ = (qId) => {
    const item = quizData.find((q) => q.id === qId);
    if (!item) return;
    
    setEditingQuiz(prev => ({ ...prev, [qId]: true }));
    setEditedQuizData(prev => ({
      ...prev,
      [qId]: {
        question: item.question || '',
        options: parseOptions(item.options),
      },
    }));
  };

  const handleCancelMCQ = (qId) => {
    setEditingQuiz(prev => ({ ...prev, [qId]: false }));
    setEditedQuizData(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleQuizTextChange = (qId, htmlContent) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const qEl = doc.querySelector("#question");
      const oEl = doc.querySelector("#option");
      
      let question = qEl ? qEl.innerHTML : htmlContent;
      let options = [];
      
      if (oEl) {
        // Extract options from ordered list
        const listItems = oEl.querySelectorAll("li");
        options = Array.from(listItems).map(li => li.innerHTML.replace(/<br>/g, '').trim());
      }
      
      setEditedQuizData(prev => ({
        ...prev,
        [qId]: { 
          ...prev[qId], 
          question: question,
          options: options.length > 0 ? options : prev[qId]?.options || []
        },
      }));
    } catch (error) {
      console.error("Error parsing HTML content:", error);
      // Fallback to treating entire content as question
      setEditedQuizData(prev => ({
        ...prev,
        [qId]: { 
          ...prev[qId], 
          question: htmlContent 
        },
      }));
    }
  };

  const handleSaveMCQ = async (qId) => {
    const editedData = editedQuizData[qId];
    if (!editedData) return;
    
    setSavingMCQ(true);
    try {
      const { question, options } = editedData;
      
      await onUpdateMCQ(qId, question, options);
      
      setQuizData(prev =>
        prev.map(q =>
          q.id === qId
            ? { ...q, question, options: JSON.stringify(options) }
            : q
        )
      );
      
      handleCancelMCQ(qId);
    } catch (error) {
      console.error("Error saving MCQ:", error);
    } finally {
      setSavingMCQ(false);
    }
  };

  const onUpdateMCQ = async (quizID, question, options) => {
    return await updateMCQ(quizID, {
      question,
      options: JSON.stringify(options),
    })
  };

  const onDeleteMCQ = async (quizID) => {
    setDeletingMCQ(prev => ({ ...prev, [quizID]: true }));
    try {
      await deleteMCQ(quizID)
      const filteredData = quizData?.filter((val) => val.id !== quizID);
      setQuizData(filteredData);
      
      // Clean up related states for deleted quiz
      setSelectedOptions(prev => {
        const newState = { ...prev };
        delete newState[quizID];
        return newState;
      });
      setShowAnswers(prev => {
        const newState = { ...prev };
        delete newState[quizID];
        return newState;
      });
      setEditingQuiz(prev => {
        const newState = { ...prev };
        delete newState[quizID];
        return newState;
      });
      setEditedQuizData(prev => {
        const newState = { ...prev };
        delete newState[quizID];
        return newState;
      });
      
    } catch (error) {
      console.error("Error deleting MCQ:", error);
    } finally {
      setDeletingMCQ(prev => ({ ...prev, [quizID]: false }));
    }
  };

  // Function to generate alphabetical labels
  const getLabel = (index) => {
    const labels = ["a)", "b)", "c)", "d)", "e)"];
    return labels[index] || `${index + 1})`; // Fallback for more than 10 options
  };

  const displayed = quizData.slice(0, visibleCount);

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
        <List>
          {displayed.map((item, idx) => (
            <React.Fragment key={item.id}>
              {isEdit && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    mb: 1,
                  }}
                >
                  {!editingQuiz[item.id] ? (
                    <>
                      <IconButton 
                        onClick={() => handleEditMCQ(item.id)}
                        color="primary"
                        disabled={deletingMCQ[item.id]}
                      >
                        <MdEdit />
                      </IconButton>
                      {/* <IconButton 
                        onClick={() => onDeleteMCQ(item.id)}
                        color="error"
                        disabled={deletingMCQ[item.id]}
                      >
                        <MdDelete />
                      </IconButton> */}
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => handleSaveMCQ(item.id)}
                        disabled={savingMCQ}
                        color="success"
                      >
                        <MdSave />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleCancelMCQ(item.id)}
                        color="error"
                      >
                        <MdCancel />
                      </IconButton>
                    </>
                  )}
                </Box>
              )}
              
              <ListItem
                sx={{
                  flexDirection: "column",
                  mb: 2,
                  alignItems: "flex-start",
                }}
              >
                {editingQuiz[item.id] ? (
                  <TextEditor
                    text={`<h3 id="question">${editedQuizData[item.id]?.question || ''}</h3>
                    <br>
                    <ol style="list-style-type:lower-alpha; padding-left: 1.2em;" id="option">
                      ${editedQuizData[item.id]?.options?.map(point => `<li>${point}</li><br>`).join('') || ''}
                    </ol>`}
                    onChange={(html) => handleQuizTextChange(item.id, html)}
                  />
                ) : (
                  <>
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      sx={{ fontSize: 16, fontWeight: "bold", mb: 1 }}
                    >
                      <Typography sx={{ mr: 1 }}>{idx + 1}.</Typography>
                      <Typography component="span">
                        <TextWithMath
                        text={item?.question}
                        textStyle={{
                        color: "#3B3D3B",
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: "600",
                        lineHeight: "20px",
                        letterSpacing: "-0.48px",
                      }}
                      />{" "}
                      </Typography>
                    </Box>
                    
                    <List sx={{ p: 0, width: '100%' }}>
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
                            sx={{ textAlign: "left" }}
                          >
                            {getLabel(index)}&nbsp;&nbsp;
                          </Typography>
                          {/* <MathJax.Text text={option} inline/> */}
                          <TextWithMath text={option} />
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

                    <Typography sx={{ marginTop: 0.4 }} variant="span">
                      <TextWithMath text={item?.answer} />
                        </Typography>
                    </Box>
                  </>
                )}
              </ListItem>
            </React.Fragment>
          ))}
          
          {visibleCount < quizData.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                  onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
                  sx={{
                  mt: 2,
                  display: "inline-flex",
                  padding: "12px 32px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  textTransform: "none",
                  borderRadius: "8px",
                  background: "#141514",
                  color: "#FFF",
                  textAlign: "center",
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontFamily: "Aptos",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "24px",
                  "&:hover": {
                    border: "1px solid #141514",
                    background: "#E5E5E5",
                    color: "#141514",
                  },
                }}
              >
                Need More
              </Button>
            </Box>
          )}
        </List>
      </MathJax.Context>
      )}
    </Box>
  );
};

export default LectureMCQ;
