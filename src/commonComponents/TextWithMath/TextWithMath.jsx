import { Box, Typography } from "@mui/material";
import React from "react";
import MathJax from "react-mathjax2";

const TextWithMath = ({ text }) => {
  const isArray = Array.isArray(text);
  const textArray = isArray ? text : [text];

  const latexRegex = /\\\[([\s\S]*?)\\\]/g;

  const replaceString = (data) => {
    return data
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\\(.?)\\*/g, "<strong>$1</strong>")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .replace(/(?<!\d)\. /g, ".<br>")
      .replace(/\n/g, "<br>")
      .replace(/\\/g, "")
      .replace(/\\\\/g, "");
  };

  const processText = (part) => {
    const chunks = part.split(latexRegex).filter(Boolean);
    return chunks?.map((chunk, i) => {
      if (i % 2 === 1) {
        const cleanedLatex = chunk.replace(/\n/g, " ").replace(/\\\\/g, "\\");
        return (
          <Typography
            variant="span"
            sx={{ fontSize: "1rem", lineHeight: "1rem" }}
            key={i}
          >
            <MathJax.Node key={i} inline>
              {cleanedLatex}
            </MathJax.Node>
          </Typography>
        );
      } else {
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
