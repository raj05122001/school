import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  getLectureAssignment,
  updateLectureAssignment,
  createAssignment,
} from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { MdAssignmentAdd } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

const LectureAssignment = ({ id, isDarkMode, class_ID, isEdit }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [newAssignment, setNewAssignment] = useState({
    assignment_text: "",
    assignment_mark: 0,
  });
  const [file, setFile] = useState(null); // New state for file
  const [isEditData, setIsEditData] = useState(false);
  const [editedText, setEditedText] = useState("");

  const lectureID = id;

  const checker = Number(userDetails.teacher_id);
  const classID = class_ID;
  const [editedAssignmentId, setEditedAssignmentId] = useState(null);

  const onChange = (e) => {
    setEditedText(e);
  };

  useEffect(() => {
    fetchAssignments();
  }, [id]);

  const fetchAssignments = async () => {
    try {
      const response = await getLectureAssignment(id);
      if (response.success && response?.data.success) {
        setAssignments(response?.data?.data);
      } else {
        setError("Failed to fetch assignments.");
      }
    } catch (err) {
      setError("An error occurred while fetching assignments.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (assignmentId, newMark) => {
    setAssignments((prevAssignments) =>
      prevAssignments?.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, assignment_mark: newMark }
          : assignment
      )
    );
  };

  const handleUpdateAssignment = async (assignment) => {
    setEditedAssignmentId(null);
    setError(null); // Clear any previous error messages
    const { id: assignment_id, assignment_mark, assignment_text } = assignment;
    const formData = {
      assignment_mark,
      is_assigned: true,
      assignment_id,
      assignment_text: editedText,
    };

    try {
      const response = await updateLectureAssignment(
        assignment.lecture.id,
        formData
      );
      if (response?.data.success) {
        setAssignments((prevAssignments) =>
          prevAssignments?.map((a) =>
            a.id === assignment_id
              ? { ...a, assignment_text: editedText, is_assigned: true }
              : a
          )
        );
        setIsEditData(false); // Close the editor after saving
        fetchAssignments();
      } else {
        setError("Failed to update assignment.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the assignment.");
    }
  };

  const handleCreateAssignment = async () => {
    const formData = {
      lecture: Number(lectureID),
      checker,
      assignment_text: newAssignment.assignment_text,
      assignment_mark: newAssignment.assignment_mark,
      lecture_class: class_ID,
      is_assigned: 1,
    };

    if (file) {
      formData.append("assignment_attachment", file); // Append file if available
    }

    try {
      const response = await createAssignment(formData);
      if (response.success) {
        setAssignments((prevAssignments) => [
          ...prevAssignments,
          { ...formData, id: response.data.id, is_assigned: true },
        ]);
        setOpenDialog(false);
      } else {
        setError("Failed to create assignment.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the assignment.");
    }
  };

  const lectureTitle =
    assignments.length > 0 ? assignments[0].lecture.title : "";

  return (
    <>
      {loading ? (
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
            maxHeight: 450,
            width: "100%",
          }}
        >
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
        </Box>
      ) : (
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
            maxHeight: 450,
            width: "100%",
          }}
        >
          <MathJax.Context input="tex">
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  {lectureTitle}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "#4491fc", // blue
                    transition: "all 150ms ease-in-out",
                    color: "#f0f4fa", // white for text

                    ":hover": {
                      backgroundColor: "#2474e3", // Slightly darker blue on hover
                      boxShadow:
                        "0 0 10px 0 #2474e3 inset, 0 0 10px 4px #2474e3", // Matching hover color with blue shade
                    },
                  }}
                  onClick={() => setOpenDialog(true)}
                >
                  Create
                </Button>
              </Box>
              {assignments.map((assignment, index) =>
                editedAssignmentId === assignment.id ? (
                  <Box sx={{ position: "relative" }} key={assignment.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "absolute",
                        right: 4,
                        top: 4,
                        zIndex: 10, // Ensures the button is above other elements
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          handleUpdateAssignment(assignment);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <FaSave size={24} />
                      </IconButton>
                    </Box>
                    <TextEditor
                      text={assignment.assignment_text}
                      onChange={onChange}
                    />
                  </Box>
                ) : (
                  <Box
                    key={assignment.id}
                    sx={{ mb: 2, display: "flex", flexDirection: "column" }}
                  >
                    {isEdit && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <FaEdit
                          size={24}
                          onClick={() => setEditedAssignmentId(assignment.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {String.fromCharCode(65 + index)}.&nbsp;
                      </Typography>
                      {/* <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: assignment.assignment_text,
                        }}
                      /> */}
                      <Box>
                        <TextWithMath text={assignment.assignment_text} />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: "auto",
                      }}
                    >
                      <TextField
                        type="number"
                        InputLabelProps={{
                          style: { color: isDarkMode ? "#d7e4fc" : "" },
                        }}
                        InputProps={{
                          sx: {
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            "& .MuiOutlinedInput-notchedOutline": {},
                          },
                        }}
                        value={assignment.assignment_mark}
                        onChange={(e) =>
                          handleMarkChange(
                            assignment.id,
                            Number(e.target.value)
                          )
                        }
                        variant="outlined"
                        size="small"
                        sx={{ width: 80, mr: 2 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleUpdateAssignment(assignment)}
                        sx={{
                          // backgroundColor: assignment.is_assigned
                          //   ? "green"
                          //   : "#89CFF0",
                          backgroundColor: "#89CFF0",
                          color: "white",
                        }}
                      >
                        {assignment.is_assigned ? "Assign" : "Assign"}
                      </Button>
                    </Box>
                  </Box>
                )
              )}
            </>
          </MathJax.Context>

          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
            sx={{
              "& .MuiDialogContent-root": {
                // bgcolor: isDarkMode ? "#424242" : "white",
                color: isDarkMode ? "white" : "black",
                background: isDarkMode
                  ? "linear-gradient(to top, #09203f 0%, #537895 100%)"
                  : "linear-gradient(109.6deg, rgb(223, 234, 247) 11.2%, rgb(244, 248, 252) 91.1%)",
                // backgroundImage: "url('/create_lectureBG.jpg')", // Add background image
                // backgroundSize: "cover", // Ensure the image covers the entire page
                // backgroundPosition: "center", // Center the image
              },
              "& .MuiDialogTitle-root": {
                bgcolor: isDarkMode ? "#424242" : "white",
                color: isDarkMode ? "white" : "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: isDarkMode
                  ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
                  : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
              },
              "& .MuiPaper-root": {
                border: "2px solid #0096FF",
                borderRadius: "12px",
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: isDarkMode ? "#424242" : "white", // Apply the background color dynamically
                color: isDarkMode ? "white" : "black",
              }}
            >
              {" "}
              <MdAssignmentAdd
                style={{
                  color: isDarkMode ? "white" : "black",
                  marginRight: "2px",
                }}
              />{" "}
              Create Assignment
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Assignment Text"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={5}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#d7e4fc" : "" },
                }}
                InputProps={{
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    "& .MuiOutlinedInput-notchedOutline": {},
                  },
                }}
                value={newAssignment.assignment_text}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    assignment_text: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Assignment Marks"
                type="number"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  style: { color: isDarkMode ? "#d7e4fc" : "" },
                }}
                InputProps={{
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    "& .MuiOutlinedInput-notchedOutline": {},
                  },
                }}
                value={newAssignment.assignment_mark}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    assignment_mark: Number(e.target.value),
                  })
                }
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ marginTop: "16px" }}
              />
            </DialogContent>
            <DialogActions
              sx={{
                background: isDarkMode
                  ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
                  : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
              }}
            >
              <Button onClick={() => setOpenDialog(false)} color="warning">
                Cancel
              </Button>
              <Button onClick={handleCreateAssignment} color="info">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default LectureAssignment;
