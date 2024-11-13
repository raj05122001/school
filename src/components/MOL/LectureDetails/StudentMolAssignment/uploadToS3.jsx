import { Upload } from "@aws-sdk/lib-storage";

export const uploadToS3 = async (
  file,
  fileType,
  assignmentId,
  s3,
  setUploadProgress
) => {
  return new Promise(async (resolve, reject) => {
    console.log("component is working");
    try {
      const fileConfigs = {
        IMAGE: {
          Bucket: "vidya-ai-video",
          Key: `assignment/lecture_${assignmentId}/images/${file.name}`,
          ContentType: file.type,
        },
        VIDEO: {
          Bucket: "vidya-ai-video",
          Key: `assignment/lecture_${assignmentId}/videos/${file.name}`,
          ContentType: file.type,
        },
        AUDIO: {
          Bucket: "vidya-ai-video",
          Key: `assignment/lecture_${assignmentId}/audios/${file.name}`,
          ContentType: file.type,
        },
        FILE: {
          Bucket: "vidya-ai-video",
          Key: `assignment/lecture_${assignmentId}/documents/${file.name}`,
          ContentType: file.type,
        },
      };

      const params = {
        ...fileConfigs[fileType],
        Body: file,
      };

      let uploadedBytes = 0;

      const upload = new Upload({
        client: s3,
        params,
        leavePartsOnError: false,
      });

      // Listen to the "httpUploadProgress" event
      upload.on("httpUploadProgress", (progress) => {
        const uploadedBytes = progress.loaded || 0;
        const totalBytes = progress.total || 1;

        const progressPercentage = Math.round(
          (uploadedBytes / totalBytes) * 100
        );
        setUploadProgress(progressPercentage);
      });

      const result = await upload.done();
      console.log("result", result);
      file.s3Location = result.Location;
      resolve(result);
    } catch (err) {
      console.error("Error uploading file:", err);
      reject(err);
    }
  });
};
