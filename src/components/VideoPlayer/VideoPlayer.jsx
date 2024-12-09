import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";
import { getBreakpoint, updatePersonalised } from "@/api/apiHelper";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Skeleton,
  Grid,
} from "@mui/material";
import { AppContextProvider } from "@/app/main";
import { FaVideo } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import axios from "axios";
import personalisedRecommendations from "../student/MOL/personalisedRecommendations";

const VideoPlayer = ({ id }) => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [markers, setMarkers] = useState([]);
  const [suggestionData, setSuggestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);

  console.log("userDetails", userDetails);

  useEffect(() => {
    if (id) {
      fetchBreakPoint();
    }
  }, [id]);

  useEffect(() => {
    updateVideoWatchtime(435.34);
  }, []);

  const updateVideoWatchtime = async (time) => {
    if (time !== 0) {
      try {
        const formData = {
          lecture_id: id,
          timestamp: time,
          student_id: userDetails?.student_id,
        };

        // await axios.post("https://dev-vidyaai.ultimeet.io/api/v1/dashboard/watchtime_data/",formData)

        // Use navigator.sendBeacon for unload events
        // const beaconData = new Blob([JSON.stringify(formData)]);
        navigator.sendBeacon(
          "https://dev-vidyaai.ultimeet.io/api/v1/dashboard/watchtime_data/",
          JSON.stringify(formData)
        );

        console.log(
          "successful uploade watch time : ",
          JSON.stringify(formData)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchBreakPoint = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getBreakpoint(id);
      const breakPoint =
        apiResponse?.data?.data?.break_point?.length > 0
          ? JSON.parse(apiResponse?.data?.data?.break_point)
          : [];
      setMarkers(breakPoint);

      setSuggestionData(
        breakPoint.map((topic) => ({
          originalTitle: topic.gist,
          lowercaseTitle: topic.gist.toLowerCase(),
        }))
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleBeforeUnload = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      updateVideoWatchtime(currentTime);
    }
  };

  useEffect(() => {
    // pagehide
    // unload
    // visibilitychange
    // document.addEventListener("visibilitychange", function logData() {
    //   if (document.visibilityState === "hidden") {
    //     navigator.sendBeacon("/log", analyticsData);
    //   }
    // });
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Optionally, update watch time when component unmounts
      handleBeforeUnload();
    };
  }, [playerRef.current, id, playerRef.current?.currentTime()]);

  const breakpointPlayer = useMemo(
    () => (
      <BreakpointPlayer
        markers={markers}
        id={id}
        onPlayerReady={(player) => {
          playerRef.current = player;
        }}
      />
    ),
    [markers, id]
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {isLoading ? (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 8 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <FaVideo size={100} color="#808080" />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: "90%" }}>{breakpointPlayer}</Box>
      )}

      {suggestionData?.length > 0 && (
        <Box height="10%">
          <Suggestion suggestionData={suggestionData} />
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;

export const BreakpointPlayer = ({ markers, id, onPlayerReady }) => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const updateDataTriggered = useRef(false);

  const updateData = async () => {
    try {
      const formData = {
        student: userDetails?.student_id,
        lecture: id,
        section: "VIDEO",
        comment: "",
      };
      await updatePersonalised(formData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Initialize Video.js
    const videoElement = videoRef.current;
    playerRef.current = videojs(videoElement);

    // Notify parent that the player is ready
    if (onPlayerReady) {
      onPlayerReady(playerRef.current);
    }

    playerRef.current.on("loadedmetadata", function () {
      const total = playerRef.current.duration();
      const progressControl = playerRef.current.controlBar.progressControl;

      markers.forEach((marker) => {
        const left = (marker.start / 1000 / total) * 100 + "%";
        const el = document.createElement("div");
        el.className = "vjs-marker";
        el.style.left = left;
        el.dataset.time = marker.start / 1000;
        el.innerHTML = `<span style={{backgroundColor:'red'}}>
        ${marker.gist}
        </span>`;

        el.onclick = function () {
          playerRef.current.currentTime(marker.start / 1000);
        };

        // progressControl.el().appendChild(el);
        progressControl.children_[0].el_.appendChild(el);
      });
    });

    // Add event listener to track playtime
    playerRef.current.on("timeupdate", () => {
      const currentTime = playerRef.current.currentTime();

      // Trigger updateData when playtime exceeds 5 minutes (300 seconds)
      if (currentTime >= 600 && !updateDataTriggered.current && userDetails?.role==="STUDENT") {
        updateDataTriggered.current = true; // Prevent multiple triggers
        updateData();
      }
    });

    // return () => {
    //   if (playerRef.current) {
    //     playerRef.current.dispose();
    //   }
    // };
  }, [markers, onPlayerReady]);

  return (
    <video
      ref={videoRef}
      className="video-js"
      controls
      preload="auto"
      style={{ width: "100%", height: "100%", borderRadius: 10 }}
      data-setup='{ "html5": { "nativeTextTracks": true }, "playbackRates": [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75] }'
    >
      <source
        src={`https://d3515ggloh2j4b.cloudfront.net/videos/${id}.mp4`}
        type="video/mp4"
      />
    </video>
  );
};

export const Suggestion = ({ suggestionData }) => {
  const { handelChatBotText } = useContext(AppContextProvider);
  const containerRef = useRef(null);

  const uniqueTitles = [
    ...new Set(suggestionData.map((topic) => topic.lowercaseTitle)),
  ];

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <Grid
      container
      sx={{
        maxWidth: { xs: "100%", sm: "600px", md: "800px", lg: "1000px" },
        mx: "auto",
      }}
    >
      <Grid item xs={12} sm={0.6} py={2}>
        {uniqueTitles.length > 0 && (
          <Button
            onClick={() => scrollContainer("left")}
            sx={{
              bgcolor: "grey.300",
              "&:hover": { bgcolor: "grey.400" },
              p: 1,
              width: 40,
              height: 40,
              minWidth: "unset",
              borderRadius: "50%",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </Button>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={10.8}
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          maxWidth: "100%",
          py: 2,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {uniqueTitles.map((lowercaseTitle, index) => {
          const originalTitle = suggestionData.find(
            (s) => s.lowercaseTitle === lowercaseTitle
          ).originalTitle;
          return (
            <IconButton
              key={index}
              onClick={() => handelChatBotText(originalTitle)}
              sx={{
                overflow: "hidden",
                bgcolor: "grey.300",
                marginRight: "4px",
                "&:hover": {
                  bgcolor: "grey.400",
                  ringColor: "green.400",
                  boxShadow: "0 0 5px rgba(0, 128, 0, 0.2)",
                },
                py: 1,
                borderRadius: 2,
                transition: "all 0.3s ease-out",
                "& .shine": {
                  position: "absolute",
                  right: 0,
                  width: 24,
                  height: 96,
                  mt: -1,
                  opacity: 0.1,
                  bgcolor: "white",
                  rotate: "12deg",
                  transform: "translateX(8px)",
                  transition: "transform 1s",
                },
                "&:hover .shine": {
                  transform: "translateX(-100%)",
                },
              }}
            >
              <Box className="shine" />
              <Typography
                variant="body2"
                sx={{ color: "primary.main", fontWeight: "bold" }}
              >
                ✦ {originalTitle}
                {originalTitle.includes("?") ? "" : "?"}
              </Typography>
            </IconButton>
          );
        })}
      </Grid>
      <Grid item xs={12} sm={0.6} py={2}>
        {uniqueTitles.length > 0 && (
          <Button
            onClick={() => scrollContainer("right")}
            sx={{
              bgcolor: "grey.300",
              "&:hover": { bgcolor: "grey.400" },
              p: 1,
              width: 40,
              height: 40,
              minWidth: "unset",
              borderRadius: "50%",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            →
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
