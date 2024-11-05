import { Typography } from "@mui/material";

const Logo = ({ color = 'initial' }) => {
  return (
    <Typography
      variant="h5"
      sx={{
        color: color === 'black' ? '#023020' : 'inherit',
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
