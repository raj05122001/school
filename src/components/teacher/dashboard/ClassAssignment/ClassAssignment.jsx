import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Avatar, Box } from "@mui/material";
import { FaTrophy, FaCircle } from "react-icons/fa";
import { getClassAssignment } from "@/api/apiHelper";

const ClassAssignment = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    fetchClassAssignment();
  }, []);
  const fetchClassAssignment = async () => {
    try {
      const response = await getClassAssignment(2);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Grid container spacing={2} mt={2}>
      {/* Left Card */}
      <Grid item xs={12} sm={6}>
        <Card variant="outlined" sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container>
            {/* Overall Class Score */}
            <Grid item xs={12} sm={6} container spacing={2}>
              <Grid
                item
                xs={6}
                container
                direction="column"
                alignItems="flex-start"
              >
                <Typography variant="h6" gutterBottom>
                  Overall Class Score
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  68%
                </Typography>
                <Typography variant="body2">Grade average</Typography>
                <Typography variant="body1" color="textSecondary">
                  71%
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaTrophy size={100} color="green" />
              </Grid>
            </Grid>

            {/* Work Assigned */}
            <Grid item xs={12} sm={6} container spacing={2}>
              <Grid
                item
                xs={6}
                container
                direction="column"
                alignItems="flex-start"
              >
                <Typography variant="h6" gutterBottom>
                  Work Assigned
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  82
                </Typography>
                <Typography variant="body2">Grade average</Typography>
                <Typography variant="body1" color="textSecondary">
                  38%
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BubblePattern />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Right Cards */}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={4}>
            <StudentCard
              bgColor="#86e28a"
              avatarSrc="/path/to/avatar1.png"
              score={5}
              percentage="20%"
              gradeAvg={23}
            />
          </Grid>
          <Grid item xs={4}>
            <StudentCard
              bgColor="#ffcc73"
              avatarSrc="/path/to/avatar2.png"
              score={10}
              percentage="40%"
              gradeAvg={50}
            />
          </Grid>
          <Grid item xs={4}>
            <StudentCard
              bgColor="#f2757d"
              avatarSrc="/path/to/avatar3.png"
              score={5}
              percentage="20%"
              gradeAvg={15}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ClassAssignment;

// Component for the bubble pattern
export const BubblePattern = () => (
  <Box sx={{ position: "relative", width: 100, height: 100 }}>
    {[
      { top: 10, left: 10, size: 30, color: "#a3e635" },
      { top: 20, left: 40, size: 25, color: "#65a30d" },
      { top: 50, left: 20, size: 40, color: "#84cc16" },
      { top: 30, left: 70, size: 35, color: "#eab308" },
      { top: 80, left: 50, size: 25, color: "#ca8a04" },
      { top: 70, left: 90, size: 20, color: "#84cc16" },
      { top: 15, left: 75, size: 15, color: "#84cc16" },
      { top: 60, left: 70, size: 30, color: "#a3e635" },
      { top: 40, left: 100, size: 20, color: "#65a30d" },
    ].map((bubble, index) => (
      <FaCircle
        key={index}
        style={{
          position: "absolute",
          top: bubble.top,
          left: bubble.left,
          fontSize: bubble.size,
          color: bubble.color,
        }}
      />
    ))}
  </Box>
);

// Component for individual student cards
export const StudentCard = ({
  bgColor,
  avatarSrc,
  score,
  percentage,
  gradeAvg,
}) => (
  <Box
    sx={{
      backgroundColor: bgColor,
      padding: 2,
      textAlign: "center",
      borderRadius: 2,
      color: "white",
      height: "100%",
    }}
  >
    <Avatar src={avatarSrc} sx={{ margin: "0 auto" }} />
    <Typography variant="h4" fontWeight="bold">
      {score}
    </Typography>
    <Typography variant="body2">{percentage} of class</Typography>
    <Typography variant="body2">Grade avg: {gradeAvg}%</Typography>
  </Box>
);