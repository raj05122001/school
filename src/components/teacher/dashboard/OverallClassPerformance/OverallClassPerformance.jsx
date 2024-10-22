import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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
} from "@mui/material";
import { AiOutlineClose, AiOutlineUp, AiOutlineDown } from "react-icons/ai"; // Importing icons from react-icons
import { useThemeContext } from "@/hooks/ThemeContext";

// Data for the pie chart and student information
const data = [
  {
    name: "Advanced",
    grade: "A",
    value: 45,
    color: "#00b894",
    students: [
      {
        name: "John Doe",
        rollNo: "101",
        course: "Math",
        department: "Science",
        class: "12A",
        email: "john@example.com",
        batchYear: 2024,
      },
      {
        name: "Jane Smith",
        rollNo: "102",
        course: "Math",
        department: "Science",
        class: "12A",
        email: "jane@example.com",
        batchYear: 2024,
      },
      {
        name: "Alice Johnson",
        rollNo: "103",
        course: "Math",
        department: "Science",
        class: "12A",
        email: "alice@example.com",
        batchYear: 2024,
      },
    ],
  },
  {
    name: "Intermediate",
    grade: "B",
    value: 24,
    color: "#ff7675",
    students: [
      {
        name: "Bob Brown",
        rollNo: "104",
        course: "English",
        department: "Arts",
        class: "11B",
        email: "bob@example.com",
        batchYear: 2025,
      },
      {
        name: "Charlie Davis",
        rollNo: "105",
        course: "English",
        department: "Arts",
        class: "11B",
        email: "charlie@example.com",
        batchYear: 2025,
      },
    ],
  },
  {
    name: "Proficient",
    grade: "C",
    value: 18,
    color: "#0984e3",
    students: [
      {
        name: "David Lee",
        rollNo: "106",
        course: "Physics",
        department: "Science",
        class: "11A",
        email: "david@example.com",
        batchYear: 2025,
      },
      {
        name: "Emma Wilson",
        rollNo: "107",
        course: "Physics",
        department: "Science",
        class: "11A",
        email: "emma@example.com",
        batchYear: 2025,
      },
    ],
  },
  {
    name: "Basic",
    grade: "D",
    value: 13,
    color: "#fdcb6e",
    students: [
      {
        name: "Frank Garcia",
        rollNo: "108",
        course: "History",
        department: "Arts",
        class: "12B",
        email: "frank@example.com",
        batchYear: 2024,
      },
      {
        name: "Hannah White",
        rollNo: "109",
        course: "History",
        department: "Arts",
        class: "12B",
        email: "hannah@example.com",
        batchYear: 2024,
      },
    ],
  },
];

// Function to render the label showing percentage
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
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

// Main Component
const OverallClassPerformance = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography
          variant="h6"
          className={`${isDarkMode ? "dark-heading" : "light-heading"}`}
          whiteSpace="nowrap"
        >
          Overall Class Performance
        </Typography>
      </Box>

      {/* Pie Chart */}
      <Box sx={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={50}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              onClick={() => handleOpenModal()}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Grid container spacing={2}>
        {data.map((entry) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            key={entry.name}
            onClick={() => handleOpenModal()} // Handle click for legend
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: entry.color,
                mr: 1,
              }}
            />
            <Box>
              <Typography sx={{ color: primaryColor }}>{entry.name}</Typography>
              <Typography
                sx={{ ml: "auto", fontWeight: "bold", color: secondaryColor }}
              >
                {entry.value}%
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="text"
          sx={{ textTransform: "none" }}
          onClick={() => handleOpenModal()}
        >
          View Details &gt;
        </Button>
      </Box>

      {/* Student Modal */}
      {modalOpen && (
        <StudentModal
          open={modalOpen}
          handleClose={handleCloseModal}
          data={data}
        />
      )}
    </Box>
  );
};

export default OverallClassPerformance;

export const StudentModal = ({ open, handleClose, data }) => (
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
      <TableContainer component={Paper}>
        <Table aria-label="student details">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Performance</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Percentage</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Students</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <Row row={row} key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  </Dialog>
);

// Row component for collapsible student details
function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: open ? "#3f51b5" : "inherit" }}
          >
            {open ? <AiOutlineUp /> : <AiOutlineDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.grade}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.value}%</TableCell>
        <TableCell>{row.students.length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Student Details
              </Typography>
              <Table size="small" aria-label="students">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Roll No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Batch Year
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.students.map((student, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                    >
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.batchYear}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
