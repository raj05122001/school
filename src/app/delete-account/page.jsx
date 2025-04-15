import React from "react";
import { Box, Typography, Paper, Link } from "@mui/material";

const DeleteAccountInfo = () => {
  return (
    <Box sx={{display:"flex",alignItems:"center"}}>
      <Box
        sx={{
          width:"100%",
          height:"100vh",
          mx: "auto",
          my:"auto",
          p: 4,
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          How to Delete Your Account
        </Typography>

        <Typography variant="body1" gutterBottom>
          You can delete your account directly from within the{" "}
          <strong>VidyaAI</strong> app by going to:
        </Typography>

        <Paper
          elevation={1}
          sx={{
            backgroundColor: "grey.100",
            p: 2,
            my: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">Profile → Settings → Delete Account</Typography>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          If you need help, contact:{" "}
          <Link href="https://www.indiqai.ai/" underline="hover">
            https://www.indiqai.ai/
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default DeleteAccountInfo;
