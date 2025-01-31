import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '@prisma/client';
import { memoryStorage } from 'multer';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('files')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(
    @Body('folder') folder: string,
    @UploadedFiles() files: any,
    @GetUser() user: Auth,
  ) {
    if (!files) {
      throw new BadRequestException('File is Required');
    }
    console.log('user Id ', user.id);
    return await this.uploadsService.uploadFiles(
      files,
      folder ?? 'default',
      user,
    );
  }

  @Delete('folder/')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async deleteFolderImages(@GetUser() user: Auth) {
    const folderPath = `dasalon/${user.id}`;
    return await this.uploadsService.deleteFilesByFolder(folderPath, user);
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  async deleteImage(@Param('fileId') fileId: string, @GetUser() user: Auth) {
    return await this.uploadsService.deleteFile(fileId);
  }
}
