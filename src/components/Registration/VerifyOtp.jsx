"use client";
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOneTimePassword, resendOneTimePassword } from "@/api/apiHelper";
import toast from "react-hot-toast";
import {CircularProgress} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Logo from "@/commonComponents/Logo/Logo";

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
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const accesskey = searchParams.get("accesskey");
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [otp, setOtp] = useState("");

  const { handleSubmit } = useForm();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const payload = {
        username: email,
        otp: otp,
      };
      const apiResponse = await verifyOneTimePassword(payload);

      if (apiResponse?.data?.success && !apiResponse?.data?.errors) {
        toast.success(apiResponse?.data?.message);
        setLoading(false);
        router.push(
          `/signup/?accesskey=${accesskey}&email=${email}&verifyotp=true&role=${apiResponse?.data?.data?.generated_for}`
        );
      } else {
        toast.error(apiResponse?.data?.message || "Failed to verify OTP.");
      }
    } catch (err) {
      toast.error("An error occurred while verifying the OTP.");
      setLoading(false);
    }finally{
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const payload = { username: email };
      const apiResponse = await resendOneTimePassword(payload);

      if (apiResponse?.data?.success) {
        toast.success(apiResponse?.data?.message);
      } else {
        toast.error(apiResponse?.data?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("An error occurred while resending the OTP.");
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
        background: `${isMobile ? "url('/mobileLoginBG2.jpg')" :"linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 4,
        animation: "slideFade 1s ease-in-out",
        ...textAnimation,
      }}
    >

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
        <Logo />
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
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify OTP"
            )}
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
