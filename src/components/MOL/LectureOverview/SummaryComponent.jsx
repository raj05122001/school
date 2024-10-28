import { Box, Typography } from "@mui/material";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { getLectureSummary, updateSummary } from "@/api/apiHelper";
import { useEffect, useState } from "react";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

const SummaryComponent = ({ lectureId, isDarkMode }) => {
  const [summary, setSummary] = useState({});
  const [summaryId, setSummaryId] = useState("");
  const [isEditData, setIsEditData] = useState(false);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    fetchSummary();
  }, [lectureId]);

  const fetchSummary = async () => {
    try {
      const summaryResponse = await getLectureSummary(lectureId);
      const summaryData = summaryResponse?.data?.data;
      const jsonData = summaryData?.summary_text
        ? JSON.parse(summaryData?.summary_text)
        : [];

      setSummaryId(summaryData?.id);
      setSummary(jsonData);
    } catch (error) {
      console.error("Error fetching API response:", error);
    }
  };

  const onUpdateSummary = async () => {
    try {
      const updatedSummaryText = JSON.stringify([editedText]);
      await updateSummary(summaryId, { summary_text: updatedSummaryText });

      setSummary([editedText]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditData(false);
    }
  };

  // Utility function to split text into paragraphs after every 5 sentences
  const splitTextIntoParagraphs = (text) => {
    const sentences = text?.split(/(?<=[!?])\s+/); // Split text by sentences
    let paragraphs = [];
    for (let i = 0; i < sentences?.length; i += 5) {
      paragraphs.push(sentences?.slice(i, i + 5)?.join(" "));
    }
    return paragraphs;
  };

  // Updated stringToHtml function
  const stringToHtml = (data) => {
    const formattedText = data
      ?.replace(/#+/g, "")
      ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const newLine = formattedText?.replace(/\n/g, "<br>");
    const paragraphs = splitTextIntoParagraphs(formattedText);
    return paragraphs.join("\n");
  };

  const onChange = (e) => {
    setEditedText(e);
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        borderRadius: "8px",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        background: isDarkMode
          ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
          : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 450,
      }}
    >
      {isEditData ? (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              right: 4,
              top: 4,
            }}
          >
            <FaSave
              size={24}
              onClick={() => onUpdateSummary()}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <TextEditor text={summary[0]} onChange={onChange} />
        </Box>
      ) : summary.length > 0 ? (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <FaEdit
              size={24}
              onClick={() => setIsEditData(true)}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <TextWithMath text={stringToHtml(summary[0])} />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginY: "auto",
            flexDirection: "column",
          }}
        >
          <FaInfoCircle style={{ color: "#999" }} size={24} />
          <Typography variant="h5" color="textSecondary">
            No summary available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SummaryComponent;
