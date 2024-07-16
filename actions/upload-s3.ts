import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { createSlug } from "../extras/utils";
const s3Client = new S3Client({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  bucket_name: string,
  type: "image" | "file"
): Promise<string> {
  const fileBuffer = file;
  const newFileName = `${Date.now()}-${createSlug(fileName)}`;

  const contentType = type === "image" ? "image/png" : "application/pdf";

  const params = {
    Bucket: bucket_name,
    Key: newFileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return newFileName;
}
