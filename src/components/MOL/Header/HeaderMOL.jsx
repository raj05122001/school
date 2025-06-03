import { Badge, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { GoBell } from "react-icons/go";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { AppContextProvider } from "@/app/main";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdPublishedWithChanges, MdUnpublished } from "react-icons/md";

function HeaderMOL({
  lectureData,
  isEdit = false,
  isShowPic = false,
  loading,
  handleReleased = () => {},
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userDetails, setUserDetails] = useState(null);

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("ACCESS_TOKEN");
      setUserDetails(token ? decodeToken(token) : {});
    }
  }, []);

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    return text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  };

  const handleDeleteLecture = async () =>{
    try{
      const deleteLecture = await deleteCompletedLecture(lectureData?.id)
      if (deleteLecture?.data?.success){
        router.push("/admin/lecture-listings")
      }
    }catch (error){
      console.error(error)
    }
  }

  const userName = userDetails?.full_name?.split(" ")[0];

  return (
    <Box
      sx={{
        display: "flex",
        // backgroundColor: "green",
        borderBottom: "1px solid var(--Stroke-Color-1, #C1C1C1)",
        width: "100%",
        height: "60px",
        padding: "8px 4px",
        justifyContent: "space-between",
        // alignItems: "flex-start",
      }}
    >
      <Typography
        sx={{
          height: "48px",
          fontSize: "28px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          //   backgroundColor: "red",
          paddingLeft: "8px",
          flexShrink: 0,
        }}
      >
        Minutes of Lecture
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight:"12px",
          gap: "12px",
        }}
      >
        {/* <IconButton>
          <Badge variant="dot" invisible={false} color="error">
            <GoBell size={24} />
          </Badge>
        </IconButton> */}
        {userDetails?.role === "ADMIN" && (
          <Button
            variant="contained"
            onClick={() => setDialogOpen(!dialogOpen)}
            sx={{
              display: "flex",
              padding: "10px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              backgroundColor: "#141514",
              textTransform: "none",
            }}
          >
            <RiDeleteBin5Fill style={{fontSize:"24px"}}/>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontSize: "20px",
                fontStyle: "normal",
                fontFamily: "Inter Tight, sans-serif",
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              Delete
            </Typography>
          </Button>
          
        )} 

        {/* { (
            <Button
              
            >
              
            </Button>
          )}  */}
        {isEdit && !lectureData?.is_released && (
          <Button
            variant="contained"
            onClick={() => handleReleased(!lectureData?.is_released)}
            // startIcon={
            //     lectureData?.is_released ? (
            //       <MdUnpublished size={22} />
            //     ) : (
            //       <MdPublishedWithChanges size={22} />
            //     )
            //   }
            sx={{
              display: "flex",
              padding: "10px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              backgroundColor: "#141514",
              textTransform: "none",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontSize: "20px",
                fontStyle: "normal",
                fontFamily: "Inter Tight, sans-serif",
                fontWeight: 700,
                lineHeight: "24px",
              }}
            >
              {lectureData?.is_released
                ? "Unpublish"
                : "Publish"}
            </Typography>
          </Button>
        )} 
      </Box>
    </Box>
  );
}

export default HeaderMOL;

