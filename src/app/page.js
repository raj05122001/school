// "use client";
// import { Box, Typography } from "@mui/material";
// import { useState } from "react";
// import { FaVideo } from "react-icons/fa";
// import FFmpeg from '@ffmpeg/ffmpeg';  // Use default import instead of named import

// // Main component
// export default function Home() {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const ffmpeg = FFmpeg.createFFmpeg({ log: true }); // Access createFFmpeg from the default import

//   async function compressVideoLossless(file) {
//     if (!ffmpeg.isLoaded()) {
//       await ffmpeg.load();
//     }
//     ffmpeg.FS('writeFile', 'input.mp4', await FFmpeg.fetchFile(file)); // Use FFmpeg.fetchFile
     
//     // Compress the video (lossless compression with libx264)
//     await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '23', 'output.mp4');
    
//     const data = ffmpeg.FS('readFile', 'output.mp4');
//     const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
//     return compressedBlob;
//   }

//   const handleFileUpload = async (e) => {
//     setIsUploading(true);
//     const file = e.target.files[0];

//     // Compress the video before uploading
//     const compressedVideo = await compressVideoLossless(file);

//     // Split the compressed video into chunks (optional)
//     const chunkSize = 10 * 1024 * 1024; // 10 MB
//     const totalChunks = Math.ceil(compressedVideo.size / chunkSize);

//     for (let i = 0; i < totalChunks; i++) {
//       const start = i * chunkSize;
//       const end = Math.min(compressedVideo.size, start + chunkSize);
//       const chunk = compressedVideo.slice(start, end);

//       await uploadChunkToS3(chunk, i);  // You need to implement this function
//       setProgress(((i + 1) / totalChunks) * 100);  // Update progress
//     }

//     setIsUploading(false);
//   };

//   return (
//     <Box>
//       <input
//         type="file"
//         accept="video/*,.mkv"
//         multiple={false}
//         style={{ display: "none" }}
//         id="videoattachment"
//         onChange={handleFileUpload}
//       />
//       <label htmlFor="videoattachment" style={{ cursor: "pointer" }}>
//         <Typography
//           variant="body2"
//           color="primary"
//           sx={{ display: "flex", alignItems: "center" }}
//         >
//           <FaVideo size={22} style={{ marginRight: 8 }} />
//           {isUploading ? `Uploading... ${progress.toFixed(2)}%` : "Add Video File"}
//         </Typography>
//       </label>
//     </Box>
//   );
// }
