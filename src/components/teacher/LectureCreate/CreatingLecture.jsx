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
import { IoDocumentAttachOutline } from "react-icons/io5";

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
import CustomAutocomplete from "@/commonComponents/CustomAutocomplete/CustomAutocomplete";

const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

const CreatingLecture = ({
  open,
  handleClose,
  lecture,
  isEditMode = false,
}) => {
  const { isDarkMode } = useThemeContext();

  const [lectureSubject, setLectureSubject] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [lectureChapter, setLectureChapter] = useState(null);
  const [chapterName, setChapterName] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState(null);
  const [lectureTopics, setLectureTopics] = useState(null);
  const [topicsName, setTopicsName] = useState(null);

  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureType, setLectureType] = useState("subject");
  const [lectureDate, setLectureDate] = useState(dayjs());
  const [lectureStartTime, setLectureStartTime] = useState(dayjs());
  const [file, setFile] = useState(null);

  // Dropdown options state
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);

  const encodeURI = (value) => encodeURIComponent(value);

  const lowerCase = (str) => str?.toLowerCase();

  useEffect(() => {
    if (isEditMode && lecture) {

      setSelectedClass(
        {
          name: lecture?.lecture_class?.name,
          id: lecture?.lecture_class?.id,
        } || null
      );
      setLectureSubject(lecture?.chapter?.subject || null);
      setLectureChapter(
        { name: lecture?.chapter?.chapter, id: lecture?.chapter?.id } || ""
      );
      setLectureTopics({name:lecture?.topics,id:0} || "");

      console.log("lecture=====>",lecture)

      setLectureDescription(lecture?.description || "");
      setLectureType(lecture?.type || "subject");
      setLectureDate(dayjs(lecture?.schedule_date) || dayjs());
      // Combine schedule_date and schedule_time to set the start time
      const scheduleTime = lecture?.schedule_time;
      const formattedTime = `${lecture.schedule_date}T${scheduleTime}`; // ISO 8601 format
      setLectureStartTime(dayjs(formattedTime)); // Set the start time
    }
  }, [isEditMode, lecture]);

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
          const response = await getChapterBySubject(lectureSubject?.name, "");

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
          const response = await getTopicsByChapter(lectureChapter?.name, "");
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

    const checkCondition = (firstValue, secondValue) => {
      if (lowerCase(firstValue?.name) === lowerCase(secondValue)) {
        return Number(firstValue?.id);
      } else {
        return secondValue;
      }
    };

    const data = {
      subject: checkCondition(lectureSubject, subjectName),
      chapter: checkCondition(lectureChapter, chapterName),
      lecture_class: checkCondition(selectedClass, selectedClassName),
      topics: topicsName,
      title: topicsName,
      organizer: Number(userDetails.teacher_id),
      schedule_date: lectureDate.format("YYYY-MM-DD"),
      schedule_time: lectureStartTime.format("HH:mm"),
      type: lectureType,
      description: lectureDescription || "",
    };

    if (file) {
      data.file = file;
    }

    try {
      if (isEditMode && lecture?.id) {
        // Call the updateLecture API when isEditMode is true
        const response = await updateLecture(lecture.id, data);

        if (response.data.success) {
          handleClose(); // Close the dialog after a successful update
        } else {
          console.error("Failed to update lecture:", response.data.message);
        }
      } else {
        // Call the createLecture API when not in edit mode

        const response = await createLecture(data);

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
              <CustomAutocomplete
                options={classOptions}
                onSelect={setSelectedClass}
                onChange={setSelectedClassName}
                label={"Lecture Class"}
                value={selectedClass}
              />
            </Grid>

            {/* Lecture Subject */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={subjectOptions}
                onSelect={setLectureSubject}
                onChange={setSubjectName}
                label={"Lecture Subject"}
                value={lectureSubject}
              />
            </Grid>

            {/* Lecture Chapter */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={chapterOptions}
                onSelect={setLectureChapter}
                onChange={setChapterName}
                label={"Lecture Chapter"}
                value={lectureChapter}
              />
            </Grid>

            {/* Lecture Topics */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={topicOptions}
                onSelect={setLectureTopics}
                onChange={setTopicsName}
                label={"Lecture Name (Topics)"}
                value={lectureTopics}
              />
            </Grid>

            {/* Lecture Description (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Lecture Description (Optional)"
                value={lectureDescription}
                onChange={(e) => setLectureDescription(e.target.value)}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#d7e4fc" : "" },
                }}
                multiline
                rows={3}
                fullWidth
                InputProps={{
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    "& .MuiOutlinedInput-notchedOutline": {},
                  },
                }}
              />
            </Grid>

            {/* Lecture Type */}
            <Grid item xs={4}>
              <FormControl fullWidth required>
                <InputLabel
                  id="lecture-type-label"
                  sx={{ color: isDarkMode ? "#d7e4fc" : "" }}
                >
                  Lecture Type
                </InputLabel>
                <Select
                  labelId="lecture-type-label"
                  value={lectureType}
                  onChange={(e) => setLectureType(e.target.value)}
                  label="Lecture Type"
                  sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    color: isDarkMode ? "#d7e4fc" : "", // Option text color
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#d7e4fc" : "", // Border color when focused
                    },
                    "& .MuiSvgIcon-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Dropdown arrow color
                    },
                  }}
                >
                  {lecture_type.map((value) => (
                    <MenuItem key={value?.key} value={value?.key}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Image src={value.image} width={22} height={22} />
                        <Typography>{value?.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lecture Date */}
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Lecture Date"
                  value={lectureDate}
                  onChange={(newDate) => setLectureDate(newDate)}
                  sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    color: isDarkMode ? "#d7e4fc" : "", // Option text color
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#d7e4fc" : "", // Border color when focused
                    },
                    "& .MuiSvgIcon-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Dropdown arrow color
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Label color
                    },
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "#d7e4fc" : "", // Input text (date value) color
                    },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Lecture Start Time */}
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Lecture Start Time"
                  value={lectureStartTime}
                  sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    color: isDarkMode ? "#d7e4fc" : "", // Option text color
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#d7e4fc" : "", // Border color when focused
                    },
                    "& .MuiSvgIcon-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Dropdown arrow color
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Label color
                    },
                    "& .MuiInputBase-input": {
                      color: isDarkMode ? "#d7e4fc" : "", // Input text (date value) color
                    },
                  }}
                  onChange={(newTime) => setLectureStartTime(newTime)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Attach Lecture Material */}

            <Grid
              item
              xs={12}
              justifyContent={"center"}
              sx={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <Grid item xs={4}>
                <Button
                  variant="color"
                  component="label"
                  fullWidth
                  sx={{
                    color: isDarkMode ? "#d7e4fc" : "", // Text color inside the button
                    border: "1px solid",
                    borderColor: isDarkMode ? "#d7e4fc" : "",
                  }}
                >
                  <IoDocumentAttachOutline
                    style={{ marginRight: 3, fontSize: "22px" }}
                  />{" "}
                  Attach Material
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Button>
                {file && <Typography variant="body2">{file.name}</Typography>}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions
        sx={{
          background: isDarkMode
            ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
            : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
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
