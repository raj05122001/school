"use client";
import React, { useState, useEffect, useRef } from "react";
import { getLectureAns } from "@/api/apiHelper";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  FaArrowUp,
  FaMicrophone,
  FaMicrophoneSlash,
  FaRobot,
} from "react-icons/fa6";
import { BsChevronDown } from "react-icons/bs";
import Image from "next/image";
import Logo from "@/commonComponents/Logo/Logo";
import { useThemeContext } from "@/hooks/ThemeContext";

const SpeechRecognition =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

export default function ChatBot({
  suggestionInput,
  setIsOpenChatBot,
  isOpenChatBot,
}) {
  const { isDarkMode } = useThemeContext();
  const [userTextInput, setUserTextInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [lastAssistantResponse, setLastAssistantResponse] = useState("");
  const [dots, setDots] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textAreaRef = useRef(null);
  const maxTextAreaHeight = 80;
  const chatbotRef = useRef(null);
  const [isReadMore, setIsReadMore] = useState({});

  const processContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content?.split(urlRegex)?.map((part, index) =>
      part.match(urlRegex) ? (
        <a
          key={index}
          style={{ color: "#1e3a8a" }}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const showMoreText = (content, isReadMore) => {
    const text = content[0].slice(0, isReadMore ? content[0]?.length : 300);
    const points = text?.split(/(\d+\.\s+)/)?.filter(Boolean);
    return points?.map((point, index) => (
      <Typography key={index} variant="body2" sx={{ mb: 2 }}>
        {point}
      </Typography>
    ));
  };

  const handleUserInput = async (input) => {
    if (!input) return;
    setIsLoading(true);
    const combinedInput = lastAssistantResponse
      ? `${lastAssistantResponse}\n\n${input}`
      : input;
    setChatHistory((prevChat) => [
      ...prevChat,
      { role: "user", content: input },
    ]);
    try {
      const formData = new FormData();
      formData.append("text", combinedInput);
      setUserTextInput("");
      const response = await getLectureAns(formData);
      const data = response.data.ans;
      const linkArry = response.data?.reference_link || "";
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "assistant", content: data, links: linkArry },
      ]);
      setLastAssistantResponse(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (suggestionInput) {
      handleUserInput(suggestionInput);
    }
  }, [suggestionInput]);

  useEffect(() => {
    if (textAreaRef.current && userTextInput.length > 30) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        maxTextAreaHeight
      )}px`;
    }
    if (userTextInput === "") {
      textAreaRef.current.style.height = "25px";
    }
  }, [userTextInput]);

  const toggleChatbot = () => {
    setIsOpenChatBot(!isOpenChatBot);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(userTextInput.trim());
    }
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(
        () => setDots((prevDots) => (prevDots % 4) + 1),
        500
      );
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserTextInput(transcript);
      };
      recognition.onend = () => setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "grey.200",
        maxWidth: 350,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        bottom: 16,
        right: 16,
        maxHeight: 800,
        zIndex: 9999,
        borderRadius: 2,
      }}
      ref={chatbotRef}
      component={Paper}
      elevation={3}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "grey.300",
          p: 2,
          width: "100%",
        }}
      >
        <Logo color="black"/>
        <IconButton onClick={toggleChatbot}>
          <BsChevronDown fontSize="large" />
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 2,
          width: "100%",
          height: 300,
          overflowY: "auto",
        }}
      >
        {chatHistory.length > 0 ? (
          chatHistory?.map((message, index) => (
            <Box
              key={index}
              sx={{
                textAlign: message.role === "assistant" ? "left" : "right",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor:
                    message?.role === "assistant"
                      ? "background.paper"
                      : "grey.800",
                  color:
                    message?.role === "assistant" ? "text.primary" : "white",
                  p: 2,
                  borderRadius: 2,
                  maxWidth: "75%",
                }}
              >
                {message?.role === "user" ? (
                  message.content
                ) : (
                  <>
                    {showMoreText(message.content, isReadMore[index])}
                    {message.content[0].length > 300 && (
                      <Typography
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          setIsReadMore((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                      >
                        {isReadMore[index] ? `Read less...` : `Read More...`}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              {message?.links && (
                <Box mt={1}>
                  <Typography variant="body2">Reference:</Typography>
                  {message?.links?.map((link, index) => (
                    <Box key={index}>{processContent(link)}</Box>
                  ))}
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}
          >
            <FaRobot size={50} sx={{ mb: 2 }} />
            <Typography variant="h6">Ask me any question</Typography>
          </Box>
        )}
        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Generating response...</Typography>
            <SkeletonShimmer width="w-40" height="h-3" />
            <SkeletonShimmer width="w-60" height="h-3" />
            <SkeletonShimmer width="w-40" height="h-3" />
          </Box>
        )}
      </Box>

      <Divider />
      <Box sx={{ display: "flex", gap: 2, p: 2, width: "100%" }}>
        <TextField
          fullWidth
          multiline
          placeholder="Ask me..."
          value={userTextInput}
          onChange={(e) => setUserTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          inputRef={textAreaRef}
          variant="outlined"
          InputLabelProps={{
            style: { color: isDarkMode ? "#d7e4fc" : "#1a1a1a" },
          }}
          InputProps={{
            sx: {
              backdropFilter: "blur(10px)",
              backgroundColor: isDarkMode
                ? "rgba(48, 48, 48, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              borderRadius: "12px",
              padding: "10px 14px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(48, 48, 48, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#777" : "#ccc",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1e88e5", // Focus color
                borderWidth: "1px",
              },
              "& .MuiInputBase-input": {
                fontSize: "0.9rem",
                color: isDarkMode ? "#e0e0e0" : "#333",
              },
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={() => handleUserInput(userTextInput.trim())}
                >
                  <FaArrowUp />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          color="primary"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </IconButton>
      </Box>
    </Box>
  );
}

export const SkeletonShimmer = ({ width, height }) => {
  return (
    <Box
      sx={{
        bgcolor: "grey.300",
        mb: 2,
        borderRadius: 1,
        width: width || "4rem",
        height: height || "1rem",
        animation: "pulse 1.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": { opacity: 0.4 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0.4 },
        },
      }}
    />
  );
};
