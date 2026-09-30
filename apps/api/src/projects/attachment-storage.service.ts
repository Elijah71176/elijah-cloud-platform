import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class AttachmentStorageService {
  async save(key: string, content: Buffer, _mimeType?: string): Promise<void> {
    const directory = join(process.cwd(), 'uploads', 'projects');

    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, key), content);
  }
  async read(key: string): Promise<Readable> {
    const filePath = join(process.cwd(), 'uploads', 'projects', key);
    return createReadStream(filePath);
  }
  async delete(key: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', 'projects', key);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

