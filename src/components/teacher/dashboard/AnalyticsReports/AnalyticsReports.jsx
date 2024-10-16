import React from "react";
import {
  Box,
  Paper,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  List,
  IconButton,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaBullhorn, FaQuestionCircle } from "react-icons/fa";

const cardStyle = {
  padding: 2,
  textAlign: "center",
  minWidth: "400px",
  minHeight: "350px", // Set same height for both cards
};

const buttonStyle = {
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
};

const AnalyticsReports = () => {

  return (
          <Box
            sx={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              width:"100%",
              p: 2,
              height:'100%'
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FaBullhorn style={{ marginRight: 8 }} />
              Announcements
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Enter your announcement here..."
              multiline
              rows={8}
              sx={{ mt: 2, mb: 2 }}
            />
            <Box sx={{display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Button variant="contained" sx={buttonStyle}>
                Post Announcement
              </Button>
            </Box>
          </Box>
  );
};

export default AnalyticsReports;
