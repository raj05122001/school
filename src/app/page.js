"use client";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { FaVideo } from "react-icons/fa";
import FFmpeg from '@ffmpeg/ffmpeg';  // Use default import instead of named import

// Main component
export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(null); // For showing file size
  const [downloadUrl, setDownloadUrl] = useState(null); // For download option

  const ffmpeg = FFmpeg.createFFmpeg({ log: true }); // Access createFFmpeg from the default import

  async function compressVideoLossless(file) {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    ffmpeg.FS('writeFile', 'input.mp4', await FFmpeg.fetchFile(file)); // Use FFmpeg.fetchFile

    // Compress the video (lossless compression with libx264)
    await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '23', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
    return compressedBlob;
  }

  const handleFileUpload = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];

    // Compress the video before uploading
    const compressedVideo = await compressVideoLossless(file);

    // Calculate and set the compressed video size
    setFileSize((compressedVideo.size / (1024 * 1024)).toFixed(2)); // Convert to MB

    // Provide a download link for the compressed video
    const url = URL.createObjectURL(compressedVideo);
    setDownloadUrl(url);

    // Optionally, split the compressed video into chunks (e.g., for large file upload)
    const chunkSize = 10 * 1024 * 1024; // 10 MB
    const totalChunks = Math.ceil(compressedVideo.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(compressedVideo.size, start + chunkSize);
      const chunk = compressedVideo.slice(start, end);

      await uploadChunkToS3(chunk, i);  // You need to implement this function
      setProgress(((i + 1) / totalChunks) * 100);  // Update progress
    }

    setIsUploading(false);
  };

  return (
    <Box>
      <input
        type="file"
        accept="video/*,.mkv"
        multiple={false}
        style={{ display: "none" }}
        id="videoattachment"
        onChange={handleFileUpload}
      />
      <label htmlFor="videoattachment" style={{ cursor: "pointer" }}>
        <Typography
          variant="body2"
          color="primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FaVideo size={22} style={{ marginRight: 8 }} />
          {isUploading ? `Uploading... ${progress.toFixed(2)}%` : "Add Video File"}
        </Typography>
      </label>

      {/* Display the file size after video compression */}
      {fileSize && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Compressed Video Size: {fileSize} MB
        </Typography>
      )}

      {/* Provide download link after video compression */}
      {downloadUrl && (
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          href={downloadUrl} 
          download="compressed_video.mp4"
        >
          Download Compressed Video
        </Button>
      )}
    </Box>
  );
}
