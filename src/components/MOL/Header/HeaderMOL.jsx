import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  useTheme,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell, FaUpload, FaDownload } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import React from "react";
import { useThemeContext } from "@/hooks/ThemeContext";
import { MdPublishedWithChanges, MdUnpublished } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import { deleteCompletedLecture } from "@/api/apiHelper";
import { useRouter } from "next/navigation";
const HeaderMOL = ({
  lectureData,
  isEdit = false,
  isShowPic = false,
  loading,
  handleReleased = () => {},
}) => {
  const { isDarkMode } = useThemeContext();
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    return text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  };

  const handleDeleteLecture = async () =>{
    try{
      const deleteLecture = await deleteCompletedLecture(lectureData?.id)
      if (deleteLecture?.data?.success){
        router.push("/admin/lecture-listings")
      }
    }catch (error){
      console.error(error)
    }
  }
  return (
    <Box
      sx={{
        padding: 3,
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 4,
          paddingBottom: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          {userDetails?.role === "ADMIN" && (
            <Button
              variant="contained"
              onClick={()=>setDialogOpen(!dialogOpen)}
              sx={{
                color: isDarkMode ? "#fff" : "#000",
                backgroundColor: "#89CFF0",
                p: 1,
                fontSize: "12px",
              }}
            >
              <RiDeleteBin5Fill
                style={{ marginRight: 4, mb: 1, fontSize: "18px" }}
              />{" "}
              Delete Lecture
            </Button>
          )}
          {isEdit && !lectureData?.is_released && (
            <Button
              variant="contained"
              onClick={() => handleReleased(!lectureData?.is_released)}
              startIcon={
                lectureData?.is_released ? (
                  <MdUnpublished size={22} />
                ) : (
                  <MdPublishedWithChanges size={22} />
                )
              }
              sx={{
                color: isDarkMode ? "#fff" : "#000",
                backgroundColor: "#89CFF0",
                p: 1,
                fontSize: "12px",
              }}
            >
              {lectureData?.is_released
                ? "Unpublish Lecture"
                : "Publish Lecture"}
            </Button>
          )}
          {/* <Button
            variant="outlined"
            startIcon={<FaDownload size={22} />}
            sx={{
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "#fff" : theme.palette.primary.main,
            }}
          >
            {loading ? <Skeleton width={80} height={30} /> : "Download"}
          </Button> */}
          <DarkMode />
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <FaBell size={24} />
            </Badge>
          </IconButton>
          {loading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <UserImage width={40} height={40} />
          )}
        </Box>
      </Box>
      {/* Lecture Topic and Details Layout */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <Box
          sx={{
            flex: 1,
            borderRight: `2px solid ${
              isDarkMode ? theme.palette.grey[300] : "#6495ED"
            }`,
            paddingRight: 2,
          }}
        >
          {loading ? (
            <Skeleton width="100%" height={50} />
          ) : (
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", fontFamily: "Inter, sans-serif" }}
            >
              {lectureData?.title || "Lecture Topic"}
              <br />
              <span style={{ fontSize: "16px", fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>
                facilitated by VidyaAI
              </span>
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 2 }}>
          <Box sx={{ mb: 1 }}>
            {loading ? (
              <Skeleton width="80%" height={30} />
            ) : (
              <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif"}}>
                <strong>Description:</strong>{" "}
                <Tooltip title={lectureData?.description || "Description not available"}>
                  <span>{truncateText(lectureData?.description || "N/A")}</span>
                </Tooltip>
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap:"14px" }}>
            {loading ? (
              <>
                <Skeleton width="20%" height={30} />
                <Skeleton width="20%" height={30} />
                <Skeleton width="20%" height={30} />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif", }}>
                  <strong>Class:</strong>{" "}
                  <Tooltip title={lectureData?.lecture_class?.name || "Class name not available"}>
                  <span>{truncateText(lectureData?.lecture_class?.name) || "N/A"}</span>
                  </Tooltip>
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: "center", fontFamily: "Inter, sans-serif", }}>
                  <strong>Subject:</strong>{" "}
                  <Tooltip title={lectureData?.chapter?.subject?.name || "Subject name not available"}>
                    <span>{truncateText(lectureData?.chapter?.subject?.name || "N/A")}</span>
                  </Tooltip>
                </Typography>
                <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif",}}>
                  <strong>Chapter:</strong>{" "}
                  <Tooltip title={lectureData?.chapter?.chapter || "Chapter name not available"}>
                    <span>{truncateText(lectureData?.chapter?.chapter || "N/A")}</span>
                  </Tooltip>
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            {loading ? (
              <>
                <Skeleton width="20%" height={30} />
                <Skeleton width="20%" height={30} />
                <Skeleton width="20%" height={30} />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif", }}>
                  <strong>Duration:</strong>{" "}
                  {lectureData?.duration
                    ? formatDuration(lectureData?.duration)
                    : "N/A"}
                </Typography>
                <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif",}}>
                  <strong>Scheduled Date:</strong>{" "}
                  {lectureData?.schedule_date || "N/A"}
                </Typography>
                <Typography variant="subtitle1" sx={{fontFamily: "Inter, sans-serif",}}>
                  <strong>Scheduled Time:</strong>{" "}
                  {lectureData?.schedule_time || "N/A"}
                </Typography>
              </>
            )}
          </Box>
          {isShowPic && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {loading ? (
                <>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton width="30%" height={30} />
                </>
              ) : (
                <>
                  <UserImage
                    profilePic={lectureData?.organizer?.profile_pic}
                    name={lectureData?.organizer?.full_name}
                  />
                  <Typography>{lectureData?.organizer?.full_name}</Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(!dialogOpen)}
      sx={{
        "& .MuiDialogContent-root": {
          borderRadius: 4,
        },
        "& .MuiDialogTitle-root": {
          fontSize:"16px",
        },
        // "& .MuiPaper-root": {
        //   border: "2px solid #0096FF",
        //   borderRadius: "12px",
        // },
      }}
      >
        <DialogTitle>
          Are you sure you want to delete this lecture?
        </DialogTitle>
        <DialogActions>
        <Box sx={{display:"flex", gap:4, justifyContent:"center", width:"100%"}}>
          <Button onClick={() => setDialogOpen(!dialogOpen)} variant="outlined">
              No
            </Button>
            <Button onClick={handleDeleteLecture} variant="contained">
              Yes
            </Button>
        </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default HeaderMOL;