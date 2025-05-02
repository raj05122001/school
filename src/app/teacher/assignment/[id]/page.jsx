"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Tabs,
  Tab,
  Badge,
  TextField,
  InputAdornment,
  Paper,
  InputBase,
} from "@mui/material";
import {
  MdPlayArrow,
  MdBookmark,
  MdDownload,
  MdMoreVert,
  MdOutlineWatchLater,
} from "react-icons/md";
import {
  getLectureById,
  getAssignmentAnswer,
  getTeacherAssignment,
} from "@/api/apiHelper";
import StudentAssignments from "@/components/teacher/Assignment/StudentAssignments";
import { useThemeContext } from "@/hooks/ThemeContext";
import { Varela_Round } from "next/font/google";
import { MdOutlineTopic } from "react-icons/md";
import { BsXDiamond } from "react-icons/bs";
import DarkMode from "@/components/DarkMode/DarkMode";
import { FaBell, FaTimes } from "react-icons/fa";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import usePresignedUrl from "@/hooks/usePresignedUrl";
import { FiFilter, FiSearch } from "react-icons/fi";
import { IoCalendarClearOutline } from "react-icons/io5";

const varelaRound = Varela_Round({ weight: "400", subsets: ["latin"] });

const darkModeStyles = {
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  inputBackgroundColor: "#ffffff",
  inputColor: "#ffffff",
  boxShadow: "0px 2px 5px rgba(255, 255, 255, 0.1)",
};

const lightModeStyles = {
  backgroundColor: "#ffffff",
  color: "#000000",
  inputBackgroundColor: "#333333",
  inputColor: "#000000",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
};

const CoursePlaylist = ({ params }) => {
  const { fetchPresignedUrl } = usePresignedUrl();
  const { id } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchQuery = searchParams.get("globalSearch") || "";
  const [globalSearch, setGlobalSearch] = useState(searchQuery);

  const [listData, setListData] = useState({});
  const [listLoading, setListLoading] = useState(true);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [selectedTab, setSelectedTab] = useState(0); // State to manage selected tab
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    getSignedUrlForObject();
  }, [id]);

  const getSignedUrlForObject = async () => {
    const data = {
      file_name: `${id}.mp4`,
      file_type: "video/mp4",
      operation: "download",
      folder: "videos/",
    };

    try {
      const signedUrl = await fetchPresignedUrl(data);
      setVideoUrl(signedUrl?.presigned_url);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (id) {
      fetchAssignmentAnswer();
    }
  }, [id, searchQuery]);

  const fetchAssignmentAnswer = async () => {
    setListLoading(true);
    try {
      const apiResponse = await getTeacherAssignment(
        id,
        "",
        "",
        "",
        "",
        searchQuery
      );

      if (apiResponse?.success) {
        setListData(apiResponse?.data);
      }
      setListLoading(false);
    } catch (e) {
      setListData({});
      console.error(e);
      setListLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleChange(globalSearch);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [globalSearch]);

  const handleChange = (value) => {
    router.push(`${pathname}?globalSearch=${value}`);
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;
  return (
    <Box
      sx={{
        padding: 4,
        color: "#fff",
        minHeight: "100vh",
        background: isDarkMode
          ? ""
          : "linear-gradient(to top, #dfe9f3 0%, white 100%)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Main Course Card */}
      <Card
        sx={{
          width: "100%",
          display: "flex",
          color: isDarkMode ? "#f1f1f1" : "#000", // Text color based on theme
          borderRadius: "16px",
          fontFamily: varelaRound,
          height: "140px",
        }}
      >
        <CardMedia
          component="video"
          preload="auto"
          //   ref={videoRef}
          src={videoUrl}
          //   controls={isHovered}
          sx={{
            width: "20%",
            height: "100%",

            backdropFilter: "blur(10px)",
            backgroundColor: "black",
          }}
        />
        <CardContent sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              fontSize={"24px"}
              fontFamily={varelaRound}
            >
              {listData?.lecture?.title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "56px" }}>
            <Box>
              <Typography
                sx={{ fontWeight: 400, fontSize: "12px", color: "#8C8F90" }}
              >
                Class
              </Typography>
              <Typography
                sx={{ fontWeight: 700, fontSize: "14px", color: "#3B3D3B" }}
              >
                {listData?.lecture?.lecture_class?.name || "N/A"}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{ fontWeight: 400, fontSize: "12px", color: "#8C8F90" }}
              >
                Subject
              </Typography>
              <Typography
                sx={{ fontWeight: 700, fontSize: "14px", color: "#3B3D3B" }}
              >
                {listData?.lecture?.chapter?.subject?.name || "N/A"}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{ fontWeight: 400, fontSize: "12px", color: "#8C8F90" }}
              >
                Chapter
              </Typography>
              <Typography
                sx={{ fontWeight: 700, fontSize: "14px", color: "#3B3D3B" }}
              >
                {listData?.lecture?.chapter?.chapter || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{display:"flex",gap:"10px"}}>
           <Box sx={{backgroundColor:"#DCF9E8",borderRadius:'4px',padding:"4px",display:'flex',gap:1,alignItems:'center'}}>
           <MdOutlineWatchLater color="#1F6F2C"/>
           <Typography sx={{fontWeight:400,fontSize:"12px",color:"#1F6F2C"}} >
              {listData?.lecture?.schedule_date || "N/A"}
            </Typography>
           </Box>

           <Box sx={{backgroundColor:"#DCF9E8",borderRadius:'4px',padding:"4px",display:'flex',gap:1,alignItems:'center'}}>
           <IoCalendarClearOutline color="#1F6F2C"/>
           <Typography sx={{fontWeight:400,fontSize:"12px",color:"#1F6F2C"}} >
           {listData?.lecture?.schedule_time || "N/A"}
            </Typography>
           </Box>

          </Box>
          {/* <Typography variant="subtitle1" marginTop={4}>
              <BsXDiamond /> <strong>Class:</strong>{" "}
              {listData?.lecture?.lecture_class?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <BsXDiamond /> <strong>Subject:</strong>{" "}
              {listData?.lecture?.chapter?.subject?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <BsXDiamond /> <strong>Chapter:</strong>{" "}
              {listData?.lecture?.chapter?.chapter || "N/A"}
            </Typography>

            <Typography variant="subtitle1">
              <BsXDiamond /> <strong>Scheduled Date:</strong>{" "}
              {listData?.lecture?.schedule_date || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <BsXDiamond /> <strong>Scheduled Time:</strong>{" "}
              {listData?.lecture?.schedule_time || "N/A"}
            </Typography> */}
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Paper
        component="form"
        sx={{
          p: "2px 8px",
          display: "flex",
          alignItems: "center",
          borderRadius: "16px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          onChange={(e) => setGlobalSearch(encodeURIComponent(e.target.value))}
          value={decodeURIComponent(globalSearch)}
        />
        <IconButton type="submit">
          <FiSearch />
        </IconButton>
      </Paper>

      {/* Video List */}
      <Box sx={{ flex: 1, width: "100%" }}>
        <StudentAssignments
          listData={listData?.students}
          isDarkMode={isDarkMode}
        />
      </Box>
    </Box>
  );
};

export default CoursePlaylist;
