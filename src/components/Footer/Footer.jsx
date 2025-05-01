import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import {
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const handlePrivacy = () => {
    router.push(`/privacy-policy`);
  };

  const handletnc = () => {
    router.push(`/terms-and-conditions`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        color: "#155A03",
        padding: "40px 20px",
        borderTop: "1px solid #155A03",
      }}
    >
      <Grid
        container
        spacing={3}
        display={"flex"}
        justifyContent={"space-between"}
      >
        {/* Headquarters Section */}
        {/* <Grid item xs={12} sm={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Gurugram Headquarters
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            437/7, Kadipur Industrial Area, Sector 10
            <br /> Gurugram, Haryana 122001
          </Typography>
          <a
            href="https://www.google.com/maps/dir//28.449693,76.994149/@28.449693,76.994149,12z?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Box
              // href="#"
              underline="none"
              sx={{ color: "#00aaff", display: "flex", alignItems: "center" }}
            >
              GET DIRECTIONS <MdArrowForward style={{ marginLeft: "5px" }} />
            </Box>
          </a>
        </Grid> */}

        {/* Social Community Section */}
        <Grid item xs={12} sm={4}>
          <Typography
            sx={{
              color: "#155A03",
              fontFamily: "Inter",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              marginBottom: "10px",
            }}
          >
            Join Our Social Community
          </Typography>
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Box underline="none" sx={{ color: "#155A03" }}>
              <FaLinkedin />
            </Box>
            <Box underline="none" sx={{ color: "#155A03" }}>
              <FaFacebookF />
            </Box>
            <Box underline="none" sx={{ color: "#155A03" }}>
              <FaInstagram />
            </Box>
            <Box underline="none" sx={{ color: "#155A03" }}>
              <FaTwitter />
            </Box>
          </Box>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} sm={4}>
          <Typography
            sx={{
              color: "#155A03",
              fontFamily: "Inter",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              marginBottom: "10px",
            }}
          >
            Let&apos;s Discuss What&apos;s Next
          </Typography>
          <Typography
            sx={{
              color: "#0B2E02",
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              marginBottom: "10px",
            }}
          >
            Have a project or a question? We&apos;d love to hear from you.
          </Typography>
          <a
            href="https://www.indiqai.ai/"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Box
              underline="none"
              sx={{
                color: "#16AA54",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                display: "flex",
                alignItems: "center",
              }}
            >
              CONTACT US <MdArrowForward style={{ marginLeft: "5px" }} />
            </Box>
          </a>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "40px", textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#7a7a7a", fontFamily:"Inter" }}>
          © 2023 IndiqAI. All rights reserved.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#7a7a7a", cursor: "pointer", fontFamily:"Inter" }}
            onClick={() => handletnc()}
          >
            Terms and Conditions
          </Typography>
          <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
            |
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#7a7a7a", cursor: "pointer" }}
            onClick={() => handlePrivacy()}
          >
            Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
