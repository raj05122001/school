import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import {
  FaLinkedin,
  FaFacebook,
  FaFileAlt,
  FaCopy,
  FaRegCopy,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  getBreakpoint,
  generateContent,
  generateArticle,
} from "@/api/apiHelper";

const Articles = ({ lectureId }) => {
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [dots, setDots] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState("");

  useEffect(() => {
    getBreakPoint();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots % 4) + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const getBreakPoint = async () => {
    try {
      const apiResponse = await getBreakpoint(lectureId);
      const breakPoint = JSON.parse(apiResponse?.data?.data?.break_point);
      const mergedSummary = breakPoint?.reduce(
        (acc, bp) => acc + bp.summary + "\n",
        ""
      );
      setText(mergedSummary);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("text", text);
      const response = await generateArticle(fd);
      const newArticle = response.data.data.article;
      setCopiedItem(newArticle);
      const processedArticle = processArticleContent(newArticle);
      setArticle(processedArticle);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (platform) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("text", text);
      fd.append("platform", platform);
      const response = await generateContent(fd);
      const newContent = response.data.data.content;
      setCopiedItem(newContent);
      const processedContent = processArticleContent(newContent);
      setArticle(processedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const processArticleContent = (content) => {
    const lines = content?.split("\n");
    const headingRegex = /^(###|####|#####)\s+/;
    const boldRegex = /\*\*(.*?)\*\*/g;

    return lines?.map((line, index) => {
      const formattedLine = line?.replace(
        boldRegex,
        (match, p1) => `<strong>${p1}</strong>`
      );
      if (headingRegex.test(line)) {
        return (
          <Typography key={index} variant="h6" sx={{ mt: 2 }}>
            {formattedLine?.replace(headingRegex, "")}
          </Typography>
        );
      } else {
        return (
          <Typography
            key={index}
            component="p"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copiedItem);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      className="blur_effect_card"
    >
      <Typography variant="h6" color="primary">
        Generate Content
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={fetchArticle}
          startIcon={<FaFileAlt />}
          fullWidth
        >
          Article
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0072b1",
            ":hover": { backgroundColor: "#005582" },
          }}
          onClick={() => fetchContent("LinkedIn")}
          startIcon={<FaLinkedin />}
          fullWidth
        >
          LinkedIn
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3b5998",
            ":hover": { backgroundColor: "#2d4373" },
          }}
          onClick={() => fetchContent("Facebook")}
          startIcon={<FaFacebook />}
          fullWidth
        >
          Facebook
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            ":hover": { backgroundColor: "#333" },
          }}
          onClick={() => fetchContent("Twitter")}
          startIcon={<FaXTwitter />}
          fullWidth
        >
          Twitter
        </Button>
      </Box>
      <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
        {loading ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ fontWeight: "bold" }}
          >
            Preparing Your Content {".".repeat(dots)}
            <CircularProgress size={20} sx={{ ml: 1 }} />
          </Box>
        ) : (
          <Typography
            color="text.primary"
            component="div"
            sx={{ textAlign: "justify", lineHeight: 1.6, mt: 2 }}
          >
            {article}
            {article && (
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                startIcon={isCopied ? <FaCopy /> : <FaRegCopy />}
                onClick={handleCopy}
              >
                {isCopied ? "Copied" : "Copy"}
              </Button>
            )}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Articles;
