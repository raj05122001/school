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
  getClassDropdown,
  getSubjectByClass,
  getChapterBySubject,
  getTopicsByChapter,
  createLecture,
  updateLecture,
} from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useThemeContext } from "@/hooks/ThemeContext";

const platforms = ["Zoom", "Google Meet", "Microsoft Teams"];

const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

const CreatingLecture = ({ open, handleClose, lecture, isEditMode }) => {
  const [lectureClass, setLectureClass] = useState("");
  const [lectureSubject, setLectureSubject] = useState("");
  const [lectureChapter, setLectureChapter] = useState("");
  const [lectureTopics, setLectureTopics] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");

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

  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  const encodeURI = (value) => {
    return encodeURIComponent(value);
  };

  useEffect(() => {
    if (isEditMode && lecture) {
      // Find the class object from the classOptions that matches the lecture class name
      const classObj = classOptions.find(
        (option) =>
          option.name.toLowerCase() ===
          lecture?.lecture_class?.name?.toLowerCase()
      );

      // Find the subject object from the subjectOptions that matches the lecture subject name
      const subjectObj = subjectOptions.find(
        (option) =>
          option.name.toLowerCase() ===
          lecture?.chapter?.subject?.name?.toLowerCase()
      );

      const chapterObj = chapterOptions.find(
        (option) => option.name === lecture?.chapter?.chapter
      );

      setSelectedClass(classObj || null); // Set the selected class object
      setLectureClass(lecture?.lecture_class?.name || "");

      setLectureSubject(lecture?.chapter?.subject?.name || "");
      setSelectedSubject(subjectObj || null); // Set the selected subject object

      setLectureChapter(lecture?.chapter?.chapter || "");
      setChapterID(chapterObj ? chapterObj.id : lecture?.chapter?.id || null);
      setLectureTopics(lecture?.topics || "");
      setLectureDescription(lecture?.description || "");
      setLectureType(lecture?.type || "subject");
      setLectureDate(dayjs(lecture?.schedule_date) || dayjs());
      // Combine schedule_date and schedule_time to set the start time
    const scheduleTime = lecture?.schedule_time;
    const formattedTime = `${lecture.schedule_date}T${scheduleTime}`; // ISO 8601 format
    setLectureStartTime(dayjs(formattedTime)); // Set the start time

    }
  }, [isEditMode, lecture, classOptions, subjectOptions]);

  // Fetch the class options from the API and extract the class names
  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await getClassDropdown();

        // Map through the data and extract the department name for each class
        const classNames = response?.data?.map((item) => ({
          id: item?.id,
          name: item?.name,
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
            response?.data &&
            response?.data.data &&
            Array.isArray(response?.data?.data)
          ) {
            // Filter out subjects that have empty or null names
            const validSubjects = response?.data?.data.filter(
              (subject) => subject?.name && subject?.name.trim() !== ""
            );

            const subjects = validSubjects?.map((subject) => ({
              id: subject?.id,
              name: subject?.name,
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
          if (response?.data?.data && Array.isArray(response?.data?.data)) {
            // Filter out subjects that have empty or null names
            const validChapters = response?.data?.data?.filter(
              (chapter) => chapter?.chapter && chapter?.chapter?.trim() !== ""
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
          if (response?.data?.data && Array.isArray(response?.data?.data)) {
            // Filter out subjects that have empty or null names
            const validTopics = response?.data?.data?.filter(
              (topic) => topic?.topics && topic?.topics?.trim() !== ""
            );
            const topics = validTopics?.map((topic) => ({
              id: topic?.id,
              name: topic?.topics, // Use the "chapter" field for names
            }));
            setTopicOptions(topics);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a new FormData object to send to the API
    const formData = new FormData();

    // Append the form data
    formData.append("lecture_class", selectedClass?.id);
    formData.append("subject", lectureSubject);
    formData.append("chapter", chapterID);
    formData.append("topics", lectureTopics);
    formData.append("title", lectureTopics);
    formData.append("organizer", userDetails.teacher_id); 
    formData.append("schedule_date", lectureDate.format("YYYY-MM-DD")); // Format date
    formData.append("schedule_time", lectureStartTime.format("HH:mm")); // Format time
    formData.append("type", lectureType);
    formData.append("description", lectureDescription || ""); // Append description if provided
    if (file) {
      formData.append("file", file); // Append file if uploaded
    }

    try {
      if (isEditMode && lecture?.id) {
        // Call the updateLecture API when isEditMode is true
        const response = await updateLecture(lecture.id, formData);

        if (response.data.success) {
          handleClose(); // Close the dialog after a successful update
        } else {
          console.error("Failed to update lecture:", response.data.message);
        }
      } else {
        // Call the createLecture API when not in edit mode
        const response = await createLecture(formData);

        if (response.data.success) {
          handleClose(); // Close the dialog after a successful creation
        } else {
          console.error("Failed to create lecture:", response.data.message);
        }
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
                  setClassID(newValue?.id);
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
                    setLectureSubject(newValue?.name);
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
                    (option) => option?.name === lectureSubject
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
                    (option) => option?.name === lectureChapter
                  ) || null
                } // Set the selected chapter
                onChange={(event, newValue) => {
                  if (newValue) {
                    setLectureChapter(newValue?.name); // Set the chapter name
                    setChapterID(newValue?.id);
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
                    <MenuItem key={value?.key} value={value?.key}>
                      <Box sx={{ display: "flex" }}>
                        <ListItemIcon>
                          <Image src={value.image} width={24} height={24} />
                        </ListItemIcon>
                        <ListItemText>{value?.name}</ListItemText>
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
