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
import { useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { loginApi } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Image from "next/image";

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

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

    // Determine screen size
  const isMobile = useMediaQuery("(max-width:600px)");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginApi(formData);
      if (response.status === 200) {
        const { access, refresh, username, message } = response.data;
        Cookies.set("ACCESS_TOKEN", access, { expires: 7 }); // Store access token in cookies
        Cookies.set("REFRESH_TOKEN", refresh, { expires: 30 }); // Store refresh token in cookies
        const accessToken = decodeToken(access);
        // Redirect user after successful login
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          if (accessToken?.role === "TEACHER") {
            router.replace("/teacher/dashboard");
          } else if (accessToken?.role === "STUDENT") {
            router.replace("/student/dashboard");
          } else {
            router.replace("/admin/dashboard");
          }
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
      {!isMobile && <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          // background: "linear-gradient(to bottom right, #1976d2, #00c853)",
          backgroundImage: "url('/loginBG3.jpg')", // Add background image
          backgroundSize: "cover", // Ensure the image covers the entire page
          backgroundPosition: "center", // Center the image
          position: "relative", // Ensures the overlay text is positioned correctly
        }}
      >
        {/* Overlay Text */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: "25%",
            // transform: "translate(-50%, -50%)",
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
            <Image
              src="/vidyaAIlogo.png"
              alt="VidyaAI Logo"
              width={40} // Adjust width as needed
              height={40} // Adjust height as needed
              style={{ display: "inline-block" }} // Optional: to align properly
            />
            <span style={{ color: "#454B1B" }}> VidyaAI</span>
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "#191970" }}>
            Your AI-powered Learning Companion
          </Typography>
        </Box>
      </Grid>}

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
          // backgroundColor: "#f7f9fc",
          // background: "radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0.1%, rgba(233, 226, 226, 0.28) 90.1%)",
          background: `${isMobile ? "url('/mobileLoginBG2.jpg')" : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"}`,
          backgroundSize: "cover", // Ensure the image covers the entire page
          backgroundPosition: "center", // Center the image
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

        {/* Login Form */}
        <Box
          sx={{
            mt: 1,
            width: "100%",
            maxWidth: 400,
            // border: "1px solid black",
            p: 5,
          }}
        >
          <Typography component="h1" variant="h5" fontWeight={"bold"} sx={{ textAlign: "center", color:"#36454F" }}>
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
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
              InputProps={{
                style: { color: "#000" },
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
              }}
              variant="outlined" // Optionally use "filled" for a different style
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
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
              InputProps={{
                style: { color: "#000" },
              }}
              sx={{ backgroundColor: "#fff", borderRadius: "5px" }}
              variant="outlined"
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
