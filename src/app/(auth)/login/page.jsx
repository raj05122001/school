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
  IconButton,
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";
import { useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { loginApi } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Image from "next/image";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Logo from "@/commonComponents/Logo/Logo";

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
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const roles = ["Student", "Teacher", "Admin"];

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
        if (redirectTo && redirectTo !== "/login") {
          router?.replace(redirectTo);
        } else {
          if (accessToken?.role === "TEACHER") {
            router?.replace("/teacher/dashboard");
          } else if (accessToken?.role === "STUDENT") {
            router?.replace("/student/dashboard");
          } else {
            router?.replace("/admin/dashboard");
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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
      }}
    >
      {/* Right Side Login Form */}
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
          backgroundSize: "cover", // Ensure the image covers the entire page
          backgroundPosition: "center", // Center the image
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
        {/* Login Form */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "407px",
            // border: "1px solid black",
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
              // display:"flex",
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
            <Box>Sign in as</Box>
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
          {/* <Box
            sx={{
              marginTop: "28px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              alignSelf: "stretch",
              justifyContent: "center",
            }}
          >
            {roles.map((role) => (
              <Button
                key={role}
                variant="contained"
                onClick={() => setSelectedRole(role)}
                sx={{
                  backgroundColor: selectedRole === role ? "#f3f5f7" : "#fff",
                  color: "var(--Text-Color-1, #3B3D3B)",
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "4px 12px",
                  ":hover": {
                    backgroundColor: selectedRole === role ? "#f3f5f7" : "#fff",
                  },
                }}
              >
                {role}
              </Button>
            ))}
          </Box> */}
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
              padding: "16px 0px",
            }}
            onSubmit={handleSubmit}
          >
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
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                // label="E-mail"
                placeholder="E-mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks when value is present
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
                variant="outlined" // Optionally use "filled" for a different style
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
                Password
              </span>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                // label="Password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true, // Ensures the label shrinks when value is present
                  style: { color: "#555" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handlePasswordVisibility()}
                        edge="end"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: "#000", borderRadius: "12px", margin: 0 },
                }}
                sx={{ backgroundColor: "#fff", borderRadius: "5px", margin: 0 }}
                variant="outlined"
              />
            </Box>

            <Grid
              container
              sx={{
                mt: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <Grid item xs={6} className="Jakarta-font-family">
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  sx={{
                    color: "var(--Text-color-2, #404145)",
                    textAlign: "center",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "118.185%",
                    letterSpacing: "0.84px",
                  }}
                />
              </Grid> */}
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  // justifyContent: "flex-end",
                }}
              >
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/forgot-password");
                  }}
                  variant="body2"
                  sx={{
                    cursor:"pointer",
                    color: "var(--Primary_Green, #16AA54)",
                    textAlign: "right",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "118.185%", // or simply "14.182px"
                    letterSpacing: "0.84px",
                    textDecoration: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Forgot password
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
                ":hover": { backgroundColor: "#fff", color: "black" },
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
                Log in
              </Typography>
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => router.push("/registration")}
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
                Sign up
              </Typography>
            </Button>
            <Typography
              sx={{
                color: "var(--Text-color-2, #8C8F90)",
                textAlign: "center",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "normal",
                fontFamily: "Inter, sans-serif",
              }}
            >
              By signing in to VidyaAI you agree to our{" "}
              <Link
                onClick={() => router.push("/login")}
                sx={{
                  color: "#1976d2",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Terms and Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Box>
        {/* <Box
          sx={{
            width: "832px",
            height: "8%",
            flexShrink: 0,
            borderRadius: "832px",
            background:
              "linear-gradient(67deg, rgba(112, 255, 0, 0.28) 29.8%, rgba(18, 221, 0, 0.28) 80.94%)",
            filter: "blur(66.95px)",
            position: "absolute",
            bottom: 0,
          }}
        ></Box> */}
      </Grid>

      {/* Left Side with Gradient Background */}
      {!isMobile && (
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            display: "inline-flex",
            // padding: "247px 32px 231px 31px",
            flexDirection: "column",
            // justifyContent: "flex-end",
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
              // marginTop: "247px",
              // marginBotton: "231px",
              // marginLeft: "31px",
              // maginRight: "32px",
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
  );
};

export default LoginPage;
