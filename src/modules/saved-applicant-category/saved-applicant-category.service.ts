import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSavedApplicantCategoryDto,
  UpdateSavedApplicantCategoryDto,
} from './dto/create-saved-applicant-category.dto';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class SavedApplicantCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateSavedApplicantCategoryDto, user: Auth) {
    const category = await this.prisma.savedApplicantCategory.create({
      data: {
        name: body.name,
        userId: user.id,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Category created successfully',
      category,
    );
  }

  async findAll(user: Auth) {
    const categories = await this.prisma.savedApplicantCategory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return new ApiSuccessResponse(
      true,
      'Categories fetched successfully',
      categories,
    );
  }

  async findOne(id: string, user: Auth) {
    const category = await this.prisma.savedApplicantCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to access this category',
      );
    }

    return new ApiSuccessResponse(
      true,
      'Category fetched successfully',
      category,
    );
  }

  async update(id: string, body: UpdateSavedApplicantCategoryDto, user: Auth) {
    const category = await this.prisma.savedApplicantCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this category',
      );
    }

    const updatedCategory = await this.prisma.savedApplicantCategory.update({
      where: { id },
      data: {
        name: body.name ?? category.name,
      },
    });

    return new ApiSuccessResponse(
      true,
      'Category updated successfully',
      updatedCategory,
    );
  }

  async remove(id: string, user: Auth) {
    const category = await this.prisma.savedApplicantCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this category',
      );
    }

    await this.prisma.savedApplicantCategory.delete({
      where: { id },
    });

    return new ApiSuccessResponse(true, 'Category deleted successfully', null);
  }
}
