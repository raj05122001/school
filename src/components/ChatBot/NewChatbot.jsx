import React, { useState, useEffect, useRef } from "react";
import { getLectureAns } from "@/api/apiHelper";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  InputAdornment,
  Grid,
  Skeleton,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FaArrowUp, FaRobot } from "react-icons/fa6";
import { BsChevronDown } from "react-icons/bs";
import Logo from "@/commonComponents/Logo/Logo";
import { useThemeContext } from "@/hooks/ThemeContext";
import UserImage from "@/commonComponents/UserImage/UserImage";
import MathJax from "react-mathjax2";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";

export default function NewChatbot({ suggestionInput, setIsOpenChatBot }) {
  const chatbotRef = useRef();
  const graphRef = useRef(null);
  const [userTextInput, setUserTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAssistantResponse, setLastAssistantResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    if (suggestionInput) {
      setShowChat(true);
      setShowList(false);
      handleUserInput(suggestionInput);
    }
  }, [suggestionInput]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserInput(userTextInput.trim());
    }
  };

  useEffect(() => {
    if (graphRef.current && isLoading) {
      document.body.style.overflowY = "scroll";
      document.body.style.position = "";

      // Scroll to the bottom of the element
      graphRef.current.scrollTo({
        top: graphRef.current.scrollHeight, // Scroll to the bottom
        behavior: "smooth",
      });
    }
  }, [isLoading]);

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
      const linkArry = response.data?.reference_link || [];
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "assistant", content: data?.[0], links: linkArry?.[0] },
      ]);
      setLastAssistantResponse(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleHistoryClick = (question) => {
    setShowChat(true);
    setShowList(false);
    handleUserInput(question);
  };

  return (
    <Box
      sx={{
        bgcolor: "grey.200",
        maxWidth: 380,
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        borderRadius: 2,
        height: "100%",
        width: "100%",
        maxHeight: 520,
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
      }}
      ref={chatbotRef}
      component={Paper}
      elevation={3}
    >
      <Grid container direction="column" sx={{ height: "100%" }}>
        {/* Header */}
        <Grid item>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "grey.300",
              p: 2,
            }}
          >
            <Logo color="black" />
            <IconButton onClick={() => setIsOpenChatBot(false)}>
              <BsChevronDown fontSize="large" />
            </IconButton>
          </Box>
        </Grid>

        {/* New Chat and History Section */}
        {showList && (
          <Grid item>
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "grey.300",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setShowChat(true);
                  setShowList(false);
                }}
                sx={{ mb: 2, width: "100%" }}
              >
                New Chat
              </Button>
              <ChatHistory onHistoryClick={handleHistoryClick} />
            </Box>
          </Grid>
        )}

        {showChat && (
          <>
            {/* Chat Area */}
            <Grid
              item
              xs
              style={{
                overflowY: "auto",
                padding: "16px",
                width: chatHistory.length > 0 ? "99%" : "100%",
                height: "100%",
              }}
              ref={graphRef}
            >
              {chatHistory.length > 0 ? (
                chatHistory.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection:
                        message.role === "user" ? "row-reverse" : "row",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "85%",
                        bgcolor:
                          message.role === "user"
                            ? "primary.light"
                            : "grey.300",
                        color: "text.primary",
                        borderRadius: 2,
                        p: 1,
                        mx: 1,
                        overflowX: "auto",
                      }}
                    >
                      <FormattedText text={message.content} />

                      {message.links &&
                        message.links.map((link, idx) => (
                          <Typography variant="caption" key={idx}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link}
                            </a>
                          </Typography>
                        ))}
                    </Box>
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
                <Box
                  sx={{
                    display: "flex",
                    mt: 2,
                    flexDirection: "column",
                    pb: 8,
                  }}
                >
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem", width: "80%" }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem", width: "60%" }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem", width: "80%" }}
                  />
                </Box>
              )}
            </Grid>

            {/* Input Field */}
            <Grid item>
              <Divider />
              <Box sx={{ display: "flex", gap: 2, p: 1, px: 2}}>
                <TextField
                  fullWidth
                  multiline
                  placeholder="Ask me..."
                  value={userTextInput}
                  onChange={(e) => setUserTextInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      // Targeting the root container of TextField
                      backdropFilter: "blur(10px)",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1e88e5",
                        borderWidth: "1px",
                      },
                      // Ensure the textarea inside TextField is scrollable
                      "& .MuiInputBase-inputMultiline": {
                        maxHeight: "100px", // Restrict height
                        overflowY: "auto", // Enable vertical scrolling
                      },
                      "& textarea": {
                        maxHeight: "100px", // Ensure the textarea respects height
                        overflowY: "auto !important", // Enable scroll
                      },
                    },
                    endAdornment: (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleUserInput(userTextInput.trim())}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            <FaArrowUp />
                          )}
                        </IconButton>
                        {userTextInput && isLoading ? (
                          ""
                        ) : (
                          <VoiceToText setUserTextInput={setUserTextInput} />
                        )}
                      </Box>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export const VoiceToText = ({ setUserTextInput }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  let recognition;

  // Initialize SpeechRecognition
  if (typeof window !== "undefined") {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const speechToText = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setUserTextInput(speechToText);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        setError("Error recognizing speech. Please try again.");
        setIsRecording(false);
      };
    } else {
      setError("Speech Recognition API is not supported in this browser.");
    }
  }

  const startRecording = () => {
    if (recognition) {
      setError(null);
      setIsRecording(true);
      recognition.start();
    } else {
      setError("Speech Recognition API is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip
        title={isRecording ? "Stop Recording" : "Start Recording"}
        arrow
        placement="top"
      >
        <IconButton
          onClick={isRecording ? stopRecording : startRecording}
          color={isRecording ? "error" : "primary"}
          sx={{
            bgcolor: isRecording ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isRecording ? "error.dark" : "primary.dark",
            },
          }}
        >
          {isRecording ? (
            <FaStopCircle size={16} />
          ) : (
            <FaMicrophone size={16} />
          )}
        </IconButton>
      </Tooltip>
      {error && (
        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export const FormattedText = ({ text }) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const isArray = Array.isArray(text);
  const textArray = isArray ? text : [text];

  const latexRegex = /\\\[([\s\S]*?)\\\]/g;

  const replaceString = (data) => {
    return data
      .replace(/\[(.*?)\]/g, `<span style="font-weight: 600">[$1]</span>`)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .replace(/(?<!\d)\. /g, ".<br>")
      .replace(/\n/g, "<br>");
  };

  const processText = (part) => {
    if (!part) return;
    const chunks = part.split(latexRegex).filter(Boolean);
    return chunks?.map((chunk, i) => {
      if (i % 2 === 1) {
        const cleanedLatex = chunk.replace(/\n/g, " ");
        return (
          <Typography
            variant="span"
            sx={{
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              width: "100%",
              overflowX: "auto",
            }}
            key={i}
          >
            <MathJax.Node key={i} inline>
              {cleanedLatex}
            </MathJax.Node>
          </Typography>
        );
      } else {
        // Non-LaTeX content, replace bold syntax
        return (
          <Typography
            variant="span"
            key={i}
            dangerouslySetInnerHTML={{ __html: replaceString(chunk) }}
          />
        );
      }
    });
  };

  return (
    <MathJax.Context input="tex">
      <Box>
        {textArray?.map((part, index) => (
          <Box key={index}>
            {processText(part?.slice(0, isReadMore ? part?.length : 300))}{" "}
            {part?.length > 300 && (
              <Typography
                variant="span"
                color="primary"
                sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => setIsReadMore((prev) => !prev)}
              >
                {isReadMore ? `Read less...` : `Read More...`}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </MathJax.Context>
  );
};

export const ChatHistory = ({ onHistoryClick }) => {
  const dummyQuestions = [
    "What is React?",
    "Explain hooks in React?",
    "How does useState work?",
    "Closures in JavaScript",
    "What is the virtual DOM?",
    "What are forms in ReactJS?",
    "Arrow Function",
    "Explain React Fiber",
  ];

  return (
    <List
      sx={{
        width: "100%",
        maxHeight: 300,
        overflowY: "auto",
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
      }}
    >
      <Typography
        variant="body1"
        fontFamily={"monospace"}
        fontSize={"18px"}
        textAlign={"center"}
        color={"#6082B6"}
      >
        Your History
      </Typography>
      {dummyQuestions.map((question, index) => (
        <ListItem button key={index} onClick={() => onHistoryClick(question)}>
          <ListItemText
            primary={question}
            primaryTypographyProps={{ fontFamily: "monospace" }}
          />
        </ListItem>
      ))}
    </List>
  );
};