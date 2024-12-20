import React, { useEffect, useState } from "react";
import { postFeedback, updateFeedback } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import {
  FaRegSadCry,
  FaRegFrown,
  FaRegMeh,
  FaRegSmile,
  FaRegGrinStars,
} from "react-icons/fa";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import Cookies from "js-cookie";

const feedbackOptions = [
  {
    icon: FaRegSadCry,
    text: "Below Average",
    value: "Below Average",
    color: "#e57373",
  },
  { icon: FaRegFrown, text: "Average", value: "Average", color: "#ffb74d" },
  {
    icon: FaRegMeh,
    text: "Above Average",
    value: "Above Average",
    color: "#fff176",
  },
  { icon: FaRegSmile, text: "Good", value: "Good", color: "#81c784" },
  {
    icon: FaRegGrinStars,
    text: "Very Good",
    value: "Very Good",
    color: "#64b5f6",
  },
];

const Feedback = ({ lectureId, data, fetchgetFeedback }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [selected, setSelected] = useState(data?.average_feedback_parameter);

  useEffect(() => {
    setSelected(data?.average_feedback_parameter);
  }, [lectureId, data]);

  const onSubmitFeedback = async (value) => {
    const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
    const studentID = userDetails?.student_id;

    const formData = {
      lecture: Number(lectureId),
      feedback_parameter: value,
      made_by: Number(studentID),
      feedback_comment: "",
    };

    try {
      setSelected(value);
      if (data?.["average_feedback_parameter"]) {
        await updateFeedback(lectureId, formData);
        fetchgetFeedback();
      } else {
        await postFeedback(formData);
        fetchgetFeedback();
      }
    } catch (error) {
      setSelected(null);
      return Error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: primaryColor }}
        >
          How was the lecture?
        </Typography>
        <Typography variant="body2" sx={{ color: secondaryColor, mt: 1 }}>
          Your feedback matters! Choose an emoji to let us know how the lecture
          went.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
        {feedbackOptions?.map(({ icon: Icon, text, color, value }, index) => (
          <Tooltip key={index} title={text} arrow>
            <IconButton
              onClick={() => onSubmitFeedback(value)}
              sx={{
                backgroundColor:
                  value === selected
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.2)"
                      : "grey.300"
                    : "transparent",
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s, background-color 0.3s",
                "&:hover": {
                  transform: "scale(1.2)",
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "grey.200",
                },
              }}
            >
              <Icon style={{ color: color, fontSize: "2rem" }} />
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default Feedback;
