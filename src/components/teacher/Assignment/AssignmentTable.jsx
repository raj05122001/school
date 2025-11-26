"use client";

import React, { useState } from "react";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Collapse,
  IconButton,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { BiSolidDownArrow } from "react-icons/bi";

const AssignmentTable = ({ data }) => {
  const router = useRouter();
  const { isDarkMode } = useThemeContext();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangeRoute = (id) => {
    router.push(`/teacher/assignment/${id}`);
  };

  const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const headerTextStyle = {
    border: "none",
    color: "#3B3D3B",
    fontFamily: "Inter",
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: "normal",
    fontSize: "14px",
  };

  const cellTextStyle = {
    fontWeight: 700,
    color: "#3B3D3B",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontStyle: "normal",
    lineHeight: "normal",
  };

  // ---------------- MOBILE CARDS (accordion with left arrow) ----------------
  const renderMobileCards = () => {
    if (!data || data.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <Typography color="textSecondary">No Data Available</Typography>
        </Box>
      );
    }

    return data.map((lecture, index) => {
      const isExpanded = expandedIndex === index;

      return (
        <Card
          key={index}
          sx={{
            mb: 2,
            p: 0.5,
            width: "100%",        // FULL width
            borderRadius: "10px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#262626" : "#f8f9fa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
          onClick={() => handleChangeRoute(lecture?.id)}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center", 
              mb: 0.5,
              gap: 1,
            }}
          >
            {/* Calendar */}
            <Box sx={{ flexShrink: 0 }}>
              <CalendarIconCustom date={lecture?.schedule_date} />
            </Box>

            {/* Title */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {lecture?.title}
              </Typography>
            </Box>

            {/* Simple arrow in green square */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleExpandClick(index);
              }}
              sx={{
                p: 0,
                ml: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "8px",
                  border: "1.5px solid #2ecc71",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#2ecc71",
                    transform: isExpanded ? "rotate(90deg)" : "none", // right -> down
                    transition: "transform 0.2s",
                  }}
                >
                  &gt;
                </Typography>
              </Box>
            </IconButton>
          </Box>

          {/* COLLAPSIBLE DETAILS */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                mt: 0.5,
                pt: 0.5,
                borderTop: "1px dashed #e0e0e0",
              }}
            >
              {/* 2-column grid details */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Class
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {lecture?.lecture_class?.name || "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Subject
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {lecture?.chapter?.subject?.name || "-"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Chapter
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {lecture?.chapter?.chapter || "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0.3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Checked / Total
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {lecture?.checked_assignments} /{" "}
                    {lecture?.total_submitted_assignments}
                  </Typography>
                </Box>

              </Box>
            </Box>
          </Collapse>
        </Card>
      );
    });
  };

  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "none",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Table sx={{ border: "none" }}>
        <TableHead
          sx={{
            backgroundColor: "#F3F5F7",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <TableRow>
            <TableCell
              sx={{
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                border: "none",
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: "normal",
                fontSize: "14px",
              }}
            ></TableCell>
            <TableCell sx={headerTextStyle}>Lecture</TableCell>
            <TableCell sx={headerTextStyle}>Chapter</TableCell>
            <TableCell sx={headerTextStyle}>Class</TableCell>
            <TableCell sx={headerTextStyle}>Subject</TableCell>
            <TableCell sx={headerTextStyle}>Checked</TableCell>
            <TableCell sx={headerTextStyle}>Total</TableCell>
            <TableCell
              sx={{
                ...headerTextStyle,
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderBottom: "none" }}>
          {data?.length > 0 ? (
            data?.map((lecture, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                }}
              >
                <TableCell>
                  <CalendarIconCustom date={lecture?.schedule_date} />
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Title: ${lecture?.title || ""}`}
                    arrow
                    placement="top-start"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        ...cellTextStyle,
                        width: "105px",
                      }}
                      noWrap
                    >
                      {lecture?.title?.length > 24
                        ? `${lecture?.title?.slice(0, 24)}...`
                        : lecture?.title}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Chapter: ${lecture?.chapter?.chapter || ""}`}
                    arrow
                    placement="top-start"
                  >
                    <span
                      style={{
                        ...cellTextStyle,
                        width: "131px",
                        height: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {lecture?.chapter?.chapter}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Class: ${lecture?.lecture_class?.name || ""}`}
                    arrow
                    placement="top-start"
                  >
                    <span
                      style={{
                        ...cellTextStyle,
                        width: "105px",
                      }}
                    >
                      {lecture?.lecture_class?.name || ""}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Subject: ${lecture?.chapter?.subject?.name}`}
                    arrow
                    placement="top-start"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        ...cellTextStyle,
                        width: "105px",
                      }}
                    >
                      {lecture?.chapter?.subject?.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{lecture?.checked_assignments}</TableCell>
                <TableCell>{lecture?.total_submitted_assignments}</TableCell>
                <TableCell onClick={() => handleChangeRoute(lecture?.id)}>
                  <img
                    src="/arrow-square-right.png"
                    style={{ width: "24px", height: "24px" }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                No Data Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ---------------- RENDER ----------------
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        backgroundColor: "var(--Website_color-white, #FFF)",
        borderRadius: "20px",
      }}
    >
      {isMobile ? renderMobileCards() : renderDesktopTable()}
    </Box>
  );
};

export default AssignmentTable;
