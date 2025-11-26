"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { alpha } from "@mui/material/styles";
import { Collapse, IconButton } from "@mui/material";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TableContainer } from "@mui/material";

const peak_usage = {
  "type": "monthly_peak_usage",
  "month": "October 2025",
  "unit": "daily",
  "data": [
    { "date": "2025-10-01", "total_logins": 246 },
    { "date": "2025-10-02", "total_logins": 200 },
    { "date": "2025-10-03", "total_logins": 260 },
    { "date": "2025-10-04", "total_logins": 270 },
    { "date": "2025-10-05", "total_logins": 255 },
    { "date": "2025-10-06", "total_logins": 289 },
    { "date": "2025-10-07", "total_logins": 310 }
  ],
  "peak_day": "2025-10-06",
  "average_daily_logins": 279
}

const login_frequency = [
  {
    "user_id": 1,
    "name": "Avantika Darshan",
    "total_logins": 134,
    "current_week_logins": 6,
    "previous_week_logins": 8,
    "last_login_date": "2025-10-06T09:45:00"
  },
  {
    "user_id": 2,
    "name": "Hritik Rajput",
    "total_logins": 89,
    "current_week_logins": 3,
    "previous_week_logins": 5,
    "last_login_date": "2025-10-05T21:12:00"
  },
  {
    "user_id": 3,
    "name": "Uma Pandey",
    "total_logins": 176,
    "current_week_logins": 9,
    "previous_week_logins": 10,
    "last_login_date": "2025-10-06T08:32:00"
  },
  {
    "user_id": 4,
    "name": "VidyaAI Student",
    "total_logins": 45,
    "current_week_logins": 2,
    "previous_week_logins": 3,
    "last_login_date": "2025-10-03T19:20:00"
  },
  {
    "user_id": 5,
    "name": "Vikash Singh",
    "total_logins": 208,
    "current_week_logins": 11,
    "previous_week_logins": 7,
    "last_login_date": "2025-10-06T11:15:00"
  },
  {
    "user_id": 6,
    "name": "Kavita Joshi",
    "total_logins": 72,
    "current_week_logins": 5,
    "previous_week_logins": 6,
    "last_login_date": "2025-10-06T06:40:00"
  },
  {
    "user_id": 7,
    "name": "Manish Gupta",
    "total_logins": 156,
    "current_week_logins": 8,
    "previous_week_logins": 10,
    "last_login_date": "2025-10-06T09:50:00"
  },
  {
    "user_id": 8,
    "name": "Ritu Singh",
    "total_logins": 101,
    "current_week_logins": 4,
    "previous_week_logins": 5,
    "last_login_date": "2025-10-04T22:18:00"
  },
  {
    "user_id": 9,
    "name": "Vikram Das",
    "total_logins": 63,
    "current_week_logins": 3,
    "previous_week_logins": 2,
    "last_login_date": "2025-10-05T15:25:00"
  },
  {
    "user_id": 10,
    "name": "Neha Reddy",
    "total_logins": 190,
    "current_week_logins": 10,
    "previous_week_logins": 9,
    "last_login_date": "2025-10-06T12:30:00"
  },
  {
    "user_id": 11,
    "name": "Arjun Nair",
    "total_logins": 54,
    "current_week_logins": 3,
    "previous_week_logins": 1,
    "last_login_date": "2025-10-02T11:05:00"
  },
  {
    "user_id": 12,
    "name": "Pooja Desai",
    "total_logins": 120,
    "current_week_logins": 7,
    "previous_week_logins": 5,
    "last_login_date": "2025-10-06T07:10:00"
  },
  {
    "user_id": 13,
    "name": "Sandeep Yadav",
    "total_logins": 98,
    "current_week_logins": 4,
    "previous_week_logins": 6,
    "last_login_date": "2025-10-05T18:50:00"
  },
  {
    "user_id": 14,
    "name": "Anita Roy",
    "total_logins": 162,
    "current_week_logins": 9,
    "previous_week_logins": 8,
    "last_login_date": "2025-10-06T10:40:00"
  },
  {
    "user_id": 15,
    "name": "Devendra Singh",
    "total_logins": 77,
    "current_week_logins": 4,
    "previous_week_logins": 3,
    "last_login_date": "2025-10-04T20:00:00"
  }
]

/* -------------------- progress_predicted_graph (UPDATED) -------------------- */
const progress_predicted_graph = [
  /* ---- TOP 5 (exact counts for the screenshot) ---- */
  {
    user_id: 1,
    name: "Avantika Darshan",
    weekly_progress: [
      { date: "2025-10-01", grade: "A" }, // Mastered
      { date: "2025-10-02", grade: "B" }, // Mastered
      { date: "2025-10-03", grade: "C" }, // Can be Improved
    ],
    monthly_progress: [
      { date: "2025-10-01", grade: "B" },
      { date: "2025-10-08", grade: "A" },
    ],
  },
  {
    user_id: 2,
    name: "Hritik Rajput",
    weekly_progress: [
      { date: "2025-10-01", grade: "A" }, // Mastered
      { date: "2025-10-02", grade: "B" }, // Mastered
    ],
    monthly_progress: [
      { date: "2025-10-01", grade: "A" },
      { date: "2025-10-08", grade: "A" },
    ],
  },
  {
    user_id: 3,
    name: "Uma Pandey",
    weekly_progress: [
      { date: "2025-10-01", grade: "B" }, // Mastered
      { date: "2025-10-02", grade: "A" }, // Mastered
      { date: "2025-10-03", grade: "C" }, // Can be Improved
    ],
    monthly_progress: [
      { date: "2025-10-01", grade: "B" },
      { date: "2025-10-08", grade: "A" },
    ],
  },
  {
    user_id: 4,
    name: "VidyaAI Student",
    weekly_progress: [
      { date: "2025-10-01", grade: "A" }, // Mastered
      { date: "2025-10-02", grade: "B" }, // Mastered
      { date: "2025-10-03", grade: "A" }, // Mastered
      { date: "2025-10-04", grade: "B" }, // Mastered  -> total 4
      { date: "2025-10-05", grade: "C" }, // Improve   -> total 1
      { date: "2025-10-06", grade: "D" }, // Needing
      { date: "2025-10-07", grade: "E" }, // Needing   -> total 2
    ],
    monthly_progress: [
      { date: "2025-10-01", grade: "B" },
      { date: "2025-10-08", grade: "C" },
    ],
  },
  {
    user_id: 5,
    name: "Vikash Singh",
    weekly_progress: [
      { date: "2025-10-01", grade: "B" }, // Mastered -> 1
      { date: "2025-10-02", grade: "C" }, // Improve  -> 1
      { date: "2025-10-03", grade: "C" }, // Improve  -> 2
    ],
    monthly_progress: [
      { date: "2025-10-01", grade: "C" },
      { date: "2025-10-08", grade: "B" },
    ],
  },

  /* ---- others (left reasonable defaults) ---- */
  {
    user_id: 6,
    name: "Meena Joshi",
    weekly_progress: [
      { date: "2025-10-01", grade: "A" },
      { date: "2025-10-02", grade: "A" },
      { date: "2025-10-03", grade: "A" },
    ],
    monthly_progress: [{ date: "2025-10-01", grade: "A" }],
  },
  {
    user_id: 7,
    name: "Vikas Singh",
    weekly_progress: [
      { date: "2025-10-01", grade: "B" },
      { date: "2025-10-02", grade: "B" },
      { date: "2025-10-03", grade: "C" },
    ],
    monthly_progress: [{ date: "2025-10-01", grade: "B" }],
  },
  {
    user_id: 8,
    name: "Kiran Das",
    weekly_progress: [
      { date: "2025-10-01", grade: "C" },
      { date: "2025-10-02", grade: "C" },
    ],
    monthly_progress: [{ date: "2025-10-01", grade: "C" }],
  },
  {
    user_id: 9,
    name: "Neha Kapoor",
    weekly_progress: [
      { date: "2025-10-01", grade: "A" },
      { date: "2025-10-02", grade: "B" },
    ],
    monthly_progress: [{ date: "2025-10-01", grade: "A" }],
  },
  {
    user_id: 10,
    name: "Rahul Nair",
    weekly_progress: [
      { date: "2025-10-01", grade: "D" },
      { date: "2025-10-02", grade: "C" },
    ],
    monthly_progress: [{ date: "2025-10-01", grade: "C" }],
  },
];


const monthly_report = [
  /* ---- TOP 5 (Work Completed + exact averages) ---- */
  {
    user_id: 1,
    name: "Avantika Darshan",
    month: "2025-09",
    assignments: { submitted_count: 3, success_rate: 85, failure_rate: 15 },
    mcqs: { attempted_count: 12, success_rate: 80, failure_rate: 20 },
    lectures: { total_score: 82, average_watch_time: 42 }, // avg = (85+80+82)/3 = 82.33%
  },
  {
    user_id: 2,
    name: "Hritik Rajput",
    month: "2025-09",
    assignments: { submitted_count: 2, success_rate: 90, failure_rate: 10 },
    mcqs: { attempted_count: 10, success_rate: 78, failure_rate: 22 },
    lectures: { total_score: 85.5, average_watch_time: 38 }, // avg = 84.5%
  },
  {
    user_id: 3,
    name: "Uma Pandey",
    month: "2025-09",
    assignments: { submitted_count: 3, success_rate: 80, failure_rate: 20 },
    mcqs: { attempted_count: 14, success_rate: 76, failure_rate: 24 },
    lectures: { total_score: 80, average_watch_time: 55 }, // avg = 78.67%
  },
  {
    user_id: 4,
    name: "VidyaAI Student",
    month: "2025-09",
    assignments: { submitted_count: 7, success_rate: 65, failure_rate: 35 },
    mcqs: { attempted_count: 18, success_rate: 70, failure_rate: 30 },
    lectures: { total_score: 78, average_watch_time: 35 }, // avg = 71%
  },
  {
    user_id: 5,
    name: "Vikash Singh",
    month: "2025-09",
    assignments: { submitted_count: 3, success_rate: 72, failure_rate: 28 },
    mcqs: { attempted_count: 16, success_rate: 74, failure_rate: 26 },
    lectures: { total_score: 81, average_watch_time: 50 }, // avg = 75.67%
  },

  /* ---- others (kept reasonable defaults) ---- */
  {
    user_id: 6,
    name: "Meena Joshi",
    month: "2025-09",
    assignments: { submitted_count: 12, success_rate: 96, failure_rate: 4 },
    mcqs: { attempted_count: 60, success_rate: 92, failure_rate: 8 },
    lectures: { total_score: 95, average_watch_time: 60 },
  },
  {
    user_id: 7,
    name: "Vikas Singh",
    month: "2025-09",
    assignments: { submitted_count: 7, success_rate: 82, failure_rate: 18 },
    mcqs: { attempted_count: 42, success_rate: 74, failure_rate: 26 },
    lectures: { total_score: 78, average_watch_time: 47 },
  },
  {
    user_id: 8,
    name: "Kiran Das",
    month: "2025-09",
    assignments: { submitted_count: 6, success_rate: 60, failure_rate: 40 },
    mcqs: { attempted_count: 36, success_rate: 58, failure_rate: 42 },
    lectures: { total_score: 65, average_watch_time: 40 },
  },
  {
    user_id: 9,
    name: "Neha Kapoor",
    month: "2025-09",
    assignments: { submitted_count: 9, success_rate: 90, failure_rate: 10 },
    mcqs: { attempted_count: 48, success_rate: 85, failure_rate: 15 },
    lectures: { total_score: 92, average_watch_time: 58 },
  },
  {
    user_id: 10,
    name: "Rahul Nair",
    month: "2025-09",
    assignments: { submitted_count: 8, success_rate: 72, failure_rate: 28 },
    mcqs: { attempted_count: 41, success_rate: 68, failure_rate: 32 },
    lectures: { total_score: 71, average_watch_time: 44 },
  },
];




/* --------------------------- helpers --------------------------- */
const initials = (name = "") =>
  name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const gradeScore = { A: 5, B: 4, C: 3, D: 2, E: 1 };
const scoreToGrade = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "E" };

function GradeChip({ grade }) {
  const theme = useTheme();
  const palette = {
    A: { bg: alpha(theme.palette.success.main, 0.12), fg: theme.palette.success.main },
    B: { bg: alpha(theme.palette.info.main, 0.12), fg: theme.palette.info.main },
    C: { bg: alpha(theme.palette.warning.main, 0.18), fg: theme.palette.warning.dark },
    D: { bg: alpha(theme.palette.error.main, 0.12), fg: theme.palette.error.dark },
    E: { bg: alpha(theme.palette.error.main, 0.18), fg: theme.palette.error.main },
  }[grade] || { bg: alpha(theme.palette.divider, 0.3), fg: theme.palette.text.primary };

  return (
    <Chip
      label={grade}
      size="small"
      sx={{
        bgcolor: palette.bg,
        color: palette.fg,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    />
  );
}

function MonthlyBatchTopperPanel({ monthlyData = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openIds, setOpenIds] = useState({});

  const rows = useMemo(() => {
    const safe = (n) => (typeof n === "number" && !Number.isNaN(n) ? n : 0);

    return [...monthlyData]
      .map((m) => {
        const assign = safe(m?.assignments?.success_rate);
        const mcq = safe(m?.mcqs?.success_rate);
        const lect = Math.min(100, safe(m?.lectures?.total_score));
        const score = Math.round((assign + mcq + lect) / 3); // 0–100
        return {
          user_id: m.user_id,
          name: m.name,
          month: m.month,
          assignments_success: assign,
          mcqs_success: mcq,
          lectures_score: lect,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [monthlyData]);

  const medal = (i) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  const toggleOpen = (id) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ================= MOBILE VIEW – accordion ================= */
  if (isMobile) {
    return (
      <Card
        sx={{
          width: "100%",
          p: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "none",
          boxShadow: "none",
        }}
      >
        <CardHeader
          title="Monthly Batch Topper"
          subheader="Ranked by composite score (Assignments ✓% • MCQs ✓% • Lectures Score)"
          sx={{ "& .MuiCardHeader-title": { fontWeight: 700 } }}
        />
        <CardContent sx={{ pt: 1, maxHeight: 400, overflowY: "auto" }}>
          {rows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No monthly data available.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {rows.map((r, idx) => {
                const key = r.user_id ?? `row-${idx}`;
                const isOpen = !!openIds[key];

                return (
                  <Accordion
                    key={key}
                    disableGutters
                    elevation={0}
                    expanded={isOpen}
                    onChange={() => toggleOpen(key)}
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.text.primary,
                        0.08
                      )}`,
                      "&::before": { display: "none" },
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                        >
                          <FiChevronDown size={18} />
                        </Box>
                      }
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        "& .MuiAccordionSummary-content": {
                          margin: 0,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        {/* left: rank + avatar + name */}
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ minWidth: 0 }}
                        >
                          <Chip
                            size="small"
                            label={medal(idx)}
                            sx={{
                              fontWeight: 700,
                              bgcolor:
                                idx === 0
                                  ? alpha(
                                      theme.palette.warning.main,
                                      0.18
                                    )
                                  : idx === 1
                                  ? alpha(
                                      theme.palette.info.main,
                                      0.18
                                    )
                                  : idx === 2
                                  ? alpha(
                                      theme.palette.success.main,
                                      0.18
                                    )
                                  : alpha(
                                      theme.palette.text.primary,
                                      0.06
                                    ),
                            }}
                          />
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 12,
                              bgcolor: alpha(
                                theme.palette.primary.main,
                                0.12
                              ),
                              color: theme.palette.primary.main,
                              fontWeight: 700,
                            }}
                          >
                            {initials(r.name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              noWrap
                            >
                              {r.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                            >
                              Assign {r.assignments_success}% · MCQs{" "}
                              {r.mcqs_success}% · Lec {r.lectures_score}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* right: score chip */}
                        <Chip
                          size="small"
                          color={
                            r.score >= 85
                              ? "success"
                              : r.score >= 70
                              ? "primary"
                              : "default"
                          }
                          label={r.score}
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>
                    </AccordionSummary>

                    <AccordionDetails sx={{ px: 1.25, pb: 1.25, pt: 0.5 }}>
                      <Stack spacing={0.6}>
                        {r.month && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Month: <strong>{r.month}</strong>
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Assignments success:{" "}
                          <strong>{r.assignments_success}%</strong>
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          MCQs success:{" "}
                          <strong>{r.mcqs_success}%</strong>
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Lectures score:{" "}
                          <strong>{r.lectures_score}</strong>
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Composite score:{" "}
                          <strong>{r.score}</strong>
                        </Typography>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }

  /* ================= DESKTOP/TABLET VIEW – आपका पुराना table जस का तस ================= */
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader
        title="Monthly Batch Topper"
        subheader="Ranked by composite score (Assignments ✓% • MCQs ✓% • Lectures Score)"
        sx={{ "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />
      <CardContent sx={{ pt: 1 }}>
        <TableContainer>
          <Table
            size="small"
            sx={{
              "& td, & th": {
                borderBottomColor: alpha(
                  theme.palette.text.primary,
                  0.06
                ),
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width={60}>Rank</TableCell>
                <TableCell>Student</TableCell>
                <TableCell align="right">Assign ✓%</TableCell>
                <TableCell align="right">MCQs ✓%</TableCell>
                <TableCell align="right">Lecture</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow hover key={r.user_id}>
                  <TableCell>
                    <Chip
                      size="small"
                      label={medal(idx)}
                      sx={{
                        fontWeight: 700,
                        bgcolor:
                          idx === 0
                            ? alpha(theme.palette.warning.main, 0.18)
                            : idx === 1
                            ? alpha(theme.palette.info.main, 0.18)
                            : idx === 2
                            ? alpha(
                                theme.palette.success.main,
                                0.18
                              )
                            : alpha(
                                theme.palette.text.primary,
                                0.06
                              ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 12,
                          bgcolor: alpha(
                            theme.palette.primary.main,
                            0.12
                          ),
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        }}
                      >
                        {initials(r.name)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {r.name}
                      </Typography>
                      {r.month && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={r.month}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {r.assignments_success}
                  </TableCell>
                  <TableCell align="right">
                    {r.mcqs_success}
                  </TableCell>
                  <TableCell align="right">
                    {r.lectures_score}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      color={
                        r.score >= 85
                          ? "success"
                          : r.score >= 70
                          ? "primary"
                          : "default"
                      }
                      label={r.score}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No monthly data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}



/* ========================== WIDGETS ========================== */

function LoginFrequencyPanel({ data = [] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const rows = useMemo(
    () => [...data].sort((a, b) => b.current_week_logins - a.current_week_logins).slice(0, 10),
    [data]
  );

  // ✅ MOBILE VIEW – अब accordion में
  if (isMobile) {
    return (
      <Card
        sx={{
          width: "100%",
          p: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "none",
          boxShadow: "none",
        }}
      >
        <CardHeader
          title="Login Frequency"
          subheader="This week vs last week"
          sx={{
            pb: 0,
            "& .MuiCardHeader-title": { fontWeight: 700 },
            backgroundColor: "#fff",
          }}
        />
        <CardContent sx={{ pt: 1, backgroundColor: "#fff" }}>
          <Stack spacing={1}>
            {rows.map((u) => {
              const delta = u.current_week_logins - u.previous_week_logins;
              const positive = delta > 0;
              const neutral = delta === 0;

              return (
                <Accordion
                  key={u.user_id}
                  disableGutters
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
                    "&::before": { display: "none" },
                    overflow: "hidden",
                    backgroundColor: "#fff",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<FiChevronDown sx={{ fontSize: 20 }} />}
                    sx={{
                      px: 1.25,
                      py: 0.75,
                      "& .MuiAccordionSummary-content": {
                        margin: 0,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1.5}
                      sx={{ width: "100%" }}
                    >
                      {/* Left: Avatar + Name */}
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 12,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        >
                          {initials(u.name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                          >
                            {u.name}
                          </Typography>
                          {/* छोटा सा subline: This week logins */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            This week: {u.current_week_logins} · Last: {u.previous_week_logins}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Right: Δ chip */}
                      <Chip
                        size="small"
                        variant={neutral ? "outlined" : "filled"}
                        label={delta > 0 ? `+${delta}` : delta}
                        sx={{
                          minWidth: 54,
                          justifyContent: "center",
                          bgcolor: neutral
                            ? "transparent"
                            : positive
                              ? alpha(theme.palette.success.main, 0.12)
                              : alpha(theme.palette.error.main, 0.12),
                          color: neutral
                            ? theme.palette.text.secondary
                            : positive
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          borderColor: alpha(theme.palette.text.primary, 0.2),
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 1.25, pt: 0, pb: 1 }}>
                    {/* Stats grid – same info जो table में है */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        rowGap: 0.5,
                        columnGap: 1.5,
                        mb: 0.75,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total logins
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {u.total_logins}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Δ (change)
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            color: neutral
                              ? theme.palette.text.secondary
                              : positive
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                          }}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          This week
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {u.current_week_logins}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last week
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {u.previous_week_logins}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Last login: {new Date(u.last_login_date).toLocaleString()}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // ✅ DESKTOP / TABLET VIEW – आपका पुराना design as-it-is
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader
        title="Login Frequency"
        subheader="This week vs last week"
        sx={{
          pb: 0,
          "& .MuiCardHeader-title": { fontWeight: 700 },
          backgroundColor: "#fff",
        }}
      />
      <CardContent sx={{ pt: 1, backgroundColor: "#fff" }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table
            stickyHeader
            size="small"
            sx={{
              "& td, & th": {
                borderBottomColor: alpha(theme.palette.text.primary, 0.06),
              },
              backgroundColor: "#fff",
            }}
          >
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 50,
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">This week</TableCell>
                <TableCell align="right">Last week</TableCell>
                <TableCell align="center">Δ</TableCell>
                <TableCell>Last login</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((u) => {
                const delta = u.current_week_logins - u.previous_week_logins;
                const positive = delta > 0;
                const neutral = delta === 0;
                return (
                  <TableRow hover key={u.user_id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        >
                          {initials(u.name)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {u.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{u.total_logins}</TableCell>
                    <TableCell align="right">
                      {u.current_week_logins}
                    </TableCell>
                    <TableCell align="right">
                      {u.previous_week_logins}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        variant={neutral ? "outlined" : "filled"}
                        label={delta > 0 ? `+${delta}` : delta}
                        sx={{
                          minWidth: 54,
                          justifyContent: "center",
                          bgcolor: neutral
                            ? "transparent"
                            : positive
                              ? alpha(theme.palette.success.main, 0.12)
                              : alpha(theme.palette.error.main, 0.12),
                          color: neutral
                            ? theme.palette.text.secondary
                            : positive
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          borderColor: alpha(theme.palette.text.primary, 0.2),
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(u.last_login_date).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}



function PeakUsagePanel({ peak }) {
  const theme = useTheme();
  if (!peak) return null;
  const data = peak.data || [];

  const fillId = "peakGradient";

  return (
    <Card sx={{
      width: "100%",
      p: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "#fff",
      borderRadius: "20px",
      border: "none",
      boxShadow: "none",
    }}>
      <CardHeader
        title="Peak Usage"
        subheader={`${peak.month} • Daily logins`}
        sx={{ "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />
      <CardContent>
        <Box height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.7)} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ReTooltip />
              <Area
                type="monotone"
                dataKey="total_logins"
                stroke={theme.palette.primary.main}
                strokeWidth={2.2}
                fillOpacity={1}
                fill={`url(#${fillId})`}
              />
              <Line type="monotone" dataKey="total_logins" strokeWidth={0} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          <Chip color="primary" label={`Peak: ${peak.peak_day}`} variant="outlined" />
          <Chip label={`Avg daily logins: ${peak.average_daily_logins}`} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/* =================== COMBINED: Monthly + Progress =================== */

/* =================== TABLE + ACCORDION VIEW =================== */

function CombinedStudentPanel({
  monthlyData = [],
  progressData = [],
}) {
  const theme = useTheme();
  const [openIds, setOpenIds] = useState({});

  // Merge monthly + progress by user_id (fallback name)
  const byKey = (obj) => `${obj.user_id ?? ""}::${(obj.name ?? "").trim().toLowerCase()}`;
  const monthlyMap = Object.fromEntries(monthlyData.map((m) => [byKey(m), m]));
  const merged = progressData.map((p) => {
    const key = byKey(p);
    const m = monthlyMap[key] ?? {};
    return {
      key,
      user_id: p.user_id ?? m.user_id,
      name: p.name ?? m.name,
      month: m.month,
      assignments: m.assignments,
      mcqs: m.mcqs,
      lectures: m.lectures,
      weekly_progress: p.weekly_progress ?? [],
      monthly_progress: p.monthly_progress ?? [],
    };
  });

  const toggleOpen = (key) =>
    setOpenIds((prev) => ({ ...prev, [key]: !prev[key] }));

  const toSeries = (arr) =>
    (arr || []).map((r) => ({
      date: r.date,
      grade: r.grade || r.predicted_grade,
      score: gradeScore[r.grade || r.predicted_grade || "C"] || 3,
      isPred: Boolean(r.predicted_grade),
    }));

  const latestGrade = (weekly, monthly) => {
    const w = toSeries(weekly);
    const m = toSeries(monthly);
    const last = (w.length ? w[w.length - 1] : null) || (m.length ? m[m.length - 1] : null);
    return last?.grade || "C";
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader
        title="Student Performance & Predicted Grades"
        subheader="Student-wise summary with expandable charts"
        sx={{ "& .MuiCardHeader-title": { fontWeight: 700 } }}
      />
      <CardContent
        sx={{
          pt: 0,
          overflowY: "auto",
          maxHeight: 500,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >

        <Table
          size="small"
          sx={{ "& td, & th": { borderBottomColor: alpha(theme.palette.text.primary, 0.06) } }}
        >
          <TableHead>
            <TableRow>
              <TableCell width={54} />
              <TableCell>Student</TableCell>
              <TableCell align="right">Assignments (✓%)</TableCell>
              <TableCell align="right">MCQs (✓%)</TableCell>
              <TableCell align="right">Lectures (Score)</TableCell>
              <TableCell align="right">Latest Grade</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {merged.map((row) => {
              const isOpen = !!openIds[row.key];
              const weeklySeries = toSeries(row.weekly_progress);
              const monthlySeries = toSeries(row.monthly_progress);
              const latest = latestGrade(row.weekly_progress, row.monthly_progress);

              return (
                <React.Fragment key={row.key}>
                  {/* Summary Row */}
                  <TableRow hover>
                    <TableCell>
                      <IconButton size="small" onClick={() => toggleOpen(row.key)}>
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        >
                          {initials(row.name)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {row.name}
                        </Typography>
                        {row.month && <Chip size="small" label={row.month} />}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {row?.assignments?.success_rate ?? 0}%
                    </TableCell>
                    <TableCell align="right">
                      {row?.mcqs?.success_rate ?? 0}%
                    </TableCell>
                    <TableCell align="right">
                      {row?.lectures?.total_score ?? 0}
                    </TableCell>
                    <TableCell align="right">
                      <GradeChip grade={latest} />
                    </TableCell>
                  </TableRow>

                  {/* Expanded Content */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, bgcolor: alpha(theme.palette.primary.main, 0.015) }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2.5 }}>
                          <Grid container spacing={2}>
                            {/* Left: Monthly Performance */}
                            <Grid item xs={12} md={5}>
                              <Card
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  borderRadius: 3,
                                  borderColor: alpha(theme.palette.text.primary, 0.08),
                                  height: "100%",
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                  Monthly Performance
                                </Typography>

                                {/* Assignments */}
                                <Box mt={2}>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Assignments: {row?.assignments?.submitted_count ?? 0} submitted • Success{" "}
                                    {row?.assignments?.success_rate ?? 0}%
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={row?.assignments?.success_rate ?? 0}
                                    sx={{
                                      height: 10,
                                      borderRadius: 999,
                                      mt: 0.6,
                                      bgcolor: alpha(theme.palette.success.main, 0.12),
                                      "& .MuiLinearProgress-bar": { bgcolor: theme.palette.success.main },
                                    }}
                                  />
                                </Box>

                                {/* MCQs */}
                                <Box mt={3}>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    MCQs: {row?.mcqs?.attempted_count ?? 0} attempted • Success{" "}
                                    {row?.mcqs?.success_rate ?? 0}%
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={row?.mcqs?.success_rate ?? 0}
                                    sx={{
                                      height: 10,
                                      borderRadius: 999,
                                      mt: 0.6,
                                      bgcolor: alpha(theme.palette.info.main, 0.12),
                                      "& .MuiLinearProgress-bar": { bgcolor: theme.palette.info.main },
                                    }}
                                  />
                                </Box>

                                {/* Lectures */}
                                <Box mt={3}>
                                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    Lectures: Score {row?.lectures?.total_score ?? 0} • Avg watch{" "}
                                    {row?.lectures?.average_watch_time ?? 0} min
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, row?.lectures?.total_score ?? 0)}
                                    sx={{
                                      height: 10,
                                      borderRadius: 999,
                                      mt: 0.6,
                                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                                      "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main },
                                    }}
                                  />
                                </Box>
                              </Card>
                            </Grid>

                            {/* Right: Charts */}
                            <Grid item xs={12} md={7}>
                              <Grid container spacing={2}>
                                {/* Weekly (Bars) */}
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                                    Weekly
                                  </Typography>
                                  <Box height={230} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={weeklySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.7)} />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis
                                          ticks={[1, 2, 3, 4, 5]}
                                          domain={[1, 5]}
                                          tickFormatter={(v) => scoreToGrade[v]}
                                          tick={{ fontSize: 12 }}
                                        />
                                        <ReTooltip formatter={(v) => scoreToGrade[v]} />
                                        <Bar dataKey="score" radius={[6, 6, 0, 0]} fill={theme.palette.primary.main} fillOpacity={0.85} />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </Box>
                                  <Stack mt={1} direction="row" spacing={0.75} flexWrap="wrap">
                                    {weeklySeries.map((g) => (
                                      <Tooltip key={g.date} title={g.isPred ? "Predicted" : "Actual"}>
                                        <span>
                                          <GradeChip grade={g.grade} />
                                        </span>
                                      </Tooltip>
                                    ))}
                                  </Stack>
                                </Grid>

                                {/* Monthly (Line) */}
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom fontWeight={700}>
                                    Monthly
                                  </Typography>
                                  <Box height={230} sx={{ bgcolor: alpha(theme.palette.success.main, 0.02), borderRadius: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={monthlySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.7)} />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis
                                          ticks={[1, 2, 3, 4, 5]}
                                          domain={[1, 5]}
                                          tickFormatter={(v) => scoreToGrade[v]}
                                          tick={{ fontSize: 12 }}
                                        />
                                        <ReTooltip formatter={(v) => scoreToGrade[v]} />
                                        <Line
                                          type="monotone"
                                          dataKey="score"
                                          strokeWidth={2.4}
                                          dot={{ r: 3 }}
                                          stroke={theme.palette.success.main}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </Box>
                                  <Stack mt={1} direction="row" spacing={0.75} flexWrap="wrap">
                                    {monthlySeries.map((g) => (
                                      <Tooltip key={g.date} title={g.isPred ? "Predicted" : "Actual"}>
                                        <span>
                                          <GradeChip grade={g.grade} />
                                        </span>
                                      </Tooltip>
                                    ))}
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


/* ===================== Page Section Wrapper ===================== */
export default function EngagementSection() {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <LoginFrequencyPanel data={login_frequency} />
        </Grid>
        <Grid item xs={12} md={5}>
          <PeakUsagePanel peak={peak_usage} />
        </Grid>

        {/* ⬇️ Merge of MonthlyPerformance + ProgressPrediction */}
        <Grid item xs={12}>
          <CombinedStudentPanel
            monthlyData={monthly_report}
            progressData={progress_predicted_graph}
          />
        </Grid>
        <Grid item xs={12}>
          <MonthlyBatchTopperPanel monthlyData={monthly_report} />
        </Grid>

      </Grid>
    </Box>
  );
}

