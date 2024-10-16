import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Grid,
} from "@mui/material";
import { FaExclamationCircle, FaStar } from "react-icons/fa";

// Sample data
const students = {
  struggling: [
    {
      name: "Wong Lee",
      subjects: "Political Science",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s",
      id: 1,
    },
    {
      name: "Sarah Nancy",
      subjects: "Science, Biology",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdHoEvVXwwHJQEFlclzVc_wrEELWYQEbd6mw&s",
      id: 2,
    },
    {
      name: "Nate Gill",
      subjects: "Math, Biology",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHDRlp-KGr_M94k_oor4Odjn2UzbAS7n1YoA&s",
      id: 3,
    },
  ],
  excelling: [
    {
      name: "Post Malone",
      subjects: "History, English",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt5w1cb-CtSk_E0KjY5u6pb_mP9F2IaAgbcA&s",
      id: 4,
    },
    {
      name: "Clara Garcia",
      subjects: "Science, Hindi",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRij6dtiHizH96qpCOe8WeXXP3yLyQJkPdGVg&s",
      id: 5,
    },
    {
      name: "vishal Garcia",
      subjects: "Math, Hindi",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s",
      id: 5,
    },
  ],
};

const StrugglingExcelling = () => {
  return (
    <Box
      sx={{
        // maxWidth: 400,
        width:"100%",
        p: 2,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        maxHeight: 530,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Struggling & Excelling
        </Typography>
        {/* <Button variant="text" sx={{ textTransform: "none" }}>
          View Details &gt;
        </Button> */}
      </Box>

      <Grid
        container
        direction={"row"}
        // mt={4}
        spacing={2}
        sx={{ overflowY: "auto", maxHeight: 480 }}
      >
        {/* Bottom 3 Struggling */}
        <Grid item xs={12} sm={12}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FaExclamationCircle style={{ color: "red", marginRight: "8px" }} />
            Bottom 3 Struggling
          </Typography>
          <List>
            {students.struggling.map((student) => (
              <ListItem
                key={student.id}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemAvatar>
                    <Avatar src={student.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={student.subjects}
                  />
                </Box>
                <Button variant="outlined" sx={{ textTransform: "none" }}>
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>
        {/* Top 3 Excelling */}
        <Grid item xs={12} sm={12}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FaStar style={{ color: "gold", marginRight: "8px" }} />
            Top 3 Excelling
          </Typography>
          <List>
            {students.excelling.map((student) => (
              <ListItem
                key={student.id}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemAvatar>
                    <Avatar src={student.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={student.subjects}
                  />
                </Box>
                <Button variant="outlined" sx={{ textTransform: "none" }}>
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrugglingExcelling;
