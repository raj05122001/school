import {
  getCountByCategory,
  getStudentByGrade,
  getteacherClass,
} from "@/api/apiHelper";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
  Collapse,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { AiOutlineClose, AiOutlineUp, AiOutlineDown } from "react-icons/ai";

const RADIAN = Math.PI / 180;

const mapData = {
  A: { name: "Advanced", color: "#00b894" },
  B: { name: "Intermediate", color: "#ff7675" },
  C: { name: "Proficient", color: "#0984e3" },
  D: { name: "Basic", color: "#fdcb6e" },
  E: { name: "Beginner", color: "#e17055" },
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

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ClassWiseStudentRanking = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [tabValue, setTabValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrad, setSelectedGrad] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);

  const handleOpenModal = (grade) => {
    setSelectedGrad(grade);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    fetchClassOptions();
  }, []);

  const fetchClassOptions = async () => {
    try {
      const response = await getteacherClass();
      setClassOptions(response?.data?.data?.class_subject_list);
      setSelectedOptions(response?.data?.data?.class_subject_list?.[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedOptions?.class_id) {
      fetchCountByCategory();
    }
  }, [selectedOptions]);

  const fetchCountByCategory = async () => {
    setLoading(true);
    try {
      const response = await getCountByCategory(selectedOptions?.class_id);
      setData(response?.data?.data || {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getChartData = () => {
    const gradewiseData =
      tabValue === 0
        ? data.active_students_gradewise
        : data.inactive_students_gradewise;
    return Object.entries(gradewiseData).map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  // Define light and dark mode styles
  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    inputBackgroundColor: "#ffffff",
    inputColor: "#ffffff",
    boxShadow: "0px 2px 5px rgba(255, 255, 255, 0.1)",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    color: "#000000",
    inputBackgroundColor: "#333333",
    inputColor: "#000000",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <Box
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
          variant="h6"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          whiteSpace="nowrap"
        >
          Class Wise Student Ranking
        </Typography>
      </Box>

      <Autocomplete
        freeSolo
        id="class"
        disableClearable
        options={classOptions.map((option) => option.class_name)}
        value={selectedOptions?.class_name || ""} // Set value to the class name only
        onChange={(event, newValue) => {
          const selected = classOptions.find((option) => option.class_name === newValue);
          setSelectedOptions(selected || null); // Set selected option object
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search Class"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              type: "search",
              sx: {
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: currentStyles.inputColor,
                height:40,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  
                },
              },
            }}
            sx={{
              boxShadow: currentStyles.boxShadow,
              borderRadius: 1,
            }}
          />
        )}
      />

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="lecture overview tabs"
        indicatorColor="none"
        sx={{
            mt:2,
          ".MuiTabs-flexContainer": {
            gap: 2,
            background:
              isDarkMode &&
              "linear-gradient(89.7deg, rgb(0, 0, 0) -10.7%, rgb(53, 92, 125) 88.8%)",
            backgroundImage: isDarkMode ? "" : "url('/TabBG2.jpg')", // Add background image
            backgroundSize: "cover", // Ensure the image covers the entire page
            backgroundPosition: "center", // Center the image
            padding: 1,
            borderRadius: "12px",
          },
          ".MuiTab-root": {
            color: "#333",
            padding: "10px 20px",
            minHeight: 0,
            marginTop: "8px",
            textAlign: "center",
            color: isDarkMode && "#F0EAD6",
            "&:hover": {
              backgroundColor: "#e0e0e0",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            },
            "&.Mui-selected": {
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            },
          },
        }}
      >
        <Tab label={`Active (${data.active_students || 0})`} />
        <Tab label={`Inactive (${data.inactive_students || 0})`} />
      </Tabs>
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
      ) : (
        Object.entries(data)?.length > 0 && (
          <Box sx={{ width: "100%", height: 240, mt: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={50}
                  outerRadius={100}
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
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )
      )}

      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={150}
          sx={{ mt: 2 }}
        />
      ) : (
        Object.entries(data)?.length > 0 && (
          <Grid container spacing={2}>
            {getChartData().map((entry) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                key={entry.name}
                onClick={() => handleOpenModal(entry.name)} // Handle click for legend
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: mapData[entry.name]?.color,
                    mr: 1,
                  }}
                />
                <Box>
                  <Typography sx={{ color: primaryColor }}>
                    {mapData[entry.name]?.name}
                  </Typography>
                  <Typography
                    sx={{
                      ml: "auto",
                      fontWeight: "bold",
                      color: secondaryColor,
                    }}
                  >
                    {entry.value}%
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
          data={data}
          selectedGrad={selectedGrad}
          selectedOptions={selectedOptions}
        />
      )}
    </Box>
  );
};

export default ClassWiseStudentRanking;

export const StudentModal = ({
  open,
  handleClose,
  data,
  selectedGrad,
  selectedOptions,
}) => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchStudentByGrade();
  }, [selectedGrad]);

  const fetchStudentByGrade = async () => {
    setLoading(true);
    try {
      const response = await getStudentByGrade(
        selectedOptions?.class_id,
        selectedGrad
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
                        <TableCell component="th" scope="row">
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