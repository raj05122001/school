import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Link, Button, Skeleton } from "@mui/material";
import { getLectureResources } from "@/api/apiHelper";
import { GrResources } from "react-icons/gr";

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
      resource?.scopus_data?.scopus_link ||
      resource?.scopus_data?.doi_link ||
      resource?.youtube_videos?.link ||
      resource?.Google_Book_Links?.thumbnail;
    return (
      self.findIndex((r) => {
        const rLink =
          r.research_papers?.link ||
          r.scopus_data?.scopus_link ||
          r.scopus_data?.doi_link ||
          r.youtube_videos?.link ||
          r.Google_Book_Links?.thumbnail;
        return rLink === link;
      }) === index
    );
  });

  const displayedResources = uniqueResources.slice(0, visibleCount);
  const refTitleCSS = {
    color: "#3B3D3B",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "20px",
    letterSpacing: "-0.48px",
  };

  const refLinkCSS = {
    color: "#1dab0e",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    fontFamily: "Inter",
  };

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
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
            color: "#3B3D3B",
            backgroundColor: "#fff",
            overflowY: "auto",
            height: "100%",
            minHeight: 400,
            maxHeight: 500,
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
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
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
            color: "#3B3D3B",
            backgroundColor: "#fff",
            overflowY: "auto",
            height: "100%",
            minHeight: 400,
            maxHeight: 500,
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
          }}
        >
          <Typography
            sx={{
              mb: 2,
              color: "#3B3D3B",
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "20px",
              letterSpacing: "-0.48px",
            }}
          >
            <GrResources /> Lecture Resources
          </Typography>

          {displayedResources?.map((resource, index) => {
            // Display research papers, YouTube videos, and Google Books separately
            return (
              (resource.research_papers ||
                resource.scopus_data ||
                resource.youtube_videos ||
                resource.Google_Book_Links) && (
                <Box
                  key={index}
                  className="blur_effect_card"
                  sx={{
                    mb: 2,
                    backgroundColor: !isDarkMode && "#f8fdff",
                    p: 2,
                    borderRadius: 4,
                  }}
                >
                  {resource.research_papers &&
                    resource.research_papers.title && (
                      <Box sx={{ mb: 1 }}>
                        <Typography sx={refTitleCSS}>
                          Research Paper:
                        </Typography>
                        <Link
                          href={resource.research_papers.link}
                          target="_blank"
                          rel="noopener"
                          sx={refLinkCSS}
                        >
                          {resource.research_papers.title}
                        </Link>
                      </Box>
                    )}
                  {resource.scopus_data && (
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={refTitleCSS}>Scopus Link:</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Box
                          component="img"
                          src="/scopus_thumbnail.png"
                          alt="Scopus logo"
                          sx={{
                            width: 100,
                            height: "auto",
                            mt: 1,
                            mixBlendMode: "multiply",
                          }}
                        />
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Typography
                            sx={{
                              color: "#3B3D3B",
                              fontFamily: "Inter",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: "500",
                              lineHeight: "20px",
                              letterSpacing: "-0.48px",
                            }}
                          >
                            Link:{" "}
                            <Link
                              href={resource.scopus_data.scopus_link}
                              target="_blank"
                              rel="noopener"
                              sx={refLinkCSS}
                            >
                              {resource.scopus_data.Title}
                            </Link>
                          </Typography>
                          {resource.scopus_data.doi_link && (
                            <Typography
                              sx={{
                                color: "#3B3D3B",
                                fontFamily: "Inter",
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "500",
                                lineHeight: "20px",
                                letterSpacing: "-0.48px",
                              }}
                            >
                              DOI Link:{" "}
                              <Link
                                href={resource.scopus_data.doi_link}
                                target="_blank"
                                rel="noopener"
                                sx={refLinkCSS}
                              >
                                {resource.scopus_data.doi_link}
                              </Link>
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {resource.youtube_videos && (
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={refTitleCSS}>YouTube Video:</Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        {resource.youtube_videos.thumbnail && (
                          <Box
                            component="img"
                            src={resource.youtube_videos.thumbnail}
                            alt="YouTube Video Thumbnail"
                            sx={{
                              width: 100,
                              height: "auto",
                              mt: 1,
                              borderRadius: 2,
                            }}
                          />
                        )}
                        <Link
                          href={resource.youtube_videos.link}
                          target="_blank"
                          rel="noopener"
                          sx={refLinkCSS}
                        >
                          {resource.youtube_videos.title}
                        </Link>
                      </Box>
                    </Box>
                  )}
                  {resource.Google_Book_Links && (
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={refTitleCSS}>
                        Google Book Link:
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        {resource.Google_Book_Links.thumbnail && (
                          <Box
                            component="img"
                            src={resource.Google_Book_Links.thumbnail}
                            alt="Google Book Thumbnail"
                            sx={{
                              width: 100,
                              height: "auto",
                              mt: 1,
                              borderRadius: 2,
                            }}
                          />
                        )}
                        <Link
                          href={resource.Google_Book_Links.link}
                          target="_blank"
                          rel="noopener"
                          sx={refLinkCSS}
                        >
                          {resource.Google_Book_Links.title}
                        </Link>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            );
          })}
          {visibleCount < resources.length && (
            <Button
              variant="contained"
              onClick={() => setVisibleCount((prevCount) => prevCount + 5)}
              sx={{
                mt: 2,
                display: "inline-flex",
                padding: "12px 32px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                textTransform: "none",
                borderRadius: "8px",
                background: "#141514",
                color: "#FFF",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Aptos",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "24px",
                "&:hover": {
                  border: "1px solid #141514",
                  background: "#E5E5E5",
                  color: "#141514",
                },
              }}
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
