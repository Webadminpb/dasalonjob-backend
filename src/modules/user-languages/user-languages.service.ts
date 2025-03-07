import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateUserLanguageDto } from './dto/create-user-language.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';
import { Auth } from '@prisma/client';
import { userInfo } from 'os';

@Injectable()
export class UserLanguagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateUserLanguageDto, user: Auth) {
    const userLanguage = await this.prismaService.userLanguage.create({
      data: {
        userId: user.id,
        languageId: body.languageId,
        proficiency: body.proficiency,
      },
    });
    return new ApiSuccessResponse(
      true,
      'User language added successfully',
      userLanguage,
    );
  }

  async findAll(user: Auth) {
    const userLanguages = await this.prismaService.userLanguage.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        language: true,
      },
    });
    if (!userLanguages) {
      throw new NotFoundException('No user languages found');
    }
    return new ApiSuccessResponse(true, 'User languages', { userLanguages });
  }

  async findOne(id: string) {
    const userLanguage = await this.prismaService.userLanguage.findUnique({
      where: { id },
      include: {
        user: true,
        language: true,
      },
    });
    if (!userLanguage) {
      throw new NotFoundException('User language not found');
    }
    return new ApiSuccessResponse(true, 'User language data', userLanguage);
  }

  async update(id: string, body: UpdateUserLanguageDto, user: Auth) {
    const existingUserLanguage =
      await this.prismaService.userLanguage.findUnique({
        where: { id, userId: id },
      });
    if (!existingUserLanguage) {
      throw new NotFoundException('User language not found');
    }
    const updatedUserLanguage = await this.prismaService.userLanguage.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'User language updated',
      updatedUserLanguage,
    );
  }

  async remove(id: string, user: Auth) {
    const existingUserLanguage =
      await this.prismaService.userLanguage.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingUserLanguage) {
      throw new NotFoundException('User language not found');
    }
    await this.prismaService.userLanguage.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'User language deleted', null);
  }
}
