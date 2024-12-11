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
import DarkMode from "@/components/DarkMode/DarkMode";
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
        p: 2,
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
                    ? "rgba(255, 255, 255, 0.1)"
                    : "white",
                  color: isDarkMode ? "#f1f1f1" : "#000",
                  borderRadius: "16px",
                  boxShadow: isDarkMode
                    ? "0px 6px 15px rgba(0, 0, 0, 0.4)"
                    : "0px 4px 10px #ADD8E6",
                  // padding: "10px",
                  paddingX: 4,
                  paddingY: 1,
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <UserImage
                        profilePic={userData?.user?.profile_pic}
                        name={userData?.user?.full_name}
                        width={40}
                        height={40}
                      />
                      <Box flex="1">
                        <Typography variant="h6" fontWeight="bold">
                          {userData?.user?.full_name}
                        </Typography>
                        <Typography variant="body2" color={secondaryColor}>
                          Email: {userData?.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                    <DarkMode />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", gap: 4 }}>
                    <Box display="flex" alignItems="center">
                      <SiGoogleclassroom
                        style={{ marginRight: "8px" }}
                        size={20}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Class: {userData?.user_class?.name}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <MdOutlineCreditScore
                        style={{ marginRight: "8px" }}
                        size={20}
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Total Assignments: {listData?.data?.length}
                      </Typography>
                    </Box>
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {listData?.data?.length > 0 &&
            listData?.data?.map((assignment, index) => (
              <Grid item xs={12} key={assignment.id}>
                <CheckAssignment  assignment={assignment} index={index} fetchAssignmentAnswer={fetchAssignmentAnswer} />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default Page;
