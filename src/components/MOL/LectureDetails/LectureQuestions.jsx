import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, Skeleton, IconButton } from "@mui/material";
import { getLectureQuestion, updateQuestions } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";

const LectureQuestions = ({ id, isDarkMode, isEdit=false }) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls


  const [questionsId, setQuestionsId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1); // Track which question is being edited
  const [editedQuestionData, setEditedQuestionData] = useState(null); // Store edited question data

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getLectureQuestion(id);
        let lectureQuestion = data?.data?.question_text;

        // Parse the question_text field
        const parsedQuestions = JSON.parse(lectureQuestion);
        setQuestionsData(parsedQuestions);
        setQuestionsId(data?.data?.id);
   
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

    const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedQuestionData({ ...questionsData[index] });
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setEditedQuestionData(null);
  };

  const parseEditedHtml = (html) => {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract title from h3 tag (preserve HTML formatting)
    const titleElement = tempDiv.querySelector('#question');
    const title = titleElement ? titleElement.innerHTML.trim() : '';
    
    // Extract questions from li tags (preserve HTML formatting)
    const listItems = tempDiv.querySelectorAll('#option li');
    const questions = Array.from(listItems).map(li => li.innerHTML.trim()).filter(text => text);
    
    return { title, questions };
  };

  const handleQueTextChange = (html) => {
    const parsedData = parseEditedHtml(html);
    setEditedQuestionData(parsedData);
  };

  const handleSave = async () => {
    if (!editedQuestionData) return;
    
    setSaving(true);
    try {
      // Create a copy of the complete questions data
      const updatedQuestionsData = [...questionsData];
      
      // Update only the specific question being edited
      updatedQuestionsData[editingIndex] = editedQuestionData;
      
      // Send complete data to API
      const question_text = JSON.stringify(updatedQuestionsData);
      await updateQuestions(questionsId, {
        question_text: question_text,
      })
      
      // Update local state with the complete updated data
      setQuestionsData(updatedQuestionsData);
      
      // Reset editing state
      setEditingIndex(-1);
      setEditedQuestionData(null);
      
    } catch (error) {
      console.error("Error updating question:", error);
    } finally {
      setSaving(false);
    }
  };


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
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Lecture Questions
            </Typography>
            {displayedQuestion?.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {isEdit && (
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    {editingIndex !== index ? (
                      <IconButton
                        onClick={() => handleEdit(index)}
                        sx={{ color: "#36454F" }}
                        title="Edit Question"
                      >
                        <MdEdit />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          onClick={handleSave}
                          disabled={saving}
                          sx={{ color: "#4CAF50" }}
                          title="Save Changes"
                        >
                          <MdSave />
                        </IconButton>
                        <IconButton
                          onClick={handleCancel}
                          sx={{ color: "#f44336" }}
                          title="Cancel Edit"
                        >
                          <MdCancel />
                        </IconButton>
                      </>
                    )}
                  </Box>
                )}
                {editingIndex === index ? (
                  <TextEditor
                    text={`<h3 id="question">${
                      item.title || ""
                    }</h3>
                    <br>
                    <ul style="padding-left: 1.2em;" id="option">
                      ${
                        item?.questions
                          ?.map((point) => `<li>${point}</li><br>`)
                          .join("") || ""
                      }
                    </ul>`}
                    onChange={(html) => handleQueTextChange(html)}
                  />
                ) : (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold">
                      <TextWithMath text={item.title} textStyle={{"fontSize":"16px", fontWeight:600}}/>
                    </Typography>
                    <ul>
                      {item?.questions?.map((question, qIndex) => (
                        <li key={qIndex}>
                          <Typography variant="body2">
                            <TextWithMath text={question} />
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
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
