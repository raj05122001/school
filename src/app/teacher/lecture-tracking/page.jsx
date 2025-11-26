"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Skeleton,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllLectureCount, getMyLectures } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import { BiSolidDownArrow } from "react-icons/bi";
import { MdOutlineEmergencyRecording } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { AppContextProvider } from "@/app/main";
import TableSkeleton from "@/commonComponents/Skeleton/TableSkeleton/TableSkeleton";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";
import SearchWithFilter from "@/components/teacher/Assignment/SearchWithFilter";

const LectureTabs = () => {
  const { isDarkMode } = useThemeContext();
  const {
    openRecordingDrawer,
    openCreateLecture,
    handleCreateLecture,
    handleLectureRecord,
  } = useContext(AppContextProvider);

  const [loading, setLoading] = useState(false);
  const [lectureCount, setLectureCount] = useState({});
  const [tabLoader, setTabLoader] = useState(false);
  const [lectureData, setLectureData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null); // accordion row (mobile)

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery("(max-width:480px)");
  const isVerySmallMobile = useMediaQuery("(max-width:360px)");

  const status = searchParams.get("status") || "COMPLETED";

  const classValue = searchParams.get("class") || "";
  const subject = searchParams.get("subject") || "";
  const searchQuery = searchParams.get("globalSearch") || "";
  const month = searchParams.get("month") || "";
  const lectureType = searchParams.get("lectureType") || "";
  const activePage = parseInt(searchParams.get("activePage")) || 1;

  const statusColorMap = {
    COMPLETED: "#2ecc71", // green
    UPCOMMING: "#3498db", // blue
    MISSED: "#f1c40f", // yellow
    CANCELLED: "#e74c3c", // red
  };

  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    paginationItemColor: "#ffffff",
    paginationBg: "#333333",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    paginationItemColor: "#000000",
    paginationBg: "#f0f0f0",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  const mapData = {
    COMPLETED: "completed_lectures",
    UPCOMMING: "upcomming_lectures",
    MISSED: "missed_lectures",
    CANCELLED: "cancelled_lectures",
  };

  useEffect(() => {
    fetchAllLectureCount();
  }, []);

  useEffect(() => {
    fetchLectureData();
  }, [searchQuery, month, lectureType, status, activePage, subject, classValue]);

  const fetchAllLectureCount = async () => {
    try {
      setTabLoader(true);
      const response = await getAllLectureCount();
      setLectureCount(response?.data?.data || {});
      setTabLoader(false);
    } catch (error) {
      console.error(error);
      setTabLoader(false);
    }
  };

  const fetchLectureData = async () => {
    try {
      setLoading(true);
      const response = await getMyLectures(
        status,
        lectureType ? lectureType : "",
        searchQuery,
        activePage,
        10,
        month,
        subject,
        classValue
      );
      setLectureData(response?.data?.data?.lecture_data || {});
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (value, parameterTypes) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(parameterTypes, value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
    if (parameterTypes !== "activePage") {
      // filter change pe page reset
      newSearchParams.set("activePage", "1");
    }
  };

  const handleRowClick = (id) => {
    router.push(`/teacher/lecture-listings/${id}`);
  };

  // Card height/padding/gap for status cards
  const getCardHeight = () => {
    if (isVerySmallMobile) return "70px";
    if (isMobile) return "65px";
    return "50px";
  };

  const getCardPadding = () => {
    if (isVerySmallMobile) return "6px 8px";
    if (isMobile) return "8px 10px";
    return "5.5px 9px";
  };

  const getCardGap = () => {
    if (isVerySmallMobile) return "6px";
    if (isMobile) return "8px";
    return "10px";
  };

  const getStatusText = (value) => {
    if (isVerySmallMobile) return value.slice(0, 3);
    if (isMobile) return value.slice(0, 4);
    return value.charAt(0) + value.slice(1).toLowerCase();
  };

  const getFontSize = () => {
    if (isVerySmallMobile) return "11px";
    if (isMobile) return "12px";
    return "14px";
  };

  const getPercentageFontSize = () => {
    if (isVerySmallMobile) return "12px";
    if (isMobile) return "14px";
    return "18.192px";
  };

  const getLineHeight = () => {
    if (isVerySmallMobile) return "14px";
    if (isMobile) return "16px";
    return "19px";
  };

  /* ---------- Shared table styles ---------- */
  const tableCellStyleBase = {
    fontWeight: 700,
    color: "#3B3D3B",
    fontFamily: "Inter, sans-serif",
    fontStyle: "normal",
    lineHeight: "normal",
  };

  /* ========= MOBILE: Accordion table (arrow + details card) ========= */
  const renderLectureDetailsCard = (lecture, index) => (
    <Card
      key={index}
      sx={{
        mb: 1,
        p: 2,
        mx: 0.5,
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
        width: "calc(100% - 8px)",
        boxSizing: "border-box",
      }}
    >
      {/* Header Row - Title with Calendar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          mb: 2,
          gap: 1,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <CalendarIconCustom date={lecture.schedule_date} />
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontSize: isVerySmallMobile ? "14px" : "15px",
            lineHeight: 1.3,
            flex: 1,
            wordBreak: "break-word",
          }}
        >
          {lecture.title}
        </Typography>
      </Box>

      {/* Details Grid - 2 columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: isVerySmallMobile ? "11px" : "12px",
              fontWeight: 500,
            }}
          >
            Type
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontSize: isVerySmallMobile ? "12px" : "13px",
              fontWeight: 600,
            }}
          >
            {lecture?.type
              ? lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)
              : "-"}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: isVerySmallMobile ? "11px" : "12px",
              fontWeight: 500,
            }}
          >
            Time
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontSize: isVerySmallMobile ? "12px" : "13px",
              fontWeight: 600,
            }}
          >
            {lecture.schedule_time}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: isVerySmallMobile ? "11px" : "12px",
              fontWeight: 500,
            }}
          >
            Class
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontSize: isVerySmallMobile ? "12px" : "13px",
              fontWeight: 600,
            }}
          >
            {lecture?.lecture_class?.name}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: isVerySmallMobile ? "11px" : "12px",
              fontWeight: 500,
            }}
          >
            Subject
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontSize: isVerySmallMobile ? "12px" : "13px",
              fontWeight: 600,
              wordBreak: "break-word",
            }}
          >
            {lecture?.chapter?.subject?.name}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Row - Chapter and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: isVerySmallMobile ? "11px" : "12px",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Chapter
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontSize: isVerySmallMobile ? "12px" : "13px",
              fontWeight: 600,
              wordBreak: "break-word",
            }}
          >
            {lecture?.chapter?.chapter}
          </Typography>
        </Box>

        {status === "UPCOMMING" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <MdOutlineEmergencyRecording
              size={isVerySmallMobile ? 20 : 22}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleLectureRecord(lecture);
              }}
            />
            <GrEdit
              size={isVerySmallMobile ? 16 : 18}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                handleCreateLecture(lecture, true);
              }}
            />
          </Box>
        )}
      </Box>
    </Card>
  );

  const renderMobileAccordionTable = () => {
    const tableCellStyle = {
      ...tableCellStyleBase,
      fontSize: isVerySmallMobile ? "11px" : "12px",
      padding: "8px 4px",
    };

    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "10px",
          border: "none",
          overflow: "hidden",
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
                  ...tableCellStyle,
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              >
                Date
              </TableCell>
              <TableCell sx={tableCellStyle}>Name</TableCell>
              <TableCell
                sx={{
                  ...tableCellStyle,
                  textAlign: "right",
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                {/* Arrow column */}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectureData?.data?.length > 0 ? (
              lectureData?.data?.map((lecture, index) => (
                <React.Fragment key={index}>
                  {/* Main row */}
                  <TableRow
                    onClick={() =>
                      status === "COMPLETED" &&
                      handleRowClick(lectureData?.data[index]?.id)
                    }
                    sx={{
                      cursor:
                        status === "COMPLETED" ? "pointer" : "default",
                      "&:hover":
                        status === "COMPLETED"
                          ? { backgroundColor: "#f5f5f5" }
                          : {},
                    }}
                  >
                    <TableCell sx={tableCellStyle}>
                      <CalendarIconCustom date={lecture.schedule_date} />
                    </TableCell>

                    <TableCell sx={tableCellStyle}>
                      <Typography
                        sx={{
                          fontSize: isVerySmallMobile ? "11px" : "12px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: isVerySmallMobile ? "120px" : "160px",
                        }}
                      >
                        {lecture.title}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        ...tableCellStyle,
                        textAlign: "right",
                        width: isVerySmallMobile ? "32px" : "40px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRow((prev) =>
                          prev === index ? null : index
                        );
                      }}
                    >
                      <BiSolidDownArrow
                        size={isVerySmallMobile ? 12 : 14}
                        style={{
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          transform:
                            expandedRow === index
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Accordion details row */}
                  {expandedRow === index && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          p: 0.5,
                          backgroundColor: "#fafafa",
                        }}
                      >
                        {renderLectureDetailsCard(lecture, index)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  /* ========= DESKTOP: Normal table ========= */
  const renderDesktopTable = () => {
    const tableCellStyle = {
      ...tableCellStyleBase,
      fontSize: isMobile ? "12px" : "14px",
      padding: isMobile ? "8px 4px" : "16px",
    };

    const tableHeaderStyle = {
      border: "none",
      color: "#3B3D3B",
      fontFamily: "Inter",
      fontWeight: "600",
      fontStyle: "normal",
      lineHeight: "normal",
      fontSize: isMobile ? "12px" : "14px",
      padding: isMobile ? "8px 4px" : "16px",
      position: "sticky",
      top: 0,
      backgroundColor: "#F3F5F7",
      zIndex: 1,
    };

    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          height: lectureData?.data?.length > 4 ? "100%" : "auto",
          overflowY: lectureData?.data?.length > 4 ? "scroll" : "visible",
          borderRadius: "10px",
          border: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Table
          sx={{ border: "none", minWidth: isTablet ? "600px" : "auto" }}
        >
          <TableHead
            sx={{
              backgroundColor: "#F3F5F7",
              borderRadius: "10px",
              border: "none",
            }}
          >
            <TableRow
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#F3F5F7",
              }}
            >
              <TableCell
                sx={{
                  ...tableHeaderStyle,
                  borderTopLeftRadius: "10px",
                  borderBottomLeftRadius: "10px",
                }}
              ></TableCell>
              <TableCell sx={tableHeaderStyle}>Name</TableCell>
              <TableCell sx={tableHeaderStyle}>Type</TableCell>
              <TableCell sx={tableHeaderStyle}>Time</TableCell>
              <TableCell sx={tableHeaderStyle}>Class</TableCell>
              <TableCell sx={tableHeaderStyle}>Subject Name</TableCell>
              <TableCell
                sx={{
                  ...tableHeaderStyle,
                  borderTopRightRadius: status === "UPCOMMING" ? 0 : "10px",
                  borderBottomRightRadius:
                    status === "UPCOMMING" ? 0 : "10px",
                }}
              >
                Chapter
              </TableCell>
              {status === "UPCOMMING" && (
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {lectureData?.data?.length > 0 ? (
              lectureData?.data?.map((lecture, index) => (
                <TableRow
                  key={index}
                  onClick={() =>
                    status === "COMPLETED" &&
                    handleRowClick(lectureData?.data[index]?.id)
                  }
                  sx={{
                    cursor:
                      status === "COMPLETED" ? "pointer" : "default",
                    "&:hover":
                      status === "COMPLETED"
                        ? { backgroundColor: "#f5f5f5" }
                        : {},
                  }}
                >
                  <TableCell sx={tableCellStyle}>
                    <CalendarIconCustom date={lecture.schedule_date} />
                  </TableCell>
                  <TableCell sx={tableCellStyle}>{lecture.title}</TableCell>
                  <TableCell sx={tableCellStyle}>
                    {lecture?.type
                      ? lecture.type.charAt(0).toUpperCase() +
                      lecture.type.slice(1)
                      : "-"}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    {lecture.schedule_time}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    {lecture?.lecture_class?.name}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    {lecture?.chapter?.subject?.name}
                  </TableCell>
                  <TableCell sx={tableCellStyle}>
                    {lecture?.chapter?.chapter}
                  </TableCell>
                  {status === "UPCOMMING" && (
                    <TableCell sx={tableCellStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MdOutlineEmergencyRecording
                          size={isMobile ? 18 : 22}
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLectureRecord(lecture);
                          }}
                        />
                        <GrEdit
                          size={isMobile ? 14 : 18}
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateLecture(lecture, true);
                          }}
                        />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={status === "UPCOMMING" ? 8 : 7}>
                  <Typography
                    align="center"
                    sx={{ py: 2, color: "#777" }}
                  >
                    No Data Available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box
      sx={{
        padding: isMobile ? 1 : 2,
        height: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        width: isMobile ? "90%" : "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Stats Cards Section */}
      <Box
        sx={{
          borderRadius: "20px",
          backgroundColor: "#fff",
          padding: isVerySmallMobile ? "12px" : isMobile ? "16px" : "32px",
          display: "flex",
          alignItems: "center",
          alignSelf: "stretch",
          boxSizing: "border-box",
          overflow: "hidden",
          width: "100%",
          mx: 0,
        }}
      >
        <Grid
          container
          spacing={isVerySmallMobile ? 1 : isMobile ? 2 : 4}
          sx={{
            margin: 0,
            width: "100%",
            "& .MuiGrid-item": {
              padding: isVerySmallMobile ? "4px" : isMobile ? "8px" : "16px",
            },
          }}
        >
          {["COMPLETED", "UPCOMMING", "MISSED", "CANCELLED"]?.map((value) =>
            tabLoader ? (
              <Grid item xs={6} sm={6} md={3} key={value}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: 2,
                    height: getCardHeight(),
                    width: "100%",
                  }}
                />
              </Grid>
            ) : (
              <Grid item xs={6} sm={6} md={3} key={value}>
                <Card
                  onClick={() => handleChange(value, "status")}
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: getCardHeight(),
                    p: getCardPadding(),
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "10px",
                    border: "0.5px solid #C1C1C1",
                    cursor: "pointer",
                    gap: getCardGap(),
                    borderLeft: `6px solid ${status === value
                        ? statusColorMap[value] || "#3498db"
                        : "transparent"
                      }`,
                    transition:
                      "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
                    boxSizing: "border-box",
                    minWidth: 0,
                    ...(status === value && {
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      transform: "translateY(-1px)",
                    }),
                    "&:hover": {
                      borderLeftColor: statusColorMap[value] || "#3498db",
                    },
                  }}
                  role="button"
                  aria-pressed={status === value}
                >
                  <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <Typography
                      sx={{
                        color: "#3B3D3B",
                        fontFamily: "Inter",
                        fontSize: getFontSize(),
                        fontWeight: 600,
                        lineHeight: getLineHeight(),
                        mb: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getStatusText(value)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={lectureCount[mapData[value]]?.percent || 0}
                      sx={{
                        height: isVerySmallMobile ? 4 : 6,
                        borderRadius: 5,
                        minWidth: "50px",
                        [`& .MuiLinearProgress-bar`]: {
                          backgroundColor: statusColorMap[value],
                        },
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#3B3D3B",
                      fontFamily: "Inter",
                      fontSize: getPercentageFontSize(),
                      fontWeight: 600,
                      lineHeight: getLineHeight(),
                      flexShrink: 0,
                      ml: 0.5,
                    }}
                  >
                    {`${lectureCount[mapData[value]]?.percent || 0}%`}
                  </Typography>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Box>

      {/* Search & Filters */}
      <SearchWithFilter />

      {/* Table Section */}
      <Box
        sx={{
          display: "flex",
          padding: isVerySmallMobile
            ? "12px"
            : isMobile
              ? "16px"
              : "24px 32px 32px 32px",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch",
          borderRadius: "20px",
          background: "#fff",
          marginTop: "10px",
          height: isMobile ? "auto" : "75vh",
          minHeight: isMobile ? "400px" : "auto",
          boxSizing: "border-box",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {loading ? (
          <Box sx={{ mt: 4, width: "100%" }}>
            <TableSkeleton row={isMobile ? 4 : 9} />
          </Box>
        ) : lectureData?.data?.length > 0 ? (
          <>
            {isMobile ? renderMobileAccordionTable() : renderDesktopTable()}

            {lectureData?.total > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 2,
                  width: "100%",
                }}
              >
                <Pagination
                  page={Number(activePage)}
                  onChange={(event, value) =>
                    handleChange(value, "activePage")
                  }
                  count={lectureData?.total}
                  variant="outlined"
                  color="primary"
                  size={
                    isVerySmallMobile ? "small" : isMobile ? "small" : "large"
                  }
                  boundaryCount={1}
                  siblingCount={1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: isDarkMode
                        ? darkModeStyles.paginationItemColor
                        : lightModeStyles.paginationItemColor,
                      fontSize: isVerySmallMobile
                        ? "10px"
                        : isMobile
                          ? "12px"
                          : "14px",
                      minWidth: isVerySmallMobile ? "30px" : "32px",
                      height: isVerySmallMobile ? "30px" : "32px",
                    },
                    "& .Mui-selected": {
                      backgroundColor: isDarkMode
                        ? darkModeStyles.paginationSelectedBg
                        : lightModeStyles.paginationSelectedBg,
                      color: isDarkMode
                        ? darkModeStyles.paginationSelectedColor
                        : lightModeStyles.paginationSelectedColor,
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: isMobile ? "200px" : "300px",
              width: "100%",
            }}
          >
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="textSecondary"
              sx={{ fontSize: isVerySmallMobile ? "14px" : "inherit" }}
            >
              No Data Available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LectureTabs;




















// "use client";
// import React, { useState, useEffect, useContext, useMemo } from "react";
// import {
//   Box,
//   Card,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Pagination,
//   Skeleton,
//   LinearProgress,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import CircularProgress, {
//   circularProgressClasses,
// } from "@mui/material/CircularProgress";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { getAllLectureCount, getMyLectures } from "@/api/apiHelper";
// import { useThemeContext } from "@/hooks/ThemeContext";
// import { BiSolidDownArrow } from "react-icons/bi";
// import LectureType from "@/commonComponents/LectureType/LectureType";
// import { MdOutlineEmergencyRecording } from "react-icons/md";
// import { GrEdit } from "react-icons/gr";
// import { AppContextProvider } from "@/app/main";
// import TeacherFilters from "@/components/teacher/lecture-listings/Filters/TeacherFilters";
// import TableSkeleton from "@/commonComponents/Skeleton/TableSkeleton/TableSkeleton";

// import { MdOutlineTrackChanges } from "react-icons/md";
// import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";
// import SearchWithFilter from "@/components/teacher/Assignment/SearchWithFilter";

// const LectureTabs = () => {
//   const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
//   const {
//     openRecordingDrawer,
//     openCreateLecture,
//     handleCreateLecture,
//     handleLectureRecord,
//   } = useContext(AppContextProvider);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const isSmallMobile = useMediaQuery('(max-width:480px)');
//   const isVerySmallMobile = useMediaQuery('(max-width:360px)');

//   const status = searchParams.get("status") || "COMPLETED";
//   const [lectureCount, setLectureCount] = useState({});
//   const [tabLoader, setTabLoader] = useState(false);
//   const [lectureData, setLectureData] = useState([]);

//   const classValue = searchParams.get("class") || "";
//   const subject = searchParams.get("subject") || "";
//   const searchQuery = searchParams.get("globalSearch") || "";
//   const month = searchParams.get("month") || "";
//   const lectureType = searchParams.get("lectureType") || "";
//   const activePage = parseInt(searchParams.get("activePage")) || 1;

//   const encodeURI = (value) => {
//     return encodeURIComponent(value);
//   };

//   useEffect(() => {
//     fetchAllLectureCount();
//   }, []);

//   useEffect(() => {
//     fetchLectureData();
//   }, [
//     searchQuery,
//     month,
//     lectureType,
//     status,
//     activePage,
//     subject,
//     classValue,
//   ]);

//   const statusColorMap = {
//     COMPLETED: "#2ecc71", // green
//     UPCOMMING: "#3498db", // blue
//     MISSED: "#f1c40f", // yellow
//     CANCELLED: "#e74c3c", // red
//   };

//   const fetchAllLectureCount = async () => {
//     try {
//       setTabLoader(true);
//       const response = await getAllLectureCount();
//       setLectureCount(response?.data?.data);
//       setTabLoader(false);
//     } catch (error) {
//       setTabLoader(false);
//       console.error(error);
//     }
//   };

//   const fetchLectureData = async () => {
//     try {
//       setLoading(true);
//       const response = await getMyLectures(
//         status,
//         lectureType ? lectureType : "",
//         searchQuery,
//         activePage,
//         10,
//         month,
//         subject,
//         classValue
//       );
//       setLectureData(response?.data?.data?.lecture_data);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error(error);
//     }
//   };

//   const mapData = {
//     COMPLETED: "completed_lectures",
//     UPCOMMING: "upcomming_lectures",
//     MISSED: "missed_lectures",
//     CANCELLED: "cancelled_lectures",
//   };

//   const darkModeStyles = {
//     backgroundColor: "#1a1a1a",
//     paginationItemColor: "#ffffff",
//     paginationBg: "#333333",
//     paginationSelectedBg: "#005bb5",
//     paginationSelectedColor: "#ffffff",
//   };

//   const lightModeStyles = {
//     backgroundColor: "#ffffff",
//     paginationItemColor: "#000000",
//     paginationBg: "#f0f0f0",
//     paginationSelectedBg: "#005bb5",
//     paginationSelectedColor: "#ffffff",
//   };

//   const handleChange = (value, parameterTypes) => {
//     const newSearchParams = new URLSearchParams(searchParams.toString());
//     newSearchParams.set(parameterTypes, value);
//     router.push(`${pathname}?${newSearchParams.toString()}`);
//   };

//   const handleRowClick = (id) => {
//     router.push(`/teacher/lecture-listings/${id}`);
//   };

//   // Mobile-friendly table data rendering - FIXED VERSION
//   const renderMobileCards = () => {
//     return lectureData?.data?.map((lecture, index) => (
//       <Card
//         key={index}
//         sx={{
//           mb: 2,
//           p: 2,
//           mx: 0.5, // Add small horizontal margin
//           cursor: status === "COMPLETED" ? 'pointer' : 'default',
//           borderRadius: '10px',
//           border: '1px solid #e0e0e0',
//           width: 'calc(100% - 8px)', // Ensure full width with margin
//           boxSizing: 'border-box',
//           '&:hover': status === "COMPLETED" ? {
//             backgroundColor: '#f8f9fa',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//           } : {}
//         }}
//         onClick={() => status === "COMPLETED" && handleRowClick(lectureData?.data[index]?.id)}
//       >
//         {/* Header Row - Title with Calendar */}
//         <Box sx={{
//           display: 'flex',
//           alignItems: 'flex-start',
//           mb: 2,
//           gap: 1
//         }}>
//           <Box sx={{ flexShrink: 0 }}>
//             <CalendarIconCustom date={lecture.schedule_date} />
//           </Box>
//           <Typography
//             variant="subtitle1"
//             sx={{
//               fontWeight: 'bold',
//               fontSize: isVerySmallMobile ? '14px' : '15px',
//               lineHeight: 1.3,
//               flex: 1,
//               wordBreak: 'break-word' // Allow text to break
//             }}
//           >
//             {lecture.title}
//           </Typography>
//         </Box>

//         {/* Details Grid - 2 columns */}
//         <Box sx={{
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: 1.5,
//           mb: 2
//         }}>
//           <Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#666',
//                 fontSize: isVerySmallMobile ? '11px' : '12px',
//                 fontWeight: 500
//               }}
//             >
//               Type
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#333',
//                 fontSize: isVerySmallMobile ? '12px' : '13px',
//                 fontWeight: 600
//               }}
//             >
//               {lecture?.type?.charAt(0).toUpperCase() + lecture?.type?.slice(1)}
//             </Typography>
//           </Box>

//           <Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#666',
//                 fontSize: isVerySmallMobile ? '11px' : '12px',
//                 fontWeight: 500
//               }}
//             >
//               Time
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#333',
//                 fontSize: isVerySmallMobile ? '12px' : '13px',
//                 fontWeight: 600
//               }}
//             >
//               {lecture.schedule_time}
//             </Typography>
//           </Box>

//           <Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#666',
//                 fontSize: isVerySmallMobile ? '11px' : '12px',
//                 fontWeight: 500
//               }}
//             >
//               Class
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#333',
//                 fontSize: isVerySmallMobile ? '12px' : '13px',
//                 fontWeight: 600
//               }}
//             >
//               {lecture?.lecture_class?.name}
//             </Typography>
//           </Box>

//           <Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#666',
//                 fontSize: isVerySmallMobile ? '11px' : '12px',
//                 fontWeight: 500
//               }}
//             >
//               Subject
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#333',
//                 fontSize: isVerySmallMobile ? '12px' : '13px',
//                 fontWeight: 600,
//                 wordBreak: 'break-word'
//               }}
//             >
//               {lecture?.chapter?.subject?.name}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Bottom Row - Chapter and Actions */}
//         <Box sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: 1
//         }}>
//           <Box sx={{ flex: 1, minWidth: 0 }}>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#666',
//                 fontSize: isVerySmallMobile ? '11px' : '12px',
//                 fontWeight: 500,
//                 mb: 0.5
//               }}
//             >
//               Chapter
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: '#333',
//                 fontSize: isVerySmallMobile ? '12px' : '13px',
//                 fontWeight: 600,
//                 wordBreak: 'break-word'
//               }}
//             >
//               {lecture?.chapter?.chapter}
//             </Typography>
//           </Box>

//           {status === "UPCOMMING" && (
//             <Box sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1,
//               flexShrink: 0
//             }}>
//               <MdOutlineEmergencyRecording
//                 size={isVerySmallMobile ? 20 : 22}
//                 style={{ cursor: "pointer" }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleLectureRecord(lecture);
//                 }}
//               />
//               <GrEdit
//                 size={isVerySmallMobile ? 16 : 18}
//                 style={{ cursor: "pointer" }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleCreateLecture(lecture, true);
//                 }}
//               />
//             </Box>
//           )}
//         </Box>
//       </Card>
//     ));
//   };

//   // Desktop table view
//   const renderDesktopTable = () => {
//     const tableCellStyle = {
//       fontWeight: 700,
//       color: "#3B3D3B",
//       fontFamily: "Inter, sans-serif",
//       fontSize: isMobile ? "12px" : "14px",
//       fontStyle: "normal",
//       lineHeight: "normal",
//       padding: isMobile ? "8px 4px" : "16px",
//     };

//     const tableHeaderStyle = {
//       border: "none",
//       color: "#3B3D3B",
//       fontFamily: "Inter",
//       fontWeight: "600",
//       fontStyle: "normal",
//       lineHeight: "normal",
//       fontSize: isMobile ? "12px" : "14px",
//       padding: isMobile ? "8px 4px" : "16px",
//       position: "sticky",
//       top: 0,
//       backgroundColor: "#F3F5F7",
//       zIndex: 1,
//     };

//     return (
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{
//           height: lectureData?.data?.length > 4 ? "100%" : "auto",
//           overflowY: lectureData?.data?.length > 4 ? "scroll" : "visible",
//           borderRadius: "10px",
//           border: "none",
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//           "&::-webkit-scrollbar": {
//             display: "none",
//           },
//         }}
//       >
//         <Table sx={{ border: "none", minWidth: isTablet ? '600px' : 'auto' }}>
//           <TableHead
//             sx={{
//               backgroundColor: "#F3F5F7",
//               borderRadius: "10px",
//               border: "none",
//             }}
//           >
//             <TableRow
//               sx={{
//                 position: "sticky",
//                 top: 0,
//                 zIndex: 1,
//                 backgroundColor: "#F3F5F7",
//               }}
//             >
//               <TableCell
//                 sx={{
//                   ...tableHeaderStyle,
//                   borderTopLeftRadius: "10px",
//                   borderBottomLeftRadius: "10px",
//                 }}
//               ></TableCell>
//               <TableCell sx={tableHeaderStyle}>
//                 Name
//               </TableCell>
//               <TableCell sx={tableHeaderStyle}>
//                 Type
//               </TableCell>
//               <TableCell sx={tableHeaderStyle}>
//                 Time
//               </TableCell>
//               <TableCell sx={tableHeaderStyle}>
//                 Class
//               </TableCell>
//               <TableCell sx={tableHeaderStyle}>
//                 Subject Name
//               </TableCell>
//               <TableCell
//                 sx={{
//                   ...tableHeaderStyle,
//                   borderTopRightRadius: "10px",
//                   borderBottomRightRadius: "10px",
//                 }}
//               >
//                 Chapter
//               </TableCell>
//               {status === "UPCOMMING" && (
//                 <TableCell
//                   sx={{
//                     ...tableHeaderStyle,
//                     borderTopRightRadius: "10px",
//                     borderBottomRightRadius: "10px",
//                   }}
//                 >
//                   Action
//                 </TableCell>
//               )}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {lectureData?.data?.map((lecture, index) => (
//               <TableRow
//                 key={index}
//                 onClick={() =>
//                   status === "COMPLETED" &&
//                   handleRowClick(lectureData?.data[index]?.id)
//                 }
//                 sx={{
//                   cursor: status === "COMPLETED" ? 'pointer' : 'default',
//                   '&:hover': status === "COMPLETED" ? { backgroundColor: '#f5f5f5' } : {}
//                 }}
//               >
//                 <TableCell sx={tableCellStyle}>
//                   <CalendarIconCustom date={lecture.schedule_date} />
//                 </TableCell>
//                 <TableCell sx={tableCellStyle}>{lecture.title}</TableCell>
//                 <TableCell sx={tableCellStyle}>
//                   {lecture?.type?.charAt(0).toUpperCase() +
//                     lecture?.type?.slice(1)}
//                 </TableCell>
//                 <TableCell sx={tableCellStyle}>
//                   {lecture.schedule_time}
//                 </TableCell>
//                 <TableCell sx={tableCellStyle}>
//                   {lecture?.lecture_class?.name}
//                 </TableCell>
//                 <TableCell sx={tableCellStyle}>
//                   {lecture?.chapter?.subject?.name}
//                 </TableCell>
//                 <TableCell sx={tableCellStyle}>
//                   {lecture?.chapter?.chapter}
//                 </TableCell>
//                 {status === "UPCOMMING" && (
//                   <TableCell sx={tableCellStyle}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >
//                       <MdOutlineEmergencyRecording
//                         size={isMobile ? 18 : 22}
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleLectureRecord(lecture)}
//                       />
//                       <GrEdit
//                         size={isMobile ? 14 : 18}
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleCreateLecture(lecture, true)}
//                       />
//                     </Box>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   // Card height calculations for consistent sizing
//   const getCardHeight = () => {
//     if (isVerySmallMobile) return "70px";
//     if (isMobile) return "65px";
//     return "50px";
//   };

//   const getCardPadding = () => {
//     if (isVerySmallMobile) return "6px 8px";
//     if (isMobile) return "8px 10px";
//     return "5.5px 9px";
//   };

//   const getCardGap = () => {
//     if (isVerySmallMobile) return "6px";
//     if (isMobile) return "8px";
//     return "10px";
//   };

//   const getStatusText = (value) => {
//     if (isVerySmallMobile) return value.slice(0, 3);
//     if (isMobile) return value.slice(0, 4);
//     return value.charAt(0) + value.slice(1).toLowerCase();
//   };

//   const getFontSize = () => {
//     if (isVerySmallMobile) return "11px";
//     if (isMobile) return "12px";
//     return "14px";
//   };

//   const getPercentageFontSize = () => {
//     if (isVerySmallMobile) return "12px";
//     if (isMobile) return "14px";
//     return "18.192px";
//   };

//   const getLineHeight = () => {
//     if (isVerySmallMobile) return "14px";
//     if (isMobile) return "16px";
//     return "19px";
//   };

//   return (
//     <Box
//       sx={{
//         padding: isMobile ? 1 : 2,
//         height: "100%",
//         minHeight: "100vh",
//         overflowX: 'hidden',
//         width: isMobile ? '90%' : '100%', // Mobile: 90%, Desktop: 100%
//         boxSizing: 'border-box'
//       }}
//     >
//       {/* Stats Cards Section */}
//       <Box
//         sx={{
//           borderRadius: "20px",
//           backgroundColor: "#fff",
//           padding: isVerySmallMobile ? "12px" : isMobile ? "16px" : "32px",
//           display: "flex",
//           alignItems: "center",
//           alignSelf: "stretch",
//           boxSizing: 'border-box',
//           overflow: 'hidden',
//           width: '100%',
//           mx: 0
//         }}
//       >
//         <Grid
//           container
//           spacing={isVerySmallMobile ? 1 : isMobile ? 2 : 4}
//           sx={{
//             margin: 0,
//             width: '100%',
//             '& .MuiGrid-item': {
//               padding: isVerySmallMobile ? '4px' : isMobile ? '8px' : '16px'
//             }
//           }}
//         >
//           {["COMPLETED", "UPCOMMING", "MISSED", "CANCELLED"]?.map((value) =>
//             tabLoader ? (
//               <Grid
//                 item
//                 xs={6}
//                 sm={6}
//                 md={3}
//                 key={value}
//               >
//                 <Skeleton
//                   variant="rectangular"
//                   sx={{
//                     borderRadius: 2,
//                     height: getCardHeight(),
//                     width: '100%',
//                   }}
//                 />
//               </Grid>
//             ) : (
//               <Grid
//                 item
//                 xs={6}
//                 sm={6}
//                 md={3}
//                 key={value}
//               >
//                 <Card
//                   onClick={() => handleChange(value, "status")}
//                   sx={{
//                     display: "flex",
//                     width: "100%",
//                     height: getCardHeight(),
//                     p: getCardPadding(),
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     borderRadius: "10px",
//                     border: "0.5px solid #C1C1C1",
//                     cursor: "pointer",
//                     gap: getCardGap(),
//                     borderLeft: `6px solid ${status === value ? (statusColorMap[value] || "#3498db") : "transparent"}`,
//                     transition: "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
//                     boxSizing: 'border-box',
//                     minWidth: 0,
//                     ...(status === value && {
//                       boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//                       transform: "translateY(-1px)",
//                     }),
//                     "&:hover": {
//                       borderLeftColor: statusColorMap[value] || "#3498db",
//                     },
//                   }}
//                   role="button"
//                   aria-pressed={status === value}
//                 >
//                   <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
//                     <Typography
//                       sx={{
//                         color: "#3B3D3B",
//                         fontFamily: "Inter",
//                         fontSize: getFontSize(),
//                         fontWeight: 600,
//                         lineHeight: getLineHeight(),
//                         mb: "4px",
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                       }}
//                     >
//                       {getStatusText(value)}
//                     </Typography>
//                     <LinearProgress
//                       variant="determinate"
//                       value={lectureCount[mapData[value]]?.percent || 0}
//                       sx={{
//                         height: isVerySmallMobile ? 4 : 6,
//                         borderRadius: 5,
//                         minWidth: '50px',
//                         [`& .MuiLinearProgress-bar`]: {
//                           backgroundColor: statusColorMap[value],
//                         },
//                         backgroundColor: "#f0f0f0",
//                       }}
//                     />
//                   </Box>
//                   <Typography
//                     sx={{
//                       color: "#3B3D3B",
//                       fontFamily: "Inter",
//                       fontSize: getPercentageFontSize(),
//                       fontWeight: 600,
//                       lineHeight: getLineHeight(),
//                       flexShrink: 0,
//                       ml: 0.5,
//                     }}
//                   >
//                     {`${lectureCount[mapData[value]]?.percent || 0}%`}
//                   </Typography>
//                 </Card>
//               </Grid>
//             )
//           )}
//         </Grid>
//       </Box>

//       <SearchWithFilter />

//       {/* Table Section */}
//       <Box
//         sx={{
//           display: "flex",
//           padding: isVerySmallMobile ? "12px" : isMobile ? "16px" : "24px 32px 32px 32px",
//           flexDirection: "column",
//           alignItems: "center",
//           gap: "16px",
//           alignSelf: "stretch",
//           borderRadius: "20px",
//           background: "#fff",
//           marginTop: "10px",
//           height: isMobile ? "auto" : "75vh",
//           minHeight: isMobile ? "400px" : "auto",
//           boxSizing: 'border-box',
//           overflow: 'hidden',
//           width: '100%'
//         }}
//       >
//         {loading ? (
//           <Box sx={{ mt: 4, width: '100%' }}>
//             <TableSkeleton row={isMobile ? 4 : 9} />
//           </Box>
//         ) : lectureData?.data?.length > 0 ? (
//           <>
//             {isMobile ? renderMobileCards() : renderDesktopTable()}

//             {lectureData?.total > 1 && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   padding: 2,
//                   width: '100%',
//                 }}
//               >
//                 <Pagination
//                   page={Number(activePage)}
//                   onChange={(event, value) => handleChange(value, "activePage")}
//                   count={lectureData?.total}
//                   variant="outlined"
//                   color="primary"
//                   size={isVerySmallMobile ? "small" : isMobile ? "small" : "large"}
//                   boundaryCount={1}  // Start aur end mein 1 number
//                   siblingCount={1}   // Current page ke around 1 number
//                   sx={{
//                     "& .MuiPaginationItem-root": {
//                       color: isDarkMode
//                         ? darkModeStyles.paginationItemColor
//                         : lightModeStyles.paginationItemColor,
//                       fontSize: isVerySmallMobile ? '10px' : isMobile ? '12px' : '14px',
//                       minWidth: isVerySmallMobile ? '30px' : '32px',
//                       height: isVerySmallMobile ? '30px' : '32px',
//                     },
//                     "& .Mui-selected": {
//                       backgroundColor: isDarkMode
//                         ? darkModeStyles.paginationSelectedBg
//                         : lightModeStyles.paginationSelectedBg,
//                       color: isDarkMode
//                         ? darkModeStyles.paginationSelectedColor
//                         : lightModeStyles.paginationSelectedColor,
//                     },
//                   }}
//                 />
//               </Box>
//             )}
//           </>
//         ) : (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: isMobile ? '200px' : '300px',
//               width: '100%'
//             }}
//           >
//             <Typography
//               variant={isMobile ? "body1" : "h6"}
//               color="textSecondary"
//               sx={{ fontSize: isVerySmallMobile ? '14px' : 'inherit' }}
//             >
//               No Data Available
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default LectureTabs;