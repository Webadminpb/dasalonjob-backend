import { Injectable } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as sharp from 'sharp';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFiles(files: any, folder: string, user: Auth) {
    // Map files to upload promises
    const uploadPromises: Promise<any>[] = files.map(async (file: any) => {
      const compressedBuffer = await this.compressFile(file.buffer);
      const folderPath = `dasalon/${user.id}/${folder}`;
      let newFileName = file.originalname;
      if (!newFileName.endsWith('.webp')) {
        newFileName = newFileName.split('.').slice(0, -1).join('.');
      }

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            format: 'webp',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error: ', error);
              return reject(error);
            }
            resolve(result);
          },
        );
        uploadStream.end(compressedBuffer);
      });

      return {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        format: uploadResult.format,
        folder: folderPath,
      };
    });

    // Wait for all upload promises to resolve
    const uploadResults = await Promise.all(uploadPromises);

    // Save all file metadata in the database using createMany
    await this.prisma.file.createMany({
      data: uploadResults.map((result) => ({
        publicId: result.publicId,
        url: result.url,
        format: result.format,
        folder: result.folder,
        userId: user.id,
      })),
    });

    const savedFiles = await this.prisma.file.findMany({
      where: {
        publicId: {
          in: uploadResults.map((result) => result.publicId),
        },
      },
    });

    return new ApiSuccessResponse(true, 'Files uploaded successfully', {
      savedFiles,
    });
  }

  async deleteFile(fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    const cloudinaryResponse = await cloudinary.uploader.destroy(file.publicId);
    console.log('cloudinary response ', cloudinaryResponse);
    await this.prisma.file.delete({ where: { id: fileId } });

    return new ApiSuccessResponse(true, 'File deleted successfully', null);
  }

  private async compressFile(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp({ quality: 80 }).toBuffer();
  }

  async deleteFilesByFolder(folderPath: string, user: Auth) {
    try {
      const cloudinaryResponse =
        await cloudinary.api.delete_resources_by_prefix(folderPath);

      console.log('Cloudinary delete response:', cloudinaryResponse);

      await cloudinary.api.delete_folder(folderPath);

      await this.prisma.file.deleteMany({
        where: {
          userId: user.id,
        },
      });

      return new ApiSuccessResponse(
        true,
        'Files and folder deleted successfully',
        cloudinaryResponse,
      );
    } catch (error) {
      console.error('Error deleting files by folder:', error);
      throw new Error('Failed to delete files by folder');
    }
  }
}
