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
import { decodeToken } from "react-jwt";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Cookies from "js-cookie";
import { getTeacherDetails, updateTeacherDetails } from "@/api/apiHelper";
import toast from "react-hot-toast";
import { useThemeContext } from "@/hooks/ThemeContext";

const EditDetailsPage = () => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);
  const [subject, setSubject] = useState([]);
  const [initialData, setInitialData] = useState({});

  const { isDarkMode } = useThemeContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  const fetchTeacherDetails = async () => {
    try {
      const response = await getTeacherDetails(userDetails?.teacher_id);
      const fetchedData = response?.data?.data;

      setValue("full_name", fetchedData?.full_name);
      setValue("designation", fetchedData?.designation);
      setValue("experience", fetchedData?.experience);
      setValue("department", fetchedData?.department?.name);
      setValue("email", fetchedData?.email);
      setProfilePicUrl(`${BASE_URL_MEET}${fetchedData?.profile_pic}`);
      setSubject(fetchedData?.subjects);

      setInitialData({
        full_name: fetchedData?.full_name,
        designation: fetchedData?.designation,
        experience: fetchedData?.experience,
        department: fetchedData?.department?.name,
        email: fetchedData?.email,
        profile_pic:`${BASE_URL_MEET}${fetchedData?.profile_pic}`,
      });

    } catch (error) {
      console.error(error);
    }
  };

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

  const onSubmit = async (formData) => {
    const updateData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialData[key]) {
        updateData.append(key, formData[key]);
      }
    });

    if (profilePicUrl && profilePicUrl !== initialData.profile_pic) {
      updateData.append("profile_pic", fileInputRef.current.files[0]);
    }

    try {
     const response= await updateTeacherDetails(
        userDetails?.teacher_id,
        updateData
      );
      toast.success("Details updated successfully.")
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update details.")
    }
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
        color= {isDarkMode ? "#E5E4E2" : "black"}
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
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
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
              className="blur_effect_card"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
              sx={{ fontWeight: "bold" }}
            >
              Designation*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              {...register("designation", {
                required: "Designation is required",
              })}
              error={!!errors.designation}
              helperText={errors.designation?.message}
              sx={{ marginTop: 1 }}
              className="blur_effect_card"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
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
              className="blur_effect_card"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
              sx={{ fontWeight: "bold" }}
            >
              Department*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              disabled={true}
              size="small"
              {...register("department", {
                required: "Department is required",
              })}
              error={!!errors.department}
              helperText={errors.department?.message}
              sx={{ marginTop: 1 }}
              className="blur_effect_card"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography
              variant="subtitle2"
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
              sx={{ fontWeight: "bold" }}
            >
              Email*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              disabled={true}
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
              className="blur_effect_card"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography
              variant="subtitle2"
              color= {isDarkMode ? "#E5E4E2" : "#B2BEB5"}
              sx={{ fontWeight: "bold" }}
            >
              Subjects*
            </Typography>

            <Box maxHeight={300} sx={{ overflowY: "auto" }}>
              {subject?.length > 0 &&
                subject?.map((val, index) => (
                  <Typography
                    key={index}
                    variant="span"
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      margin: "4px",
                      border: "1px solid #1976d2",
                      borderRadius: "4px",
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {val?.name}
                  </Typography>
                ))}
            </Box>
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
