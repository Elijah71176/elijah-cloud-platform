import { Injectable } from '@nestjs/common';

import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3AttachmentStorageService {
    private readonly bucket: string;
    private readonly client: S3Client;

    constructor() {
        const bucket = process.env.S3_ATTACHMENTS_BUCKET;
        const region = process.env.AWS_REGION;

        if (!bucket || !region) {
            throw new Error('S3_ATTACHMENTS_BUCKET and AWS_REGION are required for S3 storage');
        }

        this.bucket = bucket;
        this.client = new S3Client({
            region,
            endpoint: process.env.AWS_ENDPOINT_URL_S3 || undefined,
            forcePathStyle: Boolean(process.env.AWS_ENDPOINT_URL_S3),
        });
    }
    async save(key: string, content: Buffer, mimeType: string): Promise<void> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: content,
                ContentType: mimeType,
            }),
        );
    }
    async read(key: string): Promise<Readable> {
        const result = await this.client.send(
            new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );

        if (!(result.Body instanceof Readable)) {
            throw new Error('S3 did not return a readable file');
        }

        return result.Body;
    }
    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }
}