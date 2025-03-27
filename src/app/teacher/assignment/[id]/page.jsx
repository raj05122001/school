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
} from "@mui/material";
import {
  MdPlayArrow,
  MdBookmark,
  MdDownload,
  MdMoreVert,
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
import { AppContextProvider } from "@/app/main";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AwsSdk } from "@/hooks/AwsSdk";

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
  const {s3FileName}=useContext(AppContextProvider)
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
  const [videoUrl,setVideoUrl]=useState("")
  
  
    useEffect(()=>{
      getSignedUrlForObject()
    },[s3FileName,id])
  
    const getSignedUrlForObject = async () => {
      const { s3 } = AwsSdk();
      const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET;
    
      const params = {
        Bucket,
        Key: `videos/${s3FileName}${id}.mp4`,
      };
      
      console.log("params : ", params);
    
      try {
        const command = new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 3 });
        setVideoUrl(signedUrl)
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
        padding: 1,
        color: "#fff",
        minHeight: "100vh",
        background:isDarkMode ? "" : "linear-gradient(to top, #dfe9f3 0%, white 100%)"
      }}
    >
    
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", justifyContent:"center", alignItems:"center" }}
      >
        {/* Main Course Card */}
        <Card
          sx={{
            marginTop:4,
            width: "100%",
            display:"flex",
            // backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: isDarkMode ? "#f1f1f1" : "#000", // Text color based on theme
            height: "70%",
            borderRadius: "16px",
            fontFamily: varelaRound,
            background: isDarkMode
              ? "rgba(255, 255, 255, 0.2)"
              : "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
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
          <CardContent sx={{width:"100%"}}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 ,justifyContent:'space-between', width:"100%"}}>
            <Typography
              variant="h5"
              fontWeight="bold"
              fontSize={"24px"}
              fontFamily={varelaRound}
            >
              <MdOutlineTopic /> {listData?.lecture?.title}
              <hr />
            </Typography>
           <Box sx={{ display:"flex", justifyContent:"flex-end"}}>  
           <TextField
              id="global-search"
              variant="outlined"
              value={decodeURIComponent(globalSearch)}
              placeholder="Global Search"
              onChange={(e) =>
                setGlobalSearch(encodeURIComponent(e.target.value))
              }
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setGlobalSearch("");
                      }}
                    >
                      <FaTimes size={18} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  ...currentStyles,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  height:40
                },
              }}
              sx={{
                boxShadow: currentStyles.boxShadow,
                borderRadius: 1,
                width: "200px",
              }}
            />
            <DarkMode />
            <UserImage width={40} height={40} />
           </Box> 
          </Box>
            <Typography variant="subtitle1" marginTop={4}>
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
            </Typography>
          </CardContent>
        </Card>
        {/* Video List */}
        <Box sx={{ flex: 1, width:"100%" }}>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="none"
              textColor="primary"
              sx={{
                alignSelf: "flex-end",
                ".MuiTabs-flexContainer": {
                  gap: 2,
                  background:
                    isDarkMode &&
                    "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
                  backgroundImage: isDarkMode ? "" : "url('/TabBG2.jpg')", // Add background image
                  backgroundSize: "cover", // Ensure the image covers the entire page
                  backgroundPosition: "center", // Center the image
                  padding: 1,
                  // borderRadius: "12px",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                },
                ".MuiTab-root": {
                  color: "#333",
                  padding: "10px 20px",
                  minHeight: 0,
                  marginTop: "8px",
                  textAlign: "center",
                  color: isDarkMode && "#F0EAD6",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  },
                },
              }}
            >
              <Tab label="Checked" />
              <Tab label="Not Checked" />
            </Tabs>
          </Box> */}
          <StudentAssignments
            listData={listData?.students}
            isDarkMode={isDarkMode}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default CoursePlaylist;