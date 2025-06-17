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
import { useTranslations } from "next-intl";

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
  const t = useTranslations()
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
  const [openDialog, setOpenDialog] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [showDept, setShowDept] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const isTeacher = roleParam === "TEACHER";

  // Fixed validation schema
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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
  .required("Password is required"),
confirmPassword: yup
  .string()
  .oneOf([yup.ref("newPassword")], "Passwords must match")
  .required("Confirm Password is required"),
    // Fixed conditional validation
    subject: !isTeacher
      ? yup
          .object()
          .nullable()
          .required("Please select a class")
          .typeError("Please select a class")
      : yup.object().nullable(),
    department: isTeacher
      ? yup
          .number()
          .nullable()
          .required("Please select or create a department")
          .typeError("Please select or create a department")
      : yup.number().nullable(),
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: emailParam || "",
      phone: "",
      role: roleParam || "",
      department: null,
      subject: null, // Changed from empty string to null
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
        const newDept = response.data.data;
        setDepartmentOptions((prev) => [...prev, newDept]);
        toast.success("Department created successfully!");
        setNewDepartment("");
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
    
    // Fixed payload construction
    const payload = {
      full_name: data.name,
      email: data.email,
      phone_number: data.phone,
      role: data.role,
      password: data.newPassword,
      country_code: "+91",
      time_zone: "IND",
      department: data.department || "",
      subjects: 9,
      student_class: isTeacher ? "" : (data.subject?.id || data.subject?.value || ""),
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
          toast.error("Please check the form for errors.");
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
      {/* Right Side Signup Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        component={Box}
        sx={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          background: `${isMobile ? "url('/mobileLoginBG2.jpg')" : "#fff"}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: 2,
          animation: "slideFade 1s ease-in-out",
          ...textAnimation,
        }}
      >
        {/* Logo top */}
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: 10,
            width: "192px",
            height: "46px",
            alignItems: "center",
            left: 10,
            flexShrink: 0,
            gap: "10.5px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="34"
            viewBox="0 0 35 34"
            fill="none"
          >
            <path
              d="M0.0158748 8.81498C0.0101488 6.58575 0.00207896 4.43087 2.56751e-06 2.27598C-0.000926809 1.30917 0.25019 0.987796 1.17992 0.771177C1.56558 0.68132 1.95761 0.632127 2.35822 0.66857C3.88182 0.807144 4.11578 1.05925 4.11511 2.5749C4.11381 5.54717 4.21133 8.5237 4.08196 11.4903C3.98171 13.7894 4.66119 15.6491 6.18545 17.3604C9.06447 20.5925 11.8148 23.9391 14.6531 27.2081C16.2384 29.034 18.0485 29.0306 19.6321 27.1933C22.8627 23.445 26.0604 19.6681 29.2551 15.889C29.9215 15.1007 30.1383 14.1134 30.1415 13.1123C30.1534 9.34816 30.1338 5.58383 30.1065 1.81971C30.103 1.33881 30.3183 1.05519 30.723 0.923103C31.1191 0.793827 31.538 0.692037 31.9521 0.668189C33.7031 0.56733 34.2264 1.08319 34.2235 2.81512C34.2173 6.48091 34.1879 10.1471 34.2319 13.8123C34.2555 15.7759 33.6283 17.3728 32.2672 18.8255C28.3249 23.033 24.4615 27.3148 20.5892 31.5875C18.5375 33.8512 15.8937 33.9601 13.8237 31.7234C9.67074 27.2361 5.5585 22.7109 1.43501 18.1962C0.434631 17.1009 0.0271045 15.7715 0.0160334 14.3137C0.00230568 12.5057 0.0148049 10.6975 0.0158748 8.81498Z"
              fill="#16AA54"
            />
            <path
              d="M17.066 7.68108C18.7821 7.68108 20.1733 6.28991 20.1733 4.57381C20.1733 2.85772 18.7821 1.46655 17.066 1.46655C15.3499 1.46655 13.9587 2.85772 13.9587 4.57381C13.9587 6.28991 15.3499 7.68108 17.066 7.68108Z"
              fill="#16AA54"
            />
            <path
              d="M16.9762 22.8585C19.4536 22.8585 26.0051 13.9288 26.0051 10.8991C26.0051 10.0912 25.4696 9.43623 24.8089 9.43623L9.58457 9.43623C8.92394 9.43623 8.38837 10.0912 8.38837 10.8991C8.3884 13.9288 14.4989 22.8585 16.9762 22.8585Z"
              fill="#16AA54"
            />
          </svg>
          <Typography
            sx={{
              width: "147.63px",
              height: "46px",
              flexShrink: 0,
              color: "var(--Primary_Green, #16AA54)",
              fontSize: "34.23px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "normal",
              letterSpacing: "-1.027px",
              fontFamily: "Space Grotesk, Arial, sans-serif",
            }}
          >
            VidyaAI
          </Typography>
        </Box>
        
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
              sx={{
                color: "var(--Secondary_Black, #141514)",
                textAlign: "center",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "44.366px",
                fontFamily: "Inter, sans-serif",
              }}
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
              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {t("Name")}
                </span>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#555" },
                      }}
                      InputProps={{
                        style: {
                          color: "#000",
                          borderRadius: "12px",
                          margin: 0,
                        },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  E-mail
                </span>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#555" },
                      }}
                      InputProps={{
                        readOnly: !!emailParam,
                        style: {
                          color: "#000",
                          borderRadius: "12px",
                          margin: 0,
                        },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Password and Confirm Password */}
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Password
                </span>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
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
                        style: {
                          color: "#000",
                          borderRadius: "12px",
                          margin: 0,
                        },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                      autoComplete="new-password"
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Confirm Password
                </span>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
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
                        style: {
                          color: "#000",
                          borderRadius: "12px",
                          margin: 0,
                        },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Phone and Role */}
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Phone Number
                </span>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      margin="normal"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#555" },
                      }}
                      InputProps={{
                        style: {
                          color: "#000",
                          borderRadius: "12px",
                          margin: 0,
                        },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100%" }}>
                <span
                  style={{
                    color: "var(--Secondary_Black, #141514)",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "118.18%",
                    letterSpacing: "0.8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Role
                </span>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required
                      margin="normal"
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      InputProps={{
                        readOnly: !!roleParam,
                        style: { color: "#000", borderRadius: "12px", margin: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#555" },
                      }}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        margin: 0,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Department or Subject */}
            <Box sx={{ marginTop: 2 }}>
              {isTeacher ? (
                <>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                    <Box sx={{ flex: 1 }}>
                      <span
                        style={{
                          color: "var(--Secondary_Black, #141514)",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 600,
                          lineHeight: "118.18%",
                          letterSpacing: "0.8px",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {t("Department")}
                      </span>
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
                              departmentOptions.find(
                                (dept) => dept.id === value
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              if (typeof newValue === "string") {
                                onChange(null);
                                setNewDepartment(newValue);
                              } else if (newValue && newValue.id) {
                                onChange(newValue.id);
                                setNewDepartment("");
                              } else {
                                onChange(null);
                                setNewDepartment("");
                              }
                            }}
                            onInputChange={(event, newInputValue) => {
                              setNewDepartment(newInputValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                required
                                margin="normal"
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputProps={{
                                  ...params.InputProps,
                                  style: {
                                    color: "#000",
                                    borderRadius: "12px",
                                    margin: 0,
                                  },
                                }}
                                sx={{
                                  backgroundColor: "#fff",
                                  borderRadius: "12px",
                                  margin: 0,
                                }}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateDepartment}
                      disabled={!newDepartment.trim()}
                      sx={{
                        height: "56px",
                        minWidth: "100px",
                        borderRadius: "12px",
                        background: "var(--Secondary_Black, #141514)",
                        textTransform: "none",
                        color: "#fff",
                        ":hover": { backgroundColor: "#333" },
                        marginBottom: "8px",
                      }}
                    >
                      Create
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontStyle: "italic",
                      fontSize: "12px",
                      color: "#666",
                      mt: 1,
                    }}
                  >
                    * Please click on Create button if the department is not in the list.
                  </Typography>
                </>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <span
                    style={{
                      color: "var(--Secondary_Black, #141514)",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "118.18%",
                      letterSpacing: "0.8px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Class
                  </span>
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
                        value={value || null}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            margin="normal"
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputLabelProps={{
                              shrink: true,
                              style: { color: "#555" },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                color: "#000",
                                borderRadius: "12px",
                                margin: 0,
                              },
                            }}
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: "12px",
                              margin: 0,
                            }}
                            variant="outlined"
                          />
                        )}
                      />
                    )}
                  />
                </Box>
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
                height: "52px",
                borderRadius: "12px",
                border: "1px solid var(--Secondary_Black, #141514)",
                background: "var(--White-Color, #FFF)",
                textTransform: "none",
                color: "#000000",
                ":hover": { backgroundColor: "#000000", color: "#fff" },
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? "Signing up..." : "Signup"}
              </Typography>
            </Button>

            {/* Link to Login */}
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
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
      
      {/* Left Side Background */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
              backgroundColor: "#fff",
              margin: "auto",
            }}
          >
            {/* Image 1: Takes 50% of the width */}
            <Box
              sx={{
                width: "388px",
                height: "546px",
                aspectRatio: "194 / 273",
                background:
                  'url("/Illustration_indian 1.png") lightgray 50% / cover no-repeat',
                flexShrink: 0,
                backgroundColor: "#fff",
              }}
            />
            {/* Images 2 and 3: Stack vertically and take remaining 50% */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  width: "253px",
                  height: "259px",
                  aspectRatio: "253 / 259",
                  background:
                    'url("/Illustration_euro 1.png") lightgray 50% / cover no-repeat',
                  flexShrink: 0,
                  backgroundColor: "#fff",
                }}
              />

              <Box
                sx={{
                  width: "253px",
                  height: "259px",
                  aspectRatio: "253 / 259",
                  background:
                    'url("/Illustration_arabic 1.png") lightgray 50% / cover no-repeat',
                  flexShrink: 0,
                  backgroundColor: "#fff",
                }}
              />
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
    </Box>
    </Box>
    </Grid>
    </Grid>
  );
};

export default SignupPage;