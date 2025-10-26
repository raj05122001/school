import { Box, Typography, Skeleton, Button, IconButton } from "@mui/material";
import { getLectureHighlights, updateMolMarks, updateHighlights } from "@/api/apiHelper";
import { useEffect, useState, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import MathJax from "react-mathjax2";
import usePersonalisedRecommendations from "@/components/student/MOL/usePersonalisedRecommendations";
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";
import TextEditor from "@/commonComponents/TextEditor/TextEditor";

const HighlightsComponent = ({
  lectureId,
  isDarkMode,
  marksData = {},
  isStudent = false,
  setMarksData,
  isEdit=false
}) => {
  const [decisions, setDecisions] = useState("");
  const [loading, setLoading] = useState(true);
  const highlightsBoxRef = useRef(null);
  const updateCalled = useRef(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [decisionsId, setDecisionsId] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [originalJsonData, setOriginalJsonData] = useState([]); // Store original JSON format

  usePersonalisedRecommendations(lectureId, "HIGHLIGHTS", highlightsBoxRef, "");

  useEffect(() => {
    const handleScrollAndUpdate = async () => {
      if (!isStudent || marksData?.viewed_highlights || updateCalled.current) {
        return;
      }

      if (highlightsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          highlightsBoxRef.current;
        if (
          scrollHeight > clientHeight &&
          scrollTop + clientHeight >= scrollHeight - 5
        ) {
          await updateMolMark();
        } else if (scrollHeight === clientHeight) {
          await updateMolMark();
        }
      }
    };

    highlightsBoxRef.current?.addEventListener("scroll", handleScrollAndUpdate);
    highlightsBoxRef.current?.addEventListener(
      "mouseenter",
      handleScrollAndUpdate
    );
    highlightsBoxRef.current?.addEventListener(
      "mouseleave",
      handleScrollAndUpdate
    );

    return () => {
      highlightsBoxRef.current?.removeEventListener(
        "scroll",
        handleScrollAndUpdate
      );
      highlightsBoxRef.current?.removeEventListener(
        "mouseenter",
        handleScrollAndUpdate
      );
      highlightsBoxRef.current?.removeEventListener(
        "mouseleave",
        handleScrollAndUpdate
      );
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
      const htmlContent = jsonData
        .map((section) => {
          const titleHTML = `<h3>${section.title}</h3><br>`;
          const pointsHTML = `<ul>${section.keypoints
            .map((point) => `<li>${point}</li><br>`)
            .join("")}</ul><br><br>`;
          return `${titleHTML}${pointsHTML}`;
        })
        .join("");

      setEditorContent(htmlContent);
      setDecisionsId(decisionData?.id);
    } catch (error) {
      console.error("Error fetching meeting decision:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlight();
  }, [lectureId]);

  const convertHtmlToJsonFormat = (htmlContent) => {
    try {

      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const sections = [];

      // Method 1: Try to find H3 followed by UL structure
      const h3Elements = tempDiv.querySelectorAll("h3");

      if (h3Elements.length > 0) {
        h3Elements.forEach((h3, index) => {
          const title = h3.textContent.trim();
          let keypoints = [];

          // Get all elements after this h3 until the next h3
          let currentElement = h3.nextElementSibling;
          const nextH3 = h3Elements[index + 1];

          while (currentElement && currentElement !== nextH3) {
            if (currentElement.tagName === "UL") {
              // Found UL, get all LI elements
              keypoints = Array.from(currentElement.querySelectorAll("li")).map(
                (li) => li.innerHTML.trim()
              );
              break;
            } else if (currentElement.tagName === "OL") {
              // Handle ordered lists too
              keypoints = Array.from(currentElement.querySelectorAll("li")).map(
                (li) => li.innerHTML.trim()
              );
              break;
            }
            currentElement = currentElement.nextElementSibling;
          }

          if (title) {
            sections.push({
              title: title,
              keypoints: keypoints,
            });
          }
        });
      }

      // Method 2: If no proper structure found, try to extract from entire content
      if (
        sections.length === 0 ||
        sections.every((section) => section.keypoints.length === 0)
      ) {

        // Split content by headings and try to extract lists
        const htmlText = tempDiv.innerHTML;
        const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
        const headings = [];
        let match;

        while ((match = headingRegex.exec(htmlText)) !== null) {
          headings.push({
            fullMatch: match[0],
            title: match[1].trim(),
            index: match.index,
          });
        }

        headings.forEach((heading, index) => {
          const nextHeadingIndex =
            headings[index + 1]?.index || htmlText.length;
          const sectionHtml = htmlText.substring(
            heading.index + heading.fullMatch.length,
            nextHeadingIndex
          );

          // Create temp div for this section
          const sectionDiv = document.createElement("div");
          sectionDiv.innerHTML = sectionHtml;

          // Extract list items
          const listItems = sectionDiv.querySelectorAll("li");
          const keypoints = Array.from(listItems).map((li) =>
            li.innerHTML.trim()
          );

          sections.push({
            title: heading.title,
            keypoints: keypoints,
          });
        });
      }

      return sections.length > 0 ? sections : originalJsonData;
    } catch (error) {
      console.error("Error converting HTML to JSON:", error);
      return originalJsonData; // Return original data if conversion fails
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert current HTML content back to original JSON format
      const jsonFormatData = convertHtmlToJsonFormat(editorContent);
      const updatedText = JSON.stringify(jsonFormatData);

      const response = await updateHighlights(decisionsId, {
          highlight_text: updatedText,
        })

      const jsonData = response?.data?.highlight_text
        ? JSON.parse(response?.data?.highlight_text)
        : [];

      setDecisions(jsonData);

      // Update the original data and exit edit mode
      setOriginalJsonData(jsonFormatData);
      setEditorContent(editorContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving highlights:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { 
    setIsEditing(false);
  };

  const onChange = (e) => {
    setEditorContent(e);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        color: "#3B3D3B",
        backgroundColor: "#fff",
        overflowY: "auto",
        height: "100%",
        minHeight: 400,
        maxHeight: 400,
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
      }}
      ref={highlightsBoxRef}
    >
      {isEdit && (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {!isEditing ? (
            <IconButton
              onClick={handleEdit}
              sx={{ color: "#36454F" }}
              title="Edit Highlights"
            >
              <MdEdit />
            </IconButton>
          ) : (
            <>
              <IconButton
                onClick={handleSave}
                disabled={saving}
                sx={{ color: "#4CAF50" }}
                title="Save Changes"
              >
                <MdSave />
              </IconButton>
              <IconButton
                onClick={handleCancel}
                sx={{ color: "#f44336" }}
                title="Cancel Edit"
              >
                <MdCancel />
              </IconButton>
            </>
          )}
        </Box>
      )}

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
        isEditing ? (
        <Box sx={{ height: "calc(100% - 60px)" }}>
          <TextEditor text={editorContent} onChange={onChange} />
        </Box>
      ) : (
        <Box>
          <MathJax.Context input="tex" inline>
            <Box sx={{ textAlign: "justify", mt: 2 }}>
              {decisions?.map((section) => (
                <Box key={section.title} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "#3B3D3B",
                      fontFamily: "Inter",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: "600",
                      lineHeight: "20px",
                      letterSpacing: "-0.48px",
                    }}
                  >
                    {section.title} -
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, py:2 }}>
                    {section?.keypoints?.map((point, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{ fontSize: "14px", fontFamily:"Inter", lineHeight:"18px", p:0.5 }}
                      >
                        <TextWithMath
                          text={point?.replace(/^- /, "")?.trim()}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </MathJax.Context>
        </Box>
      )
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
