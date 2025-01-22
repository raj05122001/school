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
import { BASE_URL_MEET } from "@/constants/apiconfig";

const VideoPlayer = ({ id }) => {
  const { s3FileName, handelChatBotText } = useContext(AppContextProvider);
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [markers, setMarkers] = useState([]);
  const [suggestionData, setSuggestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchBreakPoint();
    }
  }, [id]);

  // updateVideoWatchtime: This function sends the latest watch time to your backend.
  // It is used in multiple scenarios.
  const updateVideoWatchtime = async (time) => {
    if (typeof time === "number" && time > 0 && userDetails?.student_id) {
      try {
        const formData = {
          lecture_id: id,
          timestamp: time,
          student_id: userDetails?.student_id,
        };

        // Create a Blob with "application/json" so your backend (Flask) can parse it correctly
        const blob = new Blob([JSON.stringify(formData)], {
          type: "application/json",
        });

        // Send the data using navigator.sendBeacon
        navigator.sendBeacon(`${BASE_URL_MEET}/api/v1/dashboard/watchtime_data/`, blob);
      } catch (error) {
        console.error("Error sending beacon:", error);
      }
    }
  };

  // Event handlers to update watch time
  const handleBeforeUnload = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      updateVideoWatchtime(currentTime);
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      updateVideoWatchtime(currentTime);
    }
  };

  // When the video is paused or ended, update the watch time immediately.
  const handleVideoPause = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      updateVideoWatchtime(currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (playerRef.current) {
      // On video end, you may want to record the full duration as the last watch time.
      updateVideoWatchtime(playerRef.current.duration());
    }
  };

  useEffect(() => {
    // window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Optionally, update on component unmount as well
      // handleBeforeUnload();
    };
  }, [playerRef.current, id]);

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
        breakPoint?.map((topic) => ({
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

  // Using useMemo to avoid unnecessary re-renders of the video player
  const breakpointPlayer = useMemo(
    () => (
      <BreakpointPlayer
        markers={markers}
        id={id}
        onPlayerReady={(player) => {
          playerRef.current = player;
          // Attach additional event listeners to the Video.js player
          player.on("pause", handleVideoPause);
          player.on("ended", handleVideoEnded);
        }}
        s3FileName={s3FileName}
      />
    ),
    [markers, id, s3FileName]
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

export const BreakpointPlayer = ({ markers, id, onPlayerReady, s3FileName }) => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const updateDataTriggered = useRef(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const getDuration = (event) => {
      event.target.currentTime = 0;
      event.target.removeEventListener("timeupdate", getDuration);
      setDuration(event.target.duration);
    };

    const handleLoadedMetadata = () => {
      const video = videoRef.current;
      setDuration(video.duration);
      if (video.duration === Infinity || isNaN(Number(video.duration))) {
        video.currentTime = 1e101;
        video.addEventListener("timeupdate", getDuration);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", getDuration);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
      };

      const videoNode = videoRef.current;
      videoNode.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoNode.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

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
    const videoElement = videoRef.current;
    playerRef.current = videojs(videoElement);

    // Notify parent that the player is ready so that we can attach global event listeners
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
        // Using inline styling for the marker label; adjust as needed.
        el.innerHTML = `<span style="background-color: red;">${marker.gist}</span>`;

        el.onclick = function () {
          playerRef.current.currentTime(marker.start / 1000);
        };

        // Append the marker element to the progress control bar
        progressControl.children_[0].el_.appendChild(el);
      });
    });

    // Additional event: update personalised data after 10 minutes
    playerRef.current.on("timeupdate", () => {
      const currentTime = playerRef.current.currentTime();
      if (
        currentTime >= 600 &&
        !updateDataTriggered.current &&
        userDetails?.role === "STUDENT"
      ) {
        updateDataTriggered.current = true;
        updateData();
      }
    });

    return () => {
      if (playerRef.current) {
        // playerRef.current.dispose();
      }
    };
  }, [markers, userDetails, id]);

  return (
    <video
      ref={videoRef}
      className="video-js"
      controls
      preload="auto"
      style={{ width: "100%", height: "100%", borderRadius: 10 }}
      data-setup='{ "html5": { "nativeTextTracks": true },"playbackRates" : [0.25, 0.5, 0.75, 1, 1.25, 1.5,1.75]}'
    >
      <source
        src={`https://d3515ggloh2j4b.cloudfront.net/videos/${s3FileName}${id}.mp4`}
        type="video/mp4"
      />
    </video>
  );
};

export const Suggestion = ({ suggestionData }) => {
  const { handelChatBotText } = useContext(AppContextProvider);
  const containerRef = useRef(null);

  const uniqueTitles = [
    ...new Set(suggestionData?.map((topic) => topic.lowercaseTitle)),
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
              position: "inherit",
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
        {uniqueTitles?.map((lowercaseTitle, index) => {
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
              position: "inherit",
            }}
          >
            →
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
