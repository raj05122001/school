"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useOnlineStatus } from "@/hooks/NetworkStatus";
import {
  updateLectureAttachment,
  uploadAudioFile,
  uploadS3Video,
} from "@/api/apiHelper";
import BottomTabs from "./BottomTabs/BottomTabs";
import { AwsSdk } from "@/hooks/AwsSdk";
import axios from "axios";
import RecorderController from "./RecorderController/RecorderController";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import RecorderErrorMessage from "./RecorderErrorMessage/RecorderErrorMessage";
import { handleErrorResponse } from "@/helper/Helper";
import { AppContextProvider } from "@/app/main";

const LectureRecorder = ({ open, closeDrawer, recordingData }) => {
  const {isTrialAccount,s3FileName}=useContext(AppContextProvider)
  const videoRef = useRef(null);
  const currentTimeLocal = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const audioRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [startRecordingBtn, setStartRecordingBtn] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState("");
  const [videoAttachment, setVideoAttachment] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isNoiseCancellation, setIsNoiseCancellation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { onlineStatus } = useOnlineStatus();
  const [error, setError] = useState({});
  const [chunkCount, setChunkCount] = useState(0);
  const [audioChunk, setAudioChunk] = useState([]);
  const [uploadedChunk, setUploadedChunk] = useState(0);
  const [audioAttachment, setAudioAttachment] = useState([]);
  const [selectedOption, setSelectedOption] = useState("vidya");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isStopsubmit, setIsStopsubmit] = useState(false);

  const [startAndEndTime, setStartAndEndTime] = useState({
    start_time: currentTimeLocal,
    end_time: currentTimeLocal,
  });

  const { s3 } = AwsSdk();

  const [lectureStoped, setLectureStoped] = useState({
    isProccess: false,
    isError: false,
    submit: false,
    stopRecording: false,
  });

  const getVideoSources = async () => {
    if (window.navigator && window.navigator.mediaDevices) {
      const videoStream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoStream) {
        videoRef.current.srcObject = videoStream;
      }
    }
  };

  const getAudioSources = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices?.filter(
        (device) => device.kind === "audioinput"
      );
      if (audioInputDevices.length > 0) {
        const constraints = {
          audio: {
            deviceId: audioInputDevices[0].deviceId
              ? { exact: audioInputDevices[0].deviceId }
              : undefined,
            echoCancellation: true,
            noiseSuppression: isNoiseCancellation,
          },
        };
        const audioStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        audioStreamRef.current = audioStream;
      }
    } catch (error) {
      console.error("Error getting audio sources:", error);
    }
  };

  const onSaveAttachments = async () => {
    try {
      let fd = new FormData();
      if (attachments.length == 0) {
        return;
      }
      attachments.forEach((fileData) => {
        fd.append("files", fileData);
      });
      fd.append("lecture", recordingData?.id);
      await updateLectureAttachment(recordingData?.id, fd);
    } catch (error) {
      console.error(error);
    }
  };

  const startVideoRecording = async () => {
    if (!videoRef.current.srcObject) await getVideoSources();
    if (!audioStreamRef.current) await getAudioSources();
    if (!videoRef.current.srcObject || !audioStreamRef.current) {
      console.error("Failed to initialize audio or video stream.");
      return;
    }
    setStartRecordingBtn(true);
    setVideoChunks([]);
    const options = {
      mimeType: "video/webm; codecs=vp9",
    };

    const audioOptions = {
      mimeType: "audio/webm;codecs=opus",
    };

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(audioStreamRef.current);
    const destination = audioCtx.createMediaStreamDestination();
    source.connect(destination);

    audioRecorderRef.current = new MediaRecorder(
      destination.stream,
      audioOptions
    );
    mediaRecorderRef.current = new MediaRecorder(
      videoRef.current.srcObject,
      options
    );
    audioRecorderRef.current.ondataavailable = handleAudioDataAvailable;
    mediaRecorderRef.current.ondataavailable = handleVideoDataAvailable;
    setStartAndEndTime((prev) => ({ ...prev, start_time: currentTimeLocal }));
    mediaRecorderRef.current.start(30000);
    audioRecorderRef.current.start();
  };

  const uploadVideoToS3 = async (chunk, index) => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: "vidya-ai-video",
          Key: `videos/${s3FileName}${recordingData.id}.mp4`,
          Body: chunk,
          ContentType: "video/mp4",
        };

        const options = {
          partSize: 10 * 1024 * 1024, 
          queueSize: 4, 
        };

        let startTime = Date.now();
        let uploadedBytes = 0;

        const upload = new Upload({
          client: s3,
          params,
          ...options,
          leavePartsOnError: false, 
        });

        upload.on("httpUploadProgress", (progress) => {
          const totalBytes = progress.total || 1;

          const currentTime = Date.now();
          const elapsedTime = (currentTime - startTime) / 1000; 
          uploadedBytes = progress.loaded;

          const uploadSpeed = uploadedBytes / elapsedTime; 
          const remainingBytes = totalBytes - uploadedBytes;
          const timeRemaining = remainingBytes / uploadSpeed; 
  
          const progressPercentage = Math.round(
            (uploadedBytes / totalBytes) * 100
          );
          setUploadProgress(progressPercentage);
          setTimeRemaining(Math.round(timeRemaining));
          setUploadSpeed((uploadSpeed / 1024 / 1024).toFixed(2));

        });

        const result = await upload.done();
        resolve(result);
      } catch (err) {
        console.error("Error uploading file:", err);
        reject(err);
      }
    });
  };

  const mergeChunks = async () => {
    await axios.post(
      `https://9eg2j1kaxd.execute-api.ap-south-1.amazonaws.com/mergeVideo/${recordingData.id}?folderType=${s3FileName==="edu/"?"edu":"vidya"}`
    );
  };

  const submitLecture = async () => {
    setIsStopsubmit(false);
    if (!videoChunks.length && !videoAttachment.length > 0) {
      alert("Please record video or upload video attachment");
      return;
    }

    if (!onlineStatus) {
      alert("Please check your network connection.");
      return;
    }

    if (attachments.length > 0) {
      onSaveAttachments();
    }

    setLectureStoped({
      isProccess: true,
      isError: false,
      submit: false,
      stopRecording: true,
    });

    if (!videoAttachment.length > 0) {
      try {
        const audioBlob = new Blob(audioChunk, { type: "audio/wav" });
        const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
        const formData = new FormData();
        formData.append("audio", audioBlob, `${recordingData.id}.wav`);
        // formData.append("video", videoBlob, ${recordingData.id}.mp4);
        formData.append("start_time", startAndEndTime?.start_time);
        formData.append("end_time", startAndEndTime?.end_time);
        formData.append("duration", timer);
        formData.append("video_src", "VIDYAAI");

        await uploadAudioFile(recordingData.id, formData);
        setLectureStoped({
          isProccess: true,
          isError: false,
          submit: true,
          stopRecording: true,
        });
      } catch (error) {
        console.error(error);
        const errorObject = handleErrorResponse(error);
        if (errorObject) {
          setError(errorObject);
        }
        setLectureStoped({
          isProccess: true,
          isError: true,
          submit: false,
          stopRecording: false,
        });
      }
      await mergeChunks();
    } else {
      try {
        if (selectedOption === "other") {
          const formData = new FormData();
          formData.append(
            "video_url",
            `https://vidya-ai-video.s3.amazonaws.com/videos/${s3FileName}${recordingData.id}.mp4`
          );
          formData.append("video_src", "OTHERS");
          await uploadVideoToS3(videoAttachment[0]);
          await uploadS3Video(recordingData.id, formData);
          // await extractingAudio(recordingData.id);
        } else if (selectedOption === "vidya") {
          const formData = new FormData();
          formData.append("video_src", "VIDYAAI");
          formData.append(
            "audio",
            audioAttachment[0],
            `${recordingData.id}.wav`
          );
          await uploadS3Video(recordingData.id, formData);
          await uploadVideoToS3(videoAttachment[0]);
        }

        setLectureStoped({
          isProccess: true,
          isError: false,
          submit: true,
          stopRecording: true,
        });
      } catch (error) {
        console.error(error);
        const errorObject = handleErrorResponse(error);
        if (errorObject) {
          setError(errorObject);
        }
        setLectureStoped({
          isProccess: true,
          isError: true,
          submit: false,
          stopRecording: false,
        });
      }
    }
  };

  const handleAudioDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunk((prev) => [...prev, event.data]);
    }
  };

  const uploadChunkToS3 = async (chunk, index) => {
    try {
      const params = {
        Bucket: "vidya-ai-video",
        Key: `videoChunks/lecture_${recordingData.id}/chunk-${index}.mp4`,
        Body: chunk,
        ContentType: "video/mp4",
      };

      // Create the upload command and send it
      const command = new PutObjectCommand(params);
      await s3.send(command);

      setUploadedChunk((prev) => prev + 1); // Update the state after successful upload
    } catch (err) {
      console.error("Error uploading chunk:", err);
      setTimeout(() => uploadChunkToS3(chunk, index), 5000);
    }
  };

  const handleVideoDataAvailable = async (event) => {
    if (event.data.size > 0) {
      setVideoChunks((prev) => [...prev, event.data]);
      setChunkCount((prevCount) => {
        uploadChunkToS3(event.data, prevCount);
        return prevCount + 1;
      });
    }
  };

  const deleteS3Folder = async () => {
    try {
      // List all the objects within the folder
      const listParams = {
        Bucket: "vidya-ai-video",
        Prefix: `videoChunks/lecture_${recordingData.id}`,
      };

      // Use ListObjectsV2Command to list objects
      const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

      if (!listedObjects.Contents || listedObjects.Contents.length === 0)
        return; // Folder is empty

      // Create a list of objects to delete
      const deleteParams = {
        Bucket: "vidya-ai-video",
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      // Use DeleteObjectsCommand to delete the objects
      await s3.send(new DeleteObjectsCommand(deleteParams));

      // If there are more objects to delete, recursively delete
      if (listedObjects.IsTruncated) {
        await deleteS3Folder();
      }
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const stopStream = (stream) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  const removeCameraAccess = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      stopStream(videoRef.current.srcObject);
      videoRef.current.srcObject = null;
    }

    // Stop audio stream
    if (audioStreamRef.current) {
      stopStream(audioStreamRef.current);
      audioStreamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    if (audioRecorderRef.current) {
      audioRecorderRef.current = null;
    }
  };

  const stopRecording = async () => {
    try {
      setLectureStoped({
        isProccess: false,
        isError: false,
        submit: false,
        stopRecording: true,
      });
      setStartRecordingBtn(false);

      // Stop media recorder
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (
        audioRecorderRef.current &&
        audioRecorderRef.current.state !== "inactive"
      ) {
        audioRecorderRef.current.stop();
      }
      setStartAndEndTime((prev) => ({ ...prev, end_time: currentTimeLocal }));
      removeCameraAccess();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const onRemoveVideoFile = () => {
    setRecordedVideo("");
    setTimer(0);
    getVideoSources();
    getAudioSources();
  };

  const handleVideoPlayPause = async () => {
    try {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        audioRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        audioRecorderRef.current.pause();
        setIsPaused(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (videoChunks.length > 0) {
      const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
      const url = URL.createObjectURL(videoBlob);
      setRecordedVideo(url);
    }

    if (videoAttachment.length > 0) {
      if (videoRef.current && videoRef.current.srcObject) {
        stopStream(videoRef.current.srcObject);
        videoRef.current.srcObject = null;
      }

      // Stop audio stream
      if (audioStreamRef.current) {
        stopStream(audioStreamRef.current);
        audioStreamRef.current = null;
      }

      const videoBlob = new Blob(videoAttachment, { type: "video/mp4" });
      const url = URL.createObjectURL(videoBlob);
      setRecordedVideo(url);
      if (videoRef.current && videoRef.current.srcObject) {
        stopStream(videoRef.current.srcObject);
      }
      if (audioStreamRef.current) {
        stopStream(audioStreamRef.current);
      }
    }
  }, [videoChunks.length, videoAttachment]);

  useEffect(() => {
    let intervalId;
    let startTime = Number(new Date()) - timer;
    if (startRecordingBtn && !isPaused) {
      intervalId = setInterval(() => {
        const currentTime = Number(new Date());
        setTimer(currentTime - startTime);
      }, 100);
    } else {
      intervalId && clearInterval(intervalId);
    }

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [startRecordingBtn, isPaused]);

  useEffect(() => {
    getVideoSources();
    getAudioSources();
  }, []);

  const beforeUnloadHandler = (event) => {
    const confirmationMessage =
      "Your lecture will be lost. Do you want to continue?";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  useEffect(() => {
    const addBeforeUnloadListener = () => {
      window.addEventListener("beforeunload", beforeUnloadHandler);
    };

    const removeBeforeUnloadListener = () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };

    if (startRecordingBtn || videoChunks.length > 0) {
      addBeforeUnloadListener();
    } else {
      removeBeforeUnloadListener();
    }

    return () => {
      removeBeforeUnloadListener();
    };
  }, [startRecordingBtn, videoChunks]);

  const removeVideoChunk = async () => {
    setVideoChunks([]);
    setVideoAttachment([]);
    setRecordedVideo("");
    setTimer(0);
    getVideoSources();
    getAudioSources();
    setAudioChunk([]);
    setChunkCount(0);
    setUploadedChunk(0);
    setLectureStoped({
      isProccess: false,
      isError: false,
      submit: false,
      stopRecording: false,
    });
    await deleteS3Folder();
  };

  const confirmClose = (message) => {
    return confirm(message);
  };

  const onCloseDrawer = async () => {
    const confirmAndClose = (message) => {
      const userInput = confirmClose(message);
      if (!userInput) {
        return false;
      }
      return true;
    };

    if (lectureStoped.isProccess && !lectureStoped.submit) {
      if (
        !confirmAndClose(
          "Lecture recording is processing, do you want to close it?"
        )
      ) {
        return;
      }
    }

    if (videoChunks.length && !lectureStoped.submit) {
      if (
        !confirmAndClose(
          "Lecture recording is not submitted, do you want to close it?"
        )
      ) {
        return;
      }
    }

    if (startRecordingBtn && !lectureStoped.submit) {
      if (
        !confirmAndClose(
          "Lecture recording is in progress, do you want to close it?"
        )
      ) {
        return;
      }
    }

    removeCameraAccess();
    // Clear references
    setIsNoiseCancellation(false);
    setTimer(0);
    setChunkCount(0);
    setAttachments([]);
    setVideoAttachment([]);
    setRecordedVideo("");
    setVideoChunks([]);
    setAudioChunk([]);
    setStartRecordingBtn(false);
    closeDrawer();
  };

  useEffect(() => {
    if (
      isStopsubmit &&
      lectureStoped.stopRecording &&
      audioChunk.length > 0 &&
      videoChunks.length > 0
    ) {
      submitLecture();
    }
  }, [isStopsubmit, audioChunk, videoChunks]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCloseDrawer}
      variant="persistent"
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          zIndex: 10,
          color: "#fff", // White text for contrast
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {recordingData?.title}
        </Typography>
        <Box onClick={onCloseDrawer} sx={{ cursor: "pointer", color: "#fff" }}>
          <FaTimes size={24} />
        </Box>
      </Box>

      {/* video recoder */}
      {!lectureStoped.isProccess && (
        <Box
          sx={{
            height: "90%",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {!videoAttachment.length > 0 &&
            !lectureStoped.stopRecording &&
            !lectureStoped.isProccess && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  style={{
                    transform: "scaleX(-1)",
                    height: "100%",
                    objectFit: "cover",
                  }}
                ></video>
                {!startRecordingBtn &&
                  !videoChunks.length > 0 &&
                  !recordedVideo &&
                  !lectureStoped.isProccess && (
                    <Box
                      onClick={() => startVideoRecording()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        bgcolor: "red",
                        color: "white",
                        borderRadius: "50px",
                        cursor: "pointer",
                        mt: 2,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: "black",
                          borderRadius: "50%",
                          border: "6px solid red",
                        }}
                      />
                      <Typography variant="body2" color="black">
                        Start Recording
                      </Typography>
                    </Box>
                  )}
              </Box>
            )}

          {((lectureStoped.stopRecording && videoChunks.length > 0) ||
            videoAttachment.length > 0) &&
            !lectureStoped.isProccess &&
            (recordedVideo ? (
              <video
                src={recordedVideo}
                controls
                style={{
                  height: "100%",

                  // width: "100%",
                }}
              />
            ) : (
              <CircularProgress size={48} sx={{ mt: 3 }} />
            ))}
        </Box>
      )}

      {(lectureStoped.isProccess ||
        lectureStoped?.isError ||
        lectureStoped?.submit) && (
        <Box
          width="100%"
          height="100%"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RecorderErrorMessage
            lectureStoped={lectureStoped}
            error={error}
            recordingData={recordingData}
            uploadedChunk={uploadProgress}
            uploadSpeed={uploadSpeed}
            timeRemaining={timeRemaining}
          />
        </Box>
      )}

      {!lectureStoped.isProccess && (
        <Grid container spacing={2} sx={{ height: "10%" }}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <BottomTabs
              startRecordingBtn={startRecordingBtn}
              videoChunks={videoChunks}
              videoAttachment={videoAttachment}
              setVideoAttachment={setVideoAttachment}
              onRemoveVideoFile={onRemoveVideoFile}
              setIsNoiseCancellation={setIsNoiseCancellation}
              isNoiseCancellation={isNoiseCancellation}
              attachments={attachments}
              setAttachments={setAttachments}
              removeVideoChunk={removeVideoChunk}
              lectureStoped={lectureStoped}
              removeCameraAccess={removeCameraAccess}
              recordingData={recordingData}
              audioAttachment={audioAttachment}
              setAudioAttachment={setAudioAttachment}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              audioChunks={audioChunk}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <RecorderController
              startRecordingBtn={startRecordingBtn}
              timer={timer}
              handleVideoPlayPause={handleVideoPlayPause}
              isPaused={isPaused}
              stopRecording={stopRecording}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                my: 2,
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                onClick={onCloseDrawer}
                variant="outlined"
                color="error"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 1,
                  textTransform: "none",
                  boxShadow: 1,
                  transition: "transform 0.2s ease-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                Cancel
              </Button>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    if(isTrialAccount){
                      alert("You don't have access. This is a trial account.");
                    } else if (!lectureStoped.stopRecording && !videoAttachment.length > 0) {
                      setIsStopsubmit(true);
                      stopRecording();
                    } else {
                      submitLecture();
                    }
                  }}
                  variant="contained"
                  color={uploadedChunk < chunkCount ? "grey" : "primary"}
                  disabled={uploadedChunk < chunkCount}
                  sx={{
                    px: 4,
                    py: 1,
                    fontWeight: "bold",
                    borderRadius: 1,
                    textTransform: "none",
                  }}
                >
                  {uploadedChunk < chunkCount ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: "white" }} />
                      <span>Processing...</span>
                    </Box>
                  ) : (
                    "Submit Lecture"
                  )}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Drawer>
  );
};

export default LectureRecorder;
