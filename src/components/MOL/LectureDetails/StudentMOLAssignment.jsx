import React, { useEffect, useState, useReducer, useCallback, useRef } from "react";
import { Box, Typography, Skeleton, Snackbar, Alert } from "@mui/material";
import { getLectureAssignment,getAssignmentAnswer } from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import AssignmentItem from "./StudentMolAssignment/AssignmentItem";
import { initialState, reducer } from "./StudentMolAssignment/stateManagement";

const StudentMOLAssignment = ({ id, isDarkMode, class_ID }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { assignments, loading, error, snackbar } = state;
  const [submittedId,SetSubmittedId]=useState([])
  const [assignmentType, setAssignmentType] = useState([])
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);
  
  const answered_by = Number(userDetails?.student_id);
  useEffect(() => {
    if(id){
      if (!hasFetchedData.current) {
        hasFetchedData.current = true;
        fetchAssignments();
        fetchAssignmentAnswer()
      }     
    }
  }, [id]);

  const fetchAssignments = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await getLectureAssignment(id);
      if (response.success && response?.data.success) {
        const assignedAssignments = response?.data?.data?.filter(
          (assignment) => assignment.is_assigned
        );
        dispatch({ type: "FETCH_SUCCESS", payload: assignedAssignments });
      } else {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Failed to fetch assignments.",
        });
      }
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "An error occurred while fetching assignments.",
      });
    }
  }, [id]);

  const fetchAssignmentAnswer=async()=>{
    try{
      const response=await getAssignmentAnswer(id)
      const data=response?.data?.data?.data
      const newData=data?.map((val)=>val?.assignment_que?.id)
      const typeAssignment = data?.map((val)=>val?.answer_type)
      SetSubmittedId(newData)
      setAssignmentType(data)   
    }catch(error){
      console.error(error);
    }
  }

  const lectureTitle =
    assignments.length > 0 ? assignments[0].lecture.title : "";

  if (loading) {
    return (
      <Box sx={{ p: 3, width: "100%" }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(7)]?.map((_, index) => (
          <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }
  const legendItems = [
    { label: "Fully Submitted", color: "#77ed84" },
    { label: "Re-Submit to Teacher", color: "#696ff5" },
    { label: "Not Attempted", color: "#c96f5b" },
  ];
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
          </Box>
          <Typography component="div" style={{ display: 'flex', gap: '8px', margin: 10 }}>
            {legendItems?.map((item, index) => (
                <Box key={index} display="flex" alignItems="center">
                    <Box
                        sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: item.color,
                            borderRadius: '4px',
                            marginRight: '8px',
                        }}
                    />
                    <Typography variant="body2" color="textPrimary">
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Typography>
          {assignments?.map((assignment, index) => {
            const submitStatus = assignmentType?.find((val)=>val?.assignment_que?.id===assignment.id)?.is_submitted || false
            return (
              <AssignmentItem
              isSubmitted={submittedId?.includes(assignment.id)}
              key={assignment.id}
              assignment={assignment}
              index={index}
              answered_by={answered_by}
              dispatch={dispatch}
              isDarkMode={isDarkMode}
              fetchAssignmentAnswer={fetchAssignmentAnswer}
              assignmentType={assignmentType?.find((val)=>val?.assignment_que?.id===assignment.id)?.answer_type}
              isSubmit={submitStatus}
              marksObtained={assignmentType?.find((val)=>val?.assignment_que?.id===assignment.id)?.marks_obtained}
              teacherComments={assignmentType?.find((val)=>val?.assignment_que?.id===assignment.id)?.comment_by_teacher}
              fetchAssignments={fetchAssignments}
            />
            )
          })}
        </>
      </MathJax.Context>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "SNACKBAR_CLOSE" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => dispatch({ type: "SNACKBAR_CLOSE" })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentMOLAssignment;