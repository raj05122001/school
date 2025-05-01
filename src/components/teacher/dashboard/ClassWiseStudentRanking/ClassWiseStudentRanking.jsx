import React, { useEffect, useState } from "react";
import { getCountByCategory, getStudentByGrade } from "@/api/apiHelper";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Tabs,
  Tab,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Rating,
  LinearProgress,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { FaRankingStar } from "react-icons/fa6";

const RADIAN = Math.PI / 180;

const mapData = {
  A: { name: "Advanced", color: "#00b894", grade: "A" },
  B: { name: "Intermediate", color: "#ff7675", grade: "B" },
  C: { name: "Proficient", color: "#0984e3", grade: "C" },
  D: { name: "Basic", color: "#fdcb6e", grade: "D" },
  E: { name: "Beginner", color: "#e17055", grade: "E" },
};

// Custom label for pie chart slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const check = percent * 100 > 0;
  return (
    <text
      x={x}
      y={y}
      fill="#D3D3D3"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {`${check ? `${(percent * 100).toFixed(0)}%` : ""}`}
    </text>
  );
};

const ClassWiseStudentRanking = ({ selectedOptions }) => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusTabValue, setStatusTabValue] = useState(0);
  const [classTabValue, setClassTabValue] = useState("Overall");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrad, setSelectedGrad] = useState("");

  const isMyClass = classTabValue === "MyClass";

  const handleOpenModal = (grade) => {
    setSelectedGrad(grade);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (selectedOptions?.class_id) {
      fetchCountByCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions, classTabValue]);

  const fetchCountByCategory = async () => {
    setLoading(true);
    try {
      const response = await getCountByCategory(
        selectedOptions?.class_id,
        isMyClass ? userDetails?.teacher_id : 0
      );
      setData(response?.data?.data || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTabChange = (event, newValue) => {
    setStatusTabValue(newValue);
  };

  const handleClassTabChange = (event, newValue) => {
    if (newValue !== null) {
      setClassTabValue(newValue);
    }
  };

  const getChartData = () => {
    const gradewiseData =
      statusTabValue === 0
        ? data.active_students_gradewise
        : data.inactive_students_gradewise;
    return Object.entries(gradewiseData || {})?.map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  return (
    <Card
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor:"#fff",
        borderRadius:"20px",
        border:"none",
        boxShadow:"none"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.67 14H4C2.9 14 2 14.9 2 16V22H8.67V14Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M13.3299 10H10.6599C9.55991 10 8.65991 10.9 8.65991 12V22H15.3299V12C15.3299 10.9 14.4399 10 13.3299 10Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20.0001 17H15.3301V22H22.0001V19C22.0001 17.9 21.1001 17 20.0001 17Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.52 2.07007L13.05 3.13006C13.12 3.28006 13.31 3.42006 13.47 3.44006L14.43 3.60007C15.04 3.70007 15.19 4.15005 14.75 4.58005L14 5.33005C13.87 5.46005 13.8 5.70006 13.84 5.87006L14.05 6.79007C14.22 7.52007 13.83 7.80007 13.19 7.42007L12.29 6.89007C12.13 6.79007 11.86 6.79007 11.7 6.89007L10.8 7.42007C10.16 7.80007 9.76998 7.52007 9.93998 6.79007L10.15 5.87006C10.19 5.70006 10.12 5.45005 9.98999 5.33005L9.24999 4.59006C8.80999 4.15006 8.94999 3.71005 9.56999 3.61005L10.53 3.45007C10.69 3.42007 10.88 3.28007 10.95 3.14007L11.48 2.08005C11.77 1.50005 12.23 1.50007 12.52 2.07007Z"
              stroke="#3B3D3B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <Typography
            variant="h5"
            sx={{
              color: isDarkMode ? "#fff" : "#000",
              fontWeight: 600,
            }}
          >
            Ranking
          </Typography>
        </Box>
        {/* Class Selection Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={classTabValue}
            exclusive
            onChange={handleClassTabChange}
            aria-label="Class Selection"
            sx={{
              width: "100%", // Ensure the ToggleButtonGroup takes full width
              "& .MuiToggleButtonGroup-grouped": {
                flex: 1, // Make each ToggleButton take equal space
              },
              "& .MuiToggleButton-root": {
                color: isDarkMode ? "#fff" : "#8C8F90",
                borderColor: isDarkMode ? "#555" : "transparent",
                fontWeight: 600,
                fontSize: "16px",
                borderRadius: "8px",
                lineHeight: "24.06px",
                "&.Mui-selected": {
                  backgroundColor: "#F3F5F7",
                  color: isDarkMode ? "black" : "#3B3D3B",
                },
              },
            }}
          >
            <ToggleButton value="Overall" aria-label="Overall Class">
              Overall
            </ToggleButton>
            <ToggleButton value="MyClass" aria-label="My Class">
              Class
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Active/Inactive Tabs */}
      <Tabs
        value={statusTabValue}
        onChange={handleStatusTabChange}
        aria-label="Status Tabs"
        // indicatorColor="primary"
        // textColor="primary"
        sx={{
          mb: 2,
          "& .MuiTabs-flexContainer": {
            // justifyContent: "center",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
          },

          "& .MuiTab-root": {
            color: isDarkMode ? "#fff" : "#8C8F90",
            borderColor: isDarkMode ? "#555" : "transparent",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24.06px",
            "&.Mui-selected": {
              backgroundColor: "#F3F5F7",
              color: isDarkMode ? "black" : "#3B3D3B",
            },
          },
        }}
      >
        <Tab label={`Active`} />
        <Tab label={`Inactive`} />
      </Tabs>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {getChartData()?.map((entry, index) => (
          <Box
            key={entry?.name}
            onClick={() => handleOpenModal(entry.name)}
            sx={{
              border: "1px solid #C1C1C1",
              borderRadius: "8px",
              padding: "11px 7px 11px 7px",
              display: "flex",
              width: "100%",
              // alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                Grade {mapData[entry.name]?.grade}
              </Typography>

              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={entry.value}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        entry.name === "A"
                          ? "#14AE5C"
                          : entry.name === "B"
                          ? "#FF9500"
                          : entry.name === "C"
                          ? "#FF3B30"
                          : entry.name === "D"
                          ? "#F4C242"
                          : "#F45B5B",
                    },
                    "&.MuiLinearProgress-colorPrimary": {
                      backgroundColor: "#E0E0E0",
                    },
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#3D3D3D",
                  lineHeight: "32.91px",
                }}
              >
                {entry.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {modalOpen && (
        <StudentModal
          open={modalOpen}
          handleClose={handleCloseModal}
          selectedGrad={selectedGrad}
          selectedOptions={selectedOptions}
          isMyClass={isMyClass}
          userDetails={userDetails}
        />
      )}
    </Card>
  );
};

export default ClassWiseStudentRanking;

export const StudentModal = ({
  open,
  handleClose,
  selectedGrad,
  selectedOptions,
  isMyClass,
  userDetails,
}) => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    fetchStudentByGrade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrad]);

  const fetchStudentByGrade = async () => {
    setLoading(true);
    try {
      const response = await getStudentByGrade(
        selectedOptions?.class_id,
        selectedGrad,
        isMyClass ? userDetails?.teacher_id : 0
      );
      setStudentData(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ backgroundColor: "#fff", color: "#000", fontFamily: "Inter" }}
      >
        Student Details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <AiOutlineClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "10px", border: "none" }}
          >
            <Table aria-label="student details" sx={{ border: "none" }}>
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
                    Name
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
                    Email Id
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
                    Avg Overall Percentage
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
                  >
                    Grade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 4 }, (_, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell component="th" scope="row">
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={30}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={30}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={30}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={30}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : studentData?.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell
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
                          {row.student__user__full_name}
                        </TableCell>
                        <TableCell
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
                          {row.student__user__email}
                        </TableCell>
                        <TableCell
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
                          {row.avg_overall_percentage}
                        </TableCell>
                        <TableCell
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
                          {selectedGrad}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </DialogContent>
    </Dialog>
  );
};
