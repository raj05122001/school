import React from "react";
import { Autocomplete, Box, TextField, InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa"; // Importing search icon from react-icons

const Filters = () => {
  // Dummy data for class and subject lists
  const classlist = [
    { title: "Class 10" },
    { title: "Class 9" },
    { title: "Class 8" },
    { title: "Class 7" },
  ];

  const subjectlist = [
    { title: "Mathematics" },
    { title: "Science" },
    { title: "History" },
    { title: "English" },
  ];

  return (
    <Box 
      sx={{ 
        display: "flex", 
        width:"100%",
        gap: 3,
        marginTop: 4,
        justifyContent: "space-between" // This will make sure the elements align properly
      }}
    >
      {/* Class Search */}
      <Autocomplete
        freeSolo
        id="class"
        disableClearable
        options={classlist.map((option) => option.title)}
        sx={{ 
            borderRadius: 2, 
            backgroundColor: "#fff", 
            width: "30%", // Set a fixed width for free-text search
            "& .MuiOutlinedInput-root": { 
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)" 
            }
          }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search class"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              type: "search",
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              )
            }}
          />
        )}
      />

      {/* Subject Search */}
      <Autocomplete
        freeSolo
        id="subject"
        disableClearable
        options={subjectlist.map((option) => option.title)}
        sx={{ 
            borderRadius: 2, 
            backgroundColor: "#fff", 
            width: "30%", // Set a fixed width for free-text search
            "& .MuiOutlinedInput-root": { 
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)" 
            }
          }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search subject"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              type: "search",
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              )
            }}
          />
        )}
      />

      {/* Free-text search */}
      <TextField
        id="anything-search"
        label="Search anything"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          )
        }}
        sx={{ 
          borderRadius: 2, 
          backgroundColor: "#fff", 
          width: "30%", // Set a fixed width for free-text search
          "& .MuiOutlinedInput-root": { 
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)" 
          }
        }}
      />
    </Box>
  );
};

export default Filters;
