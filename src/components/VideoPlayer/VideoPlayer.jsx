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
import { BASE_URL_MEET } from "@/constants/apiconfig";
import usePresignedUrl from "@/hooks/usePresignedUrl";

/* =========================================================================
   Register SEEK components (unique names) once
   ========================================================================= */
let SEEK_COMPONENTS_READY = false;

function registerSeekComponents(vjs) {
  if (SEEK_COMPONENTS_READY) return;
  const VjsButton = vjs.getComponent("Button");

  class SeekBack10 extends VjsButton {
    constructor(player, options) {
      super(player, options);
      this.addClass("vjs-seek-button");
      this.addClass("vjs-seek-back");
      this.controlText("Back 10 seconds");
    }
    handleClick() {
      const p = this.player();
      const dur = p.duration() || 0;
      const t = Math.max(0, Math.min((p.currentTime() || 0) - 10, dur));
      p.currentTime(t);
    }
  }

  class SeekForward10 extends VjsButton {
    constructor(player, options) {
      super(player, options);
      this.addClass("vjs-seek-button");
      this.addClass("vjs-seek-forward");
      this.controlText("Forward 10 seconds");
    }
    handleClick() {
      const p = this.player();
      const dur = p.duration() || 0;
      const t = Math.max(0, Math.min((p.currentTime() || 0) + 10, dur));
      p.currentTime(t);
    }
  }

  vjs.registerComponent("SeekBack10", SeekBack10);
  vjs.registerComponent("SeekForward10", SeekForward10);
  SEEK_COMPONENTS_READY = true;
}

/* =========================================================================
   Main Player wrapper
   ========================================================================= */
const VideoPlayer = ({
  id,
  duration = 1e101,
  setVideoTimeStamp = () => {},
  timeStamp = 0,
}) => {
  const { s3FileName } = useContext(AppContextProvider);
  const { fetchPresignedUrl } = usePresignedUrl();
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
      const signedUrl = await fetchPresignedUrl(data);
      setVideoUrl(signedUrl?.presigned_url);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (id) fetchBreakPoint();
  }, [id]);

  // send latest watch time (beacon)
  const updateVideoWatchtime = async (time) => {
    if (typeof time === "number" && time > 0 && userDetails?.student_id) {
      try {
        const formData = {
          lecture_id: id,
          timestamp: time,
          student_id: userDetails?.student_id,
        };
        const blob = new Blob([JSON.stringify(formData)], {
          type: "application/json",
        });
        navigator.sendBeacon(
          `${BASE_URL_MEET}/api/v1/dashboard/watchtime_data/`,
          blob
        );
      } catch (error) {
        console.error("Error sending beacon:", error);
      }
    }
  };

  // lifecycle listeners
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
  const handleVideoPause = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime();
      updateVideoWatchtime(currentTime);
    }
  };
  const handleVideoEnded = () => {
    if (playerRef.current) {
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
  }, [playerRef.current, id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const breakpointPlayer = useMemo(
    () => (
      <BreakpointPlayer
        markers={markers}
        id={id}
        onPlayerReady={(player) => {
          playerRef.current = player;
          player.on("pause", handleVideoPause);
          player.on("ended", handleVideoEnded);
        }}
        s3FileName={s3FileName}
        duration={duration}
        videoUrl={videoUrl}
        setVideoTimeStamp={setVideoTimeStamp}
        timeStamp={timeStamp}
      />
    ),
    [markers, id, s3FileName, duration, videoUrl, timeStamp] // eslint-disable-line
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {isLoading ? (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 8 }} />
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
          {videoUrl ? breakpointPlayer : null}
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

/* =========================================================================
   BreakpointPlayer (video.js)
   ========================================================================= */
export const BreakpointPlayer = ({
  markers,
  id,
  onPlayerReady,
  s3FileName,
  duration,
  videoUrl,
  setVideoTimeStamp,
  timeStamp = 0,
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
    // guard: avoid double init (StrictMode or state changes)
    if (playerRef.current) return;

    const el = videoRef.current;
    const player = videojs(el, {
      html5: { nativeTextTracks: true },
      playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75],
      controlBar: { remainingTimeDisplay: true },
    });
    playerRef.current = player;

    onPlayerReady?.(player);

    // register + add our unique seek buttons
    registerSeekComponents(videojs);
    const controlBar = player.getChild("controlBar");

    // remove any lingering DOM duplicates (safety)
    Array.from(controlBar.el().querySelectorAll(".vjs-seek-back,.vjs-seek-forward"))
      .forEach(n => n.parentElement?.removeChild(n));
    try { controlBar.removeChild("SeekBack10"); } catch {}
    try { controlBar.removeChild("SeekForward10"); } catch {}

    const backBtn = controlBar.addChild("SeekBack10", {}, 2); // after PlayToggle
    const fwdBtn  = controlBar.addChild("SeekForward10", {}, controlBar.children_.length - 1);

    // markers + resume timestamp
    player.on("loadedmetadata", () => {
      const total = player.duration();
      const progressControl = player.controlBar.progressControl;

      markers.forEach((marker) => {
        const left = ((marker.start / 1000) / total) * 100 + "%";
        const el = document.createElement("div");
        el.className = "vjs-marker";
        el.style.left = left;
        el.dataset.time = marker.start / 1000;
        el.innerHTML = `<span style="background-color: red;">${marker.gist}</span>`;
        el.onclick = () => player.currentTime(marker.start / 1000);
        progressControl.children_[0].el_.appendChild(el);
      });

      if (timeStamp > 0 && timeStamp < total) player.currentTime(timeStamp);
    });

    player.on("timeupdate", () => {
      const t = player.currentTime();
      setVideoTimeStamp?.(t);
      if (t >= 600 && !updateDataTriggered.current && userDetails?.role === "STUDENT") {
        updateDataTriggered.current = true;
        updateData();
      }
    });

    // keyboard shortcuts
    const seekBy = (secs) => {
      const dur = player.duration() || 0;
      const t = Math.max(0, Math.min((player.currentTime() || 0) + secs, dur));
      player.currentTime(t);
    };

    const keyHandler = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;

      const k = (e.key || "").toLowerCase();
      if (e.code === "ArrowLeft" || k === "j") {
        seekBy(-10); e.preventDefault();
      } else if (e.code === "ArrowRight" || k === "l") {
        seekBy(10); e.preventDefault();
      } else if (k === "k" || e.code === "Space") {
        if (player.paused()) player.play(); else player.pause();
        e.preventDefault();
      }
    };

    // document.addEventListener("keydown", keyHandler, { passive: false });

    return () => {

    };
  }, [markers, userDetails, id, onPlayerReady, timeStamp, setVideoTimeStamp]); // eslint-disable-line

  return (
    <video
      ref={videoRef}
      className="video-js"
      controls
      preload="metadata"
      style={{ width: "100%", height: "100%", borderRadius: 10 }}
    >
      {/* <source
        src={`https://d3515ggloh2j4b.cloudfront.net/videos/${s3FileName}${id}.mp4?v=2`}
        type="video/mp4"
      /> */}
      <source src={videoUrl} type="video/mp4" />
    </video>
  );
};

/* =========================================================================
   Suggestion scroller
   ========================================================================= */
export const Suggestion = ({ suggestionData }) => {
  const { handelChatBotText } = useContext(AppContextProvider);
  const containerRef = useRef(null);
  const uniqueTitles = [...new Set(suggestionData?.map((t) => t.lowercaseTitle))];

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
            disableRipple
            onClick={() => scrollContainer("left")}
            sx={{
              p: 1, width: 40, height: 40, minWidth: "unset", borderRadius: "50%",
              zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
              position: "inherit", backgroundColor: "#fff", mr: "4px", color: "#16AA54",
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
                backgroundColor: "#fff",
                mr: "4px",
                p: "10px 10px",
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#16AA54",
                  textAlign: "center",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: 550,
                  lineHeight: "16px",
                  letterSpacing: "-0.36px",
                }}
              >
                {/* green star icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.40965 0.09375C3.8008 3.40099 3.30722 3.89454 0 4.50339C3.30725 5.11225 3.8008 5.6058 4.40965 8.91304C5.01851 5.6058 5.51206 5.11225 8.81931 4.50339C5.51206 3.89454 5.01848 3.40099 4.40965 0.09375Z" fill="url(#g1)" />
                  <path d="M9.19597 6.29785C8.80879 8.40112 8.49485 8.71504 6.3916 9.10221C8.49485 9.48941 8.80879 9.80333 9.19597 11.9066C9.58314 9.80333 9.89709 9.48938 12.0003 9.10221C9.89703 8.71504 9.58317 8.40112 9.19597 6.29785Z" fill="url(#g2)" />
                  <defs>
                    <linearGradient id="g1" x1="4.41" y1="0.094" x2="4.41" y2="8.913" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1F8505" /><stop offset="1" stopColor="#12DD00" />
                    </linearGradient>
                    <linearGradient id="g2" x1="9.196" y1="6.298" x2="9.196" y2="11.907" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1F8505" /><stop offset="1" stopColor="#12DD00" />
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

      <Grid item xs={12} sm={0.6} py={2}>
        {uniqueTitles.length > 0 && (
          <Button
            disableRipple
            onClick={() => scrollContainer("right")}
            sx={{
              p: 1, width: 40, height: 40, minWidth: "unset", borderRadius: "50%",
              zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center",
              position: "inherit", backgroundColor: "#fff", mr: "4px", color: "#16AA54",
            }}
          >
            →
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
