import { Box, Typography } from "@mui/material";
import React from "react";
import MathJax from "react-mathjax2";

const TextWithMath = ({ text }) => {
  // Ensure `text` is an array
  const isArray = Array.isArray(text);
  const textArray = isArray ? text : [text];

  // Updated regex to match LaTeX expressions in \[...\]
  const latexRegex = /\\\[([\s\S]*?)\\\]/g;

  // Function to replace bold text in plain text and remove newlines inside LaTeX
  const replaceString = (data) => {
    return data
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\n/g, "<br>"); // New lines outside LaTeX
  };

  // Function to process and render text with LaTeX expressions
  const processText = (part) => {
    const chunks = part.split(latexRegex).filter(Boolean);
    return chunks?.map((chunk, i) => {
      if (i % 2 === 1) {
        const cleanedLatex = chunk.replace(/\n/g, " "); // Replace newlines inside LaTeX with spaces
        return (
          <Typography
            variant="span"
            sx={{ fontSize: "1.25rem", lineHeight: "1.75rem" }}
            key={i}
          >
            <MathJax.Node key={i} inline>
              {cleanedLatex}
            </MathJax.Node>
          </Typography>
        );
      } else {
        // Non-LaTeX content, replace bold syntax
        return (
          <Typography
            variant="span"
            key={i}
            dangerouslySetInnerHTML={{ __html: replaceString(chunk) }}
          />
        );
      }
    });
  };

  return (
    <MathJax.Context input="tex">
      <Box>
        {textArray?.map((part, index) => (
          <Box key={index}>{processText(part)}</Box>
        ))}
      </Box>
    </MathJax.Context>
  );
};

export default TextWithMath;
