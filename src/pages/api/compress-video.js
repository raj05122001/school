import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

// Disable body parsing by Next.js to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: `Error parsing the form: ${err.message}` });
      }

      const videoFile = files.video.filepath;  // Path of the uploaded video file

      // Define output path for the compressed video
      const outputPath = path.resolve(process.cwd(), 'public/compressed-video.mp4');

      // Use FFmpeg to compress the video
      ffmpeg(videoFile)
        .outputOptions('-vf', 'scale=1280:720')  // Scale video resolution
        .outputOptions('-b:v', '1M')  // Target bitrate to reduce size
        .save(outputPath)
        .on('end', () => {
          const stats = fs.statSync(outputPath);
          const fileSizeInBytes = stats.size;  // Get file size
          const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);  // Convert to MB
          
          res.status(200).json({
            message: 'Video compression complete',
            output: `/compressed-video.mp4`,  // Accessible from the public folder
            size: fileSizeInMB  // Return the size in MB
          });
        })
        .on('error', (err) => {
          res.status(500).json({ error: `Error compressing video: ${err.message}` });
        });
    });
  } else {
    res.status(405).json({ message: 'Only POST requests allowed' });
  }
}
