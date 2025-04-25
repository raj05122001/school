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
  Pagination,
} from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { useThemeContext } from "@/hooks/ThemeContext";
import { getClassAssignment, getStudentAssignment, getteacherClass } from "@/api/apiHelper";
import { FiAlertTriangle } from "react-icons/fi";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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

const StudentAssignment = () => {
  const { isDarkMode } = useThemeContext();
  const [data, setData] = useState([]);
  const [rangeData, setRangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [classOptions, setClassOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);

  useEffect(() => {
    if (selectedOptions?.class_id) {
      fetchClassAssignment();
      fetchStudentAssignment()
    }
  }, [selectedOptions, activePage]);

  useEffect(() => {
    if (selectedOptions?.class_id) {
      fetchClassAssignment();
    }
  }, [selectedOptions]);

  useEffect(() => {
      fetchClassOptions();
    }, []);

  const handleChange = (event, value) => {
    setActivePage(value);
  };

  const fetchClassOptions = async () => {
      try {
        const response = await getteacherClass();
        setClassOptions(response?.data?.data?.class_subject_list);
        const findMCA=response?.data?.data?.class_subject_list?.find((val)=>val?.class_id===2 || val?.class_id===27)
        setSelectedOptions(findMCA);
      } catch (error) {
        console.error(error);
      }
    };

  const fetchStudentAssignment = async () => {
    setLoading(true);
    try {
      const response = await getStudentAssignment(
        selectedOptions?.class_id,
        activePage,
        5,
        true
      );
      setData(response?.data?.data?.data);
      setTotalPage(response?.data?.data?.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassAssignment = async () => {
    setLoading(true);
    try {
      const response = await getClassAssignment(
        selectedOptions?.class_id,
        true
      );
      setRangeData(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Range Data", rangeData);

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
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "17px",
        backgroundColor: "#fff",
        width: "100%",
        // maxWidth: "714px",
        // maxHeight: "344px",
        // width: "100%",
        // height: "100%",
        flexShrink: 0,
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "35px",
          marginLeft: "32px",
          gap: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          <Box sx={{ width: "24px", height: "24px", flexShrink: 0 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.1401 21.62C17.2601 21.88 16.2201 22 15.0001 22H9.00011C7.78011 22 6.74011 21.88 5.86011 21.62C6.08011 19.02 8.75011 16.97 12.0001 16.97C15.2501 16.97 17.9201 19.02 18.1401 21.62Z"
                stroke="#3B3D3B"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z"
                stroke="#3B3D3B"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.5799 10.58C15.5799 12.56 13.9799 14.17 11.9999 14.17C10.0199 14.17 8.41992 12.56 8.41992 10.58C8.41992 8.60002 10.0199 7 11.9999 7C13.9799 7 15.5799 8.60002 15.5799 10.58Z"
                stroke="#3B3D3B"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Box>
          <Typography
            // variant="h5"
            // className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
            sx={{
              color: "var(--Text-Color-1, #3B3D3B)",
              fontFamily: "Inter, sans-serif",
              fontSize: "22px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            Student Proficiency
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "var(--BG-Color-1, #F3F5F7)",
            borderRadius: "10px",
            margin:2,
          }}
        >
          <Autocomplete
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
                placeholder="Select Class"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  sx: {
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    height: 45,
                    width: 200,
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #d3d3d3",
                    },
                  },
                }}
                sx={{
                  //   boxShadow: currentStyles.boxShadow,
                  borderRadius: "10px",
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: 500,
            minHeight: 380,
            height: "100%",
            borderRadius: "10px",
            border:"none",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            marginX: "32px",
          }}
          // className="blur_effect_card"
        >
          <Table sx={{ border: "none" }}>
            <TableHead stickyHeader sx={{backgroundColor: "#F3F5F7",
                borderRadius: "10px",
                border: "none",}}>
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
                  Full Name
                </TableCell>
                <TableCell
                  align="center"
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
                  Work Completed
                </TableCell>
                <TableCell
                  align="center"
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
                  Average Score
                </TableCell>
                <TableCell
                  align="center"
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
                  Needing Attention
                </TableCell>
                <TableCell
                  align="center"
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
                  Can be Improved
                </TableCell>
                <TableCell
                  align="center"
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
                  Mastered
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{borderBottom: "none"}}>
              {loading
                ? Array.from(new Array(5))?.map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton
                          variant="rectangular"
                          width={120}
                          height={30}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton
                          variant="rectangular"
                          width={60}
                          height={30}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton
                          variant="rectangular"
                          width="80%"
                          height={30}
                        />
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
                        backgroundColor: "#fff",
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <UserImage
                            name={student?.student_name}
                            width={24}
                            height={24}
                          />
                          <Typography
                            sx={{
                              color: "var(--Text-Color-1, #3B3D3B)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            {student?.student_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "var(--Text-Color-1, #3B3D3B)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        {student?.completed_assignment}/
                        {student?.total_assignment}
                      </TableCell>
                      {/* <TableCell align="center">
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
                            Background bar
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
                            Progress bar
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
                            Score text
                            <Box
                              sx={{
                                color: "var(--Text-Color-1, #3B3D3B)",
                                textAlign: "center",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                                fontWeight: "700",
                                fontFamily: "Inter, sans-serif",
                                lineHeight: "normal",
                              }}
                            >
                              {student?.average_scored_percentage}%
                            </Box>
                          </Box>
                        </Box>
                      </TableCell> */}
                      <TableCell align="center">
                      <Typography
                            sx={{
                              color: "var(--Text-Color-1, #3B3D3B)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "normal",
                              marginLeft: "12px",
                            }}
                          >
                            {student?.average_scored_percentage}%
                          </Typography>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // margin: 2,
            padding: 2,
            gap: "25px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "14px 12px",
              alignItems: "flex-start",
              gap: "10px",
              borderRadius: "12px",
              backgroundColor: "#FBEDEE",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Assignment Range 0-50
              </Typography>
              <Box>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="8" fill="#FF3B30" />
                </svg>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "var(--Text-Color-1, #3B3D3B)",
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              {rangeData?.student_counts?.range_0_50 || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "14px 12px",
              alignItems: "flex-start",
              gap: "10px",
              borderRadius: "12px",
              backgroundColor: "#FFF3E0",
              // marginY: "15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Assignment Range 50-80
              </Typography>
              <Box>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="8" fill="#FFCC00" />
                </svg>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "var(--Text-Color-1, #3B3D3B)",
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              {rangeData?.student_counts?.range_50_80 || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "14px 12px",
              alignItems: "flex-start",
              gap: "10px",
              borderRadius: "12px",
              backgroundColor: "#DBFFDC",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Assignment Range 80-100
              </Typography>
              <Box>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle cx="8" cy="8" r="8" fill="#34C759" />
                </svg>
              </Box>
            </Box>

            <Typography
              sx={{
                color: "var(--Text-Color-1, #3B3D3B)",
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              {rangeData?.student_counts?.range_80_100 || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pagination Box */}
      {data?.length > 0 && totalPage > 1 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: 2,
            marginTop: "auto",
          }}
        >
          <Pagination
            page={activePage}
            onChange={handleChange}
            count={totalPage}
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
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
    </Box>
  );
};

export default StudentAssignment;
