import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Skeleton,
  IconButton,
  Stack,
} from "@mui/material";
import {
  getAssignmentAnswer,
  getLectureAssignment,
  submitMOLAssignment,
} from "@/api/apiHelper";
import MathJax from "react-mathjax2";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { FaPhotoVideo, FaFileAudio, FaRegFileVideo } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { AwsSdk } from "@/hooks/AwsSdk";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

const StudentMOLAssignment = ({ id, isDarkMode, class_ID }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileLinks, setFileLinks] = useState({});
  const [answerDescriptions, setAnswerDescriptions] = useState({});
  const [submitted, setSubmitted] = useState({});

  const lectureID = id;
  const answered_by = Number(userDetails.student_id);
  console.log("answered_by", answered_by);
  const classID = class_ID;

  const { s3 } = AwsSdk();

  const uploadToS3 = async (
    chunk,
    key,
    
    assignmentId
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        let params;

        // Set the appropriate parameters based on the key
        if (key === "video") {
          params = {
            Bucket: "vidya-ai-video",
            Key: `assignment/lecture_${id}/video.mp4`,
            Body: chunk,
            ContentType: "video/mp4",
          };
        } else if (key === "audio") {
          params = {
            Bucket: "vidya-ai-video",
            Key: `assignment/lecture_${id}/audio.mp3`,
            Body: chunk,
            ContentType: "audio/mp3",
          };
        } else if (key === "picture") {
          params = {
            Bucket: "vidya-ai-video",
            Key: `assignment/lecture_${id}/picture.png`,
            Body: chunk,
            ContentType: "image/png",
          };
        } else if (key === "document") {
          // Extract the file extension from fileName
          const extension = chunk?.name.split(".").pop();
          let contentType;

          // Determine MIME type based on file extension
          switch (extension) {
            case "pdf":
              contentType = "application/pdf";
              break;
            case "xlsx":
              contentType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
              break;
            case "xls":
              contentType = "application/vnd.ms-excel";
              break;
            case "doc":
              contentType = "application/msword";
              break;
            case "docx":
              contentType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
              break;
            default:
              contentType = "application/octet-stream";
          }

          params = {
            Bucket: "vidya-ai-video",
            Key: `assignment/lecture_${id}/${chunk?.name}`,
            Body: chunk,
            ContentType: contentType,
          };
        } else {
          return reject(new Error("Invalid key specified"));
        }

        const options = {
          partSize: 10 * 1024 * 1024, // 10 MB
          queueSize: 4, // 4 parallel uploads
        };

        // Use Upload from @aws-sdk/lib-storage
        const upload = new Upload({
          client: s3,
          params,
          ...options,
          // Progress tracking
          leavePartsOnError: false, // Cleans up the parts on failure
        });

        const result = await upload.done();
        const newLinks = fileLinks[assignmentId]
          ? [...fileLinks[assignmentId], result.Location]
          : [result.Location];
        setFileLinks((prev) => ({ ...prev, [assignmentId]: newLinks }));
        console.log("New Links", newLinks)
        console.log("Assign ID",assignmentId)
        console.log("Result location", result.Location);
        console.log("File uploaded successfully:", result);
        resolve(result);
      } catch (err) {
        console.error("Error uploading file:", err);
        reject(err);
      }
    });
  };

  const handleSubmit = async (assignmentId, answered_by, submissionData) => {

    if (!assignmentId || !answered_by) {
      console.error("Invalid assignmentId or studentId:", {
        assignmentId,
        answered_by,
      });
      alert("Error: Invalid assignment or student ID.");
      return;
    }

    try {
      // Fetch existing submissions
      const response = await getAssignmentAnswer(id, assignmentId);
      
      const existingSubmissions = response?.data?.data?.data;
      console.log("Exisiting Submisison", existingSubmissions);
      // Check for existing submission
      const alreadySubmitted = existingSubmissions.some(
        (submission) =>
          submission?.assignment_que?.id === assignmentId &&
          submission?.answer_by?.id === answered_by
      );

      console.log("Already SUbmitted", alreadySubmitted);
      console.log("FileLink", fileLinks)
      console.log("New File",)
      console.log("Answer Description", answerDescriptions)

      if (alreadySubmitted) {
        // Show error or update existing submission if needed
        alert("This assignment has already been submitted.");
      } else {
        const formData = {
          assignment_que: assignmentId,
          answer_by: answered_by,
          answer_link: fileLinks[assignmentId]?.[0], // join multiple links if uploaded
          answer_description: answerDescriptions[assignmentId] || null,
        };
        const response = await submitMOLAssignment(formData);
        console.log("Response submission", response)
        if (response.data.success) {
          setSubmitted((prev) => ({ ...prev, [assignmentId]: true }));
        } else {
          console.error("Error submitting assignment:", response.message);
        }
      }
      
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getLectureAssignment(id);
        if (response.success && response?.data.success) {
          const assignedAssignments = response?.data?.data.filter(
            (assignment) => assignment.is_assigned
          );
          setAssignments(assignedAssignments);
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

  const lectureTitle =
    assignments.length > 0 ? assignments[0].lecture.title : "";

  if (loading) {
    return (
      <Box sx={{ p: 3, width: "100%" }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(7)].map((_, index) => (
          <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
        ))}
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
          {assignments.map((assignment, index) => (
            <Box
              key={assignment.id}
              sx={{ mb: 4, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                {String.fromCharCode(65 + index)}.{" "}
              </Typography>
              <MathJax.Text text={assignment.assignment_text} />
              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                Marks: {assignment.assignment_mark}
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Describe your answer here..."
                sx={{ mt: 2, mb: 2 }}
                onChange={(e) =>
                  setAnswerDescriptions((prev) => ({
                    ...prev,
                    [assignment.id]: e.target.value,
                  }))
                }
                disabled={submitted[assignment.id]}
              />

              {!submitted[assignment.id] && (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="primary"
                    component="label"
                    onChange={(e) =>
                      uploadToS3(e.target.files[0], "picture", assignment.id)
                    }
                  >
                    <FaPhotoVideo />
                    <input hidden accept="image/*" type="file" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    component="label"
                    onChange={(e) =>
                      uploadToS3(e.target.files[0], "audio", assignment.id)
                    }
                  >
                    <FaFileAudio />
                    <input hidden accept="audio/*" type="file" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    component="label"
                    onChange={(e) =>
                      uploadToS3(e.target.files[0], "video", assignment.id)
                    }
                  >
                    <FaRegFileVideo />
                    <input hidden accept="video/*" type="file" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    component="label"
                    onChange={(e) =>
                      uploadToS3(e.target.files[0], "document", assignment.id)
                    }
                  >
                    <MdDescription />
                    <input hidden accept=".pdf,.doc,.docx,.txt" type="file" />
                  </IconButton>
                </Stack>
              )}

              {!submitted[assignment.id] && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(assignment.id, answered_by)}
                  sx={{ mt: 2 }}
                >
                  Submit Assignment
                </Button>
              )}
            </Box>
          ))}
        </>
      </MathJax.Context>
    </Box>
  );
};

export default StudentMOLAssignment;
