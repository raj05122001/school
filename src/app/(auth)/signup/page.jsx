"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  MenuItem,
} from "@mui/material";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiAccountCircleLine } from "react-icons/ri";

const SignupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    subject: "",
    newPassword:"",
    confirmPassword:"",
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

    // Add your form submission logic here
    try {
      console.log("Form submitted:", formData);
      setSuccess("Account created successfully!");
      toast.success("Account created successfully!");
      // Redirect to login page
      router.push("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("Signup failed. Please check the details.");
    }
  };

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

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
      }}
    >
      {/* Left Side Background */}
      {/* Left Side with Gradient Background */}
      <Grid
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
      </Grid>

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
          background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
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
        <Box sx={{display:"flex", justifyContent:"center"}}>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
            Create Account 
          </Typography>
        <RiAccountCircleLine style={{paddingTop:"4px", fontSize:"28px"}}/>
        </Box>
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
              name="name"
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            />
            <TextField
              name="email"
              label="Email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Password"
              type="password"
              id="password"
              value={formData.newPassword}
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
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="password"
              value={formData.confirmPassword}
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
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
              name="phone"
              label="Phone Number"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            />
            <TextField
              name="role"
              label="Role"
              fullWidth
              required
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
              select
              name="department"
              label="Department"
              fullWidth
              required
              value={formData.department}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            >
              <MenuItem value="CSE">CSE</MenuItem>
              <MenuItem value="ME">ME</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="CE">CE</MenuItem>
            </TextField>
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
            <TextField
              name="Subject"
              label="Subject"
              fullWidth
              required
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true, // Ensures the label shrinks when value is present
                style: { color: "#555" },
              }}
            />
          </Box>  
            
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
              Signup
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
    </Grid>
  );
};

export default SignupPage;
