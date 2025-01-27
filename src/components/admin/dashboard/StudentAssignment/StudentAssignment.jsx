import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Skeleton,
} from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getStudentAssignment } from "@/api/apiHelper";
import { FiAlertTriangle } from "react-icons/fi";

const StudentAssignment = ({ selectedOptions }) => {
  const { isDarkMode } = useThemeContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedOptions?.id) {
      fetchStudentAssignment();
    }
  }, [selectedOptions]);

  const fetchStudentAssignment = async () => {
    setLoading(true);
    try {
      const response = await getStudentAssignment(selectedOptions?.id);
      setData(response?.data?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRowColor = (score) => {
    if (score >= 80) return "#E6F4EA"; // Light green
    if (score >= 50) return "#FFF3CC"; // Light yellow
    return "#FDECEC"; // Light red
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#28A745"; // Green
    if (score >= 50) return "#FFC107"; // Yellow
    return "#DC3545"; // Red
  };

  const getCircleStyle = (count, value) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 20 + count,
    height: 20 + count,
    borderRadius: "50%",
    backgroundColor:
      value === "masterd"
        ? "#28A745"
        : value === "working"
        ? "#FFC107"
        : "#DC3545",
    color: "white",
    fontWeight: "bold",
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Student Proficiency
        </Typography>
        {/* <Autocomplete
          freeSolo
          id="class"
          disableClearable
          options={classOptions?.map((option) => option.class_name)}
          value={selectedOptions?.class_name || ""} // Set value to the class name only
          onChange={(event, newValue) => {
            const selected = classOptions.find(
              (option) => option.class_name === newValue
            );
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
                  height: 40,
                  width: 200,
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
        /> */}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 420,
          borderRadius: "8px",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
        className="blur_effect_card"
      >
        <Table>
          <TableHead stickyHeader>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Full Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Work Completed
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Average Score
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Needing Attention
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Can be Improved
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#F9F6EE" : "#353935",
                }}
              >
                Mastered
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array?.from(new Array(5))?.map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="rectangular" width={120} height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width={60} height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width="80%" height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={30} height={30} />
                    </TableCell>
                  </TableRow>
                ))
              : data?.map((student, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: getRowColor(
                        student.average_scored_percentage
                      ),
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <UserImage
                          name={student?.student_name}
                          width={36}
                          height={36}
                        />
                        <Typography sx={{ marginLeft: 2 }}>
                          {student?.student_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {student?.completed_assignment}/
                      {student?.total_assignment}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "80%",
                            height: 40,
                            position: "relative",
                          }}
                        >
                          {/* Background bar */}
                          <Box
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "4px",
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              right: 0,
                              left: 0,
                              zIndex: 6,
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          {/* Progress bar */}
                          <Box
                            sx={{
                              backgroundColor: getScoreColor(
                                student.average_scored_percentage
                              ),
                              borderRadius: "4px",
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              left: 0,
                              zIndex: 8,
                              width: `${student.average_scored_percentage}%`,
                              height: "100%",
                            }}
                          />
                          {/* Score text */}
                          <Box
                            sx={{
                              color: "black",
                              textAlign: "center",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              zIndex: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {student?.average_scored_percentage}%
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={getCircleStyle(
                            student?.my_assignment_in_which_i_got_less_than_50,
                            "need"
                          )}
                        >
                          {student?.my_assignment_in_which_i_got_less_than_50}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={getCircleStyle(
                            student?.my_assignment_in_which_i_got_between_than_50_to_80,
                            "working"
                          )}
                        >
                          {
                            student?.my_assignment_in_which_i_got_between_than_50_to_80
                          }
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={getCircleStyle(
                            student?.my_assignment_in_which_i_got_between_than_80_to_100,
                            "masterd"
                          )}
                        >
                          {
                            student?.my_assignment_in_which_i_got_between_than_80_to_100
                          }
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!data?.length > 0 && !loading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            marginY={16}
            width={"100%"}
          >
            <FiAlertTriangle
              style={{ marginRight: 8 }}
              size={24}
              color="gray"
            />
            <Typography color="textSecondary">No Data Found</Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default StudentAssignment;
