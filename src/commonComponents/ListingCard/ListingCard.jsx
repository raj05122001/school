import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import { MdOutlineDateRange } from "react-icons/md";
import LectureType from "../LectureType/LectureType";
import Image from "next/image";
import { AppContextProvider } from "@/app/main";
import UserImage from "../UserImage/UserImage";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import usePresignedUrl from "@/hooks/usePresignedUrl";

// enable relativeTime throughout your app
dayjs.extend(relativeTime);

const ListingCard = ({ data, onClick }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const { fetchPresignedUrl } = usePresignedUrl()
  const videoRef = useRef(null);
  const [videoUrl,setVideoUrl]=useState("")

  useEffect(()=>{
    getSignedUrlForObject()
  },[data?.id])

  const getSignedUrlForObject = async () => {
    const urlData = {
      file_name: `${data?.id}.mp4`,
      file_type: "video/mp4",
      operation: "download",
      folder: "videos/",
    };

    console.log("urlData : ",urlData)
  
    try {
      const signedUrl = await fetchPresignedUrl(urlData)
      console.log("signedUrl?.presigned_url : ",signedUrl?.presigned_url)
      setVideoUrl(signedUrl?.presigned_url)
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef?.current?.pause();
  };

  return (
    <Box
      p={2}
      sx={{ width: "100%", height: "100%" }}
      onClick={() => onClick(data?.id)}
    >
      <Card
        // className="blur_effect_card"
        sx={{
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: isDarkMode
              ? "0px 8px 30px rgba(255, 255, 255, 0.1)" // Dark mode hover shadow
              : "0px 8px 30px rgba(0, 0, 0, 0.15)", // Light mode hover shadow
          },
          height: "100%",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {data?.processing_status === "SUCCESS" ? (
          <CardMedia
            component="video"
            preload="auto"
            ref={videoRef}
            src={videoUrl}
            controls={isHovered}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 230,
              borderRadius: "16px 16px 0 0",
              backdropFilter: "blur(10px)",
              backgroundColor: "black",
            }}
          />
        ) : (
          <Image src={"/Your Lecture is.png"} width={200} height={230} style={{width:"100%",height: "auto", maxHeight: 230,}}/>
        )}

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            // p: 3,
            paddingX: 2,
            textAlign: "left",
            height: "100%",
            color: isDarkMode ? "#f1f1f1" : "#000", // Text color based on theme
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box sx={{display:"flex" , alignItems:'center', gap:1}}>
            <UserImage name={data?.organizer?.full_name} profilePic={data?.organizer?.profilePic}/>
          <Typography
            // variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize:"14px", lineHeight:"100%", color: "#3B3D3B", fontFamily: "Inter, sans-serif" }}
          >
            {data?.title}
          </Typography>
          </Box>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif", fontSize:"12px", fontWeight:500,mt:1 }}
          >
            <strong>Batch:</strong> {data?.lecture_class?.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif", fontSize:"12px", fontWeight:500 }}
          >
            <strong>Course:</strong> {data?.chapter?.subject?.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif", fontSize:"12px", fontWeight:500 }}
          >
            <strong>Module:</strong> {data?.chapter?.chapter}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif", fontSize:"12px", fontWeight:500 }}
          >
            <strong>Description:</strong> {data?.description || "N/A"}
          </Typography>
          <Grid container mt={"auto"} pt={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: "flex", gap: 1, alignItems:'center' }}>
                <Box>
                <MdOutlineDateRange size={22} />
                </Box>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif",fontSize:"13px", fontWeight:500,m:0 }}
                >
                  {dayjs(data?.schedule_date).fromNow()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LectureType lectureType={data?.type} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ListingCard;
