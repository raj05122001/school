import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";
import { getBreakpoint } from "@/api/apiHelper";
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

const VideoPlayer = ({ id }) => {
  const [markers, setMarkers] = useState([]);
  const [suggestionData, setSuggestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBreakPoint();
    }
  }, [id]);

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

  const breakpointPlayer = useMemo(
    () => <BreakpointPlayer markers={markers} id={id} />,
    [markers, id, markers?.length]
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
        <Box sx={{width:'100%',height:"90%"}}>
          {breakpointPlayer}
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

export const BreakpointPlayer = ({ markers, id }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

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
        ${marker.headline}
        </span>`;

        el.onclick = function () {
          playerRef.current.currentTime(marker.start / 1000);
        };

        progressControl.children_[0].el_.appendChild(el);
      });
    });

    // return () => {
    //   // Clean up Video.js player
    //     if (playerRef.current) {
    //       playerRef.current=null
    //     }
    // };
  }, [markers?.length, markers]);
  return (
    <video
      ref={videoRef}
      className="video-js"
      controls
      preload="auto"
      style={{ width: "100%",height:'100%', borderRadius: 10 }}
      data-setup='{ "html5": { "nativeTextTracks": true },"playbackRates" : [0.25, 0.5, 0.75, 1, 1.25, 1.5,1.75]}'
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
<Grid container sx={{ maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' }, mx: 'auto' }}>
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
      maxWidth: '100%',
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
            bgcolor: "green.100",
            "&:hover": {
              bgcolor: "green.200",
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
