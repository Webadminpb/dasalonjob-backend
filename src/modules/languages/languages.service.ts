import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LangaugesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateLanguageDto, user: Auth) {
    const language = await this.prismaService.languages.create({
      data: {
        userId: user.id,
        language: body.language,
        proficiency: body.proficiency,
      },
    });
    return new ApiSuccessResponse(
      true,
      'new langauge addedd successfully',
      language,
    );
  }

  async findMyAllLangauges(user: Auth) {
    console.log('user ', user);
    const languages = await this.prismaService.languages.findMany({
      where: {
        userId: user.id,
      },
    });
    console.log('languages ', languages);
    if (!languages) {
      throw new NotFoundException('Lanagauge not found');
    }
    return new ApiSuccessResponse(true, 'languages', { languages });
  }

  async findOne(id: string) {
    const language = await this.prismaService.languages.findUnique({
      where: {
        id,
      },
    });
    if (!language) {
      throw new NotFoundException('langauage not found');
    }
    return new ApiSuccessResponse(true, 'Langauage data ', language);
  }

  async update(id: string, body: UpdateLanguageDto, user: Auth) {
    const existingLanguage = await this.prismaService.languages.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingLanguage) {
      throw new NotFoundException('langauage not found');
    }
    const langauge = await this.prismaService.languages.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'Langauage updated', langauge);
  }

  async remove(id: string, user: Auth) {
    const existingLangauage = await this.prismaService.languages.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingLangauage) {
      throw new NotFoundException('langauage not found');
    }
    await this.prismaService.languages.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'Langauage deleted', null);
  }
}
