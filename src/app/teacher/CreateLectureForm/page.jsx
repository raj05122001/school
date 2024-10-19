"use client";
import React, { useState } from "react";
import {
  TextField,
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { FaChalkboardTeacher, FaBookOpen, FaQuestion, FaTools, FaClipboard } from "react-icons/fa";

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

const Page = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const lectureData = {
      lectureClass,
      lectureSubject,
      lectureChapter,
      lectureTopics,
      lectureName,
      lectureDescription,
      lectureDate,
      lectureStartTime,
      lectureDuration,
      lectureType,
      platform,
      file,
    };
    console.log("Lecture Data Submitted:", lectureData);
    // Handle the form submission (e.g., send it to an API)
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
        margin: "auto",
        backgroundColor: "#fff",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Create Lecture
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Lecture Class */}
          <Grid item xs={6}>
            <TextField
              label="Lecture Class"
              value={lectureClass}
              onChange={(e) => setLectureClass(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Lecture Subject */}
          <Grid item xs={6}>
            <TextField
              label="Lecture Subject"
              value={lectureSubject}
              onChange={(e) => setLectureSubject(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Lecture Chapter */}
          <Grid item xs={6}>
            <TextField
              label="Lecture Chapter"
              value={lectureChapter}
              onChange={(e) => setLectureChapter(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Lecture Topics */}
          <Grid item xs={6}>
            <TextField
              label="Lecture Topics"
              value={lectureTopics}
              onChange={(e) => setLectureTopics(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Lecture Name */}
          <Grid item xs={6}>
            <TextField
              label="Lecture Name"
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              fullWidth
              required
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
                {lectureTypes.map((value) => (
                  <MenuItem key={value.key} value={value.key}>
                    <ListItemIcon>{value.icon}</ListItemIcon>
                    <ListItemText>{value.name}</ListItemText>
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
                renderInput={(params) => <TextField {...params} fullWidth required />}
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
                renderInput={(params) => <TextField {...params} fullWidth required />}
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

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Lecture
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Page;
