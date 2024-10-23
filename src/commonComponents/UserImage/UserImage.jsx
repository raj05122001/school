import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BASE_URL_MEET } from "@/constants/apiconfig";

const UserImage = ({ profilePic, name, width = 32, height = 32 }) => {
  return (
    <>
      {profilePic ? (
        <Image
          src={`${BASE_URL_MEET}${profilePic}`}
          alt="Profile"
          width={width}
          height={height}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <Avatar
          alt={name || ""}
          src="/sampleprofile.jpg" // Sample profile image
          sx={{ width: width, height: height }}
        />
      )}
    </>
  );
};

export default UserImage;
