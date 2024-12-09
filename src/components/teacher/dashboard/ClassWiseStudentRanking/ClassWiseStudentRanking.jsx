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
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

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
    return Object.entries(gradewiseData || {}).map(([key, value]) => ({
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
      }}
      className="blur_effect_card"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: isDarkMode ? "#fff" : "#000",
            fontWeight: 600,
          }}
        >
          Student Ranking
        </Typography>
      </Box>

      {/* Class Selection Toggle */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={classTabValue}
          exclusive
          onChange={handleClassTabChange}
          aria-label="Class Selection"
          sx={{
            mb: 3,
            width: "100%", // Ensure the ToggleButtonGroup takes full width
            "& .MuiToggleButtonGroup-grouped": {
              flex: 1, // Make each ToggleButton take equal space
            },
            "& .MuiToggleButton-root": {
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "#555" : "#ccc",
              "&.Mui-selected": {
                backgroundColor: primaryColor,
                color: isDarkMode ? "black" : "white",
              },
            },
          }}
        >
          <ToggleButton value="Overall" aria-label="Overall Class">
            Overall Class
          </ToggleButton>
          <ToggleButton value="MyClass" aria-label="My Class">
            My Class
          </ToggleButton>
        </ToggleButtonGroup>
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
            justifyContent: "center",
          },
          "& .MuiTab-root": {
            color: primaryColor,
            fontWeight: 600,
            "&.Mui-selected": {
              color: "#0984e3",
            },
          },
        }}
      >
        <Tab label={`Active (${data.active_students || 0})`} />
        <Tab label={`Inactive (${data.inactive_students || 0})`} />
      </Tabs>

      {/* Pie Chart */}
      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: 240,
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="circular" width={240} height={240} />
        </Box>
      ) : Object.entries(data)?.length > 0 &&
        getChartData().every((item) => Number(item.value) === 0) ? (
        <Box
          sx={{
            width: "100%",
            height: 240,
            mt: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              position: "absolute",
              fontSize: 24,
              fontWeight: 600,
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            No Data Available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={55}
                outerRadius={110}
                label={renderCustomizedLabel}
                dataKey="value"
              >
                {getChartData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={mapData[entry.name]?.color}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderRadius: 8,
                }}
                labelStyle={{
                  color: isDarkMode ? "#fff" : "#000",
                }}
                itemStyle={{
                  color: isDarkMode ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Grade Details */}
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={100}
          sx={{ mt: 2 }}
        />
      ) : (
        Object.entries(data)?.length > 0 && (
          <Grid container spacing={2} mt={2}>
            {getChartData().map((entry) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={statusTabValue === 0 ? 4 : 6}
                key={entry.name}
                onClick={() => handleOpenModal(entry.name)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: mapData[entry.name]?.color,
                    borderRadius: "50%",
                    mr: 2,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: isDarkMode ? "#fff" : "#000",
                      fontWeight: 600,
                    }}
                  >
                    Grade:{mapData[entry.name]?.grade}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? "#ccc" : "#666",
                      mt: 0.5,
                    }}
                  >
                    {entry.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )
      )}
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
      <DialogTitle sx={{ backgroundColor: "#3f51b5", color: "#fff" }}>
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
          <TableContainer component={Paper}>
            <Table aria-label="student details">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email Id</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Avg Overall Percentage
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Grade</TableCell>
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
                        <TableCell sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                          {row.student__user__full_name}
                        </TableCell>
                        <TableCell>{row.student__user__email}</TableCell>
                        <TableCell>{row.avg_overall_percentage}</TableCell>
                        <TableCell>{selectedGrad}</TableCell>
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
