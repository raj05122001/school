import React, { useRef, useState } from "react";
import { Box, Card, CardContent, Typography, CardMedia } from "@mui/material";

const ListingCard = ({ ind }) => {
  const lectureDetails = {
    "Lecture Class": "10th Grade",
    "Lecture Subject": "Mathematics",
    "Lecture Chapter": "Chapter 5: Algebra",
    "Lecture Name": "Solving Quadratic Equations",
    "Lecture Description":
      "In this lecture, we will learn how to solve quadratic equations using various methods.",
    "Lecture Date": "15th October 2024",
    "Lecture Type": "Video Lecture",
  };

  // Create a reference for the video element
  const videoRef = useRef(null);

  // State to track hover state
  const [isHovered, setIsHovered] = useState(false);

  // Handle hover to play video
  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current.play();
  };

  // Handle leaving hover to pause video
  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current.pause();
  };

  return (
    <Box p={2} sx={{width:'100%',height:'100%'}}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Softer shadow for depth
          transition: "transform 0.4s ease, box-shadow 0.4s ease", // Smooth hover animation
          borderRadius: "16px", // Rounded corners
          background: "linear-gradient(145deg, #f8f9fa, #e9ecef)", // Subtle gradient
          "&:hover": {
            transform: "scale(1.05)", // Slightly increase the size on hover
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)", // Increase shadow on hover
          },
          height:'100%'
        }}
        onMouseEnter={handleMouseEnter} // Trigger video play on hover
        onMouseLeave={handleMouseLeave} // Trigger video pause when hover stops
      >
        {/* Video Section */}
        <CardMedia
          component="video"
          preload="auto"
          ref={videoRef} // Reference to the video element
          src={`https://d3515ggloh2j4b.cloudfront.net/videos/${570 + (ind*2)}.mp4`}
          controls={isHovered} // Show controls only when hovered
          sx={{
            width: "100%",
            height: "auto",
            maxHeight:220,
            borderRadius: "16px 16px 0 0", // Rounded corners for the top part
          }}
        />

        {/* Lecture Details Section */}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 3,
            textAlign: "left",
            height:'100%'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {lectureDetails["Lecture Name"]}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#555" }}>
            <strong>Class:</strong> {lectureDetails["Lecture Class"]}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#555" }}>
            <strong>Subject:</strong> {lectureDetails["Lecture Subject"]}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#555" }}>
            <strong>Chapter:</strong> {lectureDetails["Lecture Chapter"]}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#555" }}>
            <strong>Description:</strong>{" "}
            {lectureDetails["Lecture Description"]}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: "#555" }}>
            <strong>Date:</strong> {lectureDetails["Lecture Date"]}
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            <strong>Type:</strong> {lectureDetails["Lecture Type"]}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ListingCard;
