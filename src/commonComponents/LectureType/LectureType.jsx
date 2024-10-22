import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useThemeContext } from "@/hooks/ThemeContext";

const LectureType = ({ lectureType, isFullScreen = false }) => {
  const { isDarkMode } = useThemeContext();
  const lowerCaseType = lectureType?.toLowerCase();
  const lectureStyle = LectureTyps[lowerCaseType]?.style;

  // Convert hex to RGBA
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Conditionally apply light/dark mode styles
  const bgColor = lectureStyle?.bg
    ? hexToRgba(lectureStyle.bg, lectureStyle.op / 100)
    : "transparent";

  const textColor = isDarkMode
    ? lectureStyle?.darkText || "white"
    : lectureStyle?.lightText || "black";

  const darkModeBg = isDarkMode ? lectureStyle?.darkBg || "#333" : bgColor;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        px: "0.5rem",
        py: "0.25rem",
        borderRadius: "0.375rem",
        minWidth: "fit-content",
        backgroundColor: darkModeBg,
        color: textColor,
        width: isFullScreen ? "100%" : "auto",
      }}
    >
      {lectureType && LectureTyps[lowerCaseType]?.image && (
        <Image
          src={LectureTyps[lowerCaseType]?.image}
          alt={lectureType}
          width={20}
          height={20}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          textTransform: "capitalize",
          fontSize: "12px",
        }}
      >
        {LectureTyps[lowerCaseType]?.name}
      </Typography>
    </Box>
  );
};

export default LectureType;

export const LectureTyps = {
  subject: {
    image: "/subject.svg",
    styles: {
      background:
        "linear-gradient(to right, rgba(201,153,65,0.5), rgba(248,235,131,1), rgba(201,153,65,0.5))",
      color: "#99650C",
    },
    name: "Subject",
    style: { bg: "#c99941", text: "#99650C", op: 40 },
  },
  case: {
    image: "/case.svg",
    styles: {
      backgroundColor: "rgba(209,255,189,0.5)",
      color: "#00562B",
    },
    name: "Case Study",
    style: { bg: "#d1ffbd", text: "#00562B", op: 50 },
  },
  qa: {
    image: "/qa.svg",
    styles: {
      backgroundColor: "rgba(0,100,207,0.1)",
      color: "#0064CF",
    },
    name: "Q/A Session",
    style: { bg: "#0064CF", text: "#0064CF", op: 10 },
  },
  workshop: {
    image: "/workshop.svg",
    styles: {
      backgroundColor: "rgba(227,76,0,0.1)",
      color: "#E34C00",
    },
    name: "Workshop",
    style: { bg: "#E34C00", text: "#E34C00", op: 10 },
  },
  quiz: {
    image: "/quiz.svg",
    styles: {
      backgroundColor: "rgba(222,0,0,0.1)",
      color: "#DE0000",
    },
    name: "Quiz Session",
    style: { bg: "#DE0000", text: "#DE0000", op: 10 },
  },
};
