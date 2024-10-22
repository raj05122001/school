import React from "react";
import AddVideoFile from "../AddVideoFile/AddVideoFile";
import { IoRefreshCircleSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { MdNoiseControlOff } from "react-icons/md";
import AttachmentDrawer from "../AttachmentDrawer/AttachmentDrawer";
import { Tooltip, IconButton, Box } from "@mui/material";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const BottomTabs = ({
  startRecordingBtn,
  videoChunks,
  videoAttachment,
  setVideoAttachment,
  onRemoveVideoFile,
  setIsNoiseCancellation,
  isNoiseCancellation,
  attachments,
  setAttachments,
  removeVideoChunk,
  lectureStoped,
  removeCameraAccess,
  recordingData,
  audioAttachment,
  setAudioAttachment,
  selectedOption,
  setSelectedOption,
  audioChunks
}) => {
  const downloadZip = async () => {
    const zip = new JSZip();

    if (videoChunks?.length > 0) {
      const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
      zip.file(`${recordingData?.title} video.mp4`, videoBlob);
    }

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      zip.file(`${recordingData?.title} audio.wav`, audioBlob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${recordingData?.title}.zip`);

    removeCameraAccess();
  };

  return (
    <Box display="flex" flexDirection="row" gap={3} mr={2} alignItems="center">
      {!startRecordingBtn && !videoChunks?.length > 0 && (
        <AddVideoFile
          videoAttachment={videoAttachment}
          setVideoAttachment={setVideoAttachment}
          onRemoveVideoFile={onRemoveVideoFile}
          removeCameraAccess={removeCameraAccess}
          audioAttachment={audioAttachment}
          setAudioAttachment={setAudioAttachment}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      )}

      <Tooltip title="Noise Cancellation">
        <IconButton
          onClick={() => setIsNoiseCancellation((prev) => !prev)}
          sx={{ color: isNoiseCancellation ? "blue" : "white" }}
        >
          <MdNoiseControlOff size={30} />
        </IconButton>
      </Tooltip>

      <AttachmentDrawer
        attachments={attachments}
        setAttachments={setAttachments}
      />

      <Tooltip title="Download Audio And Video">
        <IconButton
          onClick={() => {
            if (lectureStoped.stopRecording) {
              downloadZip();
            }
          }}
          sx={{
            color: lectureStoped?.stopRecording ? "white" : "gray",
          }}
        >
          <FaDownload size={26} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Re-Record Video">
        <IconButton
          onClick={() => lectureStoped.stopRecording && removeVideoChunk()}
          sx={{
            color: lectureStoped?.stopRecording ? "white" : "gray",
          }}
        >
          <IoRefreshCircleSharp size={30} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default BottomTabs;