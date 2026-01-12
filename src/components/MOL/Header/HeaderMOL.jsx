import { Badge, Box, Button, IconButton, Typography, Collapse } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { GoBell } from "react-icons/go";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { AppContextProvider } from "@/app/main";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdPublishedWithChanges, MdUnpublished, MdExpandMore, MdExpandLess } from "react-icons/md";

function HeaderMOL({
  lectureData,
  isEdit = false,
  isShowPic = false,
  loading,
  handleReleased = () => { },
}) {
  const searchParams = useSearchParams()
  const web_access_token = searchParams.get("token") || ""
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userDetails, setUserDetails] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false); // State for mobile accordion

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

  const handleDeleteLecture = async () => {
    try {
      const deleteLecture = await deleteCompletedLecture(lectureData?.id)
      if (deleteLecture?.data?.success) {
        router.push("/admin/lecture-listings")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const userName = userDetails?.full_name?.split(" ")[0];

  return (
     <>
     {!web_access_token &&
<Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderBottom: "1px solid var(--Stroke-Color-1, #C1C1C1)",
        width: "100%",
        padding: "8px 4px",
        justifyContent: "space-between",
      }}
    >
      {/* Header Title with Expand Button for Mobile */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", sm: "22px", md: "28px" },
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexGrow: 1,
            pr: 1,
          }}
        >
          Minutes of Lecture
        </Typography>
        
        {/* Mobile Expand Button */}
        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
        </IconButton>
      </Box>

      {/* Action Buttons - Collapsible for Mobile */}
      <Collapse in={mobileOpen} sx={{ width: "100%", display: { xs: "block", sm: "none" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px 0",
            width: "100%",
          }}
        >
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
                width: "100%",
              }}
            >
              <RiDeleteBin5Fill style={{ fontSize: "24px" }} />
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

          {isEdit && !lectureData?.is_released && (
            <Button
              variant="contained"
              onClick={() => handleReleased(!lectureData?.is_released)}
              sx={{
                display: "flex",
                padding: "10px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "8px",
                backgroundColor: "#141514",
                textTransform: "none",
                width: "100%",
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
                {lectureData?.is_released ? "Unpublish" : "Publish"}
              </Typography>
            </Button>
          )}
        </Box>
      </Collapse>

      {/* Desktop Action Buttons */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "12px",
          gap: "12px",
        }}
      >
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
            <RiDeleteBin5Fill style={{ fontSize: "24px" }} />
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

        {isEdit && !lectureData?.is_released && (
          <Button
            variant="contained"
            onClick={() => handleReleased(!lectureData?.is_released)}
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
              {lectureData?.is_released ? "Unpublish" : "Publish"}
            </Typography>
          </Button>
        )}
      </Box>
    </Box>}
    </>
  );
}

export default HeaderMOL;