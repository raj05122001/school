import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { getLectureNotes, regenrateNotes } from "@/api/apiHelper";
import { toast } from "react-hot-toast";
import MathJax from "react-mathjax2";

const LectureNotes = ({ id, isDarkMode }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [insightInputs, setInsightInputs] = useState({});
  const [showTextFields, setShowTextFields] = useState({});

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

    fetchLectureNotes();
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        borderRadius: "8px",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
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
                <MathJax.Text text={note.notes.replace(/^\*\*\s*/, "")} />
              </Typography>
            </Box>
          ))}
        </>
      </MathJax.Context>

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
