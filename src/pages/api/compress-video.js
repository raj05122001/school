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
        console.error('Form parse error:', err);  // Log error here
        return res.status(500).json({ error: `Error parsing form data: ${err.message}` });
      }

      console.log('Parsed files:', files);  // Debugging parsed files

      const videoFile = files.video.filepath;
      console.log('Video file path:', videoFile);  // Ensure file exists

      const outputPath = path.resolve(process.cwd(), 'public/compressed-video.mp4');
      console.log('Output path:', outputPath);  // Path for compressed video

      try {
        ffmpeg(videoFile)
          .outputOptions('-vf', 'scale=1280:720')  // Resize video
          .outputOptions('-b:v', '1M')  // Bitrate reduction
          .save(outputPath)
          .on('end', () => {
            console.log('Video compression finished');

            const stats = fs.statSync(outputPath);
            const fileSizeInBytes = stats.size;
            const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

            res.status(200).json({
              message: 'Video compression complete',
              output: `/compressed-video.mp4`,
              size: fileSizeInMB,
            });
          })
          .on('error', (ffmpegError) => {
            console.error('FFmpeg error:', ffmpegError);  // Log FFmpeg errors
            res.status(500).json({ error: `FFmpeg error: ${ffmpegError.message}` });
          });
      } catch (err) {
        console.error('Video processing error:', err);  // Catch general errors
        res.status(500).json({ error: `Processing error: ${err.message}` });
      }
    });
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
