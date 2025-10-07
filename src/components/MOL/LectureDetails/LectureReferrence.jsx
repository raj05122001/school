import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Skeleton,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
// import { getLectureResources } from "@/api/apiHelper";
import { GrResources } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { getLectureResources, updateResources } from "@/api/apiHelper";

const LectureReferrence = ({ id, isEdit }) => {
  const [resources, setResources] = useState([]);
  const [resourcesId, setResourcesId] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls
  const [currentLectureId, setCurrentLectureId] = useState(id);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null,
  });

  useEffect(() => {
    const handleLectureUUIDChange = (e) => {
      const newLectureUUID = e.detail;
      setCurrentLectureId(newLectureUUID);
    };

    window.addEventListener("lectureUUIDChange", handleLectureUUIDChange);

    return () => {
      window.removeEventListener("lectureUUIDChange", handleLectureUUIDChange);
    };
  }, []);

  useEffect(() => {
    // Reset hasFetchedData when currentLectureId changes
    hasFetchedData.current = false;
    setLoading(true);

    // Fetch lecture resources
    const fetchResources = async () => {
      try {
        const response = await getLectureResources(id)
        if (response?.success) {
          // Parse the resources_text JSON string into a JS array
          const resourcesArray = JSON.parse(response.data.resources_text);
          setResources(resourcesArray);
          setResourcesId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching lecture resources:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedData.current && currentLectureId) {
      hasFetchedData.current = true;
      fetchResources();
    }
  }, [currentLectureId]);

  // Filter unique resources
  const uniqueResources = resources?.filter((resource, index, self) => {
    const link =
      resource?.research_papers?.link ||
      resource?.scopus_data?.scopus_link ||
      resource?.scopus_data?.doi_link ||
      resource?.springer_data?.url ||
      resource?.youtube_videos?.link ||
      resource?.Google_Book_Links?.thumbnail;
    return (
      self.findIndex((r) => {
        const rLink =
          r.research_papers?.link ||
          r.scopus_data?.scopus_link ||
          r.scopus_data?.doi_link ||
          r?.springer_data?.url ||
          r.youtube_videos?.link ||
          r.Google_Book_Links?.thumbnail;
        return rLink === link;
      }) === index
    );
  });

  const displayedResources = uniqueResources.slice(0, visibleCount);

  // Open delete confirmation dialog
  const handleDeleteClick = (originalIndex) => {
    setDeleteDialog({ open: true, index: originalIndex });
  };

  // Close delete dialog
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, index: null });
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      const indexToDelete = deleteDialog.index;
      if (indexToDelete !== null) {
        // Remove the item from uniqueResources and update the original resources
        const updatedUniqueResources = uniqueResources.filter(
          (_, index) => index !== indexToDelete
        );

        // Update the original resources state to reflect the deletion
        setResources(updatedUniqueResources);

        const updatedText = JSON.stringify(updatedUniqueResources);

        await updateResources(resourcesId, {
          resources_text: updatedText,
        })

        // If we deleted an item and now have fewer items than visibleCount, adjust visibleCount
        if (updatedUniqueResources.length < visibleCount && visibleCount > 10) {
          setVisibleCount(Math.max(10, updatedUniqueResources.length));
        }
      }
    } catch (error) {
      console.error("Error deleting reference:", error);
    } finally {
      setDeleteDialog({ open: false, index: null });
    }
  };

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

          {displayedResources?.map((resource, displayIndex) => {
            // Find the original index in uniqueResources array
            const originalIndex = uniqueResources.findIndex(
              (r) => r === resource
            );

            // Display research papers, YouTube videos, and Google Books separately
            return (
              (resource.research_papers ||
                resource.scopus_data ||
                resource?.springer_data ||
                resource.youtube_videos ||
                resource.Google_Book_Links) && (
                <Box
                  key={originalIndex}
                  className="blur_effect_card"
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 4,
                  }}
                >
                  {isEdit && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                        mb: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => handleDeleteClick(originalIndex)}
                        color="error"
                      >
                        <MdDelete />
                      </IconButton>
                    </Box>
                  )}
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
                      <Typography sx={refTitleCSS}>
                        Scopus Link:
                      </Typography>
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
                            }}>
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
                  {resource?.springer_data && (
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={refTitleCSS}>
                        Springer Link:
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Box
                          component="img"
                          src="/springer_logo.png"
                          alt="Springer logo"
                          sx={{
                            width: 100,
                            height: "auto",
                            mt: 1,
                            mixBlendMode: "multiply",
                          }}
                        />
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Link
                            href={resource?.springer_data?.url}
                            target="_blank"
                            rel="noopener"
                            sx={refLinkCSS}
                          >
                            {resource?.springer_data?.title}
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {resource.youtube_videos && (
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={refTitleCSS}>
                        YouTube Video:
                      </Typography>
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
          {visibleCount < uniqueResources.length && (
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this reference? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LectureReferrence;
