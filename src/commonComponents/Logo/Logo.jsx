import { Typography } from "@mui/material";

const Logo = () => {
  return (
    <Typography
      variant="h5"
      sx={{
        color: "#fff",
        fontWeight: "bold",
        letterSpacing: "0.5px",
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
  );
};

export default Logo;
