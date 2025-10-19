import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class S3Service {
  async generateUploadUrl(
    fileName?: string,
    fileType: string = 'image/jpeg',
    expiresIn: number = process.env.S3_EXPIRATION_SECONDS ? parseInt(process.env.S3_EXPIRATION_SECONDS) : 60
  ): Promise<{
    uploadURL: string;
    // key: string;
    // publicUrl: string;
  }> {
    const bucketName = process.env.AWS_S3_BUCKET!;
    const extension = (fileType.split('/')[1] || 'bin').toLowerCase();
    const key = fileName ? `uploads/${fileName}` : `uploads/${Date.now()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });
    // const uploadURL = await getSignedUrl(s3, command, { expiresIn });
    const uploadURL = await 'getSignedUrl(s3, command, { expiresIn });'

    return {
      uploadURL,
    //   key,
    //   publicUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  }
}



// const s3RepoInstance = new S3Repository();
// export const generateUploadUrl = s3RepoInstance.generateUploadUrl.bind(s3RepoInstance);
// export default s3RepoInstance;
  
  


