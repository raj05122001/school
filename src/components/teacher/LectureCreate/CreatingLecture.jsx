import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs"; // Import dayjs for date handling
import { MdOutlineClass } from "react-icons/md";
import Image from "next/image";
import { lecture_type } from "@/helper/Helper";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaQuestion,
  FaTools,
  FaClipboard,
} from "react-icons/fa";

import {
  getClassDropdown,
  getSubjectByClass,
  getChapterBySubject,
  getTopicsByChapter,
  getTeacherDetails,
  createLecture,
} from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useThemeContext } from "@/hooks/ThemeContext";
import { LectureTyps } from "@/helper/Helper";

// const lectureTypes = [
//   {
//     name: "Subject Lecture",
//     type: "subject",
//     icon: <FaChalkboardTeacher />,
//     key: "subject",
//   },
//   {
//     name: "Case Study Lecture",
//     type: "case",
//     icon: <FaBookOpen />,
//     key: "case",
//   },
//   { name: "Q/A Session", type: "qa", icon: <FaQuestion />, key: "qa" },
//   {
//     name: "Workshop Lecture",
//     type: "workshop",
//     icon: <FaTools />,
//     key: "workshop",
//   },
//   { name: "Quiz Session", type: "quiz", icon: <FaClipboard />, key: "quiz" },
// ];

const platforms = ["Zoom", "Google Meet", "Microsoft Teams"];

const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
console.log("User Details is", userDetails);
const userID = userDetails.user_id;
console.log("user ID", userID);

const CreatingLecture = ({ open, handleClose, lecture, isEditMode }) => {
  const [lectureClass, setLectureClass] = useState("");
  const [lectureSubject, setLectureSubject] = useState("");
  const [lectureChapter, setLectureChapter] = useState("");
  const [lectureTopics, setLectureTopics] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");

  console.log("Lecture is", lecture);
  console.log("Class is", lecture?.lecture_class?.name);
  console.log("Subject Name", lecture?.chapter?.subject?.name);
  console.log("Chapter Name", lecture?.chapter?.chapter);
  console.log("Topics Name", lecture?.topics);
  console.log("Description Name", lecture?.description);
  console.log("Lecture Type", lecture?.type);
  console.log("Schedule Date", lecture?.schedule_date);
  console.log("Schedule Time", lecture?.schedule_date);
  console.log("Edit Mode", isEditMode);

  // Default the lecture type to "subject"
  const [lectureType, setLectureType] = useState("subject");

  // Set the current date and time as default
  const [lectureDate, setLectureDate] = useState(dayjs());
  const [lectureStartTime, setLectureStartTime] = useState(dayjs());

  const [lectureDuration, setLectureDuration] = useState("");
  const [platform, setPlatform] = useState("");
  const [file, setFile] = useState(null);

  // Dropdown options state
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [chapterID, setChapterID] = useState(null);
  const [classID, setClassID] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState({});

  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  // Fetch the class options from the API and extract the class names
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await getClassDropdown();

        // Map through the data and extract the department name for each class
        const classNames = response.data.map((item) => ({
          id: item.id,
          name: item.department.name,
        }));

        setClassOptions(classNames); // Set the mapped class names in state
      } catch (error) {
        console.error("Failed to fetch class options", error);
      }
    };

    fetchClassOptions();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass) {
        try {
          const response = await getSubjectByClass(selectedClass.name, ""); // Pass class name

          // Check if the response is valid and contains data
          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            // Filter out subjects that have empty or null names
            const validSubjects = response.data.data.filter(
              (subject) => subject.name && subject.name.trim() !== ""
            );

            const subjects = validSubjects.map((subject) => ({
              id: subject.id,
              name: subject.name,
            }));

            setSubjectOptions(subjects); // Set the filtered subjects
          } else {
            console.error("Invalid subject data format");
          }
        } catch (error) {
          console.error("Failed to fetch subject options", error);
        }
      }
    };

    fetchSubjects();
  }, [selectedClass]);

  // Fetch chapters based on selected subject
  useEffect(() => {
    if (lectureSubject) {
      const fetchChapterOptions = async () => {
        try {
          const response = await getChapterBySubject(lectureSubject, "");

          // Check if response contains the data array
          if (response.data.data && Array.isArray(response.data.data)) {
            // Filter out subjects that have empty or null names
            const validChapters = response.data.data.filter(
              (chapter) => chapter.chapter && chapter.chapter.trim() !== ""
            );
            const chapters = validChapters.map((chapter) => ({
              id: chapter.id,
              name: chapter.chapter, // Use the "chapter" field for names
            }));
            setChapterOptions(chapters); // Set the fetched chapter data
          } else {
            console.error("Invalid chapter data format");
          }
        } catch (error) {
          console.error("Failed to fetch chapter options", error);
        }
      };

      fetchChapterOptions();
    }
  }, [lectureSubject]);

  // Fetch topics based on selected chapter
  useEffect(() => {
    if (lectureChapter) {
      const fetchTopicOptions = async () => {
        try {
          const response = await getTopicsByChapter(lectureChapter, "");
          // Check if response contains the data array
          if (response.data.data && Array.isArray(response.data.data)) {
            // Filter out subjects that have empty or null names
            const validTopics = response.data.data.filter(
              (topic) => topic.topics && topic.topics.trim() !== ""
            );
            const topics = validTopics.map((topic) => ({
              id: topic.id,
              name: topic.topics, // Use the "chapter" field for names
            }));
            setTopicOptions(topics); // Set the fetched topics data
            console.log("topics are", topics);
          } else {
            console.error("Invalid chapter data format");
          }
        } catch (error) {
          console.error("Failed to fetch topic options", error);
        }
      };

      fetchTopicOptions();
    }
  }, [lectureChapter]);

  // Populate form fields when edit mode is true
  useEffect(() => {
    if (isEditMode && lecture) {
      setLectureClass(lecture?.lecture_class?.name || "");
      setLectureSubject(lecture?.chapter?.subject?.name || "");
      setLectureChapter(lecture?.chapter?.chapter || "");
      setLectureTopics(lecture?.topics || "");
      setLectureDescription(lecture?.description || "");
      setLectureType(lecture?.type || "subject");
      setLectureDate(dayjs(lecture?.schedule_date) || dayjs());
      setLectureStartTime(dayjs(lecture?.schedule_date) || dayjs());
    }
  }, [isEditMode, lecture]);

  const encodeURI = (value) => {
    return encodeURIComponent(value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object to send to the API
    const formData = new FormData();
      // Encoding the values to avoid special characters mismatch
  const encodedClass = encodeURI(selectedClass?.id);
  const encodedSubject = encodeURI(lectureSubject);
  const encodedChapter = encodeURI(chapterID);
  const encodedTopics = encodeURI(lectureTopics);
  const encodedDescription = encodeURI(lectureDescription || "");

    // Append the form data
    formData.append("lecture_class", encodedClass);
    formData.append("subject", encodedSubject);
    formData.append("chapter", encodedChapter);
    formData.append("topics", encodedTopics);
    formData.append("title", encodedTopics);
    formData.append("organizer", userDetails.teacher_id); // Assuming organizer is the logged-in user
    console.log("Submitted User ID", userDetails.teacher_id);
    formData.append("schedule_date", lectureDate.format("YYYY-MM-DD")); // Format date
    formData.append("schedule_time", lectureStartTime.format("HH:mm")); // Format time
    formData.append("type", lectureType);
    formData.append("description", encodedDescription); // Append description if provided
    if (file) {
      formData.append("file", file); // Append file if uploaded
    }

    try {
      // Call the createLecture API
      const response = await createLecture(formData);

      if (response.data.success) {
        console.log("Lecture created successfully");
        // You can add additional actions after a successful response, e.g., closing the form
        handleClose();
      } else {
        console.error("Failed to create lecture:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialogContent-root": {
          bgcolor: isDarkMode ? "#424242" : "white",
          color: isDarkMode ? "white" : "black",
          background: isDarkMode
            ? "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%);"
            : "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%);",
        },
        "& .MuiDialogTitle-root": {
          bgcolor: isDarkMode ? "#424242" : "white",
          color: isDarkMode ? "white" : "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: isDarkMode
            ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
            : "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
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
        <MdOutlineClass
          style={{ color: isDarkMode ? "white" : "black", marginRight: "2px" }}
        />{" "}
        Create Lecture
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} marginTop={2}>
            {/* Lecture Class */}
            <Grid item xs={6}>
              <Autocomplete
                options={classOptions}
                getOptionLabel={(option) => option.name} // Display the department name in dropdown
                onChange={(event, newValue) => {
                  setSelectedClass(newValue);
                  setClassID(newValue.id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lecture Class"
                    variant="outlined"
                    fullWidth
                  />
                )}
                value={selectedClass}
              />
            </Grid>

            {/* Lecture Subject */}
            <Grid item xs={6}>
              <Autocomplete
                options={subjectOptions} // Use the state that holds the subject options
                getOptionLabel={(option) => option.name} // Display subject names
                onChange={(event, newValue) => {
                  if (newValue) {
                    setLectureSubject(newValue.name);
                  }
                }} // Set selected subject name
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lecture Subject"
                    variant="outlined"
                    fullWidth
                  />
                )}
                value={
                  subjectOptions.find(
                    (option) => option.name === lectureSubject
                  ) || null
                } // Find selected subject by name
              />
            </Grid>

            {/* Lecture Chapter */}
            <Grid item xs={6}>
              <Autocomplete
                options={chapterOptions} // Use the updated chapter options array
                getOptionLabel={(option) => option.name} // Display chapter names
                value={
                  chapterOptions.find(
                    (option) => option.name === lectureChapter
                  ) || null
                } // Set the selected chapter
                onChange={(event, newValue) => {
                  if (newValue) {
                    setLectureChapter(newValue.name); // Set the chapter name
                    setChapterID(newValue.id);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lecture Chapter"
                    variant="outlined"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            {/* Lecture Topics */}
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                options={topicOptions.map((option) => option.name)}
                value={lectureTopics}
                onInputChange={(e, newValue) => setLectureTopics(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lecture Topics"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>

            {/* Lecture Type */}
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel id="lecture-type-label">Lecture Type</InputLabel>
                <Select
                  labelId="lecture-type-label"
                  value={lectureType}
                  onChange={(e) => setLectureType(e.target.value)}
                  label="Lecture Type"
                >
                  {lecture_type.map((value) => (
                    <MenuItem key={value.key} value={value.key}>
                      <Box sx={{ display: "flex" }}>
                        <ListItemIcon>
                          <Image src={value.image} width={24} height={24} />
                        </ListItemIcon>
                        <ListItemText>{value.name}</ListItemText>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lecture Description (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Lecture Description (Optional)"
                value={lectureDescription}
                onChange={(e) => setLectureDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>

            {/* Lecture Date */}
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Lecture Date"
                  value={lectureDate}
                  onChange={(newDate) => setLectureDate(newDate)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Lecture Start Time */}
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Lecture Start Time"
                  value={lectureStartTime}
                  onChange={(newTime) => setLectureStartTime(newTime)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Attach Lecture Material */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Attach Lecture Material
                <input
                  type="file"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              {file && <Typography variant="body2">{file.name}</Typography>}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          background: isDarkMode
            ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
            : "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
        }}
      >
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {isEditMode ? "Update Lecture" : "Create Lecture"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatingLecture;
