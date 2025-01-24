import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getGuidance } from "@/api/apiHelper";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  ListItem,
} from "@mui/material";
import { TbArrowGuide } from "react-icons/tb";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { RiRoadMapLine } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import { SiKnowledgebase } from "react-icons/si";
import { GrTechnology } from "react-icons/gr";
import { IoFootstepsSharp } from "react-icons/io5";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

export default function NeedMoreGuide({ assignmentId, open, setOpen }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const hasFetchedData = useRef(false); // Prevent multiple fetch calls
  // const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    if (assignmentId && open) {
      if (!hasFetchedData.current) {
        hasFetchedData.current = true;
        fetchData();
      }
    }
  }, [assignmentId]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGuidance(assignmentId);
      console.log("Response", response);
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

  console.log("Data", data);

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
    console.log("Status of showStepDetails:", showStepDetails);
  };
  // Function to render the carousel for `road_map_guide`
  const renderCarousel = (steps) => {
    // const stepArray = steps
    // ?.split(/step_\d+:/)
    // ?.filter((step) => step?.replace(/\n/g, "")?.trim() !== "");

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          p: 1,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <IconButton
          onClick={() => scrollContainer(`left`)}
          // disabled={currentStepIndex === 0}
          disableRipple
          sx={{
            fontWeight: "bold",
            fontSize: "36px",
            color: "black",
            gap: 2,
            "&:hover": {
              backgroundColor: "transparent", // Removes the hover background color
            },
            cursor: "pointer", // Ensures the cursor is a pointer
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
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "4px",
            },
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
                minWidth: "300px",
                padding: 2,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                borderRadius: 4,
                background: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
                boxShadow: "0px 4px 10px #5d7aa1",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              <Typography variant="h6" gutterBottom textAlign={"center"}>
                <IoFootstepsSharp />
                Step {index + 1}
              </Typography>
              <Typography
                // variant="span"
                textAlign={"center"}
                dangerouslySetInnerHTML={{
                  __html: replaceString(step?.step.trim()),
                }}
              />
            </Paper>
          ))}
        </Box>
        <IconButton
          onClick={() => scrollContainer(`right`)}
          // disabled={currentStepIndex === roadMapSteps.length - 1}
          disableRipple
          sx={{
            fontWeight: "bold",
            fontSize: "36px",
            color: "black",
            gap: 2,
            "&:hover": {
              backgroundColor: "transparent", // Removes the hover background color
            },
            cursor: "pointer", // Ensures the cursor is a pointer
          }}
        >
          <CiCircleChevRight />
        </IconButton>
      </Box>
    );
  };
  // Typing effect for the text
  const TypingEffect = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length - 1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10); // Adjust speed (50ms per character)
      return () => clearInterval(interval);
    }, [text]);
    return (
      <Typography variant="subtitle1" fontSize={"14px"}>
        {renderCodeWithLineBreaks(displayedText)}
      </Typography>
    );
  };

  // Function to render data

  const renderData = (data) => {
    return Object?.keys(data)?.map((key) => {
      const value = data[key];

      if (key === "steps_with_context") {
        console.log("Value for steps with context", value);
        return (
          <Box key={key} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              <RiRoadMapLine style={{ marginRight: 4 }} /> {formatKey(key)}
            </Typography>
            {renderCarousel(value)}
            {showStepDetails === true && (
              <Box>

                  <Paper
                    key={stepIndex}
                    elevation={3}
                    sx={{
                      minWidth: "300px",
                      padding: 2,
                      textAlign: "left",
                      whiteSpace: "pre-wrap",
                      borderRadius: 4,
                      background:
                        "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
                      boxShadow: "0px 4px 10px #5d7aa1",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom textAlign={"center"}>
                      <IoFootstepsSharp />
                      Explanation for Step {stepIndex + 1}
                    </Typography>
                    {/* <Typography
                      // variant="span"
                      textAlign={"center"}
                      dangerouslySetInnerHTML={{
                        __html: replaceString(value[stepIndex]?.description.trim()),
                      }}
                    /> */}
                    <TextWithMath text={value[stepIndex]?.description.trim()} />  
                  </Paper>

              </Box>
            )}
          </Box>
        );
      }

      if (key === "code_snippets_or_examples" && value !== "") {
        return (
          <Box key={key} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              <FaCode style={{ marginRight: 4 }} />
              {formatKey(key)}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#000000",
                color: "#4CBB17",
                padding: 4,
                borderRadius: 4,
              }}
            >
              <TypingEffect text={value} />
            </Box>
          </Box>
        );
      }

      if (key === "concepts_and_knowledge_required") {
        return (
          <Box key={key} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              <SiKnowledgebase style={{ marginRight: 4 }} /> {formatKey(key)}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#EADDCA",
                color: "#4A0404",
                padding: 4,
                borderRadius: 4,
                boxShadow: "0px 4px 10px #a1865d",
              }}
            >
              {renderWithLineBreaks(value)}
            </Box>
          </Box>
        );
      }

      if (key === "technology_or_tools_options") {
        return (
          <Box key={key} sx={{ marginBottom: "16px" }}>
            <Typography variant="h6" gutterBottom textAlign={"center"}>
              <GrTechnology style={{ marginRight: 4 }} /> {formatKey(key)}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#E6E6FA80",
                color: "#51414F",
                padding: 4,
                borderRadius: 4,
                backdropFilter: "blur(10px)",
                boxShadow: "0px 4px 10px #E0B0FF",
              }}
            >
              {renderWithLineBreaks(value)}
            </Box>
          </Box>
        );
      }
      return (
        value !== "" && (
          <div key={key} style={{ marginBottom: "8px" }}>
            <strong>{formatKey(key)}:</strong> <br />{" "}
            {renderWithLineBreaks(value)}
          </div>
        )
      );
    });
  };
  const replaceString = (data) => {
    return data
      ?.replace(/\[(.*?)\]/g, <span style="font-weight: 600">[$1]</span>)
      ?.replace(/#/g, "")
      ?.replace(/`/g, "")
      ?.replace(/(?<!\d)\. /g, `. <br>`)
      ?.replace(/\n/g, `.<br>`)
      ?.replace(/\\n/g, `<br>`); // Handle escaped \n
    // .replace(/\\(.?)\\*/g, "<strong>$1</strong>");
  };

  // Function to handle rendering text with line breaks
  const renderWithLineBreaks = (text) => {
    return text.map((line, index) => (
      <React.Fragment key={index}>
        <Typography
          variant="span"
          dangerouslySetInnerHTML={{ __html: replaceString(line.trim()) }}
        />
        <br />
      </React.Fragment>
    ));
  };
  // Function to handle conde snippet key rendering text with line breaks
  const renderCodeWithLineBreaks = (text) => {
    return text?.split("\\n")?.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  // Function to format keys (optional)
  const formatKey = (key) => {
    return key
      ?.replace(/_/g, " ")
      ?.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          bgcolor: "#f0f0f0",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        marginTop={5}
        fontWeight={"bold"}
        fontSize={"22px"}
      >
        <TbArrowGuide
          style={{ marginRight: 4, fontSize: "24px", fontFamily: "monospace" }}
        />
        Guidance
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>please wait...</Typography>
            </Box>
          ) : (
            data && renderData(data)
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}