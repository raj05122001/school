import { useState, useCallback, useRef } from "react";

const useFileUploader = () => {
  const [uploadProgress, setUploadProgress] = useState(0);    // 0–100%
  const [uploadSpeed, setUploadSpeed]       = useState(0);    // MB/s
  const [timeRemaining, setTimeRemaining]   = useState(0);    // seconds

  // keep track of last loaded bytes and time to compute speed
  const lastLoadedRef = useRef(0);
  const lastTimeRef   = useRef(Date.now());

  const uploadVideoToS3 = useCallback((fileChunk, signedUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", signedUrl.presigned_url, true);
      xhr.setRequestHeader("Content-Type", signedUrl.file_type);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        // overall progress %
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);

        // compute speed since last event
        const now = Date.now();
        const timeDelta = (now - lastTimeRef.current) / 1000;        // in s
        const bytesDelta = event.loaded - lastLoadedRef.current;     // in bytes

        if (timeDelta > 0) {
          const speedBps = bytesDelta / timeDelta;                    // B/s
          const speedMbps = speedBps / 1024 / 1024;                   // MB/s
          setUploadSpeed(speedMbps.toFixed(2));

          // remaining bytes & ETA
          const bytesLeft = event.total - event.loaded;
          const etaSec   = bytesLeft / speedBps;
          setTimeRemaining(Math.round(etaSec));
        }

        lastLoadedRef.current = event.loaded;
        lastTimeRef.current   = now;
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // done
          setUploadProgress(100);
          setTimeRemaining(0);
          resolve(xhr);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(fileChunk);
    });
  }, []);


  return {
    uploadVideoToS3,
    uploadProgress,
    uploadSpeed,
    timeRemaining
  };
};

export default useFileUploader;