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

const WaveSurferPlayer = forwardRef(
  ({ playerTalk, url, avtarName, startTime, setStartTime }, ref) => {
    const containerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioLength, setAudioLength] = useState(0);
    const [loading, setLoading] = useState(true);
    const animationRef = useRef(null); // Reference to store animation

    useEffect(() => {
      if (startTime) {
        onJumpTime(startTime);
        setStartTime(0);
      }
    }, [startTime]);

    const playerOptions = useMemo(
      () => ({
        height: 100,
        container: "#waveform",
        waveColor: "#2196f3",
        progressColor: "#4caf50",
        cursorColor: "#ff5722",
        url,
        sampleRate: 8000,
      }),
      [url]
    );

    const isBrowser = typeof window !== "undefined";
    const isSafari =
      isBrowser &&
      (/^((?!chrome|android).)*safari/i.test(navigator.userAgent || "") ||
        /iPad|iPhone|iPod/i.test(navigator.userAgent || ""));

    if (isSafari) {
      playerOptions.backend = "MediaElement";
    }

    const wavesurfer = useWavesurfer(containerRef, playerOptions);

    const playerControlHandler = async () => {
      try {
        if (wavesurfer.isPlaying()) {
          await wavesurfer.pause();
          animationRef.current?.pause(); // Pause the animation
        } else {
          await wavesurfer.play();
          animationRef.current?.play(); // Play the animation
        }
      } catch (error) {
        console.error("Error in Player", error);
        toast.error("Something went wrong, please try again");
      }
    };

    const onPlayClick = useCallback(() => {
      playerControlHandler();
    }, [wavesurfer]);

    const playerPauseHandler = async () => {
      try {
        await wavesurfer.pause();
        animationRef.current?.pause(); // Pause the animation
      } catch (error) {
        console.error("Error in Player", error);
        toast.error("Something went wrong, please try again");
      }
    };

    const onPauseClick = useCallback(() => {
      playerPauseHandler();
    }, [wavesurfer]);

    useEffect(() => {
      if (!wavesurfer) return;

      setCurrentTime(0);
      setIsPlaying(false);

      const subscriptions = [
        wavesurfer.on("play", () => {
          setIsPlaying(true);
          animationRef.current?.play(); // Play the animation
        }),
        wavesurfer.on("pause", () => {
          setIsPlaying(false);
          animationRef.current?.pause(); // Pause the animation
        }),
        wavesurfer.on("timeupdate", (cTime) => {
          setCurrentTime(cTime);
        }),
        wavesurfer.on("ready", () => {
          setAudioLength(wavesurfer.getDuration());
          setLoading(false);
        }),
      ];

      return () => {
        subscriptions.forEach((unsub) => unsub());
      };
    }, [wavesurfer]);

    const onJumpTime = (data) => {
      if (!isPlaying) {
        onPlayClick();
      }
      const updated = data / 1000;
      wavesurfer.setTime(updated);
    };

    const backward = () => {
      const currentTime = wavesurfer.getCurrentTime();
      wavesurfer.setTime(currentTime - 20);
    };

    const forward = () => {
      const currentTime = wavesurfer.getCurrentTime();
      wavesurfer.setTime(currentTime + 20);
    };

    const msToHMS = (ms) => {
      let seconds = ms;
      let hours = parseInt(seconds / 3600);
      seconds = seconds % 3600;
      let minutes = parseInt(seconds / 60);
      seconds = (seconds % 60).toFixed(0);
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${hours === 0 ? "" : hours + ":"}${minutes}:${seconds}`;
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
      [playerTalk,audioLength,onJumpTime]
    );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          ref={containerRef}
          sx={{
            display: loading ? "none" : "block", // Show the wave line when loading is done
            width: "100%",
            height: "100px", // Match the height defined in playerOptions
            marginBottom: 2,
            overflow: "hidden",
            position: "relative",
          }}
        />
        {/* <Box
            ref={containerRef}
            sx={{
              display: loading ? "none" : "block",
              width: "100%",
              height: "70px",
              bgcolor: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              mb: 2,
            }}
          /> */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
            <Typography variant="body2">
              Please wait, lecture audio is loading...
            </Typography>
          </Box>
        ) : (
          <>
            {/* <Seekbar
              data={playerTalk}
              time={currentTime}
              totalTime={audioLength}
              onClickonUser={onJumpTime}
              avtarName={replaceSpeaker(avtarName)}
            /> */}
            {seekbar}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                mb: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: "gray" }}>
                {msToHMS(currentTime)}
              </Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
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
              <IconButton
                onClick={backward}
                sx={{ color: "#2196f3", "&:hover": { color: "#1e88e5" } }}
              >
                <FaBackward size={22} />
              </IconButton>
              {isPlaying ? (
                <IconButton
                  onClick={onPauseClick}
                  sx={{ color: "#4caf50", "&:hover": { color: "#43a047" } }}
                >
                  <FaPause size={20} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={onPlayClick}
                  sx={{ color: "#4caf50", "&:hover": { color: "#43a047" } }}
                >
                  <FaPlay size={20} />
                </IconButton>
              )}
              <IconButton
                onClick={forward}
                sx={{ color: "#2196f3", "&:hover": { color: "#1e88e5" } }}
              >
                <FaForward size={22} />
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
