import React, { useState, useEffect } from "react";
import {
  getPersonalisedRecommendations,
  getTopic,
  getQuery,
} from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider,
  Box,
  Skeleton,
  useTheme,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa"; // Importing icon from react-icons
import MathJax from "react-mathjax2";
import { VscPreview } from "react-icons/vsc";
import { MdSelfImprovement, MdRecommend } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { TbMoodEmpty } from "react-icons/tb";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

const PersonalisedRecommendations = ({ id, marksData }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [section, setSection] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedApproach, setSelectedApproach] = useState("");

  useEffect(() => {
    fetchSection();
  }, [marksData]);

  console.log("Marks Data", marksData);

  const fetchSection = async () => {
    try {
      const response = await getPersonalisedRecommendations(id);
      if (response?.data?.data !== "NOT FOUND") {
        setSection(response?.data?.data?.[0]);
        fetchTopic(response?.data?.data?.[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopic = async (value) => {
    try {
      const response = await getTopic(id, value);
      const data = response?.data?.data?.[0];
      const jsonData = Array.isArray(data?.topic_list)
        ? data.topic_list
        : JSON.parse(data?.topic_list || "[]");
      setTopics(jsonData);
      setSelectedTopic(data?.prevoius_selected_topic || "");
      setSelectedApproach(data?.previous_selected_approach || "");
    } catch (error) {
      console.error(error);
    }
  };

  const isSummary = section==="SUMMARY" || section==="HIGHLIGHTS"

  console.log("Selected Topic", selectedTopic);

  return (
    <Container
      sx={{
        // maxWidth: 450,
        height: "100%",
        minHeight: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        borderRadius: "24px",
      }}
    >
      <Typography variant="h4" gutterBottom color={primaryColor}>
        <MdSelfImprovement style={{ fontSize: "32px" }} /> Personalised
        Recommendations
      </Typography>

      {marksData?.viewed_highlights === false &&
      marksData?.viewed_notes === false &&
      marksData?.viewed_summary === false &&
      marksData?.viewed_summary === false ? (
        <Typography variant="h6" textAlign={"center"}>
          We are analysing your activity for Personalised Recommendation.
        </Typography>
      ) : (
        selectedTopic && (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 6,
              pl: 2,
              boxShadow: "0px 4px 10px #ADD8E6",
            }}
          >
            <CardContent sx={{}}>
              <Typography variant="h6" color={"#483248"}>
                <VscPreview style={{ marginRight: 2 }} />
                Previously Selected
              </Typography>
              <TopicAccordion
                topic={selectedTopic}
                id={id}
                section={section}
                selectedApproach={selectedApproach}
                isApiCall={true}
                isSummary={isSummary}
              />
              <Typography variant="body1" color={"#630330"}>
                <strong>✦ Approach:</strong>{" "}
                <span style={{ color: "#51414F" }}>
                  {selectedApproach || "None"}
                </span>
              </Typography>
              <Typography variant="body1" color={"#630330"}>
                <strong>✦ Section:</strong>{" "}
                <span style={{ color: "#51414F" }}>{section || "None"}</span>
              </Typography>
            </CardContent>
          </Card>
        )
      )}
      <Box display={"flex"} gap={1}>
        <MdRecommend style={{ fontSize: "32px" }} />
        <Typography variant="h6" gutterBottom color={primaryColor}>
          {" "}
          Personalized Topics Tailored for You
        </Typography>
      </Box>

      <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
        {topics.length > 0 ? (
          topics?.map((topic, index) => (
            <TopicAccordion
              key={index}
              topic={topic}
              id={id}
              section={section}
              selectedApproach={selectedApproach}
              isSummary={isSummary}
            />
          ))
        ) : (
          <Typography>No topics available.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default PersonalisedRecommendations;

const TopicAccordion = ({
  topic,
  id,
  section,
  selectedApproach,
  isApiCall = false,
  isSummary = false
}) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [myApproach, setMyApproach] = useState(selectedApproach);

  const approachOptions = [
    "Theoretically",
    "Through Practical Example",
    "Through Real Life Example",
    "Through Case Study",
  ];

  useEffect(() => {
    if (isApiCall || isSummary) {
      fetchQuery(selectedApproach);
    }
  }, [isApiCall, isSummary]);

  const handleChange = (event) => {
    setMyApproach(event.target.value); // Update parent's state
  };

  const fetchQuery = async (myApproach) => {
    setLoading(true);
    try {
      const formData = {
        lecture_id: id,
        section_identified: section,
        topic_selected: topic,
        approach_selected: myApproach,
      };
      const response = await getQuery(formData);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion
      // onChange={(event, expanded) => expanded && fetchQuery()}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 2,
        p: 2,
        boxShadow: "0px 2px 6px #FFDEAD",
        margin: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<FaChevronDown />} // Using react-icons here
      >
        <Typography variant="body1" color={primaryColor}>
        {isSummary ? <TextWithMath text={`${topic.slice(0,200)}...`} /> : <TextWithMath text={topic} />}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ boxShadow: "0px 2px 6px #666aa1", borderRadius: 4 }}
      >
        <Box sx={{ display: "flex", gap: 2, m: 2, p: 2 }}>
          <FormControl
            sx={{
              width: "230px",
              backgroundColor: "#daf0da",
              borderRadius: 2,
              boxShadow: "0px 2px 6px #666aa1",
              "& .MuiOutlinedInput-notchedOutline": {
                display: "none", // Removes the outline
              },
            }}
          >
            <InputLabel
              id="approach-select-label"
              sx={{ fontSize: "14px", fontStyle: "bold", color: "#000000" }}
            >
              Select Approach
            </InputLabel>
            <Select
              labelId="approach-select-label"
              value={myApproach}
              onChange={handleChange}
              label="Select Approach"
              size="small"
              sx={{
                fontSize: "0.875rem",
                height: "100%",
                ":hover": { backgroundColor: "#81b581" },
              }}
            >
              {approachOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option}
                  sx={{ fontSize: "0.875rem" }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{
              color: isDarkMode ? "#1d3254" : "primary",
              border: !isDarkMode && "none",
              borderColor: isDarkMode ? "#1d3254" : "none",
              borderRadius: 4,
              boxShadow: "0px 2px 6px #666aa1",
              ":hover": { backgroundColor: "#4066a3", color: "#fff" },
            }}
            onClick={() => fetchQuery(myApproach)}
          >
            Explanation <IoSend style={{ marginLeft: 2, fontSize: "18px" }} />
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : data?.title ? (
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              maxHeight: 400,
              overflow: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <CardContent color={secondaryColor}>
              <Typography variant="h6" color={primaryColor}>
                <TextWithMath text={data.title} />
              </Typography>
              {data.explanation && (
                <FormattedText text={data.explanation} color={primaryColor} />
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <Box display={"flex"} justifyContent={"center"} gap={1}>
              <Typography textAlign={"center"}>No data available</Typography>
              <TbMoodEmpty style={{ fontSize: "22px" }} />
            </Box>

            <Typography
              textAlign={"center"}
              sx={{ fontSize: "14px", fontStyle: "italic" }}
            >
              Kindly click on Explain button to show details regarding the
              topic.
            </Typography>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const FormattedText = ({ text, color }) => {
  const isArray = Array.isArray(text);
  const textArray = isArray ? text : [text];

  const latexRegex = /\\\[([\s\S]*?)\\\]/g;

  const replaceString = (data) => {
    return data
      .replace(/\[(.*?)\]/g, `<span style="font-weight: 600">[$1]</span>`)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .replace(/\\/g, "")
      .replace(/(?<!\d)\. /g, ".<br>")
      .replace(/\n/g, "<br>");
  };

  const processText = (part) => {
    if (!part) return null;
    const chunks = part.split(latexRegex).filter(Boolean);
    return chunks.map((chunk, i) => {
      if (i % 2 === 1) {
        // LaTeX content
        const cleanedLatex = chunk.replace(/\n/g, " ");
        return (
          // <MathJax.Node key={i} inline>
          //   {cleanedLatex}
          // </MathJax.Node>
          <TextWithMath key={i} text={cleanedLatex} />
        );
      } else {
        // Non-LaTeX content
        return (
          <Typography
            key={i}
            variant="body2"
            component="span"
            color={color}
            dangerouslySetInnerHTML={{ __html: replaceString(chunk) }}
          />
        );
      }
    });
  };

  return (
    <MathJax.Context input="tex" inline>
      <Box>
        {textArray.map((part, index) => (
          <Box key={index} color={color}>
            {processText(part)}
          </Box>
        ))}
      </Box>
    </MathJax.Context>
  );
};
