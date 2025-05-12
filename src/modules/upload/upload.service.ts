import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { UploadFilesResponse, FileInfo } from './dto/upload.output';
import { UploadFilesInput } from './dto/upload.input';
import { FileUpload } from 'graphql-upload-ts';
import { MaxFilesValidator } from './validators/max-files.validator';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'public/uploads');

  constructor() {
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  validateFiles(files: Promise<FileUpload>[]): void {
    if (!new MaxFilesValidator().validate(files, 3)) throw new Error('Maximum number of files exceeded');
  }

  async uploadFiles(input: UploadFilesInput): Promise<UploadFilesResponse> {
    const { files, description } = input;
    const uploadedFiles: FileInfo[] = [];
    let totalSize = 0;

    this.validateFiles(files);

    for (const filePromise of files) {
      const file = await filePromise;
      const { createReadStream, filename, mimetype } = file;

      const uniqueFilename = this.generateUniqueFilename(filename);
      const filePath = join(this.uploadDir, uniqueFilename);

      await this.saveFile(createReadStream, filePath);

      const stats = statSync(filePath);
      const size = stats.size;
      totalSize += size;

      uploadedFiles.push({
        url: `/uploads/${uniqueFilename}`,
        filename,
        mimetype,
        size,
      });
    }

    return {
      files: uploadedFiles,
      description,
      totalSize,
    };
  }

  private generateUniqueFilename(originalname: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalname.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  private async saveFile(createReadStream: () => NodeJS.ReadableStream, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(path))
        .on('finish', resolve)
        .on('error', reject);
    });
  }
}