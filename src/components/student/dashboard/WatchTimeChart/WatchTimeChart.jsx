import React, { useState, useEffect } from "react";
import { Tooltip as DropdownTooltip, Box, Typography, Select, MenuItem } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiSandsOfTime } from "react-icons/gi";
import { getMySubject, getMySubjectWatchtime } from "@/api/apiHelper";
import LectureDuration from "@/components/teacher/dashboard/LectureDuration/LectureDuration";
import { useTranslations } from "next-intl";

function WatchTimeChart() {
  const t = useTranslations()
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

  const newData = {
    total_duration:
      Number(watchtimeData?.pending_minutes) +
      Number(watchtimeData?.watched_minutes),
    avg_duration: Number(watchtimeData?.watched_minutes),
  };

  return (
    <Box
      // display="flex"
      // flexDirection="column"
      // alignItems="center"
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
        overflow: "hidden",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between"
      }}
      className="blur_effect_card"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <GiSandsOfTime
            style={{ color: isDarkMode ? "dark-heading" : "light-heading" }}
          />
          <Typography
            variant="h6"
            className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          >
            {t("Watchtime")}
          </Typography>
        </Box>

        {/* Dropdown and Legends Row */}
        <Box display="flex" mb={2} sx={{ whiteSpace: "nowrap" }}>
          {/* Dropdown */}
          <Select
            value={selectedSubject}
            onChange={handleChange}
            sx={{
              minWidth: "150px",
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
              <MenuItem key={subject?.id} value={subject?.id}>
              <DropdownTooltip key={subject?.id} title={subject?.name}>
                {subject?.name?.length > 20
                  ? `${subject?.name?.slice(0, 20)}...`
                  : subject?.name}
              </DropdownTooltip>
                
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LectureDuration averageDuration={newData} />
      </Box>

      <Box
        sx={{
          backgroundColor: "#F3F5F7",
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          padding: "8px",
          gap: "8px",
        }}
      >
        <img src={"/timer.png"} style={{ width: "24px", height: "24px" }} />
        <Typography
          sx={{ fontWeight: 700, fontSize: "16px", color: "#3B3D3B" }}
        >
          Time Remaining
        </Typography>
        <Typography
          sx={{ fontWeight: 500, fontSize: "16px", color: "#3B3D3B" }}
        >
          3hrs 23min
        </Typography>
      </Box>
    </Box>
  );
}

export default WatchTimeChart;
