import { Box, Card, Typography, Avatar, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import WaveSurferPlayer from "./WaveSurferPlayer";
import stc from "string-to-color";
import { getBreakpoint } from "@/api/apiHelper";

const AudioPlayer = ({ audio, id=0, duration=0, isShowBrekpoint = true }) => {
  const [startTime, setStartTime] = useState(0);
  const [playerTalk, setPlayerTalk] = useState([]);
  const [avtarName, setAvtarName] = useState("");

  useEffect(() => {
    if (isShowBrekpoint && id) {
      fetchBreakPoint();
    }
  }, []);

  const jsonData = (value) => {
    try {
      return value ? JSON.parse(value || "[]") : [];
    } catch (error) {
      return value;
    }
  };

  const fetchBreakPoint = async () => {
    try {
      const apiResponse = await getBreakpoint(id);
      const breakPoint = jsonData(apiResponse?.data?.data?.break_point);
      // apiResponse?.data?.data?.break_point?.length > 0
      //   ? JSON.parse(apiResponse?.data?.data?.break_point)
      //   : [];
      setPlayerTalk(breakPoint);
    } catch (error) {
      console.error(error);
    }
  };

  const transformTalkData = useCallback((startTime, endTime) => {
    return startTime?.map((item, index) => ({
      time: item,
      endTime: endTime[index],
    }));
  }, []);

  const userTalkData = useCallback(
    (startTime, endTime, avatar, name) => {
      const transformedData = transformTalkData(startTime, endTime);
      setPlayerTalk(transformedData);
      setAvtarName(name);
    },
    [transformTalkData]
  );

  return (
    <Box>
      <Card
        sx={{
          padding: 4,
          borderRadius: 6,
          // boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#F0F4F8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <WaveSurferPlayer
            playerTalk={playerTalk}
            url={audio}
            avtarName={avtarName}
            startTime={startTime}
            setStartTime={setStartTime}
            callId={id}
            sx={{
              background: "linear-gradient(to right, #74b9ff, #0984e3)",
              borderRadius: 4,
              padding: 2,
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default AudioPlayer;
