import React, { useEffect, useState, useRef } from "react";
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
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  getLectureAssignment,
  updateLectureAssignment,
  createAssignment,
  postRewriteAI,
} from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { MdAssignmentAdd } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import AssignmentTextFormat from "@/commonComponents/TextWithMath/AssignmentTextFormat";

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
  const [isLoadingRewrite, setIsLoadingRewrite] = useState(false);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls
  const [openAccordian, setOpenAccordian] = useState(false);
  const [activeAccordion, setActiveAccordion] = React.useState(null);

  const lectureID = id;

  const checker = Number(userDetails?.teacher_id);
  const classID = class_ID;
  const [editedAssignmentId, setEditedAssignmentId] = useState(null);

  const onChange = (e) => {
    setEditedText(e);
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchAssignments();
    }
  }, [id]);

  const fetchAssignments = async () => {
    try {
      const response = await getLectureAssignment(id);
      if (response?.success && response?.data.success) {
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
        assignment?.id === assignmentId
          ? { ...assignment, assignment_mark: newMark }
          : assignment
      )
    );
  };

  const handleEditAssignment = async (assignment) => {
    setEditedAssignmentId(null);
    setError(null); // Clear any previous error messages
    const { id: assignment_id, assignment_mark, assignment_text } = assignment;
    const formData = {
      assignment_mark,
      is_assigned: false, // Ensure it's not assigned when editing
      assignment_id,
      assignment_text: editedText === "" ? assignment_text : editedText,
    };
  
    try {
      const response = await updateLectureAssignment(
        assignment?.lecture.id,
        formData
      );
  
      if (response?.data?.success) {
        setAssignments((prevAssignments) =>
          prevAssignments?.map((a) =>
            a?.id === assignment_id
              ? { ...a, assignment_text: editedText } // Update only the text
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
  
  const handleAssignAssignment = async (assignment) => {
    setError(null); // Clear any previous error messages
    const { id: assignment_id, assignment_mark, assignment_text } = assignment;
    const formData = {
      assignment_mark,
      is_assigned: true, // Assign the assignment
      assignment_id,
      assignment_text,
    };
  
    try {
      const response = await updateLectureAssignment(
        assignment?.lecture.id,
        formData
      );
  
      if (response?.data?.success) {
        setAssignments((prevAssignments) =>
          prevAssignments?.map((a) =>
            a?.id === assignment_id ? { ...a, is_assigned: true } : a
          )
        );
        fetchAssignments();
      } else {
        setError("Failed to assign the assignment.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while assigning the assignment.");
    }
  };
  

  const handleCreateAssignment = async () => {
    const formData = {
      lecture: Number(lectureID),
      checker,
      assignment_text: newAssignment?.assignment_text,
      assignment_mark: newAssignment?.assignment_mark,
      lecture_class: class_ID,
      is_assigned: 1,
    };

    if (file) {
      formData.assignment_attachment = file;
    }

    try {
      const response = await createAssignment(formData);
      if (response?.data?.success) {
        setAssignments((prevAssignments) => [
          ...prevAssignments,
          { ...formData, id: response?.data?.id, is_assigned: true },
        ]);
        fetchAssignments();
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

  const handleRewriteWithAI = async (text) => {
    setIsLoadingRewrite(true); // Start loader
    try {
      const formData = { text };
      const response = await postRewriteAI(formData);
      if (response.data.success) {
        setNewAssignment((prevState) => ({
          ...prevState,
          assignment_text: response.data.data.assignment_question,
        }));
      } else {
        console.error("Failed to rewrite with AI:", response.message);
      }
    } catch (error) {
      console.error("Error rewriting with AI:", error);
    } finally {
      setIsLoadingRewrite(false); // Stop loader
    }
  };

  const getFileName = (path = "") => {
    const pathSplited = path?.split("/");
    return pathSplited?.pop();
  };

  const downloadFile = (path) => {
    const downloadPath = path?.startsWith("http")
      ? path
      : `${BASE_URL_MEET}${path}`;
    const link = document?.createElement("a");
    link.href = downloadPath;
    link.target = "_blank";
    link.download = getFileName(path);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const legendItems = [
    { label: "Assigned", color: "#30a347" },
    { label: "Not Assigned", color: "#d1cc3f" },
  ];

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
            maxHeight: 500,
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
            maxHeight: 500,
            width: "100%",
          }}
        >
          <Typography
            component="div"
            style={{ display: "flex", gap: "8px", margin: 10 }}
          >
            {legendItems?.map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    backgroundColor: item.color,
                    borderRadius: "4px",
                    marginRight: "8px",
                  }}
                />
                <Typography variant="body2" color="textPrimary">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Typography>
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
              {assignments?.map((assignment, index) =>
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
                          handleEditAssignment(assignment);
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
                ) : activeAccordion === assignment?.id ? (
                  <Box
                    key={assignment.id}
                    sx={{
                      mb: 2,
                      mt: 2,
                      p: 2,
                      position:"relative",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: assignment?.is_assigned
                        ? "0px 2px 8px #30a347"
                        : "0px 2px 8px #a39f30",
                    }}
                  >
                  <label
                      style={{
                        position: "absolute",
                        color: "white",
                        top: "-10px",
                        right: "10px",
                        backgroundColor:
                        assignment?.is_assigned
                        ? "#30a347"
                        : "#a39f30",
                        color: "white",
                        width: "150px",
                        textAlign: "center",
                        height: "30px",
                        padding: "6px 6px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {assignment?.is_assigned
                        ? "Assigned"
                        : "Not Assigned"}
                    </label>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        alignItems: "center",
                        padding: 2
                      }}
                    >
                      <Typography variant="h6">
                        Question {String.fromCharCode(65 + index)}&nbsp;
                      </Typography>
                      {isEdit && (
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "space-evenly",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: "auto",
                            }}
                          >
                            <span style={{ marginRight: 2 }}>Marks:</span>
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
                              sx={{ width: 80, mr: 1 }}
                            />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {assignment.assignment_attachment && (
                              <Button
                                variant="contained"
                                startIcon={
                                  <BsDownload style={{ padding: 1 }} />
                                }
                                sx={{
                                  color: isDarkMode ? "#fff" : "#000",
                                  backgroundColor: isDarkMode
                                    ? "#507dba"
                                    : "#89CFF0",
                                  p: 1,
                                  fontSize: "12px",
                                  ":hover": {
                                    color: "#fff",
                                  },
                                }}
                                onClick={() =>
                                  downloadFile(assignment.assignment_attachment)
                                }
                              >
                                Download
                              </Button>
                            )}
                            <Button
                              variant="contained"
                              onClick={() => handleAssignAssignment(assignment)}
                              sx={{
                                // backgroundColor: assignment.is_assigned
                                //   ? "green"
                                //   : "#89CFF0",
                                backgroundColor: assignment?.is_assigned
                                  ? "#92d689"
                                  : "#89CFF0",
                                color: "white",
                              }}
                            >
                              {assignment.is_assigned ? "Assigned" : "Assign"}
                            </Button>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FaEdit
                              size={24}
                              onClick={() =>
                                setEditedAssignmentId(assignment.id)
                              }
                              style={{ cursor: "pointer" }}
                            />
                            <IconButton
                              onClick={() =>
                                setActiveAccordion(
                                  activeAccordion === assignment?.id
                                    ? null
                                    : assignment?.id
                                )
                              }
                            >
                              <IoIosArrowUp
                                style={{
                                  color: isDarkMode ? "#fff" : "#000000",
                                }}
                              />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ marginY: 2 }}>
                      <Divider />
                    </Box>

                    <Box sx={{ display: "flex", padding: 2 }}>
                      {/* <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html: assignment.assignment_text,
                        }}
                      /> */}
                      <Box>
                        <AssignmentTextFormat
                          text={assignment.assignment_text}
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mb: 4,
                      mt: 4,
                      display: "flex",
                      position: "relative",
                      borderRadius: 4,
                      flexDirection: "row",
                      boxShadow: assignment?.is_assigned
                        ? "0px 2px 8px #30a347"
                        : "0px 2px 8px #a39f30",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === assignment?.id
                          ? null
                          : assignment?.id
                      )
                    }
                  >
                    <label
                      style={{
                        position: "absolute",
                        color: "white",
                        top: "-10px",
                        right: "10px",
                        backgroundColor:
                        assignment?.is_assigned
                        ? "#30a347"
                        : "#a39f30",
                        color: "white",
                        width: "150px",
                        textAlign: "center",
                        height: "30px",
                        padding: "6px 6px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {assignment?.is_assigned
                        ? "Assigned"
                        : "Not Assigned"}
                    </label>
                    <Box sx={{ display: "flex", padding: 2,}}>
                      <Typography variant="body1">
                        {String.fromCharCode(65 + index)}.&nbsp;
                      </Typography>
                      <Box mt={0.3}>
                        <AssignmentTextFormat
                          text={
                            assignment.assignment_text?.length > 200
                              ? `${assignment.assignment_text?.slice(
                                  0,
                                  200
                                )}...`
                              : assignment.assignment_text
                          }
                        />
                      </Box>
                    </Box>
                    <Box>
                      <IconButton>
                        <IoIosArrowDown
                          style={{ color: isDarkMode ? "#fff" : "#000000" }}
                        />
                      </IconButton>
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
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  disabled={isLoadingRewrite} // Disable button while loading
                  onClick={async () => {
                    await handleRewriteWithAI(newAssignment.assignment_text);
                  }}
                  sx={{
                    backgroundColor: "#6a0dad",
                    color: "white",
                    ":hover": {
                      backgroundColor: "#5a00c1",
                    },
                  }}
                >
                  {isLoadingRewrite ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "#fff", width: "100%" }}
                    />
                  ) : (
                    "◇ Rewrite with AI "
                  )}
                </Button>
              </Box>
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
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
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