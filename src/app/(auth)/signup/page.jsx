"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { RiAccountCircleLine } from "react-icons/ri";
import {
  grtDepartment,
  getClassDropdown,
  registration,
  postDepartment,
} from "@/api/apiHelper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Logo from "@/commonComponents/Logo/Logo";

// Define keyframes for animation
const textAnimation = {
  "@keyframes slideFade": {
    "0%": {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
};

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailParam = searchParams.get("email");
  const roleParam = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // For Create Department Dialog
  const [newDepartment, setNewDepartment] = useState(""); // Input for new department
  const [showDept, setShowDept] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const isTeacher = roleParam === "TEACHER";

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    role: yup.string().required("Role is required"),
    newPassword: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
    subject:
      !isTeacher &&
      yup
        .number()
        .typeError("Please select/fill class before submitting")
        .required("Please select/fill class before submitting"),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: emailParam || "",
      phone: "",
      role: roleParam || "",
      department: null,
      class: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const fetchData = async () => {
    try {
      if (isTeacher) {
        const departmentResponse = await grtDepartment();
        setDepartmentOptions(departmentResponse?.data?.data || []);
      } else {
        const response = await getClassDropdown();
        setClassOptions(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dropdown options.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleParam]);

  const handleCreateDepartment = async () => {
    if (!newDepartment.trim()) {
      toast.error("Department name cannot be empty.");
      return;
    }

    const departmentExists = departmentOptions.some(
      (dept) => dept.name.toLowerCase() === newDepartment.trim().toLowerCase()
    );

    if (departmentExists) {
      toast.error(`${newDepartment} department already exists.`);
      return;
    }

    try {
      const response = await postDepartment({ name: newDepartment.trim() });
      if (response?.data?.success) {
        const newDept = response.data.data; // Assuming API returns the created department object
        setDepartmentOptions((prev) => [...prev, newDept]);
        toast.success("Department created successfully!");
        setNewDepartment("");
        // Update the form field with the new department's ID
        setValue("department", newDept.id);
      } else {
        toast.error("Failed to create department.");
      }
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    const payload = {
      full_name: data.name,
      email: data.email,
      phone_number: data.phone,
      role: data.role,
      password: data.newPassword,
      country_code: "+91",
      time_zone: "IND",
      department:
        data.department?.value || data.department?.id || data.department || "",
      subjects: 9,
      student_class: data.subject || "",
    };

    try {
      const apiResponse = await registration(payload);

      if (apiResponse?.data?.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else if (apiResponse?.response?.status === 400) {
        let errorsArray = apiResponse?.response?.data?.errors;
        if (errorsArray && Object.keys(errorsArray).length > 0) {
          Object.keys(errorsArray).forEach((field) => {
            const messages = errorsArray[field];
            setError(field, {
              type: "server",
              message: messages.join(". "),
            });
          });
          toast.error(messages.join(". "));
        } else {
          setServerError("An unexpected error occurred. Please try again.");
          toast.error("Signup failed. Please check the details.");
        }
      } else {
        setServerError("An unexpected error occurred. Please try again.");
        toast.error("Signup failed. Please check the details.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setServerError("An error occurred. Please try again.");
      toast.error("Signup failed. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
      }}
    >
      {/* Left Side Background */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: "url('/loginBG3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Overlay Text */}
          <Box
            sx={{
              position: "absolute",
              top: "25%",
              left: "25%",
              color: "#fff",
              textAlign: "left",
              animation: "slideFade 1s ease-in-out",
              ...textAnimation,
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "#EDEADE" }}
            >
              Welcome to
              <br />
              <Box sx={{ p: 1 }}>
                <Logo />
              </Box>
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, color: "#191970" }}>
              Your AI-powered Learning Companion
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Right Side Signup Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Box}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          background: `${
            isMobile
              ? "url('/mobileLoginBG2.jpg')"
              : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"
          }`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Create Account
            </Typography>
            <RiAccountCircleLine
              style={{ paddingTop: "4px", fontSize: "28px" }}
            />
          </Box>

          {/* Signup Form */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            {/* Name and Email */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#555" },
                    }}
                  />
                )}
              />

              {/* Email Field (Read-Only) */}
              <TextField
                label="Email"
                fullWidth
                required
                margin="normal"
                value={emailParam || ""}
                InputProps={{
                  readOnly: true,
                  style: { color: "#000" },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
              />
            </Box>

            {/* Password and Confirm Password */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Password Field */}
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#555" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <MdVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: "#000" },
                    }}
                    sx={{ backgroundColor: "#fff", borderRadius: "5px" }}
                    variant="outlined"
                    autoComplete="new-password"
                  />
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#555" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <MdVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: "#000" },
                    }}
                    sx={{ backgroundColor: "#fff", borderRadius: "5px" }}
                    variant="outlined"
                  />
                )}
              />
            </Box>

            {/* Phone and Role */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Phone Number Field */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "#555" },
                    }}
                  />
                )}
              />

              {/* Role Field (Read-Only) */}
              <TextField
                label="Role"
                fullWidth
                required
                margin="normal"
                value={roleParam || ""}
                InputProps={{
                  readOnly: true,
                  style: { color: "#000" },
                }}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
              />
            </Box>

            {/* Department or Subject */}
            <Box>
              {isTeacher ? (
                // Department Autocomplete for Teachers
                <>
                  
                  <span style={{display:"flex",}}>
                  <span style={{flexBasis: "80%", flexGrow: 0}}>
                  <Controller
                    name="department"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <Autocomplete
                        freeSolo
                        options={departmentOptions}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.name || ""
                        }
                        value={
                          departmentOptions.find((dept) => dept.id === value) ||
                          null
                        }
                        onChange={(event, newValue) => {
                          if (typeof newValue === "string") {
                            // For free solo input, set the name as value
                            onChange(null); // Reset the value to null since the ID isn't available yet
                            setNewDepartment(newValue); // Update state for creating a new department
                          } else if (newValue && newValue.id) {
                            // For selected department, set the ID
                            onChange(newValue.id);
                            setNewDepartment(""); // Clear new department since it's an existing one
                          } else {
                            onChange(null);
                            setNewDepartment("");
                          }
                        }}
                        onInputChange={(event, newInputValue) => {
                          setNewDepartment(newInputValue); // Update new department input
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Department"
                            required
                            margin="normal"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                    )}
                  />
                  </span>
                  
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateDepartment}
                      sx={{flexBasis: "20%",flexGrow:0, m:2, p:2}}
                    >
                      Create
                    </Button>
                  </span>
                  <span style={{ fontStyle: "italic", fontSize: "12px" }}>
                     * Please click on Create button if it is not
                      present in the list.
                  </span>
                </>
              ) : (
                // Class Field for Students
                <Controller
                  name="subject"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      options={classOptions}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name || ""
                      }
                      value={
                        classOptions.find((option) => option.id === value) ||
                        null
                      }
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Class"
                          required
                          margin="normal"
                          error={!!error}
                          helperText={error ? error.message : null}
                          InputLabelProps={{
                            shrink: true,
                            style: { color: "#555" },
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Box>

            {/* Server Error Message */}
            {serverError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {serverError}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#1976d2",
                ":hover": { backgroundColor: "#115293" },
              }}
            >
              {loading ? "Signing up..." : "Signup"}
            </Button>

            {/* Link to Login */}
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    onClick={() => router.push("/login")}
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
