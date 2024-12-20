import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Avatar, Box, Skeleton } from "@mui/material";
import { FaTrophy, FaCircle } from "react-icons/fa";
import { getClassAssignment } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";

const ClassAssignment = ({selectedOptions}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  useEffect(() => {
    if(selectedOptions?.id){
    fetchClassAssignment();
  }
  }, [selectedOptions]);

  const fetchClassAssignment = async () => {
    setLoading(true);
    try {
      const response = await getClassAssignment(selectedOptions?.id);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Left Card */}
      <Grid item xs={12} sm={7}>
        <Card
          variant="outlined"
          sx={{
            padding: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
          }}
          className="blur_effect_card"
        >
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
                <Typography variant="h6" gutterBottom color={primaryColor}>
                  Overall Class Score
                </Typography>
                {loading ? (
                  <>
                    <Skeleton variant="text" width={80} height={40} />
                    <Skeleton variant="text" width={60} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {data?.over_all_class_score || 0}
                    </Typography>
                    <Typography variant="body2" color={secondaryColor}>
                      Average Grade
                    </Typography>
                    <Typography variant="body1" color={secondaryColor}>
                      {data?.average_grade || 0}
                    </Typography>
                  </>
                )}
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
                {loading ? (
                  <Skeleton variant="circular" width={100} height={100} />
                ) : (
                  <FaTrophy size={100} color="green" />
                )}
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
                <Typography variant="h6" gutterBottom color={primaryColor}>
                  Work Assigned
                </Typography>
                {loading ? (
                  <>
                    <Skeleton variant="text" width={80} height={40} />
                    <Skeleton variant="text" width={60} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {data?.total_assignments || 0}
                    </Typography>
                    <Typography variant="body2" color={secondaryColor}>
                      Average Percentage
                    </Typography>
                    <Typography variant="body1" color={secondaryColor}>
                      {data?.average_percentage || 0}%
                    </Typography>
                  </>
                )}
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
                {loading ? (
                  <Skeleton variant="circular" width={100} height={100} />
                ) : (
                  <BubblePattern />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Right Cards */}
      <Grid item xs={12} container sm={5} spacing={2}>
        {[0, 50, 80]?.map((range, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              sx={{
                backgroundColor:
                  index === 0 ? "#f2757d" : index === 1 ? "#ffcc73" : "#86e28a",
                padding: 2,
                textAlign: "center",
                borderRadius: 2,
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <Skeleton variant="text" width={40} height={40} />
              ) : (
                <Typography variant="h4" fontWeight="bold">
                  {(index === 0
                    ? data?.student_counts?.range_0_50
                    : index === 1
                    ? data?.student_counts?.range_50_80
                    : data?.student_counts?.range_80_100) || 0}
                </Typography>
              )}
              <Typography variant="body2">
                {index === 0
                  ? "Assignment Range 0 To 50"
                  : index === 1
                  ? "Assignment Range 50 To 80"
                  : "Assignment Range 80 To 100"}
              </Typography>
            </Box>
          </Grid>
        ))}
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
    ]?.map((bubble, index) => (
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
