"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import {
  MdPlayArrow,
  MdBookmark,
  MdDownload,
  MdMoreVert,
} from "react-icons/md";
import { getLectureById, getAssignmentAnswer } from "@/api/apiHelper";
import StudentAssignments from "@/components/teacher/Assignment/StudentAssignments";

const courseDetails = {
  title: "C Language Tutorials In Hindi",
  instructor: "CodeWithHarry",
  description:
    "In this latest course on C language tutorials in 2019 in Hindi, we will learn how to write efficient and powerful C programs using modern tools. C programming is one of the most requested...",
  videoCount: 76,
  lastUpdated: "Dec 25, 2020",
};

const videos = [
  {
    title: "Why Learn C Programming Language?",
    duration: "14:51",
    views: "4.9M views",
    updated: "5 years ago",
  },
  {
    title: "What Is Coding & C Programming Language?",
    duration: "14:23",
    views: "2.2M views",
    updated: "5 years ago",
  },
  {
    title: "Install & Configure VS Code With C Compiler",
    duration: "20:57",
    views: "5M views",
    updated: "5 years ago",
  },
  {
    title: "Basic Structure of C Program in Hindi",
    duration: "16:45",
    views: "2.4M views",
    updated: "5 years ago",
  },
  {
    title: "Basic Syntax Of A C Program",
    duration: "13:57",
    views: "1.4M views",
    updated: "5 years ago",
  },
];

const CoursePlaylist = ({ params }) => {
  const { id } = params;
  const [lectureData, setLectureData] = useState({});
  const [listData, setListData] = useState({});
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getMeetingByID();
      fetchAssignmentAnswer();
    }
  }, [id]);

  const getMeetingByID = async () => {
    setLoading(true);
    try {
      const apiResponse = await getLectureById(id);
      if (apiResponse?.data?.success) {
        setLectureData(apiResponse?.data?.data);
      }
      setLoading(false);
    } catch (e) {
      setLectureData({});
      console.error(e);
      setLoading(false);
    }
  };

  const fetchAssignmentAnswer = async () => {
    setListLoading(true);
    try {
      const apiResponse = await getAssignmentAnswer(id);
      if (apiResponse?.data?.success) {
        setListData(apiResponse?.data?.data);
      }
      setListLoading(false);
    } catch (e) {
      setListData({});
      console.error(e);
      setListLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 2, height: "100%" }}
      >
        {/* Main Course Card */}
        <Card
          sx={{
            width: 300,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            height: "100%",
            borderRadius: "16px",
          }}
        >
          <CardMedia
            component="video"
            preload="auto"
            //   ref={videoRef}
            src={`https://d3515ggloh2j4b.cloudfront.net/videos/${id}.mp4`}
            //   controls={isHovered}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 230,
              borderRadius: "16px 16px 0 0",
              backdropFilter: "blur(10px)",
              backgroundColor: "black",
            }}
          />
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {lectureData.title}
            </Typography>

            <Typography variant="subtitle1">
              <strong>Class:</strong>{" "}
              {lectureData?.lecture_class?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Subject:</strong>{" "}
              {lectureData?.chapter?.subject?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Chapter:</strong> {lectureData?.chapter?.chapter || "N/A"}
            </Typography>

            <Typography variant="subtitle1">
              <strong>Scheduled Date:</strong>{" "}
              {lectureData?.schedule_date || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Scheduled Time:</strong>{" "}
              {lectureData?.schedule_time || "N/A"}
            </Typography>

            <Typography variant="subtitle1">
              <strong>Description:</strong> {lectureData?.description || "N/A"}
            </Typography>
          </CardContent>
        </Card>

        {/* Video List */}
        <Box sx={{ flex: 1 }}>
        <StudentAssignments listData={listData}/>
        </Box>
      </Box>
    </Box>
  );
};

export default CoursePlaylist;
