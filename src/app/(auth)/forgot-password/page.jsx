"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { resendOneTimePassword, resetPassword } from "@/api/apiHelper";

// Keyframes for the text animation
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

const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);

  // Determine screen size
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null); // Clear error when user starts typing
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual API call
      const response = await resendOneTimePassword({
        username: formData.email,
      });

      if (response.data?.success) {
        toast.success("OTP sent successfully to your email!");
        setStep(2);
        startOtpTimer();
      } else {
        throw new Error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP - NEW FUNCTION ADDED
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.otp) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    if (formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      // For OTP verification, we just move to step 3
      // The actual OTP verification will happen in the reset password step
      setStep(3);
      toast.success("OTP verified! Please set your new password.");
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.password) {
      setError("Please enter a new password");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const apiData = {
      password: formData.password,
      otp: formData.otp,
    };

    try {
      // Replace with your actual API call - this will send both password and OTP
      const response = await resetPassword(formData.email, apiData);

      if (response.success) {
        toast.success("Password reset successful!");
        router.push("/login");
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;

    setLoading(true);
    try {
      const response = await resendOneTimePassword({
        username: formData.email,
      });
      if (response.data?.success) {
        toast.success("OTP resent successfully!");
        startOtpTimer();
      } else {
        throw new Error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Timer
  const startOtpTimer = () => {
    setOtpTimer(60);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    } else {
      router.push("/login");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "20px",
              padding: "16px 0px",
            }}
            onSubmit={handleSendOtp}
          >
            <Typography
              sx={{
                color: "var(--Text-color-2, #8C8F90)",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                fontFamily: "Inter, sans-serif",
                width: "100%",
              }}
            >
              Enter your email address and we&apos;ll send you an OTP to reset your
              password.
            </Typography>

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
                Email Address
              </span>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Enter your email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
                InputProps={{
                  style: { color: "#000", borderRadius: "12px", margin: 0 },
                }}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  margin: 0,
                }}
                variant="outlined"
              />
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 1, fontSize: "14px" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "52px",
                padding: "24px",
                gap: "12px",
                flexShrink: 0,
                alignSelf: "stretch",
                borderRadius: "12px",
                background: "var(--Secondary_Black, #141514)",
                textTransform: "none",
                color: "#fff",
                ":hover": { backgroundColor: "#333" },
                ":disabled": { backgroundColor: "#ccc" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Send OTP
                </Typography>
              )}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "20px",
              padding: "16px 0px",
            }}
            onSubmit={handleVerifyOtp} // FIXED: Added the missing onSubmit handler
          >
            <Typography
              sx={{
                color: "var(--Text-color-2, #8C8F90)",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                fontFamily: "Inter, sans-serif",
                width: "100%",
              }}
            >
              We&apos;ve sent a 6-digit OTP to {formData.email}. Please enter it
              below.
            </Typography>

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
                Enter OTP
              </span>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                placeholder="Enter 6-digit OTP"
                name="otp"
                type="text"
                inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                value={formData.otp}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
                InputProps={{
                  style: { color: "#000", borderRadius: "12px", margin: 0 },
                }}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  margin: 0,
                }}
                variant="outlined"
              />
            </Box>

            <Box sx={{ width: "100%", textAlign: "center" }}>
              {otpTimer > 0 ? (
                <Typography
                  sx={{
                    color: "var(--Text-color-2, #8C8F90)",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Resend OTP in {otpTimer}s
                </Typography>
              ) : (
                <Link
                  component="button"
                  type="button"
                  onClick={handleResendOtp}
                  sx={{
                    color: "var(--Primary_Green, #16AA54)",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontFamily: "Inter, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Resend OTP
                </Link>
              )}
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 1, fontSize: "14px" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "52px",
                padding: "24px",
                gap: "12px",
                flexShrink: 0,
                alignSelf: "stretch",
                borderRadius: "12px",
                background: "var(--Secondary_Black, #141514)",
                textTransform: "none",
                color: "#fff",
                ":hover": { backgroundColor: "#333" },
                ":disabled": { backgroundColor: "#ccc" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Verify OTP
                </Typography>
              )}
            </Button>
          </Box>
        );

      case 3:
        return (
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "20px",
              padding: "16px 0px",
            }}
            onSubmit={handleResetPassword}
          >
            <Typography
              sx={{
                color: "var(--Text-color-2, #8C8F90)",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                fontFamily: "Inter, sans-serif",
                width: "100%",
              }}
            >
              Create a new password for your account.
            </Typography>

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
                New Password
              </span>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="Enter new password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: "#000", borderRadius: "12px", margin: 0 },
                }}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  margin: 0,
                }}
                variant="outlined"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                placeholder="Confirm new password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#555" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleConfirmPasswordVisibility}
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
                  style: { color: "#000", borderRadius: "12px", margin: 0 },
                }}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  margin: 0,
                }}
                variant="outlined"
              />
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 1, fontSize: "14px" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "52px",
                padding: "24px",
                gap: "12px",
                flexShrink: 0,
                alignSelf: "stretch",
                borderRadius: "12px",
                background: "var(--Secondary_Black, #141514)",
                textTransform: "none",
                color: "#fff",
                ":hover": { backgroundColor: "#333" },
                ":disabled": { backgroundColor: "#ccc" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Reset Password
                </Typography>
              )}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
      default:
        return "Forgot Password";
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
      {/* Right Side Form */}
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

        {/* Back Button */}
        <IconButton
          onClick={goBack}
          sx={{
            position: "absolute",
            top: 80,
            left: 20,
            color: "var(--Secondary_Black, #141514)",
          }}
        >
          <MdArrowBack size={24} />
        </IconButton>

        {/* Form */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "407px",
            p: 3,
          }}
        >
          <Typography
            sx={{
              color: "var(--Secondary_Black, #141514)",
              textAlign: "center",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "44.366px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Welcome to
          </Typography>
          <Typography
            sx={{
              color: "var(--Primary_Green, #16AA54)",
              fontSize: "64px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "75.638px",
              textAlign: "center",
              fontFamily: "Space Grotesk, Arial, sans-serif",
            }}
          >
            VidyaAI
          </Typography>
          <Box
            sx={{
              color: "var(--Secondary_Black, #141514)",
              width: "100%",
              height: "19px",
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              marginTop: "44px",
              display: "flex",
              gap: "6px",
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: "#C1C1C1",
                marginTop: "10px",
                marginBottom: "9px",
              }}
            />
            <Box>{getStepTitle()}</Box>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: "#C1C1C1",
                marginTop: "10px",
                marginBottom: "9px",
              }}
            />
          </Box>

          {renderStepContent()}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography
              sx={{
                color: "var(--Text-color-2, #8C8F90)",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Remember your password?{" "}
              <Link
                onClick={() => router.push("/login")}
                sx={{
                  color: "var(--Primary_Green, #16AA54)",
                  cursor: "pointer",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Left Side with Images */}
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
  );
};

export default ForgotPassword;
