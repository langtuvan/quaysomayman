import { Injectable, BadRequestException } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private async ensureUploadDirectoryExists() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, location: string): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = join(this.uploadDir, fileName);

      await new Promise<void>((resolve, reject) => {
        const stream = createWriteStream(filePath);
        stream.on('finish', resolve);
        stream.on('error', reject);
        stream.write(file.buffer);
        stream.end();
      });

      const fileUrl = `/${location}/${fileName}`;
      return fileUrl;
    } catch (error) {
      throw new BadRequestException(`File upload failed`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileName = fileUrl.split('/').pop();
      const filePath = join(this.uploadDir, fileName);
      await fs.unlink(filePath);
    } catch (error) {
      throw new BadRequestException(`File deletion failed`);
    }
  }
}
