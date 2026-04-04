import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // https://{account-id}.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// TWO SEPARATE FUNCTIONS — never combine into one generic function

export async function generatePrivateUploadUrl(userId: string, docType: string, contentType: string) {
  const key = `${userId}/${docType}/${randomUUID()}.${contentType === 'image/png' ? 'png' : 'jpg'}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_VERIFICATION!, // PRIVATE bucket
    Key: key,
    ContentType: contentType,
  }), { expiresIn: 300 }); // 5 minutes
  return { uploadUrl: url, objectKey: key };
}

export async function generatePublicUploadUrl(prefix: string, contentType: string) {
  const key = `${prefix}/${randomUUID()}.${contentType === 'image/png' ? 'png' : 'jpg'}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_LISTINGS!, // PUBLIC bucket
    Key: key,
    ContentType: contentType,
  }), { expiresIn: 300 }); // 5 minutes
  return { uploadUrl: url, objectKey: key };
}

export async function generateViewUrl(key: string) {
  return getSignedUrl(s3, new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_VERIFICATION!, // PRIVATE only — public has direct URLs
    Key: key,
  }), { expiresIn: 3600 }); // 1 hour for admin viewing
}

export async function verifyObjectExists(bucket: string, key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch { return false; }
}
