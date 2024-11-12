import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { GiTeacher } from "react-icons/gi";

const TeacherCount = () => {
  // Dummy data for classes and student counts
  const classesData = [
    { id: 1, name: "Class 1", count: 15 },
    { id: 2, name: "Class 2", count: 25 },
    { id: 3, name: "Class 3", count: 20 },
    { id: 4, name: "Class 4", count: 28 },
  ];

  const [selectedClass, setSelectedClass] = useState(classesData[0].id);

  // Handler for dropdown selection
  const handleChange = (event) => {
    setSelectedClass(event.target.value);
  };

  // Get the selected class data
  const classData = classesData.find((cls) => cls.id === selectedClass);

  return (
    <Box
      sx={{
        maxWidth: "full",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        background:
          "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      {/* Dropdown for selecting class */}
      {/* <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <Select value={selectedClass} onChange={handleChange} displayEmpty>
          {classesData.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <Typography variant="h6" sx={{color:"#708090"}}><GiTeacher style={{marginRight:"2px"}}/><b>Teachers Count</b>
      </Typography>
      <Typography variant="h2" sx={{color:"#36454F"}}>
        {classData.count} 
      </Typography>
    </Box>
  );
};

export default TeacherCount;
