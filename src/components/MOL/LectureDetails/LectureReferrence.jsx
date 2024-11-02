import React, { useEffect, useState } from "react";
import { Box, Typography, Link, Button, Skeleton } from "@mui/material";
import { getLectureResources } from "@/api/apiHelper";

const LectureReferrence = ({ id, isDarkMode }) => {
  const [resources, setResources] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lecture resources
    const fetchResources = async () => {
      try {
        const response = await getLectureResources(id);
        if (response?.success) {
          // Parse the resources_text JSON string into a JS array
          const resourcesArray = JSON.parse(response.data.resources_text);
          setResources(resourcesArray);
        }
      } catch (error) {
        console.error("Error fetching lecture resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [id]);

  const displayedResources = resources.slice(0, visibleCount);

  if (loading) {
    return (
      <Box sx={{ p: 3, width: "100%" }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        {[...Array(7)].map((_, index) => (
          <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        borderRadius: "8px",
        background: isDarkMode
          ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
          : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 450,
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Lecture Resources
      </Typography>

      {displayedResources?.map((resource, index) => {
        // Display research papers, YouTube videos, and Google Books separately
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {resource.research_papers && resource.research_papers.title && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Research Paper:</Typography>
                <Link
                  href={resource.research_papers.link}
                  target="_blank"
                  rel="noopener"
                >
                  {resource.research_papers.title}
                </Link>
              </Box>
            )}
            {resource.youtube_videos && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">YouTube Video:</Typography>
                <Link
                  href={resource.youtube_videos}
                  target="_blank"
                  rel="noopener"
                >
                  Watch Video
                </Link>
              </Box>
            )}
            {resource.Google_Book_Links && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Google Book Link:</Typography>
                <Link
                  href={resource.Google_Book_Links}
                  target="_blank"
                  rel="noopener"
                >
                  View Book
                </Link>
              </Box>
            )}
          </Box>
        );
      })}
      {visibleCount < resources.length && (
        <Button
          variant="contained"
          onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
          sx={{ mt: 2 }}
        >
          Need More
        </Button>
      )}
    </Box>
  );
};

export default LectureReferrence;
