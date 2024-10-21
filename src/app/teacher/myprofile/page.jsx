"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Badge,
  Tooltip,
} from "@mui/material";
import { FaSave, FaCamera } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { BASE_URL } from "@/constants/apiconfig";
import Cookies from "js-cookie";

const EditDetailsPage = () => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profile_pic, setProfile_pic] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {}, // Start with empty default values
  });

  const handleEditPicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select a valid image file.",
          severity: "error",
        });
        return;
      }
      setProfile_pic(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (profilePicUrl) {
        URL.revokeObjectURL(profilePicUrl);
      }
    };
  }, [profilePicUrl]);

  const onSubmit = async (data) => {
    console.log("data", data);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Teacher Details
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          position: "relative",
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ cursor: "pointer" }}
          onClick={handleEditPicClick}
          badgeContent={
            <Tooltip title="Edit Profile Picture">
              <IconButton color="primary" size="small">
                <FaCamera size={24} />
              </IconButton>
            </Tooltip>
          }
        >
          <Avatar
            src={profilePicUrl}
            alt="Profile Picture"
            sx={{
              width: { xs: 100, sm: 150 },
              height: { xs: 100, sm: 150 },
              border: "2px solid #1976d2",
              boxShadow: 3,
            }}
          />
        </Badge>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handlePicChange}
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Full Name*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              {...register("full_name", { required: "Full name is required" })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
              sx={{ marginTop: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Age*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="number"
              inputProps={{ min: 0 }}
              {...register("age", { required: "Age is required" })}
              error={!!errors.age}
              helperText={errors.age?.message}
              sx={{ marginTop: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Experience*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              {...register("experience", {
                required: "Experience is required",
              })}
              error={!!errors.experience}
              helperText={errors.experience?.message}
              sx={{ marginTop: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Department*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              {...register("department", {
                required: "Department is required",
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
              sx={{ marginTop: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Email*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ marginTop: 1 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "right", marginTop: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<FaSave />}
          >
            Save
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditDetailsPage;
