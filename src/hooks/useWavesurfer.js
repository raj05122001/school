import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

// WaveSurfer hook
const useWavesurfer = (containerRef, options) => {
  const [wavesurfer, setWavesurfer] = useState(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};

export default useWavesurfer;
