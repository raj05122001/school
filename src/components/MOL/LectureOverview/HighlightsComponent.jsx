import { Box, Typography, Skeleton } from "@mui/material";
import { getLectureHighlights, updateMolMarks } from "@/api/apiHelper";
import { useEffect, useState, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import MathJax from "react-mathjax2";

const HighlightsComponent = ({
  lectureId,
  isDarkMode,
  marksData = {},
  isStudent = false,
  setMarksData,
}) => {
  const [decisions, setDecisions] = useState("");
  const [loading, setLoading] = useState(true);
  const highlightsBoxRef = useRef(null);
  const updateCalled = useRef(false);

  useEffect(() => {
    const handleScrollAndUpdate = async () => {
      if (!isStudent || marksData?.viewed_highlights || updateCalled.current) {
        return;
      }

      if (highlightsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = highlightsBoxRef.current;
        if (scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 5) {
          await updateMolMark();
        } else if (scrollHeight === clientHeight) {
          await updateMolMark();
        }
      }
    };

    highlightsBoxRef.current?.addEventListener("scroll", handleScrollAndUpdate);
    highlightsBoxRef.current?.addEventListener('mouseenter', handleScrollAndUpdate);
    highlightsBoxRef.current?.addEventListener('mouseleave', handleScrollAndUpdate);

    return () => {
      highlightsBoxRef.current?.removeEventListener("scroll", handleScrollAndUpdate);
      highlightsBoxRef.current?.removeEventListener('mouseenter', handleScrollAndUpdate);
      highlightsBoxRef.current?.removeEventListener('mouseleave', handleScrollAndUpdate);
    };
  }, [isStudent, marksData?.viewed_highlights]);

  const updateMolMark = async () => {
    if (!updateCalled.current) {
      updateCalled.current = true;
      try {
        const formData = {
          student_score: marksData.student_score + 1,
          viewed_highlights: true,
        };
        await updateMolMarks(marksData.id, formData);

        setMarksData((prev) => ({
          ...prev,
          viewed_highlights: true,
          student_score: prev.student_score + 1,
        }));
      } catch (error) {
        console.error("Error updating Mol Marks:", error);
      }
    }
  };

  const fetchHighlight = async () => {
    setLoading(true);
    try {
      const apiResponse = await getLectureHighlights(lectureId);
      const decisionData = apiResponse?.data?.data;
      const jsonData = decisionData?.highlight_text
        ? JSON.parse(decisionData?.highlight_text)
        : [];
      setDecisions(jsonData);
    } catch (error) {
      console.error("Error fetching meeting decision:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlight();
  }, [lectureId]);

  const renderTextWithMathJax = (text) => {
    const parts = text.split(/(\\\[.*?\\\]|\\\(.*?\\\))/g);

    return parts?.map((part, idx) => {
      if (part.match(/\\\[.*?\\\]/)) {
        return (
          <MathJax.Node key={idx} inline>
            {part.replace(/\\\[|\\\]/g, "")}
          </MathJax.Node>
        );
      } else if (part.match(/\\\(.*?\\\)/)) {
        return (
          <MathJax.Node key={idx} inline>
            {part.replace(/\\\(|\\\)/g, "")}
          </MathJax.Node>
        );
      } else {
        return <span key={idx}>{part}</span>;
      }
    });
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
        maxHeight: 450,
      }}
      ref={highlightsBoxRef}
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
      ) : decisions.length > 0 ? (
        <Box>
          <MathJax.Context input="tex" inline>
            <Box sx={{ textAlign: "justify", mt: 2 }}>
              {decisions?.map((section) => (
                <Box key={section.title} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {section.title} -
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {section?.keypoints?.map((point, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {renderTextWithMathJax(point.replace(/^- /, "").trim())}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </MathJax.Context>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "#999",
          }}
        >
          <FaInfoCircle size={24} />
          <Typography variant="h5" sx={{ color: "text.secondary", mt: 1 }}>
            No highlights available.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HighlightsComponent;
