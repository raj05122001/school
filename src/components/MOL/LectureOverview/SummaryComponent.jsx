import { Box, Typography, Skeleton, IconButton } from "@mui/material";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import {
  getLectureSummary,
  updateSummary,
  updateMolMarks,
} from "@/api/apiHelper";
import { useEffect, useState, useRef } from "react";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import usePersonalisedRecommendations from "@/components/student/MOL/usePersonalisedRecommendations";

const SummaryComponent = ({
  lectureId,
  isDarkMode,
  isEdit,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const [summary, setSummary] = useState({});
  const [summaryId, setSummaryId] = useState("");
  const [isEditData, setIsEditData] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(true);
  const summaryBoxRef = useRef(null);
  const updateCalled = useRef(false);

  useEffect(() => {
    fetchSummary();
  }, [lectureId]);

  usePersonalisedRecommendations(lectureId, "SUMMARY", summaryBoxRef, "");

  useEffect(() => {
    const handleScrollAndUpdate = async () => {
      if (!isStudent || marksData?.viewed_summary || updateCalled.current) {
        return;
      }

      if (summaryBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = summaryBoxRef.current;
        if (scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 5) {
          await updateMolMark();
        } else if (scrollHeight === clientHeight) {
          await updateMolMark();
        }
      }
    };

    summaryBoxRef.current?.addEventListener("scroll", handleScrollAndUpdate);
    summaryBoxRef.current?.addEventListener('mouseenter', handleScrollAndUpdate);
    summaryBoxRef.current?.addEventListener('mouseleave', handleScrollAndUpdate);

    return () => {
      summaryBoxRef.current?.removeEventListener("scroll", handleScrollAndUpdate);
      summaryBoxRef.current?.removeEventListener('mouseenter', handleScrollAndUpdate);
      summaryBoxRef.current?.removeEventListener('mouseleave', handleScrollAndUpdate);
    };
  }, [isStudent, marksData?.viewed_summary]);

  const updateMolMark = async () => {
    updateCalled.current = true;
    try {
      const formData = {
        student_score: marksData.student_score + 1,
        viewed_summary: true,
      };
      await updateMolMarks(marksData.id, formData);

      setMarksData((prev) => ({
        ...prev,
        viewed_summary: true,
        student_score: prev.student_score + 1,
      }));
    } catch (error) {
      console.error("Error updating Mol Marks:", error);
    }
  };

  function safeParseJSON(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn(
        "Initial JSON parsing failed, attempting to clean and retry."
      );

      const cleanedData = data.replace(/\\"/g, '"').replace(/\\\\n/g, "\n");

      try {
        return JSON.parse(cleanedData);
      } catch (secondError) {
        console.error("Failed to parse JSON even after cleaning:", secondError);
        return null;
      }
    }
  }

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const summaryResponse = await getLectureSummary(lectureId);
      const summaryData = summaryResponse?.data?.data;

      const jsonData = summaryData?.summary_text
        ? safeParseJSON(summaryData.summary_text)
        : [];

      setSummaryId(summaryData?.id);
      setSummary(jsonData);
    } catch (error) {
      console.error("Error fetching API response:", error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSummary = async () => {
    try {
      // if(!editedText)return ;
      const updatedSummaryText = JSON.stringify([editedText]);

      await updateSummary(summaryId, { summary_text: updatedSummaryText });

      setSummary([editedText]);
      setIsEditData(false); // Move here to ensure edit mode exits after success
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  }

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
    let formattedText = data
      ?.replace(/#+/g, "")
      ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    formattedText = formattedText?.replace(
        /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/g,
        (match, beforeSrc, src, afterSrc) => {
          return `<img ${beforeSrc}src="${src}" ${afterSrc} style="max-width: 800px; max-height: 400px; display: block; margin: auto;">`;
        }
     );
    
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
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        color: isDarkMode ? "#F0EAD6" : "#36454F",
        background: isDarkMode
          ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
          : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 500,
      }}
      ref={summaryBoxRef}
    >
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
        </Box>
      ) : isEditData ? (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              right: 4,
              top: 4,
              zIndex: 10, // Ensures the button is above other elements
            }}
          >
            <IconButton
              onClick={() => {
                onUpdateSummary();
              }}
              style={{ cursor: "pointer" }}
            >
              <FaSave size={24} />
            </IconButton>
          </Box>
          <TextEditor text={summary[0]} onChange={onChange} />
        </Box>
      ) : summary?.length > 0 ? (
        <Box>
          {isEdit && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }} >
              <FaEdit
                size={24}
                onClick={() => {
                  setIsEditData(true);
                  setEditedText(summary[0]);
                }}
                style={{ cursor: "pointer" }}
              />
            </Box>
          )}
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
