import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import { GiBallPyramid } from "react-icons/gi";
import { getMyRank } from "@/api/apiHelper";

function MyRank() {
  const { isDarkMode } = useThemeContext();
  const [myGrade, setMyGrade] = useState(null);
  const [otherCounts, setOtherCounts] = useState({}); // A/B/C/D/E bucket stats

  const fetchMyRank = async () => {
    try {
      const response = await getMyRank();
      if (response?.success) {
        setMyGrade(response?.data?.grade ?? null);
        setOtherCounts(response?.data?.other_grade_count ?? {});
      }
    } catch (error) {
      console.error("Error fetching Grade", error);
    }
  };

  useEffect(() => {
    fetchMyRank();
  }, []);

  // Funnel slices with an explicit gradeKey used by tooltip
  const data = [
    { gradeKey: "A", name: "A (80-100%)", value: 100, fill: "#228B22" },
    { gradeKey: "B", name: "B (60-80%)", value: 80,  fill: "#F4BB44" },
    { gradeKey: "C", name: "C (40-60%)", value: 60,  fill: "#FF7518" },
    { gradeKey: "D", name: "D (20-40%)", value: 40,  fill: "#E35335" },
    { gradeKey: "E", name: "E (0-20%)",  value: 20,  fill: "#8B0000" },
  ];

  const getMyGradeMeta = (g) => {
    if (g === "A") return { label: "Grade A (80-100%)", color: "#228B22" };
    if (g === "B") return { label: "Grade B (60-80%)", color: "#F4BB44" };
    if (g === "C") return { label: "Grade C (40-60%)", color: "#FF7518" };
    if (g === "D") return { label: "Grade D (20-40%)", color: "#E35335" };
    return { label: "Grade E (0-20%)", color: "#8B0000" };
  };
  const { label: gradeLabel, color: gradeColor } = getMyGradeMeta(myGrade);

  return (
    <Box sx={{ width: "100%", p: 2, height: "100%" }} className="blur_effect_card">
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
        className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
      >
        <GiBallPyramid style={{ color: isDarkMode ? "#F0EAD6" : "#36454F" }} />{" "}
        My Rank
      </Typography>

      <Box sx={{ display: "flex", mb: 2, flexDirection: "row", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" ml={4}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: gradeColor,
              mr: 1,
            }}
          />
          <Typography
            variant="body1"
            sx={{ color: isDarkMode ? "#F0EAD6" : "#36454F", fontWeight: "bold" }}
          >
            My Grade: {gradeLabel}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: 400 }}>
        <ResponsiveContainer width="60%" height="80%">
          <FunnelChart width={450} height={300}>
            {/* ⬇️ Custom tooltip shows other_grade_count */}
            <ReTooltip
              content={<CustomFunnelTooltip isDarkMode={isDarkMode} otherCounts={otherCounts} />}
            />
            <Funnel dataKey="value" data={data} isAnimationActive width="100%">
              <LabelList
                position="outside"
                fill={isDarkMode ? "#F0EAD6" : "#F0EAD6"}
                stroke="none"
                dataKey="name"
                offset={20}
                style={{ fontSize: 12 }}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

function CustomFunnelTooltip({
  active,
  payload,
  isDarkMode,
  otherCounts,
}) {
  if (!active || !payload || !payload.length) return null;

  const seg = payload[0]?.payload || {};
  const key = seg.gradeKey; // "A" | "B" | ...
  const stats = otherCounts?.[key] || {
    avg_mcq_success_rate: 0,
    avg_assignment_success_rate: 0,
    avg_lecture_success_rate: 0,
    student_count: 0,
  };

  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#ffffff";
  const text = isDarkMode ? "#F0EAD6" : "#36454F";
  const sub = isDarkMode ? "rgba(240,234,214,0.8)" : "rgba(54,69,79,0.8)";

  return (
    <div
      style={{
        background: cardBg,
        border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.12)",
        minWidth: 220,
      }}
    >
      <div style={{ color: text, fontWeight: 700, marginBottom: 6 }}>
        Grade {key}
      </div>
      <div style={{ color: sub, fontSize: 13, marginBottom: 8 }}>
        Students: <b style={{ color: text }}>{stats.student_count ?? 0}</b>
      </div>
      <div style={{ display: "grid", gap: 4, color: sub, fontSize: 13 }}>
        <div>
          MCQ avg: <b style={{ color: text }}>
            {Number(stats.avg_mcq_success_rate ?? 0).toFixed(1)}%
          </b>
        </div>
        <div>
          Assignment avg: <b style={{ color: text }}>
            {Number(stats.avg_assignment_success_rate ?? 0).toFixed(1)}%
          </b>
        </div>
        <div>
          Lecture avg: <b style={{ color: text }}>
            {Number(stats.avg_lecture_success_rate ?? 0).toFixed(1)}%
          </b>
        </div>
      </div>
    </div>
  );
}

export default MyRank;
