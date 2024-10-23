import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';

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
        console.error('Error parsing the form:', err);
        return res.status(500).json({ error: `Error parsing the form: ${err.message}` });
      }

      // Ensure the file is uploaded correctly
      console.log('Parsed files:', files);

      const videoFile = files.video.filepath;  // Check if this path exists
      console.log('Video file path:', videoFile);

      const outputPath = path.resolve(process.cwd(), 'public/compressed-video.mp4');
      console.log('Output path:', outputPath);

      // Ensure FFmpeg is installed and available
      try {
        ffmpeg(videoFile)
          .outputOptions('-vf', 'scale=1280:720')  // Scale video resolution
          .outputOptions('-b:v', '1M')  // Target bitrate to reduce size
          .save(outputPath)
          .on('end', () => {
            console.log('Video compression complete');

            const stats = fs.statSync(outputPath);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            res.status(200).json({
              message: 'Video compression complete',
              output: `/compressed-video.mp4`,
              size: fileSizeInMB,
            });
          })
          .on('error', (ffmpegErr) => {
            console.error('FFmpeg error:', ffmpegErr);
            res.status(500).json({ error: `Error compressing video: ${ffmpegErr.message}` });
          });
      } catch (e) {
        console.error('Error during FFmpeg processing:', e);
        res.status(500).json({ error: 'Error during FFmpeg processing' });
      }
    });
  } else {
    res.status(405).json({ message: 'Only POST requests allowed' });
  }
}
