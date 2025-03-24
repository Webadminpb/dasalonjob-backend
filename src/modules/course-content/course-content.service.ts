import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateCourseContentDto } from './dto/create-course-content.dto';
import { UpdateCourseContentDto } from './dto/update-course-content.dto';
import { Auth, HighestEducation } from '@prisma/client';

@Injectable()
export class CourseContentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateCourseContentDto, user: Auth) {
    const courseContent = await this.prismaService.courseContent.create({
      data: {
        content: body.content,
        description: body.description,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseContent created successfully',
      courseContent,
    );
  }

  async findAll(user: Auth) {
    const courseContent = await this.prismaService.courseContent.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!courseContent) {
      throw new BadRequestException('No course content found');
    }
    return new ApiSuccessResponse(true, 'CourseContent found', {
      courseContent,
    });
  }

  async findOne(id: string) {
    const courseContent = await this.prismaService.courseContent.findUnique({
      where: {
        id: id,
      },
    });
    if (!courseContent) {
      throw new BadRequestException('CourseContent not found');
    }
    return new ApiSuccessResponse(true, 'CourseContent found', courseContent);
  }

  async update(id: string, body: UpdateCourseContentDto, user: Auth) {
    const existingCourseContent =
      await this.prismaService.courseContent.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingCourseContent) {
      throw new BadRequestException('CourseContent not found');
    }
    const courseContent = await this.prismaService.courseContent.update({
      where: {
        id: id,
      },
      data: {
        // content: body.content,
        content: body.content.map((item) => ({
          service: item.service,
          // list: item.list,
        })),
        description: body.description,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseContent updated successfully',
      courseContent,
    );
  }

  async remove(id: string, user: Auth) {
    const existingCourseContent =
      await this.prismaService.courseContent.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingCourseContent) {
      throw new BadRequestException('CourseContent not found');
    }
    const courseContent = await this.prismaService.courseContent.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'CourseContent deleted successfully',
      courseContent,
    );
  }
}
