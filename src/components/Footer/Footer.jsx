import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import {
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1c1e22",
        color: "#ffffff",
        padding: "40px 20px",
      }}
    >
      <Grid container spacing={3}>
        {/* Headquarters Section */}
        <Grid item xs={12} sm={4}>
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
        </Grid>

        {/* Social Community Section */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Join Our Social Community
          </Typography>
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Box underline="none" sx={{ color: "#ffffff" }}>
              <FaLinkedin />
            </Box>
            <Box underline="none" sx={{ color: "#ffffff" }}>
              <FaFacebookF />
            </Box>
            <Box underline="none" sx={{ color: "#ffffff" }}>
              <FaInstagram />
            </Box>
            <Box underline="none" sx={{ color: "#ffffff" }}>
              <FaTwitter />
            </Box>
          </Box>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Let&apos;s Discuss What&apos;s Next
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            Have a project or a question? We&apos;d love to hear from you.
          </Typography>
          <a
            href="https://www.intellai.ai/contact"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Box
              underline="none"
              sx={{ color: "#00aaff", display: "flex", alignItems: "center" }}
            >
              CONTACT US <MdArrowForward style={{ marginLeft: "5px" }} />
            </Box>
          </a>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: "40px", textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
          © 2023 IntellAI. All rights reserved.
        </Typography>
        <Box
          underline="none"
          sx={{ color: "#7a7a7a", marginTop: "10px", display: "inline-block" }}
        >
          Privacy Policy
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
