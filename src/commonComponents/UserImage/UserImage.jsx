import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const UserImage = ({ profilePic="", name="", width = 32, height = 32 }) => {
  // Get the access token from cookies and decode it if props are not provided
  const token = Cookies.get("ACCESS_TOKEN");
  const decodedToken = token ? decodeToken(token) : null;

  // Use props if provided, otherwise fall back to the decoded token values
  const finalProfilePic = profilePic || decodedToken?.profile_pic;
  const finalName = name || decodedToken?.full_name;

  return (
    <>
      {finalProfilePic ? (
        <Image
          src={`${BASE_URL_MEET}${finalProfilePic}`}
          alt="Profile"
          width={width}
          height={height}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <Avatar
          alt={finalName || ""}
          src="/sampleprofile.jpg" // Fallback sample profile image
          sx={{ width: width, height: height }}
        />
      )}
    </>
  );
};

export default UserImage;
