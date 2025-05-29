"use client";
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOneTimePassword, resendOneTimePassword } from "@/api/apiHelper";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
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
  const [timer, setTimer] = useState(0);

  const [otp, setOtp] = useState("");

  const { handleSubmit } = useForm();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleClick = () => {
    resendOtp();
    setTimer(30);
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
    } finally {
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
      {/* OTP Verification Form */}
      <Box
        sx={{
          mt: 1,
          width: "100%",
          maxWidth: 400,
          p: 5,
        }}
      >
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
        <Typography
          sx={{
            color: "var(--Secondary_Black, #141514)",
            textAlign: "center",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "44.366px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Logo />
          Verify OTP to Continue
        </Typography>
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
          onSubmit={handleSubmit(verifyOtp)}
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
              name="email"
              // label="Email Address"
              type="email"
              value={email}
              aria-readonly
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
              name="otp"
              // label="Enter OTP"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              InputLabelProps={{
                shrink: true,
                style: { color: "#555" },
              }}
              InputProps={{
                style: { color: "#000", borderRadius: "12px", margin: 0 },
              }}
              sx={{ backgroundColor: "#fff", borderRadius: "5px", margin: 0 }}
              variant="outlined"
            />
          </Box>

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
            disabled={loading} // Disable button when loading
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
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClick}
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
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Typography>
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
