import { Typography } from "@mui/material";
import Image from "next/image";

const Logo = ({ color = "initial" }) => {
  return (
    <Typography
      variant="h5"
      sx={{
        color: color === "black" ? "#023020" : "inherit",
        fontWeight: "bold",
        letterSpacing: "0.5px",
      }}
    >
      <Image
        className="cursor-pointer"
        src="/vidyaAIFulllogo.png"
        alt="chat bot"
        width={150}
        height={30}
      />
    </Typography>
  );
};

export default Logo;
