"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Grid,
  Slide,
} from "@mui/material";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { loginApi } from "@/api/apiHelper";

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

const window = global?.window || {};
const localStorage = window.localStorage || {};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await loginApi(formData);
      if (response.status === 200) {
        console.log("response.data", response.data);
        const { access, refresh, username, message } = response.data;
        localStorage.setItem("REFRESH_TOKEN", refresh);
        localStorage.setItem("ACCESS_TOKEN", access);
        Cookies.set("ACCESS_TOKEN", access, { expires: 7 }); // Store access token in cookies
        Cookies.set("REFRESH_TOKEN", refresh, { expires: 7 }); // Store refresh token in cookies

        // Display success message
        setSuccess(message || "Logged in successfully!");

        // Redirect user after successful login
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.replace("/teacher/dashboard"); // Default redirect to dashboard or any other page
        }

        // Display a toast notification for success
        toast.success("Login successful!");
      }
    } catch (error) {
      // Handle error response
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      toast.error("Login failed. Please check your credentials.");
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
      {/* Left Side with Gradient Background */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          background: "linear-gradient(to bottom right, #1976d2, #00c853)",
          position: "relative", // Ensures the overlay text is positioned correctly
        }}
      >
        {/* Overlay Text */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center",
            animation: "slideFade 1s ease-in-out",
            ...textAnimation,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>
            Welcome to VidyaAI
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Your AI-powered Learning Companion
          </Typography>
        </Box>
      </Grid>

      {/* Right Side Login Form */}
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
          backgroundColor: "#f7f9fc",
          padding: 4,
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

        {/* Login Form */}
        <Box
          sx={{
            mt: 1,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            Sign in to your account
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 2 }}
            onSubmit={handleSubmit}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              InputLabelProps={{
                style: { color: "#555" },
              }}
              InputProps={{
                style: { color: "#000" },
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              InputLabelProps={{
                style: { color: "#555" },
              }}
              InputProps={{
                style: { color: "#000" },
              }}
              sx={{ backgroundColor: "#fff", borderRadius: "5px" }}
            />
            <Grid
              container
              sx={{
                mt: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  sx={{ color: "#555" }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Link href="#" variant="body2" sx={{ color: "#1976d2" }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="primary" sx={{ mt: 1 }}>
                {success}
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
              Sign In
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Don&apos;t have an account?{" "}
                  <Link
                    onClick={() => router.push("/registration")}
                    sx={{ color: "#1976d2", cursor: "pointer" }}
                  >
                    Sign Up
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

export default LoginPage;
