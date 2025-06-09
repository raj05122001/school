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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaSave, FaCamera, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { decodeToken } from "react-jwt";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import Cookies from "js-cookie";
import { getTeacherDetails, updateTeacherDetails } from "@/api/apiHelper";
import toast from "react-hot-toast";
import { useThemeContext } from "@/hooks/ThemeContext";
import { letterSpacing } from "@mui/system";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profilePicChanged, setProfilePicChanged] = useState(false);
  const [profilePicRemoved, setProfilePicRemoved] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);

  const { isDarkMode } = useThemeContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  // Watch all form fields for changes
  const watchedFields = watch();

  useEffect(() => {
    fetchTeacherDetails();
  }, []);

  // Check for changes whenever form data changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      checkForChanges();
    }
  }, [watchedFields, profilePicChanged, profilePicRemoved, initialData]);

  const checkForChanges = () => {
    const currentData = {
      full_name: watchedFields.full_name || '',
      designation: watchedFields.designation || '',
      experience: watchedFields.experience || '',
      department: watchedFields.department || '',
      email: watchedFields.email || '',
    };

    const initialFormData = {
      full_name: initialData.full_name || '',
      designation: initialData.designation || '',
      experience: initialData.experience || '',
      department: initialData.department || '',
      email: initialData.email || '',
    };

    // Check if any form field has changed
    const formDataChanged = Object.keys(currentData).some(
      key => currentData[key] !== initialFormData[key]
    );

    // Update hasChanges state
    setHasChanges(formDataChanged || profilePicChanged || profilePicRemoved);
  };

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
        profile_pic: `${BASE_URL_MEET}${fetchedData?.profile_pic}`,
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
      setProfilePicChanged(true);
      setProfilePicRemoved(false); // Reset removed state if new pic is selected
    }
  };

  const handleRemovePicClick = () => {
    setRemoveConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    setProfilePicUrl(null);
    setProfilePicRemoved(true);
    setProfilePicChanged(false); // Reset changed state
    setRemoveConfirmOpen(false);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setSnackbar({
      open: true,
      message: "Profile picture removed. Click Save to confirm changes.",
      severity: "info",
    });
  };

  const handleCancelRemove = () => {
    setRemoveConfirmOpen(false);
  };

  useEffect(() => {
    return () => {
      if (profilePicUrl && profilePicUrl.startsWith('blob:')) {
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
    
    // Handle profile picture changes
    if (profilePicRemoved) {
      // Send empty string or null to indicate removal
      updateData.append("profile_pic", "");
    } else if (profilePicUrl && profilePicChanged && fileInputRef.current.files[0]) {
      updateData.append("profile_pic", fileInputRef.current.files[0]);
    }

    setIsLoading(true);

    try {
      const response = await updateTeacherDetails(
        userDetails?.teacher_id,
        updateData
      );

      console.log("response : ", response?.data?.data?.new_token);
      const accessToken = response?.data?.data?.new_token?.access;
      const refreshToken = response?.data?.data?.new_token?.refresh;
      console.log("refreshToken : ", refreshToken, ", accessToken : ", accessToken);
      Cookies.set("ACCESS_TOKEN", accessToken, { expires: 7 });
      Cookies.set("REFRESH_TOKEN", refreshToken, { expires: 30 });
      toast.success("Details updated successfully.");
      
      // Reset change tracking after successful update
      setProfilePicChanged(false);
      setProfilePicRemoved(false);
      setHasChanges(false);
      
      // Update initial data with new values
      const updatedInitialData = { ...initialData };
      Object.keys(formData).forEach((key) => {
        updatedInitialData[key] = formData[key];
      });
      if (profilePicRemoved) {
        updatedInitialData.profile_pic = null;
      } else if (profilePicChanged) {
        updatedInitialData.profile_pic = profilePicUrl;
      }
      setInitialData(updatedInitialData);
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const labelCSS = {
    color: "#141514",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "19px",
    letterSpacing: "0.8px",
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        maxWidth: "1142px",
        margin: "32px auto",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "flex-start",
        gap: "34px",
        borderRadius: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={profilePicUrl}
            alt="Profile Picture"
            sx={{
              width: { xs: 100, sm: 150 },
              height: { xs: 100, sm: 150 },
              boxShadow: 3,
              borderRadius: "16px",
            }}
          />
          
          {/* Edit Button */}
          <Tooltip title="Edit Profile Picture">
            <IconButton
              onClick={handleEditPicClick}
              sx={{
                position: "absolute",
                bottom: -8,
                right: profilePicUrl ? 32 : -8, // Adjust position when remove button is present
                backgroundColor: "#141514",
                borderRadius: "8px",
                width: 32,
                height: 32,
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.0399 3.02025L8.15988 10.9003C7.85988 11.2003 7.55988 11.7903 7.49988 12.2203L7.06988 15.2303C6.90988 16.3203 7.67988 17.0803 8.76988 16.9303L11.7799 16.5003C12.1999 16.4403 12.7899 16.1403 13.0999 15.8403L20.9799 7.96025C22.3399 6.60025 22.9799 5.02025 20.9799 3.02025C18.9799 1.02025 17.3999 1.66025 16.0399 3.02025Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          </Tooltip>

          {/* Remove Button - Only show if there's a profile picture */}
          {profilePicUrl && (
            <Tooltip title="Remove Profile Picture">
              <IconButton
                onClick={handleRemovePicClick}
                sx={{
                  position: "absolute",
                  bottom: -8,
                  right: -8,
                  backgroundColor: "#dc3545",
                  borderRadius: "8px",
                  width: 32,
                  height: 32,
                  "&:hover": {
                    backgroundColor: "#c82333",
                  },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.33 16.5H13.66"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 12.5H14.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handlePicChange}
        />
      </Box>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography sx={labelCSS}>Full Name*</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                {...register("full_name", {
                  required: "Full name is required",
                })}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={labelCSS}>Designation*</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                {...register("designation", {
                  required: "Designation is required",
                })}
                error={!!errors.designation}
                helperText={errors.designation?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={labelCSS}>Experience*</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                {...register("experience", {
                  required: "Experience is required",
                })}
                error={!!errors.experience}
                helperText={errors.experience?.message}
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography sx={labelCSS}>Department*</Typography>
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
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography sx={labelCSS}>Email*</Typography>
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
                sx={{
                  backgroundColor: "#fff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "12px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                  "& .MuiFormHelperText-root": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                    fontFamily: "Inter",
                    color: "#282D32",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography sx={labelCSS}>Subjects*</Typography>

              <Box maxHeight={300} sx={{ overflowY: "auto" }}>
                {subject?.length > 0 &&
                  subject?.map((val, index) => (
                    <Typography
                      key={index}
                      variant="span"
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        margin: "4px",
                        border: "1px solid #16AA54",
                        borderRadius: "12px",
                        backgroundColor: "#D7FCE0",
                        cursor: "pointer",
                        fontWeight: 400,
                        color: "#174321",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        lineHeight: "18.91px",
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
              size="large"
              disabled={!hasChanges || isLoading}
              sx={{
                mt: 2,
                display: "inline-flex",
                padding: "24px",
                width: "175px",
                height: "52px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                textTransform: "none",
                borderRadius: "8px",
                background: hasChanges ? "#141514" : "#CCCCCC",
                color: hasChanges ? "#FFF" : "#888888",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: "Inter",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "normal",
                cursor: hasChanges ? "pointer" : "not-allowed",
                "&:hover": {
                  border: hasChanges ? "1px solid #141514" : "none",
                  background: hasChanges ? "#E5E5E5" : "#CCCCCC",
                  color: hasChanges ? "#141514" : "#888888",
                },
                "&:disabled": {
                  background: "#CCCCCC",
                  color: "#888888",
                },
              }}
            >
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Confirmation Dialog for Profile Picture Removal */}
      <Dialog
        open={removeConfirmOpen}
        onClose={handleCancelRemove}
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-description"
      >
        <DialogTitle id="remove-dialog-title">
          Remove Profile Picture
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-dialog-description">
            Are you sure you want to remove your profile picture? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

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