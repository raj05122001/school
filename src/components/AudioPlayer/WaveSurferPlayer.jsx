import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import useWavesurfer from "@/hooks/useWavesurfer";
import { FaBackward, FaPlay, FaPause, FaForward } from "react-icons/fa";
import Seekbar from "./Seekbar";
import toast from "react-hot-toast";
import { replaceSpeaker } from "@/helper/Helper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { BASE_URL_MEET } from "@/constants/apiconfig";

const WaveSurferPlayer = forwardRef(
  ({ playerTalk, url, avtarName, startTime, setStartTime, callId=0 , timeStamp=0}, ref) => {
    const containerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioLength, setAudioLength] = useState(0);
    const [loading, setLoading] = useState(true);
    const animationRef = useRef(null);

    const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

    // to throttle beacon calls every 10s
    const lastBeaconTime = useRef(0);

    useEffect(() => {
      if (startTime) {
        onJumpTime(startTime);
        setStartTime(0);
      }
    }, [startTime]);

    const updateAudioWatchtime = async (time) => {
      // only send if at least 10s has passed since last
      if (time - lastBeaconTime.current < 10) return;
      lastBeaconTime.current = time;

      if (typeof time === "number" && time > 0 && userDetails?.student_id) {
        try {
          const formData = {
            lecture_id: callId,
            timestamp: time,
            student_id: userDetails.student_id,
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

    const playerOptions = useMemo(
      () => ({
        height: 100,
        container: "#waveform",
        waveColor: "#2196f3",
        progressColor: "#4caf50",
        cursorColor: "#ff5722",
        url,
        sampleRate: 8000,
        backend:
          typeof window !== "undefined" &&
          (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
            /iPad|iPhone|iPod/i.test(navigator.userAgent))
            ? "MediaElement"
            : undefined,
      }),
      [url]
    );

    const wavesurfer = useWavesurfer(containerRef, playerOptions);

    const playerControlHandler = async () => {
      try {
        if (wavesurfer.isPlaying()) {
          await wavesurfer.pause();
          animationRef.current?.pause();
        } else {
          await wavesurfer.play();
          animationRef.current?.play();
        }
      } catch {
        toast.error("Something went wrong, please try again");
      }
    };

    const onPlayClick = useCallback(playerControlHandler, [wavesurfer]);
    const onPauseClick = useCallback(async () => {
      try {
        await wavesurfer.pause();
        animationRef.current?.pause();
      } catch {
        toast.error("Something went wrong, please try again");
      }
    }, [wavesurfer]);

    useEffect(() => {
      if (!wavesurfer) return;

      setCurrentTime(0);
      setIsPlaying(false);

      const unsubs = [
        wavesurfer.on("play", () => {
          setIsPlaying(true);
          animationRef.current?.play();
        }),
        wavesurfer.on("pause", () => {
          setIsPlaying(false);
          animationRef.current?.pause();
        }),
        wavesurfer.on("timeupdate", (cTime) => {
          setCurrentTime(cTime);
          updateAudioWatchtime(cTime);
        }),
        wavesurfer.on("ready", () => {
          setAudioLength(wavesurfer.getDuration());
          setLoading(false);
          if (timeStamp > 0) {
            // seek to provided timeStamp (ms → s)
            wavesurfer.setTime(timeStamp);
          }
        }),
      ];

      return () => unsubs.forEach((u) => u());
    }, [wavesurfer, timeStamp]);

    const onJumpTime = (ms) => {
      if (!isPlaying) onPlayClick();
      wavesurfer.setTime(ms / 1000);
    };

    const backward = () => {
      wavesurfer.setTime(Math.max(0, wavesurfer.getCurrentTime() - 10));
    };
    const forward = () => {
      wavesurfer.setTime(
        Math.min(wavesurfer.getDuration(), wavesurfer.getCurrentTime() + 10)
      );
    };

    const msToHMS = (sec) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");
      return `${h ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s}`;
    };

    useImperativeHandle(
      ref,
      () => ({
        pauseAudio: onPauseClick,
        playAudio: onPlayClick,
        isPlaying,
        isAudioLoading: loading,
      }),
      [onPlayClick, isPlaying, loading]
    );

    const seekbar = useMemo(
      () => (
        <Seekbar
          data={playerTalk}
          time={currentTime}
          totalTime={audioLength}
          onClickonUser={onJumpTime}
        />
      ),
      [playerTalk, currentTime, audioLength]
    );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          ref={containerRef}
          sx={{
            display: loading ? "none" : "block",
            width: "100%",
            height: 100,
            mb: 2,
            position: "relative",
          }}
        />
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography variant="body2">
              Please wait, lecture audio is loading...
            </Typography>
          </Box>
        ) : (
          <>
            {seekbar}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="caption" color="gray">
                {msToHMS(currentTime)}
              </Typography>
              <Typography variant="caption" color="gray">
                {msToHMS(audioLength)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 1,
              }}
            >
              <IconButton onClick={backward} color="primary">
                <FaBackward />
              </IconButton>
              {isPlaying ? (
                <IconButton onClick={onPauseClick} color="success">
                  <FaPause />
                </IconButton>
              ) : (
                <IconButton onClick={onPlayClick} color="success">
                  <FaPlay />
                </IconButton>
              )}
              <IconButton onClick={forward} color="primary">
                <FaForward />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    );
  }
);

WaveSurferPlayer.displayName = "WaveSurferPlayer";

export default WaveSurferPlayer;
