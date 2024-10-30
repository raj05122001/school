import React from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const UserImage = ({ profilePic = "", name = "", width = 32, height = 32 }) => {
  const stringAvatar = (name) => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };
  // Get the access token from cookies and decode it if props are not provided
  const token = Cookies.get("ACCESS_TOKEN");
  const decodedToken = token ? decodeToken(token) : null;

  // Use props if provided, otherwise fall back to the decoded token values
  const finalProfilePic = profilePic || decodedToken?.profile_pic;
  const finalName = name || decodedToken?.full_name;

  return (
    <>
      {!profilePic && !name ? (
        decodedToken?.profile_pic ? (
          <Image
            src={`${BASE_URL_MEET}${decodedToken?.profile_pic}`}
            alt="Profile"
            width={width}
            height={height}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <Avatar
            {...stringAvatar(decodedToken?.full_name || "")}
            sx={{ width: width, height: height }}
          />
        )
      ) : profilePic ? (
        <Image
          src={`${BASE_URL_MEET}${profilePic}`}
          alt="Profile"
          width={width}
          height={height}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <Avatar
          {...stringAvatar(name || "")}
          sx={{ width: width, height: height }}
        />
      )}
    </>
  );
};

export default UserImage;
