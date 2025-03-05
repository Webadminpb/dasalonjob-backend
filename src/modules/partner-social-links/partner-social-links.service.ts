import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerSocialLinksDto } from './dto/create-partner-social-link.dto';
import { UpdatePartnerSocialLinksDto } from './dto/update-partner-social-link.dto';

@Injectable()
export class PartnerSocialLinksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerSocialLinksDto, user: Auth) {
    const existingSocialLinks =
      await this.prismaService.partnerSocialLinks.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (existingSocialLinks) {
      throw new BadRequestException('Social links already added');
    }

    const socialLinks = await this.prismaService.partnerSocialLinks.create({
      data: {
        userId: user.id,
        facebook: body.facebook,
        instagram: body.instagram,
        linkedin: body.linkedin,
        website: body.website,
      },
    });

    return new ApiSuccessResponse(true, 'Social links added', socialLinks);
  }

  async findMySocialLinks(user: Auth) {
    const socialLinks = await this.prismaService.partnerSocialLinks.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!socialLinks) {
      throw new NotFoundException('Social links not found');
    }

    return new ApiSuccessResponse(true, 'Social links fetched', socialLinks);
  }

  async update(body: UpdatePartnerSocialLinksDto, user: Auth) {
    const existingSocialLinks =
      await this.prismaService.partnerSocialLinks.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (!existingSocialLinks) {
      throw new NotFoundException('Social links not found');
    }

    const updatedSocialLinks =
      await this.prismaService.partnerSocialLinks.update({
        where: {
          id: existingSocialLinks.id,
        },
        data: {
          ...body,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Social links updated',
      updatedSocialLinks,
    );
  }

  async remove(user: Auth) {
    const existingSocialLinks =
      await this.prismaService.partnerSocialLinks.findUnique({
        where: {
          userId: user.id,
        },
      });

    if (!existingSocialLinks) {
      throw new NotFoundException('Social links not found');
    }

    await this.prismaService.partnerSocialLinks.delete({
      where: {
        id: existingSocialLinks.id,
      },
    });

    return new ApiSuccessResponse(true, 'Social links deleted', null);
  }
}
