import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import { FaBell, FaSearch, FaTimes } from "react-icons/fa";
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
import UserImage from "@/commonComponents/UserImage/UserImage";

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

const StudentFilters = ({
  subject = "",
  searchQuery = "",
  month = null,
  lectureType = "",
  label = "",
}) => {
  const { isDarkMode } = useThemeContext();
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const router = useRouter();

  const [filterState, setFilterState] = useState({
    selectedSubject: subject,
    globalSearch: searchQuery,
    selectedMonth: month,
    selectedLectureType: lectureType,
  });
  const [subjectList, setSubjectList] = useState([]);

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  // Helper function for updating the URL with new parameters
  const updateURL = useCallback(
    (params) => {
      const query = new URLSearchParams(params).toString();
      router.push(`?${query}`, undefined, { shallow: true });
    },
    [router]
  );

  useEffect(() => {
    const fetchData = async () => {
      const subjectResponse = await getSubjectByClass("", "");
      setSubjectList(subjectResponse?.data?.data || []);
    };
    fetchData();
  }, []);

  // Handle changes to filters and update the URL
  const handleChange = (value, key) => {
    setFilterState((prev) => {
      const newState = { ...prev, [key]: value };
      updateURL({
        subject: encodeURIComponent(newState.selectedSubject) || "",
        globalSearch: encodeURIComponent(newState.globalSearch) || "",
        month:
          key === "selectedMonth"
            ? newState.selectedMonth || month || ""
            : month || "",
        lectureType: newState.selectedLectureType || "",
      });
      return newState;
    });
  };

  // Clear specific filter fields
  const clearField = (fieldKey) => handleChange("", fieldKey);

  // Memoized LectureType Dropdown
  const lectureTypeDropDown = useMemo(
    () => (
      <LectureTypeDropDown
        handleSelectType={(type) => handleChange(type, "selectedLectureType")}
        lectureType={filterState.selectedLectureType}
      />
    ),
    [filterState.selectedLectureType]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mt: 4,
          p: 4,
          color: currentStyles.color,
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          {label}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {lectureTypeDropDown}
            <DarkMode />
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <FaBell size={20} />
              </Badge>
            </IconButton> */}
            <UserImage width={40} height={40}/>
          </Box>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              freeSolo
              disableClearable
              options={subjectList?.map((option) => option.name)}
              value={decodeURIComponent(filterState[`selectedSubject`])}
              onChange={(event, newValue) =>
                handleChange(encodeURIComponent(newValue), `selectedSubject`)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Search Subject`}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                    endAdornment: filterState[`selected Subject}`] && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => clearField(`selected Subject`)}
                        >
                          <FaTimes />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      ...currentStyles,
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

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              id="global-search"
              variant="outlined"
              value={filterState.globalSearch}
              placeholder="Global Search"
              onChange={(e) =>
                handleChange(encodeURIComponent(e.target.value), "globalSearch")
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
                endAdornment: filterState.globalSearch && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => clearField("globalSearch")}>
                      <FaTimes />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  ...currentStyles,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                },
              }}
              sx={{
                boxShadow: currentStyles.boxShadow,
                borderRadius: 1,
                width: "100%",
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <DatePicker
              views={["month"]}
              placeholder="Select Month"
              value={dayjs(filterState.selectedMonth)}
              onChange={(newValue) =>
                handleChange(newValue.format("YYYY-MM"), "selectedMonth")
              }
              sx={{
                ...currentStyles,
                width: "100%",
                padding: 0,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default StudentFilters;
