import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StudentAssignments = ({ listData }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {listData?.data?.length > 0 ? (
          listData.data.map((assignment, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
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
                  <Box ml={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Marks Obtained:</strong>{" "}
                          {assignment.marks_obtained} /{" "}
                          {assignment.assignment_que.assignment_mark}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Scored Percentage:</strong>{" "}
                          {assignment.scored_percentage}%
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2">
                          <strong>Email:</strong>{" "}
                          {assignment.answer_by.user.email}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="body2">
                      <strong>Teacher's Comment:</strong>{" "}
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
