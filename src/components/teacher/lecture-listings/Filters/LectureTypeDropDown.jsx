import React, { useState, useRef, useEffect } from "react";
import { IoFunnelOutline } from "react-icons/io5";
import { lecture_type } from "@/helper/Helper";
import {
  Button,
  Popover,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
} from "@mui/material"; // MUI imports
import Image from "next/image";

const LectureTypeDropDown = ({ handleSelectType,lectureType }) => {
  const [filterShow, setFilterShow] = useState(false);
  const [selectedType, setSelectedType] = useState(lectureType); // Initial value set correctly
  const [anchorEl, setAnchorEl] = useState(null); // For managing popover
  const popupRef = useRef(null);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleClear = () => {
    setSelectedType("");
    handleSelectType(""); // Assuming handleSelectType is passed in props
    setFilterShow(false);
    setAnchorEl(null);
  };

  const handleFilter = () => {
    handleSelectType(selectedType);
    setFilterShow(false);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setFilterShow(!filterShow);
  };

  const handleClose = () => {
    setFilterShow(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div ref={popupRef}>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{
          backgroundColor: selectedType ? "#2161D1" : "#ffffff",
          minWidth: "40px",
          height: "40px",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IoFunnelOutline color={selectedType ? "#fff" : "#919BA7"} size={20} />
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            padding: "16px",
            width: "220px",
          },
        }}
      >
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup
            aria-labelledby="lecture-type-label"
            name="lecture-type"
            value={selectedType}
            onChange={handleTypeChange}
          >
            {lecture_type?.map((type, index) => (
              <FormControlLabel
                key={index}
                value={type.key}
                control={<Radio />}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Image
                      src={type.image}
                      alt={type.name}
                      width={24}
                      height={24}
                    />
                    <Typography
                      sx={{
                        color: type.style.color,
                        opacity: type.style.op,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {type.name}
                    </Typography>
                  </Box>
                }
                sx={{
                  color: type.style.color,
                  opacity: type.style.op,
                  "& .MuiTypography-root": {
                    fontSize: "14px",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <Button
            onClick={handleClear}
            variant="outlined"
            size="small"
            sx={{
              color: "#2161D1",
              borderColor: "#2161D1",
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            Clear
          </Button>
          <Button
            onClick={handleFilter}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#2161D1",
              color: "#fff",
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            Save
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default LectureTypeDropDown;
