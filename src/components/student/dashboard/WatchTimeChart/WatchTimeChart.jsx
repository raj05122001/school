import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiSandsOfTime } from "react-icons/gi";
import { getMySubject, getMySubjectWatchtime } from "@/api/apiHelper";

function WatchTimeChart() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [watchtimeData, setWatchtimeData] = useState(null);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  // Fetch subjects when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getMySubject();
        if (response.success) {
          setSubjects(response.data);
          // Optionally select the first subject by default
          if (response.data.length > 0) {
            setSelectedSubject(response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch watchtime data when a subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const fetchWatchtime = async () => {
        try {
          const response = await getMySubjectWatchtime(selectedSubject);
          if (response.success) {
            setWatchtimeData(response.data);
          }
        } catch (error) {
          console.error("Error fetching watchtime data:", error);
        }
      };
      fetchWatchtime();
    }
  }, [selectedSubject]);

  const handleChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // Prepare data for the PieChart component based on watchtimeData
  const data = watchtimeData
    ? [
        {
          name: "Watched",
          value: watchtimeData.watched_minutes,
          color: "#4caf50",
        },
        {
          name: "Pending",
          value: watchtimeData.pending_minutes,
          color: "#f44336",
        },
      ]
    : [];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
        overflow: "hidden",
      }}
      className="blur_effect_card"
    >
      <Typography
        variant="h6"
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        sx={{ marginBottom: "4px", textAlign: "center" }}
      >
        <GiSandsOfTime
          style={{ color: isDarkMode ? "dark-heading" : "light-heading" }}
        />{" "}
        Lecture Watch Time
      </Typography>

      {/* Dropdown and Legends Row */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={2}
        sx={{ width: "100%",overflow: "hidden",
      whiteSpace: "nowrap",  }}
      >
        {/* Dropdown */}
        <Select
          value={selectedSubject}
          onChange={handleChange}
          sx={{
            minWidth:"150px",
            maxWidth: "200px", // Restrict max width to prevent overflow
            marginRight: 2,
            color: isDarkMode ? "#d7e4fc" : "", // Sets the selected value text color to white
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkMode ? "#d7e4fc" : "", // Changes the border color to white
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDarkMode ? "#d7e4fc" : "", // Keeps the border white when focused
            },
            "& .MuiSvgIcon-root": {
              color: isDarkMode ? "#d7e4fc" : "", // Changes the dropdown icon color to white
            },
          }}
        >
          {subjects?.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name.length > 20
                ? `${subject.name.slice(0, 20)}...`
                : subject.name}
            </MenuItem>
          ))}
        </Select>

        {/* Legends */}
        <Box
          display="flex"
          alignItems="center"       
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
        >
          <Box display="flex" alignItems="center" mr={2}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                marginRight: 0.5,
              }}
            />
            <Typography variant="body2">Watched</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#f44336",
                borderRadius: "50%",
                marginRight: 0.5,
              }}
            />
            <Typography variant="body2">Pending</Typography>
          </Box>
        </Box>
      </Box>

      {/* Donut Chart */}
      <Box position="relative" width="300px" height="200px">
        <PieChart width={300} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={0.5}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        {watchtimeData && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: "translate(-50%, -50%)",
              fontSize: "18px",
              color: isDarkMode ? "#d7e4fc" : "#000",
            }}
          >
            {`${watchtimeData.progress_percentage.toFixed(2)}%`}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default WatchTimeChart;
