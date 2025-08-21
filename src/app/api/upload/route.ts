import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { s3 } from '@/lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json('No file uploaded', { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const fileKey = `blogs/${randomUUID()}-${file.name}`

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    })
  )

  const url = `https://${process.env.S3_BUCKET_NAME}.storage.yandexcloud.net/${fileKey}`

  return NextResponse.json({ url })
}
