import React, { useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Button,
} from "@mui/material";

const CustomTimePicker = ({ label, value, onChange, isDarkMode }) => {
  const [openTime, setOpenTime] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState("AM");

  const handleSave = () => {
    const formattedHour = hour.padStart(2, "0");
    const formattedMinute = minute.padStart(2, "0");
    const formattedTime = `${formattedHour}:${formattedMinute} ${ampm}`;
    onChange(formattedTime);
    setOpenTime(false);
  };

  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{
          color: isDarkMode ? "#d7e4fc" : "",
          fontSize: isDarkMode ? "20px" : "",
        }}
      >
        {label}
      </InputLabel>
      <Select
        open={openTime}
        onClose={() => setOpenTime(false)}
        onOpen={() => setOpenTime(true)}
        value=""
        displayEmpty
        renderValue={() => (
          <Typography
            sx={{
              color: isDarkMode ? "#d7e4fc" : "",
              paddingY: "8px",
            }}
          >
            {value || "Enter Time"}
          </Typography>
        )}
        sx={{
          backdropFilter: "blur(10px)",
          "& .MuiSelect-icon": {
            color: isDarkMode ? "#d7e4fc" : "",
          },
        }}
      >
        <MenuItem disableRipple>
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              label="HH"
              value={hour}
              onChange={(e) => setHour(e.target.value.replace(/\D/, ""))}
              inputProps={{ maxLength: 2 }}
              sx={{ width: 60 }}
            />
            <Typography>:</Typography>
            <TextField
              label="MM"
              value={minute}
              onChange={(e) => setMinute(e.target.value.replace(/\D/, ""))}
              inputProps={{ maxLength: 2 }}
              sx={{ width: 60 }}
            />
            <Select
              value={ampm}
              onChange={(e) => setAmPm(e.target.value)}
              sx={{ width: 80 }}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
            <Button variant="outlined" size="small" onClick={handleSave}>
              Set
            </Button>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default CustomTimePicker
