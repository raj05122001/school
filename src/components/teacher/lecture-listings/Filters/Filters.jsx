import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Typography,
  Badge,
  Avatar,
} from "@mui/material";
import { FaBell, FaSearch, FaTimes } from "react-icons/fa"; // Importing search and close icons
import { getClassByCourse, getSubjectByClass } from "@/api/apiHelper";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LectureTypeDropDown from "./LectureTypeDropDown";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import DarkMode from "@/components/DarkMode/DarkMode";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useThemeContext } from "@/hooks/ThemeContext";

const Filters = ({
  classValue = "",
  subject = "",
  searchQuery = "",
  month = null,
  lectureType = "",
}) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const router = useRouter();
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classValue);
  const [selectedSubject, setSelectedSubject] = useState(subject);
  const [globalSearch, setGlobalSearch] = useState(searchQuery);
  const [selectedMonth, setSelectedMonth] = useState(dayjs(month));
  const [selectedLectureType, setSelectedLectureType] = useState(lectureType);

  const decodeURI = (value) => {
    return decodeURIComponent(value);
  };

  useEffect(() => {
    fetchClassData();
    fetchSubjectData("", "");
  }, []);

  const fetchClassData = async () => {
    const response = await getClassByCourse("", "");
    setClassList(response?.data?.data);
  };

  const fetchSubjectData = async (className, search) => {
    const response = await getSubjectByClass(className, search);
    setSubjectList(response?.data?.data);
  };

  const updateURL = (params) => {
    const query = new URLSearchParams(params).toString();
    router.push(`?${query}`, undefined, { shallow: true });
  };

  const handleClassChange = (event, newValue) => {
    setSelectedClass(newValue);
    updateURL({
      class: encodeURI(newValue) || "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: encodeURI(globalSearch) || "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const clearClass = () => {
    setSelectedClass("");
    updateURL({
      class: "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: encodeURI(globalSearch) || "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: encodeURI(newValue) || "",
      globalSearch: encodeURI(globalSearch) || "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const clearSubject = () => {
    setSelectedSubject("");
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: "",
      globalSearch: encodeURI(globalSearch) || "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const handleGlobalSearchChange = (event) => {
    setGlobalSearch(event.target.value);
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: encodeURI(event.target.value) || "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const clearGlobalSearch = () => {
    setGlobalSearch("");
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: "",
      month: month ? month : "",
      lectureType: selectedLectureType || "",
    });
  };

  const handleDateChange = (newValue) => {
    setSelectedMonth(newValue);
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: encodeURI(globalSearch) || "",
      month: newValue ? newValue.format("YYYY-MM") : "",
      lectureType: selectedLectureType || "",
    });
  };

  const handleSelectType = (type) => {
    setSelectedLectureType(type);
    updateURL({
      class: encodeURI(selectedClass) || "",
      subject: encodeURI(selectedSubject) || "",
      globalSearch: encodeURI(globalSearch) || "",
      month: month ? month : "",
      lectureType: type || "",
    });
  };

  // Define light and dark mode styles
  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    inputBackgroundColor: "#ffffff",
    inputColor: "#ffffff",
    boxShadow: "0px 2px 5px rgba(255, 255, 255, 0.1)",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    color: "#000000",
    inputBackgroundColor: "#333333",
    inputColor: "#000000",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  const lectureTypeDropDown = useMemo(
    () => (
      <LectureTypeDropDown
        handleSelectType={handleSelectType}
        lectureType={lectureType}
      />
    ),
    [lectureType, month]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: 4,
          padding: 4,
          color: currentStyles.color,
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6" // Corresponds to text-xl
              sx={{
                color: currentStyles.color,
                fontWeight: "bold",
              }}
            >
              Your Lecture
            </Typography>
            <Typography
              variant="body2" // Corresponds to text-sm
              sx={{
                color: "gray",
              }}
            >
              Facilitated by
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                fontStyle: "italic",
                color: currentStyles.color,
              }}
            >
              VidyaAI
            </Typography>
          </Box>

          {/* Right side: Dark Mode, Notifications, Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {lectureTypeDropDown}
            <DarkMode />
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <FaBell size={20} />
              </Badge>
            </IconButton>
            <Avatar
              alt={userDetails?.full_name || ""}
              src="/sampleprofile.jpg"
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        </Grid>

        <Grid container spacing={3}>
          {/* Class Search */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              id="class"
              disableClearable
              options={classList.map((option) => option.name)}
              value={decodeURI(selectedClass)}
              onChange={handleClassChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Class"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                    endAdornment: selectedClass && (
                      <InputAdornment position="end">
                        <IconButton onClick={clearClass}>
                          <FaTimes />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: currentStyles.inputColor,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    },
                  }}
                  sx={{
                    boxShadow: currentStyles.boxShadow,
                    borderRadius: 1,
                  }}
                />
              )}
            />
          </Grid>

          {/* Subject Search */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              id="subject"
              disableClearable
              options={subjectList.map((option) => option.name)}
              value={selectedSubject}
              onChange={handleSubjectChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Subject"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                    endAdornment: selectedSubject && (
                      <InputAdornment position="end">
                        <IconButton onClick={clearSubject}>
                          <FaTimes />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: currentStyles.inputColor,
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    },
                  }}
                  sx={{
                    boxShadow: currentStyles.boxShadow,
                    borderRadius: 1,
                  }}
                />
              )}
            />
          </Grid>

          {/* Global Search */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="global-search"
              variant="outlined"
              value={globalSearch}
              placeholder="Global Search"
              onChange={handleGlobalSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
                endAdornment: globalSearch && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearGlobalSearch}>
                      <FaTimes />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: currentStyles.inputColor,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                },
              }}
              sx={{
                boxShadow: currentStyles.boxShadow,
                borderRadius: 1,
                width: "100%",
              }}
            />
          </Grid>

          {/* Date Picker */}
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              views={["month"]}
              placeholder="Select Month"
              value={selectedMonth}
              slotProps={{ field: { clearable: true } }}
              onChange={handleDateChange}
              sx={{
                boxShadow: currentStyles.boxShadow,
                borderRadius: 0,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: currentStyles.inputColor,
                border: 0,
                width: "100%",
                padding: 0,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Filters;
