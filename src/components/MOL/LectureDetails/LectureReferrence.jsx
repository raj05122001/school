import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Link, Button, Skeleton } from "@mui/material";
import { getLectureResources } from "@/api/apiHelper";

const LectureReferrence = ({ id, isDarkMode }) => {
  const [resources, setResources] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls

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

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchResources();
    }
  }, [id]);

  // Filter unique resources
  const uniqueResources = resources?.filter((resource, index, self) => {
    const link =
      resource?.research_papers?.link ||
      resource?.youtube_videos?.link ||
      resource?.Google_Book_Links?.thumbnail;
    return (
      self.findIndex((r) => {
        const rLink =
          r.research_papers?.link ||
          r.youtube_videos?.link ||
          r.Google_Book_Links?.thumbnail;
        return rLink === link;
      }) === index
    );
  });

  const displayedResources = uniqueResources.slice(0, visibleCount);

  // if (loading) {
  //   return (
  //     <Box sx={{ p: 3, width: "100%" }}>
  //       <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
  //       {[...Array(7)].map((_, index) => (
  //         <Skeleton key={index} variant="text" height={30} sx={{ mb: 1 }} />
  //       ))}
  //     </Box>
  //   );
  // }
  return (
    <>
      {loading ? (
        <Box
          sx={{
            p: 3,
            width: "100%",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            color: isDarkMode ? "#F0EAD6" : "#36454F",
            background: isDarkMode
              ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
              : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
            overflowY: "auto",
            height: "100%",
            minHeight: 400,
            maxHeight: 500,
            width: "100%",
          }}
        >
          <Box>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            width: "100%",
            color: isDarkMode ? "#F0EAD6" : "#36454F",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            background: isDarkMode
              ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
              : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
            overflowY: "auto",
            height: "100%",
            minHeight: 400,
            maxHeight: 500,
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
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      Research Paper:
                    </Typography>
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
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      YouTube Video:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {resource.youtube_videos.thumbnail && (
                        <Box
                          component="img"
                          src={resource.youtube_videos.thumbnail}
                          alt="YouTube Video Thumbnail"
                          sx={{ width: 100, height: "auto", mt: 1 }}
                        />
                      )}
                      <Link
                        href={resource.youtube_videos.link}
                        target="_blank"
                        rel="noopener"
                      >
                        {resource.youtube_videos.title}
                      </Link>
                    </Box>
                  </Box>
                )}
                {resource.Google_Book_Links && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={"bold"}>
                      Google Book Link:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {resource.Google_Book_Links.thumbnail && (
                        <Box
                          component="img"
                          src={resource.Google_Book_Links.thumbnail}
                          alt="Google Book Thumbnail"
                          sx={{ width: 100, height: "auto", mt: 1 }}
                        />
                      )}
                      <Link
                        href={resource.Google_Book_Links.link}
                        target="_blank"
                        rel="noopener"
                      >
                        {resource.Google_Book_Links.title}
                      </Link>
                    </Box>
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
      )}
    </>
  );
};

export default LectureReferrence;
