import React from "react";
import { FaRegFileVideo, FaFileAudio } from "react-icons/fa";
import { MdDescription } from "react-icons/md";

const FilePreview = ({ file, fileType }) => {
  if (!file || !fileType) return null;

  const fileURL = URL.createObjectURL(file);

  switch (fileType) {
    case "IMAGE":
      return (
        <img
          src={fileURL}
          alt="Selected"
          style={{ width: 40, height: 40, borderRadius: "5px" }}
        />
      );
    case "VIDEO":
      return <FaRegFileVideo size={40} />;
    case "AUDIO":
      return <FaFileAudio size={40} />;
    case "FILE":
    default:
      return <MdDescription size={40} />;
  }
};

export default FilePreview;
