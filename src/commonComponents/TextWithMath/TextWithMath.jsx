import { Box, Typography } from "@mui/material";
import React from "react";
import MathJax from "react-mathjax2";

const TextWithMath = ({ text, color, isShow = false, textStyle = {} }) => {
  const isArray = Array.isArray(text);
  const textArray = isArray ? text : [text];
  // Combined regex to match $$...$$ or \[...\]
  const combinedRegex = /(\$\$([\s\S]+?)\$\$|\\\[\s*([\s\S]+?)\s*\\\])/g;

  const replaceString = (data) => {
    return data
      ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      ?.replace(/#/g, "")
      ?.replace(/`/g, "")
      ?.replace(/(?<!\d)\. /g, ".<br>")
      ?.replace(/\\\\n\\\\n/g, "<br><br>")
      ?.replace(/\\\n\\\n/g, "<br><br>")
      ?.replace(/\\n\\n/g, "<br><br>")
      ?.replace(/\n\n/g, "<br><br>")
      ?.replace(/\\\\n/g, "<br>")
      ?.replace(/\\\n/g, "<br>")
      ?.replace(/\\n/g, "<br>")
      ?.replace(/\n/g, "<br>")
      ?.replace(/\\(.?)\\*/g, "<strong>$1</strong>")
      ?.replace(/\\/g, "")
      ?.replace(/\\\\/g, "");
  };

  const processText = (part) => {
    const elements = [];
    let lastIndex = 0;

    part?.replace(combinedRegex, (match, p1, p2, p3, offset) => {
      // Add the text before the LaTeX expression
      if (lastIndex < offset) {
        const textBefore = part?.substring(lastIndex, offset);
        elements.push(
          <Typography
            variant="span"
            key={`${offset}-text`}
            sx={{
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: "500",
              lineHeight: "18px",
              letterSpacing: "-0.42px",
              color:
                color === "red"
                  ? "red"
                  : color === "green"
                  ? "green"
                  : "#3B3D3B",

              ...textStyle,
            }}
            dangerouslySetInnerHTML={{ __html: replaceString(textBefore) }}
          />
        );
      }
      if (isShow) {
        console.log(color);
      }

      // Determine which LaTeX delimiter was used
      const latexContent = p2 || p3;
      if (latexContent) {
        const cleanedLatex = latexContent
          ?.replace(/\n/g, " ")
          ?.replace(/\\\\/g, "\\");
        elements.push(
          <Typography
            variant="span"
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "18px",
              letterSpacing: "-0.42px",
              fontFamily: "Inter",
              color:
                color === "red"
                  ? "red"
                  : color === "green"
                  ? "green"
                  : "#3B3D3B",
              ...textStyle,
            }}
            key={`${offset}-math`}
          >
            <MathJax.Node inline key={`${offset}-math-node`}>
              {cleanedLatex}
            </MathJax.Node>
          </Typography>
        );
      }

      lastIndex = offset + match.length;
      return match;
    });

    // Add any remaining text after the last LaTeX expression
    if (lastIndex < part?.length) {
      const remainingText = part?.substring(lastIndex);
      elements.push(
        <Typography
          variant="span"
          key={`remaining-text`}
          dangerouslySetInnerHTML={{ __html: replaceString(remainingText) }}
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "18px",
            letterSpacing: "-0.42px",
            fontFamily: "Inter",
            color:
              color === "red" ? "red" : color === "green" ? "green" : "#3B3D3B",
            ...textStyle,
          }}
        />
      );
    }

    return elements;
  };

  return (
    <MathJax.Context input="tex">
      <Box
        sx={{
          color: color === "red" ? "red" : color === "green" ? "green" : "",
        }}
      >
        {textArray?.map((part, index) => (
          <Box key={index}>{processText(part)}</Box>
        ))}
      </Box>
    </MathJax.Context>
  );
};

export default TextWithMath;

// import { Box, Typography } from "@mui/material";
// import React from "react";
// import MathJax from "react-mathjax2";

// const TextWithMath = ({ text }) => {
//   const isArray = Array.isArray(text);
//   const textArray = isArray ? text : [text];

//   const latexRegex = /\\\[([\s\S]*?)\\\]/g;
//   const combinedRegex = /(\$\$(.*?)\$\$|\\\[([\s\S]*?)\\\])/g;

//   const replaceString = (data) => {
//     return data
//       .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\\(.?)\\*/g, "<strong>$1</strong>")
//       .replace(/#/g, "")
//       .replace(/`/g, "")
//       .replace(/(?<!\d)\. /g, ".<br>")
//       .replace(/\n/g, "<br>")
//       .replace(/\\/g, "")
//       .replace(/\\\\/g, "")
//       .replace(/:/g, " :<br><br>");
//   };

//   const processText = (part) => {
//     const chunks = part.split(latexRegex).filter(Boolean);
//     return chunks?.map((chunk, i) => {
//       if (i % 2 === 1) {
//         const cleanedLatex = chunk.replace(/\n/g, " ").replace(/\\\\/g, "\\");
//         return (
//           <Typography
//             variant="span"
//             sx={{ fontSize: "1rem", lineHeight: "1rem" }}
//             key={i}
//           >
//             <MathJax.Node key={i} inline>
//               {cleanedLatex}
//             </MathJax.Node>
//           </Typography>
//         );
//       } else {
//         return (
//           <Typography
//             variant="span"
//             key={i}
//             dangerouslySetInnerHTML={{ __html: replaceString(chunk) }}
//           />
//         );
//       }
//     });
//   };

//   return (
//     <MathJax.Context input="tex">
//       <Box>
//         {textArray?.map((part, index) => (
//           <Box key={index}>{processText(part)}</Box>
//         ))}
//       </Box>
//     </MathJax.Context>
//   );
// };

// export default TextWithMath;
