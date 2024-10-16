'use client'
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
  { name: 'Completed', value: 95 },
  { name: 'Pending', value: 5 },
];

const COLORS = ['#0088FE', '#FF8042'];

function SubjectCompletion() {
  const [isClient, setIsClient] = useState(false);

  // Ensure the component is only rendered on the client-side to avoid hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card sx={{
        background: 'linear-gradient(109.6deg, rgb(251, 250, 225) 11.2%, rgb(206, 240, 185) 47.5%, rgb(100, 163, 111) 100.2%)'
    }}>
      <CardContent sx={{
        display:"flex",
        gap:4,
        alignItems: "center"
      }}>
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
        </Box>
        <Box>
            <Typography variant="h6" component="div" gutterBottom align='center' fontWeight={'bold'}>
            Subject Completion
            </Typography>
            <Typography variant="subtitle1">
                <span style={{ color: COLORS[0] }}>●</span> Completed: 95%
              </Typography>
              <Typography variant="body1">
                <span style={{ color: COLORS[1] }}>●</span> Pending: 5%
              </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SubjectCompletion;
