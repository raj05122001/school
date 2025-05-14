import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { getGuidance } from "@/api/apiHelper";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { TbArrowGuide } from "react-icons/tb";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { IoFootstepsSharp } from "react-icons/io5";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

// New TypingEffect component
const TypingEffect = ({ text, speed = 25, className = "", onComplete = () => {} ,color=""}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text?.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete && currentIndex === text?.length) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return <span className={className}>
    <TextWithMath text={displayedText} color={color}/>
  </span>;
};

// New CodeSnippetWithTyping component
const CodeSnippetWithTyping = ({ text }) => {
  const [isTyping, setIsTyping] = useState(true);
  const [displayedLines, setDisplayedLines] = useState([]);
  const lines = text?.split("\\n") || [];
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  const handleLineComplete = () => {
    setCurrentLineIndex(prev => {
      if (prev < lines.length - 1) {
        return prev + 1;
      }
      setIsTyping(false);
      return prev;
    });
  };

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      setDisplayedLines(prev => [...prev.slice(0, currentLineIndex), ""]);
    }
  }, [currentLineIndex, lines.length]);

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#4CBB17",
        p: 2,
        borderRadius: 1,
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        overflowX: "auto",
      }}
    >
      <pre style={{ margin: 0 }}>
        {lines.map((_, index) => (
          <React.Fragment key={index}>
            {index < currentLineIndex ? (
              <span>{lines[index]}<br /></span>
            ) : index === currentLineIndex ? (
              <>
                <TypingEffect 
                  text={lines[index]} 
                  speed={15} 
                  onComplete={handleLineComplete} 
                />
                <br />
              </>
            ) : null}
          </React.Fragment>
        ))}
      </pre>
    </Box>
  );
};

export default function NeedMoreGuide({ assignmentId, open, setOpen }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showStepDetails, setShowStepDetails] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const hasFetchedData = useRef(false);
  const containerRef = useRef(null);
  const [animationComplete, setAnimationComplete] = useState({
    stepExplanation: false,
    concepts: false,
    tools: false
  });

  useEffect(() => {
    if (assignmentId && open) {
      if (!hasFetchedData.current) {
        hasFetchedData.current = true;
        fetchData();
      }
    }
  }, [assignmentId, open]);

  useEffect(() => {
    // Reset animation states when step changes
    setAnimationComplete(prev => ({
    ...prev,
    stepExplanation: false,
  }));
  }, [stepIndex]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGuidance(assignmentId);
      const parsedData =
        typeof response?.data?.data === "string"
          ? JSON?.parse(response?.data?.data)
          : response?.data?.data;
      setData(parsedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleStepClick = (index) => {
    setShowStepDetails(true);
    setStepIndex(index);
  };

  // Render step carousel
  const renderCarousel = (steps) => {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          p: 1,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          onClick={() => scrollContainer("left")}
          disableRipple
          sx={{
            fontWeight: "bold",
            fontSize: "36px",
            color: "black",
            "&:hover": {
              backgroundColor: "transparent",
            },
            cursor: "pointer",
          }}
        >
          <CiCircleChevLeft />
        </IconButton>
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            borderRadius: 3,
            gap: 2,
            overflowX: "auto",
            p: 2,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {steps.map((step, index) => (
            <Paper
              key={index}
              elevation={3}
              onClick={() => {
                handleStepClick(index);
              }}
              sx={{
                minWidth: "150px",
                maxWidth: "180px",
                padding: 2,
                textAlign: "center",
                whiteSpace: "pre-wrap",
                borderRadius: 2,
                backgroundColor:
                  stepIndex === index ? "#090909 !important" : "#222",
                color: stepIndex === index ? "#fff" : "#000000",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#090909",
                  color: "#FFF",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Typography variant="body2" gutterBottom>
                Step {index + 1}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {step?.step.trim()}
              </Typography>
            </Paper>
          ))}
        </Box>
        <IconButton
          onClick={() => scrollContainer("right")}
          disableRipple
          sx={{
            fontWeight: "bold",
            fontSize: "36px",
            color: "black",
            "&:hover": {
              backgroundColor: "transparent",
            },
            cursor: "pointer",
          }}
        >
          <CiCircleChevRight />
        </IconButton>
      </Box>
    );
  };

  // Main render function for all data
  const renderContent = () => {
    if (!data) return null;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Steps with Context Section */}
        {data.steps_with_context && (
          <Box mt={4}>
            <Box
              sx={{
                backgroundColor: "#F3F5F7 !important",
                borderRadius: "12px",
                padding: "12px",
                // transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  fontSize: "22px",
                  color: "#141514",
                  mb: 1,
                  pb: 0.5,
                  lineHeight: "118%",
                  letterSpacing: "2%",
                  fontFamily: "Inter",
                }}
              >
                Steps with Context
              </Typography>
              {renderCarousel(data.steps_with_context)}
            </Box>

            {showStepDetails && data.steps_with_context[stepIndex] && (
              <Paper
                elevation={1}
                sx={{
                  mt: 2,
                  p: "12px",
                  backgroundColor: "#090909 !important",
                  color: "#fff !important",
                  borderRadius: "8px",
                  // transition: "all 0.3s ease",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  {/* <TypingEffect text={`Explanation of Step ${stepIndex + 1}`} speed={30} color={"#fff"} /> */}
                  Explanation of Step {stepIndex + 1}
                </Typography>
                <Typography variant="body2">
                  <TypingEffect 
                    text={data.steps_with_context[stepIndex]?.description}
                    color={"#fff"} 
                    speed={10}
                    onComplete={() => setAnimationComplete(prev => ({...prev, stepExplanation: true}))}
                  />
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Code Snippets Section */}
        {data.code_snippets_or_examples  && (
          <Box
            sx={{
              backgroundColor: "#F3F5F7 !important",
              borderRadius: "12px",
              padding: "12px",
              animation: "fadeIn 0.5s ease",
              transition: "all 0.3s ease",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: "22px",
                color: "#141514",
                mb: 1,
                pb: 0.5,
                lineHeight: "118%",
                letterSpacing: "2%",
                fontFamily: "Inter",
              }}
            >
              Code Snippets or Examples
            </Typography>
            <CodeSnippetWithTyping text={data.code_snippets_or_examples} />
          </Box>
        )}

        {/* Concepts & Knowledge Section */}
        {data.concepts_and_knowledge_required && (
          <Box
            sx={{
              backgroundColor: "#F3F5F7 !important",
              borderRadius: "12px",
              padding: "12px",
              animation: "fadeIn 0.5s ease",
              transition: "all 0.3s ease",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: "22px",
                color: "#141514",
                mb: 1,
                pb: 0.5,
                lineHeight: "118%",
                letterSpacing: "2%",
                fontFamily: "Inter",
              }}
            >
              Concepts And Knowledge Required
            </Typography>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                padding: "5.68px 9.1px",
                borderRadius: "6.82px",
              }}
            >
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.concepts_and_knowledge_required.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect 
                        text={item} 
                        speed={20}
                        onComplete={() => {
                          if (index === data.concepts_and_knowledge_required.length - 1) {
                            setAnimationComplete(prev => ({...prev, concepts: true}));
                          }
                        }}
                      />
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        )}

        {/* Technology or Tools Section */}
        {data.technology_or_tools_options && animationComplete.concepts && (
          <Box
            sx={{
              backgroundColor: "#F3F5F7 !important",
              borderRadius: "12px",
              padding: "12px",
              animation: "fadeIn 0.5s ease",
              transition: "all 0.3s ease",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: "22px",
                color: "#141514",
                mb: 1,
                pb: 0.5,
                lineHeight: "118%",
                letterSpacing: "2%",
                fontFamily: "Inter",
              }}
            >
              Technology Or Tools Options
            </Typography>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                padding: "5.68px 9.1px",
                borderRadius: "6.82px",
              }}
            >
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.technology_or_tools_options.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect 
                        text={item} 
                        speed={20}
                        onComplete={() => {
                          if (index === data.technology_or_tools_options.length - 1) {
                            setAnimationComplete(prev => ({...prev, tools: true}));
                          }
                        }}
                      />
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          bgcolor: "#fff",
        },
        "@keyframes fadeIn": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "18px",
          backgroundColor: "#222",
          color: "#fff",
          py: 1,
        }}
      >
        <TbArrowGuide
          style={{ marginRight: 4, fontSize: "24px", fontFamily: "monospace" }}
        />
        Guidance
      </DialogTitle>
      <DialogContent sx={{ p: 3, backgroundColor: "#fff" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          renderContent()
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: "#fff" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "#222",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#000",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}