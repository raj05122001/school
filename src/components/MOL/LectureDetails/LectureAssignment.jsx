import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { getLectureAssignment, updateLectureAssignment } from "@/api/apiHelper";
import MathJax from "react-mathjax2";

const LectureAssignment = ({ id, isDarkMode }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getLectureAssignment(id);
        if (response.success && response.data.success) {
          setAssignments(response.data.data);
        } else {
          setError("Failed to fetch assignments.");
        }
      } catch (err) {
        setError("An error occurred while fetching assignments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id]);

  const handleMarkChange = (assignmentId, newMark) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, assignment_mark: newMark }
          : assignment
      )
    );
  };

  const handleUpdateAssignment = async (assignment) => {
    setError(null); // Clear any previous error messages
    const { id: assignment_id, assignment_mark } = assignment;
    const formData = {
      assignment_mark,
      is_assigned: true,
      assignment_id,
    };
  
    try {
      const response = await updateLectureAssignment(
        assignment.lecture.id,
        formData
      );
      if (response.success) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((a) =>
            a.id === assignment_id ? { ...a, is_assigned: true } : a
          )
        );
      } else {
        setError("Failed to update assignment.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the assignment.");
    }
  };
  

  if (loading) {
    return <Typography>Loading assignments...</Typography>;
  }

  const lectureTitle =
    assignments.length > 0 ? assignments[0].lecture.title : "";

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
      <Typography variant="h6" sx={{ mb: 2, fontWeight:"bold" }}>
        {lectureTitle}
      </Typography>
      {assignments.map((assignment, index) => (
        <Box
          key={assignment.id}
          sx={{ mb: 2, display: "flex", flexDirection: "column" }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            {String.fromCharCode(65 + index)}. {" "} 
          </Typography>
          <MathJax.Text text={assignment.assignment_text} />
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
              value={assignment.assignment_mark}
              onChange={(e) =>
                handleMarkChange(assignment.id, Number(e.target.value))
              }
              variant="outlined"
              size="small"
              sx={{ width: 80, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={() => handleUpdateAssignment(assignment)}
              sx={{
                backgroundColor: assignment.is_assigned ? "green" : "blue",
                color: "white",
              }}
            >
              {assignment.is_assigned ? "Assign" : "Assign"}
            </Button>
          </Box>
        </Box>
      ))}
      </>
    </MathJax.Context>
      
    </Box>
  );
};

export default LectureAssignment;
