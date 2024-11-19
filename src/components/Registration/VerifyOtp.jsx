"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { verifyOneTimePassword, resendOneTimePassword } from "@/api/apiHelper";

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

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams= useSearchParams()
  const pathname=usePathname()
  const email = searchParams.get("email");
  const accesskey = searchParams.get("accesskey");
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false); // Teacher/student role handling
  const [role, setRole] = useState(""); // User role
  const [otpVerified, setOtpVerified] = useState(false);

  const { handleSubmit } = useForm();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


  const verifyOtp = async () => {
    setError("");

    try {
      const payload = {
        username: email,
        otp: otp,
      };
      const apiResponse = await verifyOneTimePassword(payload);

      if (apiResponse?.data?.success && !apiResponse?.data?.errors) {
        setRole(apiResponse?.data?.data?.generated_for);
        setOtpVerified(true);

        if (apiResponse?.data?.data?.generated_for === "STUDENT") {
          setIsTeacher(false);
        } else {
          setIsTeacher(true);
        }
      } else {
        setError(apiResponse?.data?.message || "Failed to verify OTP.");
      }
    } catch (err) {
      setError("An error occurred while verifying the OTP.");
    }
  };

  const resendOtp = async () => {
    setError("");

    try {
      const payload = { username: email };
      const apiResponse = await resendOneTimePassword(payload);

      if (apiResponse?.data?.success) {
        router.push(
            `${pathname}?accesskey=${accesskey}&email=${email}&verifyotp=true`
          );
      } else {
        setError(apiResponse?.data?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError("An error occurred while resending the OTP.");
    }
  };

  return (
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
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        padding: 4,
        animation: "slideFade 1s ease-in-out",
        ...textAnimation,
      }}
    >
      {/* Logo */}
      <Typography
        variant="h5"
        sx={{
          color: "#1976d2",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          mb: 2,
        }}
      >
        VidyaAI
        <Typography
          variant="h5"
          component="span"
          sx={{
            color: "#00c853",
            ml: 0.2,
            fontWeight: "bold",
          }}
        >
          ►
        </Typography>
      </Typography>

      {/* OTP Verification Form */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          maxWidth: 400,
          p: 5,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Verify OTP to Continue
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 2 }}
          onSubmit={handleSubmit(verifyOtp)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={email}
            aria-readonly
            InputLabelProps={{
              shrink: true,
              style: { color: "#555" },
            }}
            InputProps={{
              style: { color: "#000" },
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="otp"
            label="Enter OTP"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            InputLabelProps={{
              shrink: true,
              style: { color: "#555" },
            }}
            InputProps={{
              style: { color: "#000" },
            }}
            sx={{ backgroundColor: "#fff", borderRadius: "5px" }}
            variant="outlined"
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#115293" },
            }}
          >
            Verify OTP
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={resendOtp}
            sx={{ mb: 2 }}
          >
            Resend OTP
          </Button>
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
  );
};

export default VerifyOtp;
