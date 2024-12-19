"use client";
import React, { useState, useRef } from "react";
import { Box, TextField, Button, Typography, Link, Grid,CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getOneTimePassword } from "@/api/apiHelper";
import toast from "react-hot-toast";
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

const AccessKey = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const accessKeyUrl = searchParams.get("accesskey");
  const [loading,setLoading]=useState(false)

  const [formData, setFormData] = useState({
    email: "",
    accessKey: accessKeyUrl || "",
  });

  const { handleSubmit } = useForm();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchOtp = async () => {
    setLoading(true)

    try {
      const payload = {
        username: formData.email,
        access_key: formData.accessKey,
      };

      const apiResponse = await getOneTimePassword(payload);
      if (
        apiResponse?.data?.success ||
        apiResponse?.data?.message === "Otp is already sent"
      ) {
        router.push(
          `${pathname}?accesskey=${formData?.accessKey}&email=${formData?.email}`
        );
      } else {
        toast.error(apiResponse?.data?.message || "Something went wrong.")
      }
      setLoading(false)
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.")
      setLoading(false)
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
        backgroundSize:"cover",
        backgroundPosition: "center",
        padding: 4,
        animation: "slideFade 1s ease-in-out",
        ...textAnimation,
      }}
    >

      {/* Signup Form */}
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
          Signup to create an account
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 2 }}
          onSubmit={handleSubmit(fetchOtp)}
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
            name="accessKey"
            label="Access Key"
            type="text"
            value={formData.accessKey}
            onChange={handleChange}
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
              "Get OTP"
            )}
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

export default AccessKey;
