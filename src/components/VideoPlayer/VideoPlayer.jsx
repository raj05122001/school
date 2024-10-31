import React, { useEffect, useState, useRef, useContext } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";
import { getBreakpoint } from "@/api/apiHelper";
import { Button, Box, Typography, IconButton } from "@mui/material";
import { AppContextProvider } from "@/app/main";

const VideoPlayer = ({ id }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [markers, setMarkers] = useState([]);
  const [suggestionData, setSuggestionData] = useState([]);

  useEffect(() => {
    if (id) {
      fetchBreakPoint();
    }
  }, [id]);

  const fetchBreakPoint = async () => {
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
  };

  console.log("markers", markers);

  useEffect(() => {
    // Initialize Video.js
    const videoElement = videoRef.current;
    playerRef.current = videojs(videoElement);

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
        ${marker.headline} </span>`;

        el.onclick = function () {
          playerRef.current.currentTime(marker.start / 1000);
        };

        progressControl.children_[0].el_.appendChild(el);
      });
    });

    return () => {
      // Clean up Video.js player
      //   if (playerRef.current) {
      //     playerRef.current.dispose();
      //   }
    };
  }, [markers]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        className="video-js"
        controls
        preload="auto"
        style={{ width: "100%", height: "90%", borderRadius: 10 }}
        data-setup='{ "html5": { "nativeTextTracks": true },"playbackRates" : [0.25, 0.5, 0.75, 1, 1.25, 1.5,1.75]}'
      >
        <source
          src={`https://d3515ggloh2j4b.cloudfront.net/videos/${id}.mp4`}
          type="video/mp4"
        />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a
            href="https://videojs.com/html5-video-support/"
            target="_blank"
            rel="noopener noreferrer"
          >
            supports HTML5 video
          </a>
        </p>
      </video>
      {suggestionData?.length > 0 && (
        <Box height="10%">
          <Suggestion suggestionData={suggestionData} />
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;

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
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      {uniqueTitles.length > 0 && (
        <Button
          onClick={() => scrollContainer("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
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
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          width: "100%",
          whiteSpace: "nowrap",
          py: 2,
          mx: 6,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none", // For Internet Explorer and Edge
          scrollbarWidth: "none", // For Firefox
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
                position: "relative",
                overflow: "hidden",
                bgcolor: "green.100",
                "&:hover": {
                  bgcolor: "green.200",
                  ringColor: "green.400",
                  boxShadow: "0 0 5px rgba(0, 128, 0, 0.2)",
                },
                px: 2,
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
                sx={{ color: "primary.main", fontWeight: "bold", px: 1 }}
              >
                ✦ {originalTitle}
                {originalTitle.includes("?") ? "" : "?"}
              </Typography>
            </IconButton>
          );
        })}
      </Box>
      {uniqueTitles.length > 0 && (
        <Button
          onClick={() => scrollContainer("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
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
    </Box>
  );
};
