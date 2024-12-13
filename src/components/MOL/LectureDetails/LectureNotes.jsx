import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  Skeleton,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import {
  getLectureNotes,
  regenrateNotes,
  updateMolMarks,
} from "@/api/apiHelper";
import { toast } from "react-hot-toast";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import usePersonalisedRecommendations from "@/components/student/MOL/usePersonalisedRecommendations";

const LectureNotes = ({
  id,
  isDarkMode,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [insightInputs, setInsightInputs] = useState({});
  const [showTextFields, setShowTextFields] = useState({});
  const notesBoxRef = useRef(null);
  const updateCalled = useRef(false);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls

  usePersonalisedRecommendations(id, "NOTES", notesBoxRef, "");

  useEffect(() => {
    const fetchLectureNotes = async () => {
      try {
        const response = await getLectureNotes(id);
        setNotes(JSON.parse(response.data.lecture_note));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchLectureNotes();
    }
  }, [id]);

  const handleMoreInsightClick = (noteId) => {
    setShowTextFields((prev) => ({ ...prev, [noteId]: true }));
  };

  const sendInfo = async (noteId) => {
    const userQuestion = insightInputs[noteId]?.trim();
    if (!userQuestion) return;

    let fd = new FormData();
    fd.append("obj_id", noteId);
    fd.append("user_question", userQuestion);

    try {
      const response = await regenrateNotes(id, fd);
      // Parse the new_data JSON string to an object
      const updatedNotesArray = JSON.parse(response?.data?.data?.new_data);

      // Find the note matching the specified noteId and extract its notes content
      const updatedNoteData = updatedNotesArray.find(
        (item) => item.id === noteId
      )?.notes;

      if (updatedNoteData) {
        setNotes((prevNotes) =>
          prevNotes?.map((note) =>
            note.id === noteId ? { ...note, notes: updatedNoteData } : note
          )
        );
        toast.success("Notes updated successfully");
      } else {
        throw new Error("Note data not found for the specified ID");
      }
    } catch (error) {
      toast.error("Failed to update notes");
      console.error("API Error:", error);
    } finally {
      setShowTextFields((prev) => ({ ...prev, [noteId]: false }));
      setInsightInputs((prev) => ({ ...prev, [noteId]: "" }));
    }
  };

  const displayedNotes = notes.slice(0, visibleCount);

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

  useEffect(() => {
    const handleScrollAndUpdate = async () => {
      if (!isStudent || marksData?.viewed_notes || updateCalled.current) {
        return;
      }

      if (notesBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notesBoxRef.current;
        if (
          scrollHeight > clientHeight &&
          scrollTop + clientHeight >= scrollHeight - 5
        ) {
          await updateMolMark();
        } else if (scrollHeight === clientHeight) {
          await updateMolMark();
        }
      }
    };

    notesBoxRef.current?.addEventListener("scroll", handleScrollAndUpdate);
    notesBoxRef.current?.addEventListener("mouseenter", handleScrollAndUpdate);
    notesBoxRef.current?.addEventListener("mouseleave", handleScrollAndUpdate);

    return () => {
      notesBoxRef.current?.removeEventListener("scroll", handleScrollAndUpdate);
      notesBoxRef.current?.removeEventListener(
        "mouseenter",
        handleScrollAndUpdate
      );
      notesBoxRef.current?.removeEventListener(
        "mouseleave",
        handleScrollAndUpdate
      );
    };
  }, [isStudent, marksData?.viewed_notes]);

  const updateMolMark = async () => {
    if (isStudent && !marksData?.viewed_notes && !updateCalled.current) {
      updateCalled.current = true;
      try {
        const formData = {
          student_score: marksData.student_score + 1,
          viewed_notes: true,
        };
        await updateMolMarks(marksData.id, formData);

        setMarksData((prev) => ({
          ...prev,
          viewed_notes: true,
          student_score: prev.student_score + 1,
        }));
      } catch (error) {
        console.error("Error updating Mol Marks:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        background: isDarkMode
          ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
          : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 500,
        width: "100%",
      }}
      ref={notesBoxRef}
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
            {displayedNotes?.map((note) => (
              <Box key={note.id} sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    <MathJax.Text text={note.title} />
                  </Typography>
                  {!showTextFields[note.id] ? (
                    <Button
                      variant="outlined"
                      onClick={() => handleMoreInsightClick(note.id)}
                      sx={{
                        whiteSpace: "nowrap", // Prevent text wrapping
                        minHeight: "36px", // Set a consistent button height
                        lineHeight: "1.5", // Ensure proper vertical alignment
                        textTransform: "none", // Optional: Keep text casing as it is
                      }}
                    >
                      More Insights
                    </Button>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={insightInputs[note.id] || ""}
                        onChange={(e) =>
                          setInsightInputs({
                            ...insightInputs,
                            [note.id]: e.target.value,
                          })
                        }
                        placeholder="Type your query..."
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        onClick={() => sendInfo(note.id)}
                        color="primary"
                      >
                        <IoMdSend />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {/* Check and remove leading ** symbols from notes */}
                <Typography variant="subtitle2">
                  <TextWithMath
                    text={note.notes
                      .replace(/^\*\*\s*/, "")
                      .replace(/\\n/g, "\n")}
                  />
                </Typography>
              </Box>
            ))}
          </>
        </MathJax.Context>
      )}

      {visibleCount < notes.length && (
        <Button
          variant="contained"
          onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
          sx={{ mt: 2 }}
        >
          Need More
        </Button>
      )}
    </Box>
  );
};

export default LectureNotes;
