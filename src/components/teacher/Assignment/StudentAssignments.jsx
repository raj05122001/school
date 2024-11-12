import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdOutlineCreditScore, MdOutlineMail } from "react-icons/md";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";

const StudentAssignments = ({ listData, isDarkMode }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {listData?.data?.length > 0 ? (
          listData.data.map((assignment, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: isDarkMode ? "#f1f1f1" : "#000", // Text color based on theme
                  borderRadius: "12px",
                  boxShadow: "0px 6px 10px #ADD8E6",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <UserImage
                      profilePic={assignment.answer_by.user.profile_pic}
                      name={assignment.answer_by.user.full_name}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {assignment.answer_by.user.full_name}
                    </Typography>
                    <Box
                      sx={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {assignment.is_checked ? (
                        <FaCheckCircle color="green" size={20} />
                      ) : (
                        <FaTimesCircle color="red" size={20} />
                      )}
                      <Typography variant="body2">
                        {assignment.is_checked ? "Checked" : "Not Checked"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box ml={6} mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <MdOutlineCreditScore style={{marginRight:"4px"}} />Marks Obtained:{" "}
                          {assignment.marks_obtained} /{" "}
                          {assignment.assignment_que.assignment_mark}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <TbSquareRoundedPercentage style={{marginRight:"5px"}}/>Scored Percentage:{" "}
                          {assignment.scored_percentage}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <MdOutlineMail style={{marginRight:"4px"}}/>Email:{" "}
                          {assignment.answer_by.user.email}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" marginTop={2}>
                      <VscFeedback style={{marginRight: "4px"}}/>Teacher&apos;s Comment:{" "}
                      {assignment.comment_by_teacher || "No comment"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2">No assignments found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default StudentAssignments;
