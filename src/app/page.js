"use client";
import { useState } from 'react';

export default function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [videoSize, setVideoSize] = useState('');

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage('Please select a video to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);

    const res = await fetch('/api/compress-video', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      setMessage('Video compressed successfully!');
      setDownloadLink(result.output);
      setVideoSize(result.size);  // Display the video size
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Compress Video</button>
      {message && <p>{message}</p>}
      
      {/* Display download link if available */}
      {downloadLink && (
        <div>
          <p>Download compressed video: <a href={downloadLink} download>Download Video</a></p>
          <p>Compressed Video Size: {videoSize} MB</p>
        </div>
      )}
    </div>
  );
}
