import React from 'react';
import { 
  FaFileVideo, 
  FaFileAudio, 
  FaFile, 
  FaFileArchive,
  FaFileCode
} from 'react-icons/fa';
import { BiSolidFileTxt } from "react-icons/bi";
import { FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
import { GrDocumentRtf } from "react-icons/gr";
import { AiOutlineFileJpg } from "react-icons/ai";
import { SiJpeg } from "react-icons/si";
import { BiSolidFilePng } from "react-icons/bi";
import { AiOutlineFileGif } from "react-icons/ai";
import { BsFiletypeSvg } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";
import { BsFiletypeCsv } from "react-icons/bs";
import { BsFiletypePpt } from "react-icons/bs";
import { BsFiletypePptx } from "react-icons/bs";
import { FaRegFileZipper } from "react-icons/fa6";

const getFileIcon = (fileName, props = {}) => {
  // Extract file extension
  const ext = fileName.split('.').pop().toLowerCase();

  // Map the extension to the respective icon
  switch (ext) {
    case 'pdf':
      return <FaRegFilePdf {...props} />;
    case 'doc':
      return <BsFiletypeDoc {...props} />;
    case 'docx':
      return <BsFiletypeDocx {...props} />;
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'wmv':
      return <FaFileVideo {...props} />;
    case 'mp3':
    case 'wav':
    case 'aac':
      return <FaFileAudio {...props} />;
    case 'txt':
      return <BiSolidFileTxt {...props} />;
    case 'rtf':
      return <GrDocumentRtf {...props} />;
    // Image file types
    case 'jpg':
      return <AiOutlineFileJpg {...props} />;
    case 'jpeg':
      return <SiJpeg {...props} />;
    case 'png':
      return <BiSolidFilePng {...props} />;
    case 'gif':
      return <AiOutlineFileGif {...props} />;
    case 'svg':
      return <BsFiletypeSvg {...props} />;
    // Excel files
    case 'xls':
      return <BsFiletypeXls {...props} />;
    case 'xlsx':
      return <BsFiletypeXlsx {...props} />;
    case 'csv':
      return <BsFiletypeCsv {...props} />;
    // PowerPoint files
    case 'ppt':
      return <BsFiletypePpt {...props} />;
    case 'pptx':
      return <BsFiletypePptx {...props} />;
    // Archive files
    case 'zip':
      return <FaRegFileZipper {...props} />;
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <FaFileArchive {...props} />;
    // Code files
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css':
    case 'json':
      return <FaFileCode {...props} />;
    default:
      return <FaFile {...props} />;
  }
};

export default getFileIcon;
