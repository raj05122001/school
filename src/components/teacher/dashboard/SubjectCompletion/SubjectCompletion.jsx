"use client";
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { getSubjectCompletion } from "@/api/apiHelper";
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';

const COLORS = ["#0088FE", "#FF8042"];

function SubjectCompletion() {
  const [isClient, setIsClient] = useState(false);
  const [completionData, setCompletionData] = useState({});

  console.log("completionData : ",completionData)

  const fetchSubjectCompletion = async () => {
    try {
      const response = await getSubjectCompletion();
      if (response?.data?.success) {
        setCompletionData(response?.data?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching response", error);
    }
  };

  // Ensure the component is only rendered on the client-side to avoid hydration error
  useEffect(() => {
    setIsClient(true);
    fetchSubjectCompletion();
  }, []);

  const data = [
    { name: "Completed", value: completionData?.Completion_percentage },
    { name: "Pending", value: completionData?.total_lectures_count },
  ];

  const perc=(completionData?.total_lectures_count * completionData?.Completion_percentage)/100

  return (
    <Box sx={{ position: 'relative' }}>
      <FacebookCircularProgress value={perc}/>
      <Box
        sx={{
          width:"100%",
          position: 'absolute',
          top: '49%',
          left: '59%',
          transform: 'translate(-50%, -50%)',
        }}
      >
    <Card
      sx={{
        maxWidth: "137.50px",
        width: "100%",
        height: "138.51px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        p: 2,
        fill: "var(--Secondary_Black, #141514)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "100%",
        backgroundColor: "#001B72"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Teacher Name */}
        <Box
          sx={{
            width: "24px",
            height: "24px",
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M22.7598 16.74V4.67001C22.7598 3.47001 21.7798 2.58001 20.5898 2.68001H20.5298C18.4298 2.86001 15.2398 3.93001 13.4598 5.05001L13.2898 5.16001C12.9998 5.34001 12.5198 5.34001 12.2298 5.16001L11.9798 5.01001C10.1998 3.90001 7.01977 2.84001 4.91977 2.67001C3.72977 2.57001 2.75977 3.47001 2.75977 4.66001V16.74C2.75977 17.7 3.53977 18.6 4.49977 18.72L4.78977 18.76C6.95977 19.05 10.3098 20.15 12.2298 21.2L12.2698 21.22C12.5398 21.37 12.9698 21.37 13.2298 21.22C15.1498 20.16 18.5098 19.05 20.6898 18.76L21.0198 18.72C21.9798 18.6 22.7598 17.7 22.7598 16.74Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.7598 5.48999V20.49"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.50977 8.48999H6.25977"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.25977 11.49H6.25977"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Box>
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          Subjects Completed
        </Typography>

        {/* Class and Department */}
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            textAlign: "center",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "24px",
          }}
        >
          {`${completionData?.completion_count || 0} / ${completionData?.total_lectures_count || 0}`}
        </Typography>
      </Box>
    </Card>
    </Box>
    </Box>
  );
}

export default SubjectCompletion;


function FacebookCircularProgress({value=0}) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          color: '#001B72',
          ...theme.applyStyles('dark', {
            color: '#001B72',
          }),
        })}
        size={170}
        thickness={2}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={(theme) => ({
          color: '#fff',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
          ...theme.applyStyles('dark', {
            color: '#FFFFFF',
          }),
        })}
        size={170}
        thickness={2}
        value={value}
      />
    </Box>
  );
}