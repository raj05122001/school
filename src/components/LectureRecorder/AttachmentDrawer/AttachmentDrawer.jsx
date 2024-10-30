import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import {
  IoDocumentAttach,
  IoCloseSharp,
  IoAddCircleOutline,
} from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { AppContextProvider } from "@/app/main";

function AttachmentDrawer({ attachments, setAttachments }) {
  const [openRight, setOpenRight] = useState(false);
  const [attachmentFileError, setAttachmentFileError] = useState("");
  const { openRecordingDrawer } = useContext(AppContextProvider);

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

  useEffect(() => {
    !openRecordingDrawer && setAttachments([]);
  }, [openRecordingDrawer]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileSize = e.target.files[0].size;

    const isFileAlreadySelected = attachments.some((existingFile) => {
      return existingFile.name === e.target.files[0].name;
    });

    if (isFileAlreadySelected) {
      e.target.value = null;
      return;
    }

    if (fileSize <= 5 * 1024 * 1024 && attachments?.length < 5) {
      setAttachments([...attachments, ...files]);
      setAttachmentFileError("");
    } else {
      setAttachmentFileError("File size is too large (maximum allowed: 5MB).");
    }
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  return (
    <React.Fragment>
      <Tooltip title="Add Attachments Files">
        <Box
          sx={{ position: "relative", cursor: "pointer" }}
          onClick={openDrawerRight}
        >
          <IoDocumentAttach size={30} style={{ color: "white" }} />
          {attachments?.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "16px",
                height: "16px",
                backgroundColor: "red",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {attachments?.length}
            </span>
          )}
        </Box>
      </Tooltip>

      <Drawer
        anchor="right"
        open={openRight}
        onClose={closeDrawerRight}
        sx={{ bgcolor: "grey.100", width: 0 }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" color="text.primary">
              Add Attachments Files
            </Typography>
            <IconButton onClick={closeDrawerRight}>
              <IoCloseSharp style={{ width: "20px", height: "20px" }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              id="attachment"
              style={{ display: "none" }}
              type="file"
              disabled={attachments?.length === 5}
              multiple
              onChange={handleFileSelect}
            />
            <label
              htmlFor="attachment"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                backgroundColor: "#1E88E5",
                color: "white",
                borderRadius: "4px",
                cursor: attachments?.length < 5 ? "pointer" : "not-allowed",
                opacity: attachments?.length === 5 ? 0.5 : 1,
              }}
              onClick={() => {
                if (attachments?.length === 5) {
                  setAttachmentFileError(
                    "You can upload a maximum of 5 files."
                  );
                } else {
                  setAttachmentFileError("");
                }
              }}
            >
              <IoAddCircleOutline style={{ marginRight: "8px" }} size={20} />
              Add Files
            </label>

            {attachments?.length > 0 && (
              <Box
                sx={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {attachments?.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                      padding: "16px",
                      gap: "8px",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {file.name}
                    </Typography>
                    <IoIosCloseCircle
                      size={30}
                      onClick={() => removeAttachment(index)}
                      style={{ color: "red", cursor: "pointer" }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {attachmentFileError && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {attachmentFileError}
              </span>
            )}
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}

export default AttachmentDrawer;
