import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TbArrowGuide } from "react-icons/tb";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { FiCopy, FiCheck } from "react-icons/fi"; // ⬅️ react-icons
import TextWithMath from "@/commonComponents/TextWithMath/TextWithMath";

/* ──────────────────────────────────────────────────────────────────────────
   HTML detection / conversion helpers
────────────────────────────────────────────────────────────────────────── */

const looksLikeHtml = (txt = "") =>
  /<\/?[a-z][\s\S]*>/i.test(txt) || /<\s*br\s*\/?>/i.test(txt);

const decodeEntities = (t = "") =>
  t
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripAll = (t = "") => decodeEntities(t.replace(/<\/?[^>]+>/g, ""));

const htmlToMarkdown = (html = "") => {
  let s = html.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  // code blocks
  s = s.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, code) => {
    return "```\n" + decodeEntities(code.trim()) + "\n```";
  });
  // inline code
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => "`" + decodeEntities(code.trim()) + "`");

  // headings
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${stripAll(t).trim()}\n\n`);
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${stripAll(t).trim()}\n\n`);
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `### ${stripAll(t).trim()}\n\n`);
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `#### ${stripAll(t).trim()}\n\n`);
  s = s.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `##### ${stripAll(t).trim()}\n\n`);
  s = s.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `###### ${stripAll(t).trim()}\n\n`);

  // paragraphs & breaks
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `${stripAll(t).trim()}\n\n`);
  s = s.replace(/<br\s*\/?>/gi, "\n");

  // links
  s = s.replace(/<a[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const label = stripAll(text).trim();
    return `[${label}](${href})`;
  });

  // emphasis
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${stripAll(t)}**`);
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${stripAll(t)}*`);

  // lists
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `1. ${stripAll(li).trim()}\n`)
  );
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `- ${stripAll(li).trim()}\n`)
  );

  // strip remaining tags
  s = s.replace(/<\/?[^>]+>/g, "");

  return s.replace(/\n{3,}/g, "\n\n").trim();
};

/* ──────────────────────────────────────────────────────────────────────────
   CopyButton (react-icons)
────────────────────────────────────────────────────────────────────────── */

const CopyButton = ({
  getText,
  preferHtmlConversion = true,
  tooltip = "Copy",
  sx = {},
}) => {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      let raw = (typeof getText === "function" ? getText() : "") || "";
      let out = raw;

      if (preferHtmlConversion && looksLikeHtml(raw)) {
        out = htmlToMarkdown(raw);
      }
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <Tooltip title={copied ? "Copied!" : tooltip} arrow>
      <IconButton
        onClick={doCopy}
        size="small"
        sx={{
          borderRadius: 1,
          bgcolor: "#f1f3f5",
          "&:hover": { bgcolor: "#e9ecef" },
          ...sx,
        }}
      >
        {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
      </IconButton>
    </Tooltip>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   TypingEffect
────────────────────────────────────────────────────────────────────────── */

const TypingEffect = ({ text, speed = 25, className = "", onComplete = () => {}, color = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (!text) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (!isComplete && currentIndex === text.length) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className={className}>
      <TextWithMath text={displayedText} color={color} />
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   CodeSnippetWithTyping (keeps its own Copy)
────────────────────────────────────────────────────────────────────────── */

const CodeSnippetWithTyping = ({ text }) => {
  const lines = text?.split("\\n") || [];
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleLineComplete = () =>
    setCurrentLineIndex((prev) => (prev < lines.length - 1 ? prev + 1 : prev));

  return (
    <Box sx={{ position: "relative" }}>
      <CopyButton
        getText={() => text || ""}
        preferHtmlConversion={true}
        tooltip="Copy code"
        sx={{ position: "absolute", top: 8, right: 8 }}
      />
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
                  <TypingEffect text={lines[index]} speed={15} onComplete={handleLineComplete} />
                  <br />
                </>
              ) : null}
            </React.Fragment>
          ))}
        </pre>
      </Box>
    </Box>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   Main
────────────────────────────────────────────────────────────────────────── */

export default function NeedMoreGuide({ assignmentId, assignment, open, setOpen }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showStepDetails, setShowStepDetails] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const hasFetchedData = useRef(false);
  const containerRef = useRef(null);
  const [animationComplete, setAnimationComplete] = useState({
    stepExplanation: false,
    concepts: false,
    tools: false,
    understanding: false,
    introduction: false,
    body: false,
    conclusion: false,
  });
  const [isApproach, setIsApproach] = useState(false);

  useEffect(() => {
    if (assignmentId && open && !hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchData();
    }
  }, [assignmentId, open]);

  useEffect(() => {
    setAnimationComplete((prev) => ({ ...prev, stepExplanation: false }));
  }, [stepIndex]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = assignment?.assignment_approach
        ? assignment?.assignment_approach
        : assignment?.assignment_guide;

      if (assignment?.assignment_approach) setIsApproach(true);

      const parsedData = typeof response === "string" ? JSON?.parse(response) : response;
      setData(parsedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

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

  /* ────────────────────────────────────────────────────────────────────────
     Build a single full text for “Copy All”
  ──────────────────────────────────────────────────────────────────────── */
  const buildCopyAllText = () => {
    if (!data) return "";

    const parts = [];

    if (isApproach) {
      // Approach content
      if (data.Understanding_and_structuring_the_answer) {
        parts.push(`# Understanding and Structuring the Answer`);
        const t = data.Understanding_and_structuring_the_answer;
        parts.push(looksLikeHtml(t) ? htmlToMarkdown(t) : t);
      }

      if (Array.isArray(data.Introduction) && data.Introduction.length) {
        parts.push(`# Introduction`);
        parts.push(
          data.Introduction
            .map((item) => {
              const txt = looksLikeHtml(item) ? htmlToMarkdown(item) : item;
              return `- ${txt}`;
            })
            .join("\n")
        );
      }

      if (Array.isArray(data.Body) && data.Body.length) {
        parts.push(`# Body`);
        parts.push(
          data.Body
            .map((item) => {
              const txt = looksLikeHtml(item) ? htmlToMarkdown(item) : item;
              return `- ${txt}`;
            })
            .join("\n")
        );
      }

      if (data.conclusion) {
        parts.push(`# Conclusion`);
        const t = data.conclusion;
        parts.push(looksLikeHtml(t) ? htmlToMarkdown(t) : t);
      }
    } else {
      // Guidance content
      if (Array.isArray(data.steps_with_context) && data.steps_with_context.length) {
        parts.push(`# Steps with Context`);
        data.steps_with_context.forEach((step, i) => {
          const title = step?.step ? stripAll(step.step) : `Step ${i + 1}`;
          parts.push(`## Step ${i + 1}: ${title}`);
          const desc = step?.description || "";
          parts.push(looksLikeHtml(desc) ? htmlToMarkdown(desc) : desc);
        });
      }

      if (data.code_snippets_or_examples) {
        parts.push(`# Code Snippets or Examples`);
        const code = data.code_snippets_or_examples;
        // if it looks like HTML, convert to markdown-ish;
        // if it looks like code without tags, keep as fenced block
        if (looksLikeHtml(code)) {
          parts.push(htmlToMarkdown(code));
        } else {
          parts.push("```\n" + code + "\n```");
        }
      }

      if (Array.isArray(data.concepts_and_knowledge_required) && data.concepts_and_knowledge_required.length) {
        parts.push(`# Concepts And Knowledge Required`);
        parts.push(
          data.concepts_and_knowledge_required
            .map((item) => `- ${looksLikeHtml(item) ? htmlToMarkdown(item) : item}`)
            .join("\n")
        );
      }

      if (Array.isArray(data.technology_or_tools_options) && data.technology_or_tools_options.length) {
        parts.push(`# Technology Or Tools Options`);
        parts.push(
          data.technology_or_tools_options
            .map((item) => `- ${looksLikeHtml(item) ? htmlToMarkdown(item) : item}`)
            .join("\n")
        );
      }
    }

    return parts.join("\n\n").trim();
  };

  // Step carousel
  const renderCarousel = (steps) => (
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
          "&:hover": { backgroundColor: "transparent" },
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
            onClick={() => handleStepClick(index)}
            sx={{
              minWidth: "150px",
              maxWidth: "180px",
              p: 2,
              textAlign: "center",
              whiteSpace: "pre-wrap",
              borderRadius: 2,
              backgroundColor: stepIndex === index ? "#090909 !important" : "#222",
              color: stepIndex === index ? "#fff" : "#000000",
              "&:hover": { cursor: "pointer", backgroundColor: "#090909", color: "#FFF" },
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
              {step?.step?.trim()}
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
          "&:hover": { backgroundColor: "transparent" },
          cursor: "pointer",
        }}
      >
        <CiCircleChevRight />
      </IconButton>
    </Box>
  );

  const renderContent = () => {
    if (!data) return null;
    const currentStepDesc = data.steps_with_context?.[stepIndex]?.description || "";

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.steps_with_context && (
          <Box mt={4}>
            <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px" }}>
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
                  position: "relative",
                }}
              >
                {/* Copy only this step explanation */}
                <CopyButton
                  getText={() => currentStepDesc}
                  preferHtmlConversion={true}
                  tooltip="Copy explanation"
                  sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#1f1f1f", color: "#fff" }}
                />

                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
                  Explanation of Step {stepIndex + 1}
                </Typography>
                <Typography variant="body2">
                  <TypingEffect
                    text={currentStepDesc}
                    color={"#fff"}
                    speed={10}
                    onComplete={() => setAnimationComplete((prev) => ({ ...prev, stepExplanation: true }))}
                  />
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {data.code_snippets_or_examples && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px" }}>
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

        {data.concepts_and_knowledge_required && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px" }}>
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
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.concepts_and_knowledge_required.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect
                        text={item}
                        speed={20}
                        onComplete={() => {
                          if (index === data.concepts_and_knowledge_required.length - 1) {
                            setAnimationComplete((prev) => ({ ...prev, concepts: true }));
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

        {data.technology_or_tools_options && animationComplete.concepts && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px" }}>
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
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px" }}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.technology_or_tools_options.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect
                        text={item}
                        speed={20}
                        onComplete={() => {
                          if (index === data.technology_or_tools_options.length - 1) {
                            setAnimationComplete((prev) => ({ ...prev, tools: true }));
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

  const renderApproachContent = () => {
    if (!data) return null;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.Understanding_and_structuring_the_answer && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px", mt: 4 }}>
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
              Understanding and Structuring the Answer
            </Typography>
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px", position: "relative" }}>
              <CopyButton
                getText={() => data.Understanding_and_structuring_the_answer || ""}
                preferHtmlConversion={true}
                tooltip="Copy section"
                sx={{ position: "absolute", top: 8, right: 8 }}
              />
              <Typography variant="body2">
                <TypingEffect
                  text={data.Understanding_and_structuring_the_answer}
                  speed={15}
                  onComplete={() => setAnimationComplete((prev) => ({ ...prev, understanding: true }))}
                />
              </Typography>
            </Box>
          </Box>
        )}

        {data.Introduction && animationComplete.understanding && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px", animation: "fadeIn 0.5s ease" }}>
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
              Introduction
            </Typography>
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px", position: "relative" }}>
              <CopyButton
                getText={() => (Array.isArray(data.Introduction) ? data.Introduction.join("\n") : "")}
                preferHtmlConversion={true}
                tooltip="Copy list"
                sx={{ position: "absolute", top: 8, right: 8 }}
              />
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.Introduction.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect
                        text={item}
                        speed={20}
                        onComplete={() => {
                          if (index === data.Introduction.length - 1) {
                            setAnimationComplete((prev) => ({ ...prev, introduction: true }));
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

        {data.Body && animationComplete.introduction && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px", animation: "fadeIn 0.5s ease" }}>
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
              Body
            </Typography>
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px", position: "relative" }}>
              <CopyButton
                getText={() => (Array.isArray(data.Body) ? data.Body.join("\n") : "")}
                preferHtmlConversion={true}
                tooltip="Copy list"
                sx={{ position: "absolute", top: 8, right: 8 }}
              />
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {data.Body.map((item, index) => (
                  <li key={index} style={{ opacity: 0, animation: `fadeIn 0.5s ease forwards ${index * 0.3}s` }}>
                    <Typography variant="body2">
                      <TypingEffect
                        text={item}
                        speed={20}
                        onComplete={() => {
                          if (index === data.Body.length - 1) {
                            setAnimationComplete((prev) => ({ ...prev, body: true }));
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

        {data.conclusion && animationComplete.body && (
          <Box sx={{ backgroundColor: "#F3F5F7 !important", borderRadius: "12px", p: "12px", animation: "fadeIn 0.5s ease" }}>
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
              Conclusion
            </Typography>
            <Box sx={{ backgroundColor: "#FFFFFF", p: "5.68px 9.1px", borderRadius: "6.82px", position: "relative" }}>
              <CopyButton
                getText={() => data.conclusion || ""}
                preferHtmlConversion={true}
                tooltip="Copy conclusion"
                sx={{ position: "absolute", top: 8, right: 8 }}
              />
              <Typography variant="body2">
                <TypingEffect
                  text={data.conclusion}
                  speed={15}
                  onComplete={() => setAnimationComplete((prev) => ({ ...prev, conclusion: true }))}
                />
              </Typography>
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
        "& .MuiPaper-root": { bgcolor: "#fff" },
        "@keyframes fadeIn": { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "18px",
          backgroundColor: "#222",
          color: "#fff",
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TbArrowGuide style={{ fontSize: 24 }} />
        {isApproach ? "Approach" : "Guidance"}
        {/* ⬅️ Copy All button (top-right) */}
        <Box sx={{ ml: "auto" }}>
          <CopyButton
            getText={buildCopyAllText}
            preferHtmlConversion={true}
            tooltip="Copy All"
            sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff" }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: "#fff" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <CircularProgress />
          </Box>
        ) : isApproach ? (
          renderApproachContent()
        ) : (
          renderContent()
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: "#fff" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ backgroundColor: "#222", color: "#fff", "&:hover": { backgroundColor: "#000" } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
