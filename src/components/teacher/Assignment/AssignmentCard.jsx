import React, { useRef, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  MdOutlineDateRange,
  MdCheckCircle,
  MdPending,
  MdOutlineTopic,
  MdOutlinePending,
} from "react-icons/md";
import LectureType from "@/commonComponents/LectureType/LectureType";
import { Varela_Round } from "next/font/google";
import { LuDot } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const varelaRound = Varela_Round({ weight: "400", subsets: ["latin"] });

const AssignmentCard = ({ data, onClick }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  return (
    <Box
      p={2}
      sx={{ width: "100%", height: "100%" }}
      onClick={() => onClick(data?.id)}
    >
      <Card
        // className="blur_effect_card"
        sx={{
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 6px 10px #ADD8E6",
          borderColor: isDarkMode ? "#555" : "#ddd",
          borderRadius: "16px",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: isDarkMode
              ? "0px 8px 30px rgba(255, 255, 255, 0.1)" // Dark mode hover shadow
              : "0px 8px 30px rgba(0, 0, 0, 0.15)", // Light mode hover shadow
          },
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            // p: 3,
            paddingX: 2,
            textAlign: "left",
            height: "100%",
            color: isDarkMode ? "#f1f1f1" : "#000", // Text color based on theme
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              color: primaryColor,
              textAlign: "center",
              fontFamily: varelaRound,
              justifyContent:'center'
            }}
          >
            <MdOutlineTopic size={24}/>
            <Typography variant="h6" >
              {data?.title}
            </Typography>
          </Box>
          <hr />
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontSize: "14px" }}
          >
            <LuDot />
            <strong>Class:</strong> {data?.lecture_class?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontSize: "14px" }}
          >
            <LuDot />
            <strong>Subject:</strong> {data?.chapter?.subject?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontSize: "14px" }}
          >
            <LuDot />
            <strong>Chapter:</strong> {data?.chapter?.chapter}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontSize: "14px" }}
          >
            <LuDot />
            <strong>Total Assignments:</strong>{" "}
            {data?.total_submitted_assignments}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555", fontSize: "14px" }}
          >
            <LuDot />
            <strong>Checked Assignments:</strong> {data?.checked_assignments}
          </Typography>

          {/* <Typography
            variant="body1"
            gutterBottom
            sx={{ color: isDarkMode ? primaryColor : "#555" }}
          >
          <LuDot /><strong>Assignment:</strong>
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IoMdCheckmarkCircleOutline
                  size={20}
                  color={isDarkMode ? "green" : "green"}
                />
                <Typography variant="body1" sx={{ color: primaryColor }}>
                  Completed: {data?.checked_count || 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MdOutlinePending size={20} color={isDarkMode ? "red" : "darkred"} />
                <Typography variant="body1" sx={{ color: primaryColor }}>
                  Pending: {data?.unchecked_count || 0}
                </Typography>
              </Box>
            </Grid>
          </Grid> */}

          <Grid container mt={"auto"} pt={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <MdOutlineDateRange size={22} />
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: isDarkMode ? primaryColor : "#555" }}
                >
                  {data?.schedule_date}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LectureType lectureType={data?.type} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssignmentCard;
