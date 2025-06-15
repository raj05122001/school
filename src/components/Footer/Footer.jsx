import React from "react";
import { Box, Typography, Grid, Link, Button } from "@mui/material";
import {
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useRouter } from "next/navigation";
import { NextIntlClientProvider, useTranslations } from "next-intl";
const Footer = () => {
  const t=useTranslations()
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
        backgroundColor: "#141514",
        color: "#fff",
        padding: "26px 151px 67px 35px",
        // borderTop: "1px solid #fff",
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
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              // marginBottom: "28px",
              marginBottom: "7px",
            }}
          >
            {t("Join Our Social Community")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "15px",
              width: "180px",
              height: "38px",
            }}
          >
            <Box underline="none" sx={{ color: "#fff" }}>
              <FaLinkedin style={{ fontSize: "20px" }} />
            </Box>
            <Box underline="none" sx={{ color: "#fff" }}>
              <FaFacebookF style={{ fontSize: "20px" }} />
            </Box>
            <Box underline="none" sx={{ color: "#fff" }}>
              <FaInstagram style={{ fontSize: "20px" }} />
            </Box>
            <Box underline="none" sx={{ color: "#fff" }}>
              <FaTwitter style={{ fontSize: "20px" }} />
            </Box>
          </Box>

          <Box sx={{ marginTop: "78px", display:"flex", flexDirection:"column", gap:"10px" }}>
            <Typography
              
              sx={{ color: "#C1C1C1", fontFamily: "Inter", fontSize:"12px", fontStyle:"normal", fontWeight:300, lineHeight:"9px" }}
            >
              © 2023 IndiqAI. All rights reserved.
            </Typography>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                gap: "4px",
              }}
            >
              {/* <Typography
                variant="body2"
                sx={{
                  color: "#7a7a7a",
                  cursor: "pointer",
                  fontFamily: "Inter",
                }}
                onClick={() => handletnc()}
              >
                Terms and Conditions
              </Typography>
              <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
                |
              </Typography> */}
              <Typography
                // variant="body2"
                sx={{ color: "#C1C1C1", fontFamily: "Inter", fontSize:"12px", fontStyle:"normal", fontWeight:300, lineHeight:"9px" }}
                onClick={() => handlePrivacy()}
              >
                Privacy Policy
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} sm={4} sx={{display:"flex", gap:"11px", flexDirection:"column"}}>
          <Typography
            sx={{
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "48px",
              // marginBottom: "10px",
            }}
          >
            {t("Let's Discuss What's Next")}
          </Typography>
          <Box sx={{display:"flex", flexDirection:"column", gap:"16px"}}>
          <Typography
            sx={{
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "19px",
            }}
          >
            {t("Have a project or a question? We'd love to hear from you")}
          </Typography>
          <a
            href="https://www.indiqai.ai/"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Button
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:"center",
                padding:"12px 32px",
                color: "#141514",
                backgroundColor:"#FCFBFA",
                borderRadius:"8px",
                fontFamily: "Aptos",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                ":hover":{backgroundColor:"#FCFBFA"},
                textTransform:"none"
                
              }}
            >
              {t("Contact Us")}
            </Button>
          </a>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
