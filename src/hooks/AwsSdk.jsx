import AWS from "aws-sdk";

export const AwsSdk = () => {
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  AWS.config.update({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });

  const s3 = new AWS.S3();
  return { s3 };
};
