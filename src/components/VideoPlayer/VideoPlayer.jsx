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
import usePresignedUrl from "@/hooks/usePresignedUrl";

const VideoPlayer = ({ id, duration = 1e101 }) => {
  const { s3FileName } = useContext(AppContextProvider);
  const { fetchPresignedUrl } = usePresignedUrl()
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [markers, setMarkers] = useState([]);
  const [suggestionData, setSuggestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);
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
      const signedUrl = await fetchPresignedUrl(data)
      setVideoUrl(signedUrl?.presigned_url)
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (id) {
      fetchBreakPoint();
    }
  }, [id]);

  // updateVideoWatchtime: This function sends the latest watch time to your backend.
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
        navigator.sendBeacon(
          `${BASE_URL_MEET}/api/v1/dashboard/watchtime_data/`,
          blob
        );
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
      // On video end, record the full duration as the last watch time.
      updateVideoWatchtime(playerRef.current.duration());
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        duration={duration}
        videoUrl={videoUrl}
      />
    ),
    [markers, id, s3FileName, duration, videoUrl]
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
        <Box sx={{ width: "100%", height: "90%" }}>
          {videoUrl ? breakpointPlayer : ""}
        </Box>
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

export const BreakpointPlayer = ({
  markers,
  id,
  onPlayerReady,
  s3FileName,
  duration,
  videoUrl,
}) => {
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
        // Use inline styling for the marker label; adjust as needed.
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
      // If you dispose here, the video might unmount on re-render
      // If that's desired, uncomment:
      // playerRef.current.dispose();
    };
  }, [markers, userDetails, id, onPlayerReady]);

  return (
    <video
      ref={videoRef}
      className="video-js"
      controls
      preload="metadata"
      style={{ width: "100%", height: "100%", borderRadius: 10 }}
      data-setup='{
        "html5": { "nativeTextTracks": true },
        "playbackRates" : [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75]
      }'
    >
      {/* <source
        src={`https://d3515ggloh2j4b.cloudfront.net/videos/${s3FileName}${id}.mp4?v=2`}
        type="video/mp4"
      /> */}
      <source src={videoUrl} type="video/mp4" />
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
      {/* <Grid item xs={12} sm={0.6} py={2}>
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
      </Grid> */}
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
                backgroundColor: "#fff",
                marginRight: "4px",
                padding: "10px 10px",
                borderRadius: 6,
              }}
            >
              <Typography
                sx={{
                  color: "#E7002A",
                  textAlign: "center",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: "550",
                  lineHeight: "16px" /* 15.6px */,
                  letterSpacing: "-0.36px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M4.40965 0.09375C3.8008 3.40099 3.30722 3.89454 0 4.50339C3.30725 5.11225 3.8008 5.6058 4.40965 8.91304C5.01851 5.6058 5.51206 5.11225 8.81931 4.50339C5.51206 3.89454 5.01848 3.40099 4.40965 0.09375Z"
                    fill="url(#paint0_linear_441_5884)"
                  />
                  <path
                    d="M9.19597 6.29785C8.80879 8.40112 8.49485 8.71504 6.3916 9.10221C8.49485 9.48941 8.80879 9.80333 9.19597 11.9066C9.58314 9.80333 9.89709 9.48938 12.0003 9.10221C9.89703 8.71504 9.58317 8.40112 9.19597 6.29785Z"
                    fill="url(#paint1_linear_441_5884)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_441_5884"
                      x1="4.40965"
                      y1="0.09375"
                      x2="4.40965"
                      y2="8.91304"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E7002A" />
                      <stop offset="1" stop-color="#E7002A" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_441_5884"
                      x1="9.19595"
                      y1="6.29785"
                      x2="9.19595"
                      y2="11.9066"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#E7002A" />
                      <stop offset="1" stop-color="#E7002A" />
                    </linearGradient>
                  </defs>
                </svg>{" "}
                {originalTitle}
                {originalTitle.includes("?") ? "" : "?"}
              </Typography>
            </IconButton>
          );
        })}
      </Grid>
      {/* <Grid item xs={12} sm={0.6} py={2}>
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
      </Grid> */}
    </Grid>
  );
};
