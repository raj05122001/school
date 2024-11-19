"use client";
import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { getSubjectCompletion } from "@/api/apiHelper";

const COLORS = ["#0088FE", "#FF8042"];

function SubjectCompletion() {
  const [isClient, setIsClient] = useState(false);
  const [completionData, setCompletionData] = useState({});

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
    { name: "Pending", value: completionData?.pending_percentage },
  ];

  return (
    <Card
      sx={{
        background:
          "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%)",
        width: "100%",
        height: "100%",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Box>
          {isClient && (
            <PieChart width={65} height={70}>
              <Pie
                data={data}
                cx={30}
                cy={30}
                innerRadius={15}
                outerRadius={30}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </Box>
        <Box>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            align="center"
            fontWeight={"bold"}
          >
            Subject Completion
          </Typography>
          <Typography variant="subtitle1">
            <span style={{ color: COLORS[0] }}>●</span> Completed:{" "}
            {completionData?.Completion_percentage}%{" "}(
            {completionData?.completion_count} lectures)
          </Typography>
          <Typography variant="body1">
            <span style={{ color: COLORS[1] }}>●</span> Pending:{" "}
            {completionData?.pending_percentage}%{" "}(
            {completionData?.pending_count} lectures)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SubjectCompletion;
