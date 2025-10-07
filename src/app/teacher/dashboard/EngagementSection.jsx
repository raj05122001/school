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

const login_frequency = [
  {
    "user_id": 1,
    "name": "Amit Sharma",
    "total_logins": 134,
    "current_week_logins": 6,
    "previous_week_logins": 8,
    "last_login_date": "2025-10-06T09:45:00"
  },
  {
    "user_id": 2,
    "name": "Priya Mehta",
    "total_logins": 89,
    "current_week_logins": 3,
    "previous_week_logins": 5,
    "last_login_date": "2025-10-05T21:12:00"
  },
  {
    "user_id": 3,
    "name": "Ravi Kumar",
    "total_logins": 176,
    "current_week_logins": 9,
    "previous_week_logins": 10,
    "last_login_date": "2025-10-06T08:32:00"
  },
  {
    "user_id": 4,
    "name": "Sneha Patel",
    "total_logins": 45,
    "current_week_logins": 2,
    "previous_week_logins": 3,
    "last_login_date": "2025-10-03T19:20:00"
  },
  {
    "user_id": 5,
    "name": "Rahul Verma",
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

const peak_usage = {
  "type": "monthly_peak_usage",
  "month": "October 2025",
  "unit": "daily",
  "data": [
    {"date": "2025-10-01", "total_logins": 246},
    {"date": "2025-10-02", "total_logins": 200},
    {"date": "2025-10-03", "total_logins": 260},
    {"date": "2025-10-04", "total_logins": 270},
    {"date": "2025-10-05", "total_logins": 255},
    {"date": "2025-10-06", "total_logins": 289},
    {"date": "2025-10-07", "total_logins": 310}
  ],
  "peak_day": "2025-10-06",
  "average_daily_logins": 279
}

const progress_predicted_graph = [
  {
    "user_id": 1,
    "name": "Amit Sharma",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "C"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "B"},
      {"date": "2025-10-04", "grade": "B"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "C"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "B"},
      {"date": "2025-10-04", "grade": "B"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"},
      {"date": "2025-10-08", "predicted_grade": "A"},
      {"date": "2025-10-09", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 2,
    "name": "Priya Mehta",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "B"},
      {"date": "2025-10-03", "grade": "A"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "A"},
      {"date": "2025-10-03", "grade": "A"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 3,
    "name": "Ravi Kumar",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "D"},
      {"date": "2025-10-02", "grade": "D"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "D"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "B"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 4,
    "name": "Sneha Patel",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "B"},
      {"date": "2025-10-03", "grade": "B"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "B"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ]
  },
  {
    "user_id": 5,
    "name": "Rahul Verma",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "E"},
      {"date": "2025-10-02", "grade": "D"},
      {"date": "2025-10-03", "grade": "D"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "E"},
      {"date": "2025-10-02", "grade": "D"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 6,
    "name": "Meena Joshi",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "A"},
      {"date": "2025-10-02", "grade": "A"},
      {"date": "2025-10-03", "grade": "A"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "A"},
      {"date": "2025-10-02", "grade": "A"},
      {"date": "2025-10-03", "grade": "A"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 7,
    "name": "Vikas Singh",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "D"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "B"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "D"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "B"},
      {"date": "2025-10-05", "grade": "B"},
      {"date": "2025-10-06", "grade": "B"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 8,
    "name": "Kiran Das",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "C"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "C"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "C"},
      {"date": "2025-10-02", "grade": "C"},
      {"date": "2025-10-03", "grade": "C"},
      {"date": "2025-10-04", "grade": "C"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "C"}
    ]
  },
  {
    "user_id": 9,
    "name": "Neha Kapoor",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "B"},
      {"date": "2025-10-03", "grade": "B"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "B"},
      {"date": "2025-10-02", "grade": "B"},
      {"date": "2025-10-03", "grade": "A"},
      {"date": "2025-10-04", "grade": "A"},
      {"date": "2025-10-05", "grade": "A"},
      {"date": "2025-10-06", "grade": "A"},
      {"date": "2025-10-07", "predicted_grade": "A"}
    ]
  },
  {
    "user_id": 10,
    "name": "Rahul Nair",
    "weekly_progress": [
      {"date": "2025-10-01", "grade": "E"},
      {"date": "2025-10-02", "grade": "E"},
      {"date": "2025-10-03", "grade": "D"},
      {"date": "2025-10-04", "grade": "D"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ],
    "monthly_progress": [
      {"date": "2025-10-01", "grade": "E"},
      {"date": "2025-10-02", "grade": "E"},
      {"date": "2025-10-03", "grade": "D"},
      {"date": "2025-10-04", "grade": "D"},
      {"date": "2025-10-05", "grade": "C"},
      {"date": "2025-10-06", "grade": "C"},
      {"date": "2025-10-07", "predicted_grade": "B"}
    ]
  }
];

const monthly_report = [
  {
    "user_id": 1,
    "name": "Amit Sharma",
    "month": "2025-09",
    "assignments": { "submitted_count": 8, "success_rate": 75, "failure_rate": 25 },
    "mcqs": { "attempted_count": 40, "success_rate": 70, "failure_rate": 30 },
    "lectures": { "total_score": 80, "average_watch_time": 42 }
  },
  {
    "user_id": 2,
    "name": "Priya Mehta",
    "month": "2025-09",
    "assignments": { "submitted_count": 6, "success_rate": 83, "failure_rate": 17 },
    "mcqs": { "attempted_count": 35, "success_rate": 60, "failure_rate": 40 },
    "lectures": { "total_score": 63, "average_watch_time": 38 }
  },
  {
    "user_id": 3,
    "name": "Ravi Kumar",
    "month": "2025-09",
    "assignments": { "submitted_count": 10, "success_rate": 90, "failure_rate": 10 },
    "mcqs": { "attempted_count": 50, "success_rate": 80, "failure_rate": 20 },
    "lectures": { "total_score": 56, "average_watch_time": 55 }
  },
  {
    "user_id": 4,
    "name": "Sneha Patel",
    "month": "2025-09",
    "assignments": { "submitted_count": 5, "success_rate": 60, "failure_rate": 40 },
    "mcqs": { "attempted_count": 30, "success_rate": 50, "failure_rate": 50 },
    "lectures": { "total_score": 88, "average_watch_time": 35 }
  },
  {
    "user_id": 5,
    "name": "Rahul Verma",
    "month": "2025-09",
    "assignments": { "submitted_count": 9, "success_rate": 78, "failure_rate": 22 },
    "mcqs": { "attempted_count": 45, "success_rate": 75, "failure_rate": 25 },
    "lectures": { "total_score": 89, "average_watch_time": 50 }
  },

  /* ---- Added to match progress_predicted_graph ---- */
  {
    "user_id": 6,
    "name": "Meena Joshi",
    "month": "2025-09",
    "assignments": { "submitted_count": 12, "success_rate": 96, "failure_rate": 4 },
    "mcqs": { "attempted_count": 60, "success_rate": 92, "failure_rate": 8 },
    "lectures": { "total_score": 95, "average_watch_time": 60 }
  },
  {
    "user_id": 7,
    "name": "Vikas Singh",
    "month": "2025-09",
    "assignments": { "submitted_count": 7, "success_rate": 82, "failure_rate": 18 },
    "mcqs": { "attempted_count": 42, "success_rate": 74, "failure_rate": 26 },
    "lectures": { "total_score": 78, "average_watch_time": 47 }
  },
  {
    "user_id": 8,
    "name": "Kiran Das",
    "month": "2025-09",
    "assignments": { "submitted_count": 6, "success_rate": 60, "failure_rate": 40 },
    "mcqs": { "attempted_count": 36, "success_rate": 58, "failure_rate": 42 },
    "lectures": { "total_score": 65, "average_watch_time": 40 }
  },
  {
    "user_id": 9,
    "name": "Neha Kapoor",
    "month": "2025-09",
    "assignments": { "submitted_count": 9, "success_rate": 90, "failure_rate": 10 },
    "mcqs": { "attempted_count": 48, "success_rate": 85, "failure_rate": 15 },
    "lectures": { "total_score": 92, "average_watch_time": 58 }
  },
  {
    "user_id": 10,
    "name": "Rahul Nair",
    "month": "2025-09",
    "assignments": { "submitted_count": 8, "success_rate": 72, "failure_rate": 28 },
    "mcqs": { "attempted_count": 41, "success_rate": 68, "failure_rate": 32 },
    "lectures": { "total_score": 71, "average_watch_time": 44 }
  }
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

/* ========================== WIDGETS ========================== */

function LoginFrequencyPanel({ data = [] }) {
  const theme = useTheme();
  const rows = useMemo(
    () => [...data].sort((a, b) => b.current_week_logins - a.current_week_logins).slice(0, 10),
    [data]
  );

  return (
    <Card
       sx={{
        width: "100%",
        p:1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "none",
        boxShadow: "none"
      }}
    >
      <CardHeader
        title="Login Frequency"
        subheader="This week vs last week"
        sx={{ pb: 0, "& .MuiCardHeader-title": { fontWeight: 700 } , backgroundColor: "#fff"}}
      />
      <CardContent sx={{ pt: 1, backgroundColor: "#fff" }}>
  <TableContainer sx={{ maxHeight: 400 }}>
    <Table stickyHeader size="small"
      sx={{ "& td, & th": { borderBottomColor: alpha(theme.palette.text.primary, 0.06) }, backgroundColor: "#fff" }}
    >
          <TableHead sx={{position:'sticky', top:0, backgroundColor: "#fff", zIndex:50}}>
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
                  <TableCell align="right">{u.current_week_logins}</TableCell>
                  <TableCell align="right">{u.previous_week_logins}</TableCell>
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
    <Card  sx={{
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
      <CardContent sx={{ pt: 0 , overflowY:'auto', maxHeight:500}}>
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
      </Grid>
    </Box>
  );
}

