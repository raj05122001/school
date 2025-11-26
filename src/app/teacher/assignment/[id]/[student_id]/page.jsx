"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getTeacherAssignment } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import CheckAssignment from "@/components/teacher/Assignment/CheckAssignment";
import UserImage from "@/commonComponents/UserImage/UserImage";
// import DarkMode from "@/components/DarkMode/DarkMode";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { MdOutlineCreditScore } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";

const Page = ({ params }) => {
  const { id, student_id } = params;
  const [listData, setListData] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();

  useEffect(() => {
    if (id && student_id) {
      fetchAssignmentAnswer();
    }
  }, [id, student_id]);

  const fetchAssignmentAnswer = async () => {
    setListLoading(true);
    setError(null);
    try {
      const apiResponse = await getTeacherAssignment(id, student_id);
      if (apiResponse?.success) {
        setListData(apiResponse?.data?.assignments || []);
      } else {
        setListData([]);
        setError("Failed to load assignments.");
      }
    } catch (e) {
      console.error(e);
      setListData([]);
      setError("An error occurred while fetching assignments.");
    } finally {
      setListLoading(false);
    }
  };

  const userData = listData?.data?.[0]?.answer_by;

  return (
    <Box
      sx={{
        color: isDarkMode ? "#fff" : "#000",
        minHeight: "100vh",
        p: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      {listLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : listData.length === 0 ? (
        <Typography variant="h6">No assignments available</Typography>
      ) : (
        <Grid container spacing={2}>
          {userData && (
            <Grid item xs={12}>
              <Card
                sx={{
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.06)"
                    : "#ffffff",
                  color: isDarkMode ? "#f1f1f1" : "#000",
                  borderRadius: "16px",
                  boxShadow: isDarkMode
                    ? "0px 6px 15px rgba(0, 0, 0, 0.4)"
                    : "0px 4px 10px rgba(173, 216, 230, 0.7)", // light blue glow
                  px: { xs: 2, sm: 4 },
                  py: { xs: 1.5, sm: 1.5 },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* TOP: Avatar + Name + Email */}
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="wrap"
                  >
                    <UserImage
                      profilePic={userData?.user?.profile_pic}
                      name={userData?.user?.full_name}
                      width={40}
                      height={40}
                    />
                    <Box flex="1" minWidth={0}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: "15px", sm: "16px" } }}
                        noWrap
                      >
                        {userData?.user?.full_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "12px", sm: "13px" },
                          color: "#555",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Email: {userData?.user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Middle divider line (full width) */}
                  <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

                  {/* BOTTOM: Class + Total Assignments in one row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 4 },
                    }}
                  >
                    {/* Class */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ minWidth: 0 }}
                    >
                      <SiGoogleclassroom size={18} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "13px", sm: "14px" },
                          color: isDarkMode ? primaryColor : "#333",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Class:&nbsp;
                        </Box>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {userData?.user_class?.name || "N/A"}
                        </Box>
                      </Typography>
                    </Box>

                    {/* Total Assignments */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ minWidth: 0 }}
                    >
                      <MdOutlineCreditScore size={18} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "13px", sm: "14px" },
                          color: isDarkMode ? primaryColor : "#333",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Total Assignments:&nbsp;
                        </Box>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {listData?.data?.length}
                        </Box>
                      </Typography>
                    </Box>

                    {/* 
                    <Box display="flex" alignItems="center">
                      <TbSquareRoundedPercentage
                        style={{ marginRight: "8px" }}
                        size={20}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Checked Assignments: {listData?.data?.length}
                      </Typography>
                    </Box> 
                    */}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}


          {listData?.data?.length > 0 &&
            listData?.data?.map((assignment, index) => (
              <Grid item xs={12} key={assignment.id}>
                <CheckAssignment
                  assignment={assignment}
                  index={index}
                  fetchAssignmentAnswer={fetchAssignmentAnswer}
                />
              </Grid>
            ))}

        </Grid>
      )}
    </Box>
  );
};

export default Page;
