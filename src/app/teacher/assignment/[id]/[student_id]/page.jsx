"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { getTeacherAssignment } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import { Varela_Round } from "next/font/google";

const varelaRound = Varela_Round({ weight: "400", subsets: ["latin"] });

const Page = ({ params }) => {
  const { id, student_id } = params;
  const [listData, setListData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  useEffect(() => {
    if (id) {
      fetchAssignmentAnswer();
    }
  }, [id]);

  const fetchAssignmentAnswer = async () => {
    setListLoading(true);
    try {
      const apiResponse = await getTeacherAssignment(id, student_id);
      if (apiResponse?.success) {
        setListData(apiResponse?.data?.assignments);
      }
      setListLoading(false);
    } catch (e) {
      console.error(e);
      setListData([]);
      setListLoading(false);
    }
  };

  const handleGradeSubmission = (assignmentId, marks, comment) => {
    console.log("Grade Submitted:", assignmentId, marks, comment);
  };

  const renderAnswerContent = (assignment) => {
    const { answer_type, answer_link, answer_description } = assignment;

    if (answer_type === "IMAGE" && answer_link) {
      return <img src={answer_link} alt="Answer" style={{ maxWidth: "100%" }} />;
    } else if (answer_type === "VIDEO" && answer_link) {
      return (
        <video controls style={{ maxWidth: "100%" }}>
          <source src={answer_link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (answer_type === "AUDIO" && answer_link) {
      return (
        <audio controls>
          <source src={answer_link} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (answer_link) {
      return (
        <Button href={answer_link} target="_blank" rel="noopener noreferrer" variant="outlined">
          Download File
        </Button>
      );
    } else if (answer_description) {
      return <Typography variant="body2">{answer_description}</Typography>;
    }

    return null;
  };

  return (
    <Box
      sx={{
        color: isDarkMode ? "#fff" : "#000",
        minHeight: "100vh",
        p: 2,
      }}
    >
      {listLoading ? (
        <Typography variant="h6">Loading assignments...</Typography>
      ) : listData.length === 0 ? (
        <Typography variant="h6">No assignments available</Typography>
      ) : (
        listData?.data?.map((assignment, index) => (
          <Card key={assignment.id} sx={{ marginBottom: 4, backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={primaryColor}>
                {index + 1}. {assignment.assignment_que.assignment_text}
              </Typography>
              {renderAnswerContent(assignment)}
              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Marks"
                  type="number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  onChange={(e) =>
                    setListData((prevData) =>
                      prevData.map((item) =>
                        item.id === assignment.id
                          ? { ...item, marks_obtained: e.target.value }
                          : item
                      )
                    )
                  }
                />
                <TextField
                  label="Comment"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  onChange={(e) =>
                    setListData((prevData) =>
                      prevData.map((item) =>
                        item.id === assignment.id
                          ? { ...item, comment_by_teacher: e.target.value }
                          : item
                      )
                    )
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleGradeSubmission(
                      assignment.id,
                      assignment.marks_obtained,
                      assignment.comment_by_teacher
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  Submit Grade
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Page;
