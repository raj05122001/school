import React, { useState } from "react";
import Image from "next/image";
import { Avatar } from "@mui/material";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const UserImage = ({ profilePic = "", name = "", width = 32, height = 32 }) => {
  const [imgError, setImgError] = useState(false);
  const stringAvatar = (name) => {
    return {
      children: `${name?.split(" ")?.[0]?.[0]}`,
      // children: `${name?.split(" ")?.[0]?.[0]}${name?.split(" ")?.[1]?.[0]}`,
    };
  };
  // Get the access token from cookies and decode it if props are not provided
  const token = Cookies.get("ACCESS_TOKEN");
  const decodedToken = token ? decodeToken(token) : null;

  return (
    <>
      {!profilePic && !name ? (
        decodedToken?.profile_pic && !imgError ? (
          <Image
            src={`${BASE_URL_MEET}${decodedToken?.profile_pic}`}
            alt=""
            width={width}
            height={height}
            style={{ borderRadius: "50%" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <Avatar
            {...stringAvatar(decodedToken?.full_name || "")}
            sx={{ width: width, height: height }}
          />
        )
      ) : profilePic && !imgError ? (
        <Image
          src={`${BASE_URL_MEET}${profilePic}`}
          alt="Profile"
          width={width}
          height={height}
          style={{ borderRadius: "50%" }}
          onError={() => setImgError(true)}
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
