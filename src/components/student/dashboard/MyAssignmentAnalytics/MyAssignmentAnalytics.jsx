import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { FiBarChart2 } from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { getMyAssignmentAnalytics } from "@/api/apiHelper";
import { GrScorecard } from "react-icons/gr";

const COLORS = ["#00C49F", "#FFBB28"];

const MyAssignmentAnalytics = () => {
  const { isDarkMode } = useThemeContext();
  const [myScores, setMyScores] = useState({})

  const fetchMyScores = async () => {
    try {
      const response = await getMyAssignmentAnalytics();
      if(response.success){
        setMyScores(response?.data)
      }
    } catch(error){
      console.error("Error fetching your score", error)
    }
  }

  useEffect(()=>{
    fetchMyScores()
  }, [])

  const data = [
    { name: "Completed", value: myScores?.completed_assignment },
    { name: "Pending", value: myScores?.total_assignment - myScores?.completed_assignment },
  ];
  
  
  return (
    <Box
      sx={{
        width: "100%",
        p: 4,
        height: "100%",
      }}
      className="blur_effect_card"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          variant="h6"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        >
          <FiBarChart2 size={22} style={{ marginRight: "8px" }} />
          My Assignment Analytics
        </Typography>
        {isDarkMode ? (
          <MdDarkMode style={{ fontSize: "24px", color: "#f0f0f0" }} />
        ) : (
          <MdLightMode style={{ fontSize: "24px", color: "#2b2b2b" }} />
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {/* Left Side - Doughnut Chart */}
        <Box sx={{ width: "50%" }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  fill: isDarkMode ? "#f0f0f0" : "#2b2b2b",
                }}
              >
                {`${myScores?.percentage_of_complitation}%`}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Right Side - Analytics Boxes */}
        <Grid container spacing={2} sx={{ width: "50%", textAlign: "center" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: isDarkMode ? "#555" : "#ddd",
                borderRadius: 8,
                boxShadow: "0px 4px 10px #ADD8E6",
                textAlign: "center",
                color: isDarkMode ? "#F9F6EE" : "#353935"
              }}
            >
              <Typography variant="subtitle1">
                <GrScorecard /> Average Score Percentage
              </Typography>
              <Typography variant="h6">{myScores?.average_scored_percentage}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: isDarkMode ? "#555" : "#ddd",
                borderRadius: 2,
                boxShadow: "0px 4px 10px #ADD8E6",
                borderRadius: 8,
                color: isDarkMode ? "#F9F6EE" : "#353935",
              }}
            >
              <Typography variant="subtitle1">
              <GrScorecard /> Assignments Below 50%
              </Typography>
              <Typography variant="h6">{myScores?.my_assignment_in_which_i_got_less_than_50}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: isDarkMode ? "#555" : "#ddd",
                borderRadius: 2,
                boxShadow: "0px 4px 10px #ADD8E6",
                borderRadius: 8,
                color: isDarkMode ? "#F9F6EE" : "#353935",
              }}
            >
              <Typography variant="subtitle1">
              <GrScorecard /> Assignments Between 50-80%
              </Typography>
              <Typography variant="h6">{myScores?.my_assignment_in_which_i_got_between_than_50_to_80}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: isDarkMode ? "#555" : "#ddd",
                borderRadius: 2,
                boxShadow: "0px 4px 10px #ADD8E6",
                borderRadius: 8,
                color: isDarkMode ? "#F9F6EE" : "#353935",
              }}
            >
              <Typography variant="subtitle1">
              <GrScorecard /> Assignments Between 80-100%
              </Typography>
              <Typography variant="h6">{myScores?.my_assignment_in_which_i_got_between_than_80_to_100}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MyAssignmentAnalytics;
