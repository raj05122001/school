import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import { GiStaryu } from "react-icons/gi";
import { MdStar } from "react-icons/md";
import { useThemeContext } from "@/hooks/ThemeContext";
import Feedback from "./Feedback";
import { getFeedback } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const RatingSection = ({ id, isShowRating = false }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [data, setData] = useState({});
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));

  useEffect(() => {
    fetchgetFeedback();
  }, []);

  const fetchgetFeedback = async () => {
    try {
      const response = await getFeedback(
        id,
        userDetails?.role === "STUDENT" ? userDetails?.student_id : 0
      );
      setData(response?.data);

    } catch (error) {
      console.error(error);
    }
  };

  const totalRatings = [1, 2, 3, 4, 5].reduce((sum, rating) => {
    return sum + (data?.feedback_index?.[`Rating${rating}`] || 0);
  }, 0);

  const getPercentage = (count) => (count / totalRatings) * 100;

  return (
    <Box
      sx={{
        p: 3,
        color: isDarkMode ? "#fff" : "#000",
        width:"100%"
      }}
      className="blur_effect_card"
    >
      <>
        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography variant="h4" color={isDarkMode ? "white" : "black"}>
            Ratings
          </Typography>
          <GiStaryu size={24} color={isDarkMode ? "#FFC107" : "#FFEA00"} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mr: 1 }}
            color={isDarkMode ? "white" : "black"}
          >
            {data?.average_feedback}
          </Typography>
          <MdStar size={44} color="yellow" />
        </Box>
        <Stack spacing={1}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Box key={star} sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ width: 20 }}
                color={isDarkMode ? "gray.300" : "text.primary"}
              >
                {star}
              </Typography>
              <Rating
                name="read-only"
                value={star}
                max={1}
                readOnly
                sx={{ color: isDarkMode ? "#FFC107" : "teal", mr: 1 }}
              />
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getPercentage(data?.feedback_index?.[`Rating${star}`])}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        star === 5
                          ? "#0D8A72"
                          : star === 4
                          ? "#68B2A0"
                          : star === 3
                          ? "#B1D4D1"
                          : star === 2
                          ? "#F4C242"
                          : "#F45B5B",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color={isDarkMode ? "gray.400" : "text.secondary"}
              >
                {data?.feedback_index?.[`Rating${star}`]}
              </Typography>
            </Box>
          ))}
        </Stack>
      </>
      {isShowRating && (
        <>
          <Divider sx={{ borderBottomWidth: 2, my: 2 }} />
          <Feedback lectureId={id} data={data} fetchgetFeedback={fetchgetFeedback}/>
        </>
      )}
    </Box>
  );
};

export default RatingSection;
