import React, { useState, useEffect, useRef } from "react";
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
  Paper,
  GlobalStyles,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs"; // Import dayjs for date handling
import { MdOutlineClass, MdDelete } from "react-icons/md";
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
  deleteUpcomingLecture,
} from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useThemeContext } from "@/hooks/ThemeContext";
import CustomAutocomplete from "@/commonComponents/CustomAutocomplete/CustomAutocomplete";
import { IoCloseOutline } from "react-icons/io5";
import getFileIcon from "@/commonComponents/FileIcon/FileIcon";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AiOutlineClockCircle } from "react-icons/ai";

// const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

const CreatingLecture = ({
  open,
  handleClose,
  lecture,
  isEditMode = false,
}) => {
  const { isDarkMode } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
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
  const inputRef = useRef(null);

  // Dropdown options state
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);

  const encodeURI = (value) => encodeURIComponent(value);

  const lowerCase = (str) => str?.toLowerCase();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  if (!userDetails || !userDetails.teacher_id) {
    console.error("Invalid or expired token");
  }

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
      setLectureTopics({ name: lecture?.topics, id: 0 } || "");

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
            const validSubjects = response?.data?.data?.filter(
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
            const chapters = validChapters?.map((chapter) => ({
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
      subject:
        checkCondition(lectureSubject, subjectName) || lecture?.subject?.id,
      chapter:
        checkCondition(lectureChapter, chapterName) || lecture?.chapter?.id,
      lecture_class:
        checkCondition(selectedClass, selectedClassName) ||
        lecture?.lecture_class?.id,
      topics: topicsName || lecture?.topics,
      title: topicsName || lecture?.title,
      organizer: Number(userDetails.teacher_id),
      schedule_date: lectureDate.format("YYYY-MM-DD"),
      schedule_time: lectureStartTime.format("HH:mm"),
      type: lectureType || lecture?.type,
      description: lectureDescription || lecture?.description || "",
    };

    if (file) {
      data.file = file;
    }
    setIsLoading(true);
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
          console.error("Failed to create training:", response.data.message);
        }
      }
    } catch (error) {
      console.error("Error creating lecture:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteLecture = async () => {
    try {
      await deleteUpcomingLecture(lecture?.id);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return isLoading ? (
    <Box className="overlay">
      <Box className="loader"></Box>
    </Box>
  ) : (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialogContent-root": {
          color: isDarkMode ? "white" : "black",
          backgroundColor: "#fff",
          backdropFilter: "blur(10px)",
          // backgroundImage: "url('/create_lectureBG.jpg')", // Add background image
          // backgroundSize: "cover", // Ensure the image covers the entire page
          // backgroundPosition: "center", // Center the image
        },
        "& .MuiDialogTitle-root": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          alignSelf: "stretch",
        },
        "& .MuiPaper-root": {
          borderRadius: "24px",
          display: "flex",
          width: "1055px",
          padding: "24px",
          flexDirection: "column",
          alignItems: "flex-end",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          alignSelf: "stretch",
          // backgroundColor:"red"
        }}
      >
        <Box
          sx={{
            color: "var(--Text-Color-1, #3B3D3B)",
            fontFamily: "Inter",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "600",
            lineHeight: "normal",
          }}
        >
          Create Training
        </Box>
        {isEditMode && lecture?.id && (
          <Box
            sx={{
              position: "absolute",
              right: "16px", // Align the delete button to the right
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              cursor: "pointer",
              flex: 1,
            }}
          >
            <MdDelete size={20} onClick={() => onDeleteLecture()} />
          </Box>
        )}
        <Button onClick={handleClose} color="primary" sx={{}}>
          Cancel
        </Button>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} marginTop={1}>
            {/* Lecture Class */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={classOptions}
                onSelect={setSelectedClass}
                onChange={setSelectedClassName}
                label={"Batch Name"}
                value={selectedClass}
                // disabled={isEditMode} // Disable in edit mode
              />
            </Grid>

            {/* Lecture Subject */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={subjectOptions}
                onSelect={setLectureSubject}
                onChange={setSubjectName}
                label={"Course Name"}
                value={lectureSubject}
                // disabled={isEditMode} // Disable in edit mode
              />
            </Grid>

            {/* Lecture Chapter */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={chapterOptions}
                onSelect={setLectureChapter}
                onChange={setChapterName}
                label={"Module Name"}
                value={lectureChapter}
                // disabled={isEditMode} // Disable in edit mode
              />
            </Grid>

            {/* Lecture Topics */}
            <Grid item xs={6}>
              <CustomAutocomplete
                options={topicOptions}
                onSelect={setLectureTopics}
                onChange={setTopicsName}
                label={"Session Title (Topics)"}
                value={lectureTopics}
              />
            </Grid>

            {/* Lecture Description (Optional) */}
            <Grid item xs={12}>
              <TextField
                label="Description (Optional)"
                value={lectureDescription}
                onChange={(e) => setLectureDescription(e.target.value)}
                InputLabelProps={{
                  sx: {
                    fontSize: "16px",
                    fontFamily: "Inter",
                    "&.Mui-focused": {
                      color: "#000", // Adjust color if needed
                    },
                  },
                }}
                multiline
                rows={3}
                fullWidth
                InputProps={{
                  sx: {
                    "&.MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "12px", // ✅ Always round
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#001B72",
                    },
                  },
                }}
              />
            </Grid>

            {/* Lecture Type */}
            <Grid item xs={4} display={"flex"} alignItems={"center"}>
              <FormControl fullWidth required>
                <InputLabel
                  id="lecture-type-label"
                  sx={{
                    color: isDarkMode ? "#d7e4fc" : "",
                    fontSize: isDarkMode && "20px",
                    "&.Mui-focused": {
                      color: "#000",
                    },
                  }}
                >
                  Training Type
                </InputLabel>
                <Select
                  labelId="lecture-type-label"
                  value={lectureType}
                  onChange={(e) => setLectureType(e.target.value)}
                  label="Lecture Type"
                  sx={{
                    backdropFilter: "blur(10px)",
                    fontSize: "16px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    color: isDarkMode ? "#d7e4fc" : "#000", // Option text color
                    "& .MuiOutlinedInput-notchedOutline": {
                      color: "#000",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#001B72", // <-- This changes the border color to green when focused
                    },
                    // "& .MuiSvgIcon-root": {
                    //   color: isDarkMode ? "#d7e4fc" : "", // Dropdown arrow color
                    // },
                  }}
                >
                  {lecture_type?.map((value) => (
                    <MenuItem key={value?.key} value={value?.key}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Image
                          src={value.image}
                          alt="icon"
                          width={22}
                          height={22}
                        />
                        <Typography>{value?.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Lecture Date */}
            <Grid item xs={4} display={"flex"} alignItems={"center"}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <GlobalStyles
                  styles={{
                    ".MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#6750A4 !important",
                      color: "#fff !important",
                    },
                    ".MuiPickersDay-root.Mui-selected:hover": {
                      backgroundColor: "#6750A4 !important",
                    },

                    // Year picker (main fix here)
                    "button.MuiPickersYear-yearButton.Mui-selected": {
                      backgroundColor: "#000 !important",
                      color: "#fff !important",
                    },
                    "button.MuiPickersYear-yearButton.Mui-selected:hover": {
                      backgroundColor: "#2e7d32 !important",
                    },
                  }}
                />
                <DatePicker
                  label="Training Date"
                  value={lectureDate}
                  onChange={(newDate) => setLectureDate(newDate)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      sx: {
                        "& .MuiInputLabel-root": {
                          fontSize: isDarkMode && "14px",

                          "&.Mui-focused": {
                            color: "#000", // label color on focus
                          },
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#001B72", // border on focus
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode ? "#d7e4fc" : "",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "#FF3B30",
                        },
                        "& .MuiInputBase-input": {
                          color: isDarkMode ? "#d7e4fc" : "",
                        },
                      },
                    },
                    popper: {
                      // placement: "bottom-start", // 👈 forces it to open below
                      modifiers: [
                        // {
                        //   name: "flip",
                        //   enabled: false, // 👈 disables auto-flipping above
                        // },
                        {
                          name: "offset",
                          options: {
                            offset: [0, 4],
                          },
                        },
                      ],
                      sx: {
                        "& .MuiPaper-root": {
                          border: "2px solid #001B72",
                          boxShadow: "none",
                          borderRadius: "12px",
                          fontSize: "14px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Lecture Start Time */}
            <Grid
              item
              xs={4}
              display={"flex"}
              alignItems={"center"}
              paddingTop={"0px"}
            >
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Lecture Start Time"
                  value={lectureStartTime}
                  sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "",
                    color: isDarkMode ? "#d7e4fc" : "", // Option text color
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000", // border on focus
                      },
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isDarkMode ? "#d7e4fc" : "", // Border color when focused
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#000", // Dropdown arrow color
                    },
                    "& .MuiInputLabel-root": {
                      color: isDarkMode ? "#d7e4fc" : "", // Label color
                      fontSize: "16px",
                      "&.Mui-focused": {
                        color: "#000", // label color on focus
                      },
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
              </LocalizationProvider> */}
              <Box sx={{ position: "relative" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    label={"Training Start Time *"}
                    openTo="hours"
                    inputRef={inputRef}
                    value={lectureStartTime}
                    onChange={(newTime) => setLectureStartTime(newTime)}
                    sx={{
                      backdropFilter: "blur(10px)",
                      backgroundColor: "",

                      color: isDarkMode ? "#d7e4fc" : "", // Option text color
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#001B72", // border on focus
                        },
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: isDarkMode ? "#d7e4fc" : "", // Border color when focused
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000", // Dropdown arrow color
                      },
                      "& .MuiInputLabel-root": {
                        color: isDarkMode ? "#d7e4fc" : "", // Label color
                        fontSize: "16px",
                        "&.Mui-focused": {
                          color: "#000", // label color on focus
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: isDarkMode ? "#d7e4fc" : "", // Input text (date value) color
                      },
                    }}
                  />
                  <Box
                   onClick={() => inputRef.current?.click()}
                    sx={{
                      position: "absolute",
                      right: 10,
                      top: "50%", // halfway down container
                      transform: "translateY(-50%)",
                    }}
                  >
                    <AiOutlineClockCircle size={20} color="#FF3B30" />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Grid>

            {/* Display file name with remove icon if a file is selected */}
            {file ? (
              <Grid item xs={12} sm={8} md={4}>
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    border: "1px solid",
                    borderColor: isDarkMode ? "#d7e4fc" : "#ccc",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getFileIcon(file.name, {
                      style: {
                        fontSize: "24px",
                        marginRight: "8px",
                        color: "#000",
                      },
                    })}
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        color: isDarkMode ? "#d7e4fc" : "#333",
                      }}
                    >
                      {file.name.length > 24
                        ? `${file.name?.slice(0, 14)}...${file.name.slice(
                            file.name.length - 7,
                            file.name.length
                          )}`
                        : file.name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleRemoveFile}
                    size="small"
                    sx={{ color: isDarkMode ? "#d7e4fc" : "#333" }}
                  >
                    {/* <IoCloseOutline style={{ fontSize: '20px' }} /> */}
                    <Image src="/icons/trash.png" width={20} height={20} />
                  </IconButton>
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Button
                  component="label"
                  fullWidth
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    color: isDarkMode ? "#d7e4fc" : "#333",
                    border: "1px solid",
                    borderColor: isDarkMode ? "#d7e4fc" : "#ccc",
                    backgroundColor: isDarkMode ? "transparent" : "#fff",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(215, 228, 252, 0.1)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    width: "100%",
                  }}
                >
                  <Image
                    src="/icons/send-square.png"
                    width={20}
                    height={20}
                    style={{ marginRight: 8, fontSize: "22px" }}
                  />
                  {/* <IoDocumentAttachOutline 
                style={{ marginRight: 8, fontSize: '22px' }} 
              /> */}
                  Upload Material
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#fff",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            display: "flex",
            padding: "12px 32px",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            background: "#E7002A",
            "&:hover": {
              background: "#E7002A", // optional: slightly lighter on hover
            },
          }}
        >
          {isEditMode ? "Update Training" : "Create Training"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatingLecture;
