import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  region: 'ru-central1',
  endpoint: 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: process.env.S3_PUBLIC_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})
