import React from "react";
import { Card, CardContent, Skeleton, Grid, Box } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";

const LectureListingCardSkeleton = () => {
  const { isDarkMode } = useThemeContext();
  return (
    <Box p={2}>
      <Card
        className="blur_effect_card"
        sx={{
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
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
        <Skeleton variant="rectangular" width="100%" height={140} />
        <CardContent>
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="text" width="40%" height={25} />
          <Skeleton variant="text" width="80%" height={25} />
          <Skeleton variant="text" width="50%" height={25} />
          <Skeleton variant="text" width="50%" height={25} />
          <Grid container mt={"auto"} pt={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton variant="text" width="10%" height={25} />
                <Skeleton variant="text" width="50%" height={25} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Skeleton variant="text" width="80%" height={25} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LectureListingCardSkeleton;
