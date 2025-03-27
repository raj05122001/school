import { S3Client } from "@aws-sdk/client-s3";

export const AwsSdk = () => {
  const awsAccessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  const s3 = new S3Client({
    region: region,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  return { s3 };
};
