import React from "react";
import { Box, Typography, Card, CardContent, Grid, Divider } from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdOutlineCreditScore, MdOutlineMail } from "react-icons/md";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { useThemeContext } from "@/hooks/ThemeContext";
import { useRouter,usePathname } from "next/navigation";

const StudentAssignments = ({ listData }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const router=useRouter()
  const pathname=usePathname()
const handleRoute=async(id)=>{
  router.push(`${pathname}/${id}`)
}
  return (
    <Box mt={4} px={2}>
      <Grid container spacing={3}>
        {listData?.data?.length > 0 ? (
          listData?.data.map((assignment, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: isDarkMode ? "#f1f1f1" : "#000",
                  borderRadius: "16px",
                  boxShadow: isDarkMode
                    ? "0px 6px 15px rgba(0, 0, 0, 0.4)"
                    : "0px 6px 15px rgba(200, 200, 200, 0.4)",
                  padding: "16px",
                }}
                onClick={()=>handleRoute(assignment?.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <UserImage
                      profilePic={assignment?.user?.profile_pic}
                      name={assignment?.user?.full_name}
                    />
                    <Box flex="1">
                      <Typography variant="h6" fontWeight="bold">
                        {assignment?.user?.full_name}
                      </Typography>
                      <Typography variant="body2" color={secondaryColor}>
                        Email: {assignment?.user?.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {assignment?.total_submitted_assignment ===
                      assignment?.checked_assignments ? (
                        <FaCheckCircle color="green" size={20} />
                      ) : (
                        <FaTimesCircle color="red" size={20} />
                      )}
                      <Typography variant="body2" fontWeight="bold">
                        {assignment?.total_submitted_assignment ===
                        assignment?.checked_assignments
                          ? "Checked"
                          : "Not Checked"}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3.5} display="flex" alignItems="center">
                      <MdOutlineCreditScore style={{ marginRight: "8px" }} size={20} />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Total Assignments: {assignment?.total_submitted_assignment}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3.5} display="flex" alignItems="center">
                      <TbSquareRoundedPercentage style={{ marginRight: "8px" }} size={20} />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Checked Assignments: {assignment?.checked_assignments}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={5} display="flex" alignItems="center">
                      <VscFeedback style={{ marginRight: "8px" }} size={20} />
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        color={isDarkMode ? primaryColor : "#555"}
                      >
                        Teacher's Comment: {assignment?.comment_by_teacher || "No comment"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" textAlign="center" mt={4}>
            No assignments found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default StudentAssignments;
