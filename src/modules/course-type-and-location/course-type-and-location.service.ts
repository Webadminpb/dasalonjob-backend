import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseTypeAndLocationDto } from './dto/create-course-type-and-location.dto';
import { UpdateCourseTypeAndLocationDto } from './dto/update-course-type-and-location.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth } from '@prisma/client';

@Injectable()
export class CourseTypeAndLocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateCourseTypeAndLocationDto, user: Auth) {
    if (user.role == 'ADMIN' || user.role == 'SUPER_ADMIN') {
      const courseTypeAndLocation =
        await this.prismaService.courseTypeAndLocation.create({
          data: {
            country: body.country,
            city: body.city,
            state: body.state,
            pincode: body.pincode,
            address: body.address,
            courseType: body.courseType,
            platform: body.platform,
            link: body.link,
            userId: body.userId,
          },
        });
      return new ApiSuccessResponse(
        true,
        'CourseTypeAndLocation created successfully',
        courseTypeAndLocation,
      );
    }
    const courseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.create({
        data: {
          country: body.country,
          city: body.city,
          state: body.state,
          pincode: body.pincode,
          address: body.address,
          courseType: body.courseType,
          platform: body.platform,
          link: body.link,
          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'CourseTypeAndLocation created successfully',
      courseTypeAndLocation,
    );
  }

  async findAll() {
    const courseTypeAndLocations =
      await this.prismaService.courseTypeAndLocation.findMany();
    if (!courseTypeAndLocations) {
      throw new BadRequestException('No course type and locations found');
    }
    return new ApiSuccessResponse(true, 'Course type and locations found', {
      courseTypeAndLocations,
    });
  }

  async findOne(id: string) {
    const courseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.findUnique({
        where: {
          id: id,
        },
      });
    if (!courseTypeAndLocation) {
      throw new BadRequestException('Course type and location not found');
    }
    return new ApiSuccessResponse(
      true,
      'Course type and location found',
      courseTypeAndLocation,
    );
  }

  async update(id: string, body: UpdateCourseTypeAndLocationDto) {
    const existingCourseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingCourseTypeAndLocation) {
      throw new BadRequestException('Course type and location not found');
    }
    const courseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.update({
        where: {
          id: id,
        },
        data: {
          country: body.country,
          city: body.city,
          state: body.state,
          pincode: body.pincode,
          address: body.address,
          courseType: body.courseType,
          platform: body.platform,
          link: body.link,
          userId: body.userId,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Course type and location updated successfully',
      courseTypeAndLocation,
    );
  }

  async remove(id: string) {
    const existingCourseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingCourseTypeAndLocation) {
      throw new BadRequestException('Course type and location not found');
    }
    const courseTypeAndLocation =
      await this.prismaService.courseTypeAndLocation.delete({
        where: {
          id: id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Course type and location deleted successfully',
      courseTypeAndLocation,
    );
  }
}
