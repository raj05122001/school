import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";
import { useThemeContext } from "@/hooks/ThemeContext";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const AssignmentTable = ({ data }) => {
  const router = useRouter();
  const { isDarkMode } = useThemeContext();

  const handleChangeRoute = (id) => {
    router.push(`/teacher/assignment/${id}`);
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
              ></TableCell>
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
                Lecture
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
                Chapter
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
                Class
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
                Subject
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
                Checked
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
                Total
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
            {data?.map((lecture,index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                }}
              >
                <TableCell>
                  <CalendarIconCustom date={lecture?.schedule_date} />
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Title: ${lecture?.title || ""}`}
                    arrow
                    placement="top-start"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#3B3D3B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        lineHeight: "normal",
                        width: "105px",
                      }}
                      noWrap
                    >
                      {lecture?.title?.length > 24
                        ? `${lecture?.title?.slice(0, 24)}...`
                        : lecture?.title}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Chapter: ${lecture?.chapter?.chapter || ""}`}
                    arrow
                    placement="top-start"
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#3B3D3B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        lineHeight: "normal",
                        width: "131px",
                        height: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {lecture?.chapter?.chapter}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Class: ${lecture?.lecture_class?.name || ""}`}
                    arrow
                    placement="top-start"
                  >
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
                      {lecture?.lecture_class?.name || ""}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`Subject: ${lecture?.chapter?.subject?.name}`}
                    arrow
                    placement="top-start"
                  >
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
                      {lecture?.chapter?.subject?.name}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{lecture?.checked_assignments}</TableCell>
                <TableCell>{lecture?.total_submitted_assignments}</TableCell>
                <TableCell onClick={() => handleChangeRoute(lecture?.id)}>
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

export default AssignmentTable;
