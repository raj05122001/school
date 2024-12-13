"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import axios from "axios";
import { BASE_URL_MEET } from "@/constants/apiconfig";
import {
  deleteAttachment,
  updateLectureAttachment,
  getLecAttachment,
} from "@/api/apiHelper";
import { MdDeleteOutline } from "react-icons/md";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { GrAttachment } from "react-icons/gr";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";

const window = global?.window || {};

const LectureAttachments = ({ lectureId, isDarkMode }) => {
  const [attachments, setAttachments] = useState([]);
  const [deleteId, setDeleteId] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = Cookies.get("ACCESS_TOKEN");
        setUserDetails(token ? decodeToken(token) : {});
      }
    }, []);

  useEffect(() => {
    getAttachments();
  }, [lectureId]);

  const handleFileSelect = (e) => {
    onSaveAttachment(e?.target.files[0]);
  };


  const onSaveAttachment = async (files) => {
    var fd = new FormData();
    fd.append("files", files);
    fd.append("lecture", lectureId);

    await updateLectureAttachment(lectureId, fd)
      .then(() => {
        getAttachments();
      })
      .catch((e) => {
        console.error("File upload error:", e);
      });
  };

  const onDeleteAttachment = async () => {
    try {
      await deleteAttachment(deleteId);
      setDeleteId(0);
      getAttachments();
    } catch (error) {
      console.error(error);
    }
  };

  const getAttachments = async () => {
    try {
      const apiResponse = await getLecAttachment(lectureId);
      setAttachments(apiResponse?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getFileName = (path = "") => {
    const pathSplited = path.split("/");
    return pathSplited.pop();
  };

  const downloadFile = (path) => {
    const downloadPath = path.startsWith("http")
      ? path
      : `${BASE_URL_MEET}${path}`;
    const link = document?.createElement("a");
    link.href = downloadPath;
    link.target = "_blank";
    link.download = getFileName(path);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        color: isDarkMode ? "#F9F6EE" : "#353935",
        borderRadius: 6,
        boxShadow: 2,
        p: 3,
        mt: 2,
      }}
      className ="blur_effect_card"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
        variant="h6"
          sx={{ color: isDarkMode ? "#F9F6EE" : "#353935", fontSize: "24px" }}
        >
        <GrAttachment />  Lecture Attachments
        </Typography>
        <label htmlFor="attachments">
          <IconButton component="span">
            <AiOutlinePlus color="gray" />
          </IconButton>
        </label>
        <input
          type="file"
          id="attachments"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </Box>
      {attachments?.length > 0 ? (
        attachments?.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Image
                src="/attachment-lecture.svg"
                alt="attachment"
                width={30}
                height={30}
              />
              <Typography
                sx={{
                  color: "primary.main",
                  fontSize: "0.875rem",
                  wordBreak: "break-all",
                }}
              >
                {item.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {userDetails?.role!=="STUDENT" && <IconButton onClick={() => setDeleteId(item.id)}>
                <MdDeleteOutline fontSize={18} />
              </IconButton>}

              <IconButton onClick={() => downloadFile(item.file)}>
                <BsDownload />
              </IconButton>
            </Box>
          </Box>
        ))
      ) : (
        <Typography
          sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.300" }}
        >
          No attachments found
        </Typography>
      )}
      <Dialog open={deleteId > 0} onClose={() => setDeleteId(0)}>
        <DialogTitle>
          Are you sure you want to delete this attachment?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ textAlign: "center", fontWeight: 600, color: "primary.main" }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(0)} variant="outlined" fullWidth>
            No
          </Button>
          <Button onClick={onDeleteAttachment} variant="contained" fullWidth>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LectureAttachments;
