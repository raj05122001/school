import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaQuestion,
  FaTools,
  FaClipboard,
} from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  createLecture,
  updateLecture,
  getClassDropdown,
  getSubjectByClass,
  getChapterBySubject,
  getTopicsByChapter,
  createNewChapter,
  createNewTopics,
  getTeacherDetails,
  createNewClass,
  createNewSubject,
  updateSubject,
  deleteUpcommingLecture,
} from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import { MdOutlineClass } from "react-icons/md";

const window = global?.window || {};
const localStorage = window.localStorage || {};

const lectureTypes = [
  {
    name: "Subject Lecture",
    type: "subject",
    icon: <FaChalkboardTeacher />,
    key: "subject",
  },
  {
    name: "Case Study Lecture",
    type: "case",
    icon: <FaBookOpen />,
    key: "case",
  },
  {
    name: "Q/A Session",
    type: "qa",
    icon: <FaQuestion />,
    key: "qa",
  },
  {
    name: "Workshop Lecture",
    type: "workshop",
    icon: <FaTools />,
    key: "workshop",
  },
  {
    name: "Quiz Session",
    type: "quiz",
    icon: <FaClipboard />,
    key: "quiz",
  },
];

const platforms = ["Zoom", "Google Meet", "Microsoft Teams"];

const LectureCreate = ({ open, handleClose }) => {
  const [lectureClass, setLectureClass] = useState("");
  const [lectureSubject, setLectureSubject] = useState("");
  const [lectureChapter, setLectureChapter] = useState("");
  const [lectureTopics, setLectureTopics] = useState("");
  const [lectureName, setLectureName] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureDate, setLectureDate] = useState(null);
  const [lectureStartTime, setLectureStartTime] = useState(null);
  const [lectureDuration, setLectureDuration] = useState("");
  const [lectureType, setLectureType] = useState("");
  const [platform, setPlatform] = useState("");
  const [file, setFile] = useState(null);
  const [classData, setClassData] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topics, setTopics] = useState("");
  const [classDropdown, setClassDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);
  const [chapterDropdown, setChapterDropdown] = useState([]);
  const [topicsDropdown, setTopicsDropdown] = useState([]);
  const [processing, setProcessing] = useState({
    class_name: false,
    subject: false,
    topic: false,
    chapter: false,
  });

  const [createMeetingData, setCreateMeetingData] = useState({
    title: "",
    schedule_date: "",
    schedule_time: "",
    location: "",
    start_time: "",
    end_time: "",
    type: "",
    organizer: 1,
    organization: 1,
    department: 1,
    description: "",
    participants_list: [],
    upload_agenda_file: [],
    recurrent_end_date: "",
    repeat: "none",
    end_date: "",
    duration: "",
  });

  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  const initialFormValues = {
    lecture_class: createMeetingData?.lecture_class?.id,
    subject: createMeetingData?.chapter?.subject?.id,
    topics: createMeetingData?.topics,
    title: createMeetingData?.title,
    organizer: createMeetingData?.organizer?.user?.id,
    schedule_date: createMeetingData?.schedule_date,
    schedule_time: createMeetingData?.schedule_time,
    type: createMeetingData?.type,
    description: createMeetingData?.description,
    chapter: createMeetingData?.chapter?.id,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useForm({
    defaultValues: initialFormValues,
  });

  const access = localStorage.getItem("VIDYAAI_ACCESS_TOKEN");
  const decodedToken = decodeToken(access);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const lectureData = {
  //     lectureClass,
  //     lectureSubject,
  //     lectureChapter,
  //     lectureTopics,
  //     lectureName,
  //     lectureDescription,
  //     lectureDate,
  //     lectureStartTime,
  //     lectureDuration,
  //     lectureType,
  //     platform,
  //     file,
  //   };
  //   console.log("Lecture Data Submitted:", lectureData);
  //   // Handle the form submission (e.g., send it to an API)
  // };

  const fetchData = async () => {
    try {
      const response = await getClassDropdown();
      setClassDropdown(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjectDataByClass = async (className, search) => {
    try {
      const encodedClass = encodeURIComponent(className);
      const response = await getSubjectByClass(encodedClass, search);
      setSubjectDropdown(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChapterDataBySubject = async (subject, search) => {
    try {
      const encodedSubject = encodeURIComponent(subject);
      const response = await getChapterBySubject(encodedSubject, search);
      setChapterDropdown(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopicsDataByChapter = async (chapter, search) => {
    try {
      const encodedChapter = encodeURIComponent(chapter);
      const response = await getTopicsByChapter(encodedChapter, search);
      setTopicsDropdown(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (createMeetingData?.id) {
      fetchData();
      fetchTopicsDataByChapter(createMeetingData?.chapter?.chapter, "");
      fetchChapterDataBySubject(createMeetingData?.chapter?.subject?.name, "");
      fetchSubjectDataByClass(createMeetingData?.lecture_class?.name, "");
      setClassData(createMeetingData?.lecture_class?.name);
      setSubject(createMeetingData?.chapter?.subject?.name);
      setChapter(createMeetingData?.chapter?.chapter);
      setTopics(createMeetingData?.topics);
    }
  }, [createMeetingData || {}]);

  const postNewClass = async (class_name) => {
    try {
      setProcessing((prev) => ({ ...prev, class_name: true }));
      const fd = new FormData();
      fd.append("department", teacherDetails?.department?.id);
      fd.append("name", class_name);
      fd.append("subjects", [9]);
      const response = await createNewClass(fd);
      setValue("lecture_class", response?.data?.data?.id);
      fetchData();
      fetchSubjectDataByClass(response?.data?.data?.name, "");
      setProcessing((prev) => ({ ...prev, class_name: false }));
    } catch (error) {
      console.error(error);
      setProcessing((prev) => ({ ...prev, class_name: false }));
    }
  };

  const postNewSubject = async (subject_name) => {
    try {
      setProcessing((prev) => ({ ...prev, subject: true }));
      const classId = getValues("lecture_class");
      const trimmedSubjectName = subject_name.trim();
      const fd = new FormData();
      fd.append("name", trimmedSubjectName);
      const response = await createNewSubject(fd);
      const subjectAllId = subjectDropdown.map((val) => val.id);
      if (response?.data?.success) {
        const formdata = new FormData();
        subjectAllId.push(response?.data?.data?.id);
        subjectAllId.forEach((fileData) => {
          formdata.append("subjects", fileData);
        });
        const subjectResponse = await updateSubject(classId, formdata);
        fetchSubjectDataByClass(subjectResponse?.data?.data?.name, "");
        fetchChapterDataBySubject(response?.data?.data?.name, "");
        setValue("subject", response?.data?.data?.id);
        setSubject(trimmedSubjectName);
      }
      setProcessing((prev) => ({ ...prev, subject: false }));
    } catch (error) {
      console.error(error);
      setProcessing((prev) => ({ ...prev, subject: false }));
    }
  };

  const postNewChapter = async (chapter) => {
    try {
      setProcessing((prev) => ({ ...prev, chapter: true }));
      const subjectId = getValues("subject");
      const subjectName = subjectDropdown.find(
        (val) => val.id === Number(subjectId)
      );
      const trimmedChapter = chapter.trim();
      const fd = new FormData();
      fd.append("subject", subjectId);
      fd.append("chapter", trimmedChapter);
      const response = await createNewChapter(fd);
      setValue("chapter", response?.data?.data?.id);
      fetchChapterDataBySubject(subjectName?.name, "");
      fetchTopicsDataByChapter(response?.data?.data?.chapter, "");
      setChapter(trimmedChapter);
      setProcessing((prev) => ({ ...prev, chapter: false }));
    } catch (error) {
      console.error(error);
      setProcessing((prev) => ({ ...prev, chapter: false }));
    }
  };

  const postNewTopics = async (topics) => {
    try {
      setProcessing((prev) => ({ ...prev, topic: true }));
      const chapterId = getValues("chapter");
      const chapterName = chapterDropdown.find(
        (val) => val.id === Number(chapterId)
      );
      const trimmedTopics = topics.trim();

      const fd = new FormData();
      fd.append("chapter", chapterId);
      fd.append("topics", trimmedTopics);
      const response = await createNewTopics(fd);
      setValue("topics", response?.data?.data?.id);
      const classId = getValues("lecture_class");
      const className = classDropdown.find((val) => val.id === Number(classId));
      fetchTopicsDataByChapter(chapterName?.chapter, "");
      setTopics(trimmedTopics);
      setProcessing((prev) => ({ ...prev, topic: false }));
    } catch (error) {
      console.error(error);
      setProcessing((prev) => ({ ...prev, topic: false }));
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const fd = new FormData();
    const topic = topicsDropdown.find((val) => val.id === data.topics[0]);
    const currentValues = getValues();
    const changedValues = {};

    if (!createMeetingData?.id) {
      fd.append("lecture_class", data.lecture_class);
      fd.append("subject", data.subject);
      fd.append("topics", data.topics);
      fd.append("title", data.title);
      fd.append("organizer", decodedToken.teacher_id);
      fd.append("schedule_date", data.schedule_date);
      fd.append("schedule_time", data.schedule_time);
      fd.append("type", data?.type);
      fd.append("description", data?.description);
      fd.append("chapter", data?.chapter);
      fd.append("course", 6);

      try {
        await createLecture(fd);
        closeDrawer();
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      try {
        Object.keys(currentValues).forEach((key) => {
          if (currentValues[key] !== initialFormValues[key]) {
            changedValues[key] = currentValues[key];
          }
        });

        Object.keys(changedValues).forEach((key) => {
          fd.append(key, changedValues[key]);
        });
        await updateLecture(createMeetingData?.id, fd);
        closeDrawer();
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
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
            ? "#424242"
            : "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%);",
        },
        "& .MuiDialogTitle-root": {
          bgcolor: isDarkMode ? "#424242" : "white",
          color: isDarkMode ? "white" : "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: isDarkMode ? "#424242" : "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
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
        <MdOutlineClass
          style={{ color: isDarkMode ? "white" : "black", marginRight: "2px" }}
        />
        Create Lecture
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%", maxWidth: 700, margin: "auto", p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Controller
                  name="lecture_class"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      label="Lecture Class"
                      value={classData}
                      setValue={setClassData}
                      options={classDropdown}
                      fieldName={"name"}
                      name={"Class"}
                      onCreate={postNewClass}
                      onChange={(val) => {
                        fetchSubjectDataByClass(val?.name, "");
                        setValue("lecture_class", val?.id);
                      }}
                      fullWidth
                      required
                      sx={{
                        "& input::placeholder": {
                          color: "white",
                        },
                      }}
                      processing={processing.class_name}
                    />
                  )}
                />
                {errors.lecture_class && (
                  <span sx={{ color: "red" }}>This field is required</span>
                )}
              </Grid>
              {getValues("lecture_class") || subjectDropdown?.length > 0 ? (
                <Grid item xs={6}>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="Lecture Subject"
                        value={subject}
                        setValue={setSubject}
                        options={subjectDropdown}
                        fieldName={"name"}
                        name={"Subject"}
                        onCreate={postNewSubject}
                        onChange={(val) => {
                          fetchChapterDataBySubject(val?.name, "");
                          setValue("subject", val?.id);
                        }}
                        fullWidth
                        required
                      />
                    )}
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </Grid>
              ) : null}

              {getValues("subject") || chapterDropdown?.length > 0 ? (
                <Grid item xs={6}>
                  <Controller
                    name="chapter"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="Lecture Chapter"
                        value={chapter}
                        setValue={setChapter}
                        options={chapterDropdown}
                        fieldName={"chapter"}
                        name={"Chapter"}
                        onCreate={postNewChapter}
                        onChange={(val) => {
                          fetchTopicsDataByChapter(val?.chapter, "");
                          setValue("chapter", val?.id);
                        }}
                        fullWidth
                        required
                        processing={processing.chapter}
                      />
                    )}
                  />
                  {errors.lecture_class && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </Grid>
              ) : null}

              {getValues("chapter") || topicsDropdown?.length > 0 ? (
                <Grid item xs={6}>
                  <Controller
                    name="topics"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label="Lecture Topics"
                        value={topics}
                        setValue={setTopics}
                        options={topicsDropdown}
                        fieldName={"topics"}
                        name={"Topics"}
                        onCreate={postNewTopics}
                        onChange={(val) => {
                          setValue("topics", val?.topics);
                        }}
                        fullWidth
                        required
                        processing={processing.topic}
                      />
                    )}
                  />
                  {errors.topics && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </Grid>
              ) : null}

              <Grid item xs={6}>
                <TextField
                  label="Lecture Name"
                  value={lectureName}
                  {...register("title", { required: true })}
                  fullWidth
                  required
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel id="lecture-type-label">Lecture Type</InputLabel>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        labelId="lecture-type-label"
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                        label="Lecture Type"
                      >
                        {lectureTypes.map((value) => (
                          <MenuItem key={value.key} value={value.key}>
                            <ListItemIcon>{value.icon}</ListItemIcon>
                            <ListItemText>{value.name}</ListItemText>
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Lecture Description (Optional)"
                  value={lectureDescription}
                  {...register("description", { required: true })}
                  multiline
                  rows={3}
                  fullWidth
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </Grid>

              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Lecture Date"
                    value={lectureDate}
                    onChange={(newDate) => setLectureDate(newDate)}
                    {...register("schedule_date", { required: true })}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                  {errors.schedule_date && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </LocalizationProvider>
              </Grid>

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
                  {errors.schedule_time && (
                    <span className="text-red-500 text-sm">
                      This field is required
                    </span>
                  )}
                </LocalizationProvider>
              </Grid>

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

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {createMeetingData?.id ? "Update Lecture" : "Create Lecture"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: isDarkMode ? "#424242" : "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);" }}>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LectureCreate;
