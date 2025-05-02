import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { MdOutlineCreditScore, MdOutlineMail } from "react-icons/md";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { useThemeContext } from "@/hooks/ThemeContext";
import { useRouter, usePathname } from "next/navigation";
import { FaDiamond } from "react-icons/fa6";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";

const StudentAssignments = ({ listData }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const router = useRouter();
  const pathname = usePathname();
  const handleRoute = async (id) => {
    router.push(`${pathname}/${id}`);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 2,
        backgroundColor: "var(--Website_color-white, #FFF)",
        borderRadius: "20px",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "none",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Edge
          },
        }}
      >
        <Table sx={{ border: "none" }}>
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
                Submitted by
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
                Checked Status
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
                Checked Assignment
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
                Total Assignment
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
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ borderBottom: "none" }}>
            {listData?.data?.map((lecture,index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                }}
              >
                <TableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      fontWeight: 700,
                      color: "#3B3D3B",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      lineHeight: "normal",
                      width: "105px",
                    }}
                    gap={2}
                  >
                    <UserImage
                      profilePic={lecture?.user?.profile_pic}
                      name={lecture?.user?.full_name}
                      width={24}
                      height={24}
                    />
                    <Box flex="1">
                      <Typography variant="h6" fontWeight={700} sx={{fontSize:"14px",color:"#3B3D3B"}}>
                        {lecture?.user?.full_name}
                      </Typography>
                      <Typography variant="body2" color={secondaryColor} sx={{fontWeight:400,fontSize:"10px",color:"#3B3D3B"}}>
                        {lecture?.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {lecture?.total_submitted_assignment ===
                    lecture?.checked_assignments ? (
                      <Box sx={{height:"16px",width:"16px",borderRadius:"100%",backgroundColor:"#34C759"}}/>
                    ) : (
                      <Box sx={{height:"16px",width:"16px",borderRadius:"100%",backgroundColor:"#FF3B30"}}/>
                    )}
                    <Typography variant="body2" fontWeight="bold">
                      {lecture?.total_submitted_assignment ===
                      lecture?.checked_assignments
                        ? "Checked"
                        : "Not Checked"}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#3B3D3B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        lineHeight: "normal",
                        width: "105px",
                      }}
                    >
                      {lecture?.checked_assignments}
                    </span>
                </TableCell>
                <TableCell>
                    <Typography
                      variant="body2"
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
                      {lecture?.total_submitted_assignment}
                    </Typography>
                </TableCell>
                <TableCell onClick={() => handleRoute(lecture?.id)}>
                  <img
                    src="/arrow-square-right.png"
                    style={{ width: "24px", height: "24px" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentAssignments;
