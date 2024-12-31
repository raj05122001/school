import React, { useState, useEffect, useRef } from "react";
import {
  getLectureAns,
  createSession,
  getNewLectureAns,
  getChatbotHistory,
} from "@/api/apiHelper";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FaArrowUp, FaRobot } from "react-icons/fa6";
import { BsChevronDown } from "react-icons/bs";
import Logo from "@/commonComponents/Logo/Logo";
import { useThemeContext } from "@/hooks/ThemeContext";
import UserImage from "@/commonComponents/UserImage/UserImage";
import MathJax from "react-mathjax2";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { RiArrowDropDownLine } from "react-icons/ri";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import AssignmentTextFormat from "@/commonComponents/TextWithMath/AssignmentTextFormat";

export default function NewChatbot({ suggestionInput, setIsOpenChatBot }) {
  const chatbotRef = useRef();
  const graphRef = useRef(null);
  const [userTextInput, setUserTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showList, setShowList] = useState(true);
  const [sessionID, setSessionID] = useState(null);
  const [oldChats, setOldChats] = useState([]);
  const [showOldChat, setShowOldChat] = useState(false);

  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const userName = userDetails?.username;
  const userID = userDetails?.user_id;
  const currentDate = new Date().toISOString();
  const pathname = usePathname(); // Retrieves the full pathname (e.g., "/teacher/lecture-listings/43")
  const lectureID = pathname?.split("/").pop(); // Extracts the last segment
  const sessionTitle = `${userName}${currentDate}`;

  const resizeRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 380, height: 520 });

  const startResizing = (mouseDownEvent) => {
    setIsResizing(true);
    mouseDownEvent.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopResizing);
  };

  const onResize = (mouseMoveEvent) => {
    if (isResizing && chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      // Calculate new width and height based on mouse position relative to top-left
      const newWidth = rect.width + (rect.left - mouseMoveEvent.clientX);
      const newHeight = rect.height + (rect.top - mouseMoveEvent.clientY);

      setDimensions({
        width: Math.max(300, Math.min(newWidth, 1200)), // Set maxWidth as needed
        height: Math.max(300, Math.min(newHeight, 800)), // Set maxHeight as needed
      });
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", onResize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", onResize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const handleCreateSession = async () => {
    try {
      const formData = new FormData();
      formData.append("session_title", sessionTitle);
      formData.append("user", userID);
      formData.append("lecture", lectureID);

      const response = await createSession(formData);
      const { session_id } = response?.data?.data;
      setSessionID(session_id);
    } catch (error) {
      console.error("Error creating Session", error);
    }
  };

  useEffect(() => {
    if (sessionID && suggestionInput) {
      handleUserInput(suggestionInput);
    }
  }, [sessionID, suggestionInput]);

  useEffect(() => {
    if (suggestionInput) {
      setShowChat(true);
      setShowList(false);
      handleCreateSession();
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

  const fetchOldChats = async () => {
    const response = await getChatbotHistory();
    const data = response?.data?.data || [];
    setOldChats(data);
  };

  useEffect(() => {
    fetchOldChats();
  }, []);

  const handleOldChatsClick = () => {
    setShowOldChat(true);
  };

  const handleUserInput = async (input) => {
    if (!input || !sessionID) return;
    setIsLoading(true);
    setChatHistory((prevChat) => [
      ...prevChat,
      { role: "user", content: input },
    ]);
    try {
      const formData = new FormData();
      formData.append("user_message", input);
      setUserTextInput("");
      const response = await getNewLectureAns(sessionID, formData);
      const data = response.data.response;
      const linkArry = response.data?.reference_link || [];
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: "assistant", content: data, links: linkArry },
      ]);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "grey.200",
        minWidth: 300,
        minHeight: 300,
        position: "fixed", // Set position to fixed
        bottom: 16,
        right: 16,
        zIndex: 99990,
        borderRadius: 2,
        width: dimensions.width,
        height: dimensions.height,
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Ensure content doesn't overflow
      }}
      ref={chatbotRef}
      component={Paper}
      elevation={3}
    >
      {/* Resize Handle at Top-Left */}
      <div
        ref={resizeRef}
        style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          top: 0, // Positioned at top-left
          left: 0,
          cursor: "nwse-resize",
          backgroundColor: "transparent",
          zIndex: 10000, // Ensure it's on top
        }}
        onMouseDown={startResizing}
      >
        {/* Visual Indicator for Resizing */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "grey.500",
            opacity: 0.5,
            borderBottomRightRadius: "4px",
          }}
        />
      </div>

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
              flexShrink: 0, // Prevent shrinking during resize
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
          <Grid item xs>
            <Box
              sx={{
                p: 2,
                borderColor: "grey.300",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleCreateSession();
                  setShowChat(true);
                  setShowList(false);
                }}
                sx={{
                  mb: 2,
                  width: "60%",
                  border: "none",
                  borderRadius: 4,
                  backgroundColor: "#AFE1AF", // Light Green
                  transition: "all 150ms ease-in-out",
                  color: "#003366", // Dark blue for text

                  ":hover": {
                    border: "none",
                    backgroundColor: "#00A36C", // Darker Green on hover
                    boxShadow: "0 0 10px 0 #00A36C inset, 0 0 10px 4px #00A36C",
                    color: "#fff",
                  },
                }}
              >
                Fresh Conversation
              </Button>

              {!showOldChat && (
                <>
                  <Typography marginBottom={2}>Or</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOldChatsClick}
                    sx={{
                      mb: 2,
                      width: "60%",
                      borderRadius: 4,
                      backgroundColor: "#EADDCA", // Light Brown
                      transition: "all 150ms ease-in-out",
                      color: "#003366", // Dark blue for text
                      border: "none",
                      ":hover": {
                        border: "none",
                        backgroundColor: "#C19A6B", // Darker Brown on hover
                        boxShadow:
                          "0 0 10px 0 #C19A6B inset, 0 0 10px 4px #C19A6B",
                        color: "#fff",
                      },
                    }}
                  >
                    Conversation History
                  </Button>
                </>
              )}
              {showOldChat &&
                (oldChats.length > 0 ? (
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: 300,
                      overflowY: "auto", // Enable scrolling
                      bgcolor: "grey.100",
                      borderRadius: 2,
                      p: 2,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <List sx={{ width: "100%" }}>
                      {oldChats?.map((data, index) => (
                        <Accordion
                          key={data?.id}
                          sx={{
                            mb: 1,
                            borderRadius: 4,
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<RiArrowDropDownLine />}
                            sx={{
                              color: "text.primary",
                              p: 2,
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              gutterBottom
                              sx={{ fontSize: "14px" }}
                            >
                              Session ID - {data?.session?.session_id}
                              <br />
                              {index + 1}. {data?.user_question}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              bgcolor: "grey.200",
                              borderRadius: 1,
                              p: 1,
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 300,
                                width: 1.5*(dimensions.width/2),
                                fontSize: "0.85rem"                              
                              }}
                            >
                              <TextWithMath text={data?.bot_response} />
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Typography>No conversation history available.</Typography>
                ))}
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
                chatHistory?.map((message, index) => (
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
                      <TextWithMath text={message.content} />

                      {message?.links &&
                        message?.links?.map((link, idx) => (
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
                  <FaRobot size={50} style={{ marginBottom: "16px" }} />
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
              <Box sx={{ display: "flex", gap: 2, p: 1, px: 2 }}>
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
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const speechToText = Array?.from(event.results)
            ?.map((result) => result[0].transcript)
            ?.join("");
          setUserTextInput(speechToText);
          setIsRecording(false);
        };

        recognition.onerror = (event) => {
          setError("Error recognizing speech. Please try again.");
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setError("Speech Recognition API is not supported in this browser.");
      }
    }
  }, [setUserTextInput]);

  const startRecording = () => {
    if (recognitionRef.current) {
      setError(null);
      setIsRecording(true);
      recognitionRef.current.start();
    } else {
      setError("Speech Recognition API is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
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
