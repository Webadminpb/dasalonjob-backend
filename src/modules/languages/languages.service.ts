import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LangaugesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateLanguageDto) {
    const language = await this.prismaService.language.create({
      data: {
        name: body.name,
        fileId: body.fileId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'new language addedd successfully',
      language,
    );
  }

  async findAll() {
    const languages = await this.prismaService.language.findMany({
      where: {},
      include: {
        file: true,
      },
    });
    if (!languages) {
      throw new NotFoundException('Language not found');
    }
    return new ApiSuccessResponse(true, 'languages', { languages });
  }

  async findOne(id: string) {
    const language = await this.prismaService.language.findUnique({
      where: {
        id,
      },
      include: {
        file: true,
      },
    });
    if (!language) {
      throw new NotFoundException('language not found');
    }
    return new ApiSuccessResponse(true, 'Language data ', language);
  }

  async update(id: string, body: UpdateLanguageDto) {
    const existingLanguage = await this.prismaService.language.findUnique({
      where: {
        id,
      },
    });
    if (!existingLanguage) {
      throw new NotFoundException('language not found');
    }
    const langauge = await this.prismaService.language.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'Language updated', langauge);
  }

  async remove(id: string, user: Auth) {
    const existingLangauage = await this.prismaService.language.findUnique({
      where: {
        id,
      },
    });
    if (!existingLangauage) {
      throw new NotFoundException('language not found');
    }
    await this.prismaService.language.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'Language deleted', null);
  }
}
