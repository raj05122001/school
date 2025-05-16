"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";



export default function ChapterStatus({totalChapters=0,checked=0,notChecked=0}) {
    const stats = [
        {
          icon: <MdOutlineLibraryBooks size={24} />,
          label: "Total Lectures",
          value: totalChapters,
        },
        {
          icon: <AiOutlineCheckCircle size={24} color="#00c853" />,
          label: "Checked",
          value: checked,
        },
        {
          icon: <AiOutlineCloseCircle size={24} color="#f44336" />,
          label: "Not Checked",
          value: notChecked,
        },
      ];
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        padding:"24px 32px 32px 32px",
        maxWidth: "100%",
        mt: 2,
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding:"18px 16px",
                borderRadius: "6.82px",
                border: "0.5px solid #C1C1C1",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: 1, color:"#3B3D3B" }}
                >
                  {stat.icon}
                  {stat.label}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={600} color={"#3B3D3B"}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
