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
  updateNotes,
} from "@/api/apiHelper";
import { toast } from "react-hot-toast";
import MathJax from "react-mathjax2";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import usePersonalisedRecommendations from "@/components/student/MOL/usePersonalisedRecommendations";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";

const LectureNotes = ({
  id,
  isDarkMode,
  marksData = {},
  isStudent = false,
  setMarksData,
  isEdit=false
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
  const [editingNotes, setEditingNotes] = useState({}); // Track which notes are being edited
  const [editedData, setEditedData] = useState({}); // Store edited data for each note
  const [saving, setSaving] = useState(false);
  const [notesId, setNotesId] = useState("");

  usePersonalisedRecommendations(id, "NOTES", notesBoxRef, "");

  useEffect(() => {
    const fetchLectureNotes = async () => {
      try {
        const response = await getLectureNotes(id);
        setNotesId(response?.data?.id);

        const lectureNotes = response?.data?.lecture_note;
        if (lectureNotes) {
          try {
            const parsedNotes = JSON.parse(lectureNotes);
            setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
          } catch (parseError) {
            console.error("Error parsing lecture notes:", parseError);
            setNotes([]);
          }
        } else {
          setNotes([]);
        }
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
        (item) => item?.id === noteId
      )?.notes;

      if (updatedNoteData) {
        setNotes((prevNotes) =>
          prevNotes?.map((note) =>
            note?.id === noteId ? { ...note, notes: updatedNoteData } : note
          )
        );
      } else {
        console.log("Error generating notes");
      }
    } catch (error) {
      // toast.error("Failed to update notes");
      console.error("API Error:", error);
    } finally {
      setShowTextFields((prev) => ({ ...prev, [noteId]: false }));
      setInsightInputs((prev) => ({ ...prev, [noteId]: "" }));
    }
  };

  const displayedNotes = notes?.slice(0, visibleCount) || [];

  useEffect(() => {
    const handleScrollAndUpdate = async () => {
      if (!isStudent || marksData?.viewed_notes || updateCalled?.current) {
        return;
      }

      if (notesBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = notesBoxRef?.current;
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

    notesBoxRef?.current?.addEventListener("scroll", handleScrollAndUpdate);
    notesBoxRef?.current?.addEventListener("mouseenter", handleScrollAndUpdate);
    notesBoxRef?.current?.addEventListener("mouseleave", handleScrollAndUpdate);

    return () => {
      notesBoxRef?.current?.removeEventListener(
        "scroll",
        handleScrollAndUpdate
      );
      notesBoxRef?.current?.removeEventListener(
        "mouseenter",
        handleScrollAndUpdate
      );
      notesBoxRef?.current?.removeEventListener(
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

  const handleEdit = (noteId) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (!noteToEdit) return;

    setEditingNotes((prev) => ({ ...prev, [noteId]: true }));
    setEditedData((prev) => ({
      ...prev,
      [noteId]: {
        title: noteToEdit.title || "",
        notes: noteToEdit.notes?.replace(/^\*\*\s*/, "")?.replace(/\\n/g, "\n") || "",
      },
    }));
  };

  const handleCancel = (noteId) => {
    setEditingNotes((prev) => ({ ...prev, [noteId]: false }));
    setEditedData((prev) => {
      const newData = { ...prev };
      delete newData[noteId];
      return newData;
    });
  };

  const handleSave = async (noteId) => {
    setSaving(true);
    try {
      // Update the notes array with edited data
      const updatedNotes = notes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            title: editedData[noteId]?.title || note.title,
            notes: editedData[noteId]?.notes || note.notes,
          };
        }
        return note;
      });

      await onUpdateNotes(updatedNotes);

      // Update local state
      setNotes(updatedNotes);
      setEditingNotes((prev) => ({ ...prev, [noteId]: false }));

      // Clean up edited data for this note
      setEditedData((prev) => {
        const newData = { ...prev };
        delete newData[noteId];
        return newData;
      });

      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditText = (noteId, htmlContent) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // grab innerHTML instead of textContent to keep tags
    const titleEl = doc.querySelector('#title');
    const notesEl = doc.querySelector('#notes');

    const title = titleEl ? titleEl.innerHTML : '';
    const notes = notesEl ? notesEl.innerHTML : '';

    setEditedData(prev => ({
      ...prev,
      [noteId]: { title, notes }
    }));
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    // fallback: send raw htmlContent
    setEditedData(prev => ({
      ...prev,
      [noteId]: { ...prev[noteId], notes: htmlContent }
    }));
  }
};

  const onUpdateNotes = async (updatedNotesArray) => {
    try {
      const updatedText = JSON.stringify(updatedNotesArray);

      const response = await updateNotes(notesId, {
          lecture_note: updatedText,
        })

      return response;
    } catch (e) {
      console.error("Error in onUpdateNotes:", e);
      throw e;
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
            {displayedNotes.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>
                No lecture notes available.
              </Typography>
            ) : (
              displayedNotes?.map((note) => (
              <Box key={note?.id} sx={{ mb: 2 }}>
                {isEdit && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                        mb: 1,
                      }}
                    >
                      {editingNotes[note?.id] && (
                        <>
                          <IconButton
                            onClick={() => handleSave(note?.id)}
                            disabled={saving}
                            sx={{ color: "#4CAF50" }}
                            title="Save Changes"
                          >
                            <MdSave />
                          </IconButton>
                          <IconButton
                            onClick={() => handleCancel(note?.id)}
                            sx={{ color: "#f44336" }}
                            title="Cancel Edit"
                          >
                            <MdCancel />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}
                  {editingNotes[note?.id] ? (
                      <TextEditor
                        text={
                          `<h2 id="title">${editedData[note?.id]?.title || ''}</h2><br>
                           <p id="notes">${editedData[note?.id]?.notes?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              ?.replace(/#/g, "")
                              ?.replace(/`/g, "")
                              ?.replace(/(?<!\d)\. /g, ".<br>")
                              ?.replace(/\\\\n\\\\n/g, "<br><br>")
                              ?.replace(/\\\n\\\n/g, "<br><br>")
                              ?.replace(/\\n\\n/g, "<br><br>")
                              ?.replace(/\n\n/g, "<br><br>")
                              ?.replace(/\\\\n/g, "<br>")
                              ?.replace(/\\\n/g, "<br>")
                              ?.replace(/\\n/g, "<br>")
                              ?.replace(/\n/g, "<br>")
                              ?.replace(/\\(.?)\\*/g, "<strong>$1</strong>")
                              ?.replace(/\\/g, "")
                              ?.replace(/\\\\/g, "") || ''}</p>`
                        }
                        onChange={(htmlContent) => handleEditText(note?.id, htmlContent)}
                      />
                    ) : (
                      <>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{}}>
                    <TextWithMath
                      text={note?.title}
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
                  {!showTextFields[note?.id] ? (
                    <Box>
                    <Button
                      variant="outlined"
                      onClick={() => handleMoreInsightClick(note?.id)}
                      sx={{
                        whiteSpace: "nowrap", // Prevent text wrapping
                        minHeight: "36px", // Set a consistent button height
                        lineHeight: "1.5", // Ensure proper vertical alignment
                        textTransform: "none", // Optional: Keep text casing as it is
                        color: "#16AA54",
                        borderColor: "#16AA54",
                      }}
                    >
                      More Insights
                    </Button>
                    {isEdit &&  <IconButton
                          onClick={() => handleEdit(note?.id)}
                          sx={{ color: "#36454F" }}
                          title="Edit Note"
                        >
                          <MdEdit />
                        </IconButton>}
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={insightInputs[note?.id] || ""}
                        onChange={(e) =>
                          setInsightInputs({
                            ...insightInputs,
                            [note?.id]: e.target.value,
                          })
                        }
                        placeholder="Type your query..."
                        sx={{
                          mr: 1,
                          "& .MuiInputBase-input": {
                            fontSize: "14px",
                            fontFamily: "Inter",
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "14px",
                            fontFamily: "Inter",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#ccc", // default border
                            },
                            "&:hover fieldset": {
                              borderColor: "#16AA54", // on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#16AA54", // on focus
                            },
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => sendInfo(note?.id)}
                        color="#16AA54"
                      >
                        <IoMdSend color="#16AA54" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {/* Check and remove leading ** symbols from notes */}
                <Typography variant="subtitle2">
                  <TextWithMath
                    text={note?.notes
                      ?.replace(/^\*\*\s*/, "")
                      ?.replace(/\\n/g, "\n")}
                  />
                </Typography>
                </>
                    )}
              </Box>
            ))
            )}
          </>
        </MathJax.Context>
      )}

      {visibleCount < notes.length && (
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
              color: "#141514"
            },
          }}
        >
          Need More
        </Button>
      )}
    </Box>
  );
};

export default LectureNotes;
