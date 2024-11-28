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
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa"; // Importing icon from react-icons
import MathJax from "react-mathjax2";

const PersonalisedRecommendations = ({ id }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [section, setSection] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedApproach, setSelectedApproach] = useState("");

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const response = await getPersonalisedRecommendations(id);
      setSection(response?.data?.data?.[0]);
      fetchTopic(response?.data?.data?.[0]);
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
        Personalised Recommendations
      </Typography>

      <Card
        variant="outlined"
        sx={{ mb: 3, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <CardContent>
          <Typography variant="h6" color={primaryColor}>
            Previously Selected
          </Typography>
          <Typography variant="body1" color={primaryColor}>
            <strong>Topic:</strong> {selectedTopic || "None"}
          </Typography>
          <Typography variant="body1" color={primaryColor}>
            <strong>Approach:</strong> {selectedApproach || "None"}
          </Typography>
          <Typography variant="body1" color={primaryColor}>
            <strong>Section:</strong> {section || "None"}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom color={primaryColor}>
        Recommended Topics
      </Typography>

      {topics.length > 0 ? (
        topics?.map((topic, index) => (
          <TopicAccordion
            key={index}
            topic={topic}
            id={id}
            section={section}
            selectedApproach={selectedApproach}
          />
        ))
      ) : (
        <Typography>No topics available.</Typography>
      )}
    </Container>
  );
};

export default PersonalisedRecommendations;

const TopicAccordion = ({ topic, id, section, selectedApproach }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchQuery = async () => {
    setLoading(true);
    try {
      const formData = {
        lecture_id: id,
        section_identified: section,
        topic_selected: topic,
        approach_selected: selectedApproach,
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
      onChange={(event, expanded) => expanded && fetchQuery()}
      sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
    >
      <AccordionSummary
        expandIcon={<FaChevronDown />} // Using react-icons here
      >
        <Typography variant="body1" color={primaryColor}>
          {topic}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
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
                {data.title}
              </Typography>
              {data.explanation && (
                <FormattedText text={data.explanation} color={primaryColor} />
              )}
            </CardContent>
          </Card>
        ) : (
          <Typography>No data available.</Typography>
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
          <MathJax.Node key={i} inline>
            {cleanedLatex}
          </MathJax.Node>
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
    <MathJax.Context input="tex">
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
