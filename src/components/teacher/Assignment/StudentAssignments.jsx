import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { MdOutlineCreditScore, MdOutlineMail } from "react-icons/md";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { useThemeContext } from "@/hooks/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { FaDiamond } from "react-icons/fa6";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";

const StudentAssignments = ({ listData }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  const handleRoute = async (id) => {
    router.push(`${pathname}/${id}`);
  };

  const handleExpandClick = (index, e) => {
    e.stopPropagation();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const data = listData?.data || [];

  /* ---------------- Desktop Table (old design) ---------------- */
  const renderDesktopTable = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "none",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
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
            >
              Submitted by
            </TableCell>
            <TableCell
              sx={{
                border: "none",
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: "normal",
                fontSize: "14px",
              }}
            >
              Checked Status
            </TableCell>
            <TableCell
              sx={{
                border: "none",
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: "normal",
                fontSize: "14px",
              }}
            >
              Checked Assignment
            </TableCell>
            <TableCell
              sx={{
                border: "none",
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: "normal",
                fontSize: "14px",
              }}
            >
              Total Assignment
            </TableCell>
            <TableCell
              sx={{
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
                border: "none",
                color: "#3B3D3B",
                fontFamily: "Inter",
                fontWeight: "600",
                fontStyle: "normal",
                lineHeight: "normal",
                fontSize: "14px",
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderBottom: "none" }}>
          {data.map((lecture, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                cursor: "pointer",
                backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
              }}
            >
              <TableCell>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    fontWeight: 700,
                    color: "#3B3D3B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    width: "105px",
                  }}
                  gap={2}
                >
                  <UserImage
                    profilePic={lecture?.user?.profile_pic}
                    name={lecture?.user?.full_name}
                    width={24}
                    height={24}
                  />
                  <Box flex="1">
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ fontSize: "14px", color: "#3B3D3B" }}
                    >
                      {lecture?.user?.full_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={secondaryColor}
                      sx={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#3B3D3B",
                      }}
                    >
                      {lecture?.user?.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {lecture?.total_submitted_assignment ===
                  lecture?.checked_assignments ? (
                    <Box
                      sx={{
                        height: "16px",
                        width: "16px",
                        borderRadius: "100%",
                        backgroundColor: "#34C759",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "16px",
                        width: "16px",
                        borderRadius: "100%",
                        backgroundColor: "#FF3B30",
                      }}
                    />
                  )}
                  <Typography variant="body2" fontWeight="bold">
                    {lecture?.total_submitted_assignment ===
                    lecture?.checked_assignments
                      ? "Checked"
                      : "Not Checked"}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <span
                  style={{
                    fontWeight: 700,
                    color: "#3B3D3B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    width: "105px",
                  }}
                >
                  {lecture?.checked_assignments}
                </span>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#3B3D3B",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    width: "105px",
                  }}
                >
                  {lecture?.total_submitted_assignment}
                </Typography>
              </TableCell>
              <TableCell onClick={() => handleRoute(lecture?.id)}>
                <img
                  src="/arrow-square-right.png"
                  style={{ width: "24px", height: "24px" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  /* ---------------- Mobile Accordion Cards ---------------- */
  const renderMobileCards = () => {
    if (!data.length) {
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
            mb: 1.5,
            p: 1,
            width: "100%",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#262626" : "#f8f9fa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
          onClick={() => handleRoute(lecture?.id)}
        >
          {/* HEADER: user + arrow */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <UserImage
              profilePic={lecture?.user?.profile_pic}
              name={lecture?.user?.full_name}
              width={32}
              height={32}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#3B3D3B",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {lecture?.user?.full_name}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "11px",
                  color: "#6b6b6b",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {lecture?.user?.email}
              </Typography>
            </Box>

            {/* Arrow button */}
            <IconButton
              size="small"
              onClick={(e) => handleExpandClick(index, e)}
              sx={{ p: 0 }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "8px",
                  border: "1.5px solid #34C759",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#34C759",
                    transform: isExpanded ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  &gt;
                </Typography>
              </Box>
            </IconButton>
          </Box>

          {/* COLLAPSE CONTENT */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                mt: 1,
                pt: 1,
                borderTop: "1px dashed #e0e0e0",
              }}
            >
              {/* Checked status */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {lecture?.total_submitted_assignment ===
                lecture?.checked_assignments ? (
                  <Box
                    sx={{
                      height: "14px",
                      width: "14px",
                      borderRadius: "100%",
                      backgroundColor: "#34C759",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "14px",
                      width: "14px",
                      borderRadius: "100%",
                      backgroundColor: "#FF3B30",
                    }}
                  />
                )}
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "13px" }}
                >
                  {lecture?.total_submitted_assignment ===
                  lecture?.checked_assignments
                    ? "Checked"
                    : "Not Checked"}
                </Typography>
              </Box>

              {/* Checked & Total numbers */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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
                    Checked Assignment
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {lecture?.checked_assignments}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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
                    Total Assignment
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {lecture?.total_submitted_assignment}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Card>
      );
    });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 1.5, sm: 2 },
        backgroundColor: "var(--Website_color-white, #FFF)",
        borderRadius: "20px",
      }}
    >
      {isMobile ? renderMobileCards() : renderDesktopTable()}
    </Box>
  );
};

export default StudentAssignments;
