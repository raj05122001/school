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
import usePresignedUrl from "@/hooks/usePresignedUrl";

const ListingCard = ({ data, onClick }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const { fetchPresignedUrl } = usePresignedUrl()
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
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
  
    try {
      const signedUrl = await fetchPresignedUrl(urlData)
      setVideoUrl(signedUrl?.presigned_url)
    } catch (error) {
      console.error(error);
      return null;
    }
  };


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
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: primaryColor, fontFamily: "Inter, sans-serif" }}
          >
            {data?.title}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif" }}
          >
            <strong>Class:</strong> {data?.lecture_class?.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif" }}
          >
            <strong>Subject:</strong> {data?.chapter?.subject?.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif" }}
          >
            <strong>Chapter:</strong> {data?.chapter?.chapter}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif" }}
          >
            <strong>Description:</strong> {data?.description || "N/A"}
          </Typography>
          <Grid container mt={"auto"} pt={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <MdOutlineDateRange size={22} />
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: isDarkMode ? primaryColor : "#555", fontFamily: "Inter, sans-serif" }}
                >
                  {data?.schedule_date}
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