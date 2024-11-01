import React from "react";
import {
  Box,
  Typography,
  List,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaQuestionCircle } from "react-icons/fa";
import { useThemeContext } from "@/hooks/ThemeContext";

const iconButtonStyle = {
  color: "#1976d2",
  "&:hover": {
    color: "#1565c0",
  },
};

function StudentQueries() {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  const queries = [
    {
      id: 1,
      student: "John Doe",
      query: "What is the due date for the Math Quiz 1?",
    },
    {
      id: 2,
      student: "Jane Smith",
      query: "Can you explain the last topic on Photosynthesis?",
    },
    {
      id: 3,
      student: "Alice Johnson",
      query: "How do we access the online library?",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaQuestionCircle style={{ marginRight: 8 }} />
        Student Queries
      </Typography>
      <List>
        {queries?.map((query) => (
          <ListItem key={query.id}>
            <ListItemText
              primary={query.query}
              secondary={`Asked by: ${query.student}`}
              primaryTypographyProps={{
                sx: { color: primaryColor }, // Custom primary text color
              }}
              secondaryTypographyProps={{
                sx: { color: secondaryColor }, // Custom secondary text color
              }}
            />
            <IconButton edge="end" aria-label="reply" sx={iconButtonStyle}>
              <FaQuestionCircle />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default StudentQueries;
