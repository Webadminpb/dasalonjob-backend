// venue-main-business-type.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateVenueMainBusinessTypeDto } from './dto/create-venuebusinesstype.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateVenuebusinesstypeDto } from './dto/update-venuebusinesstype.dto';

@Injectable()
export class VenueMainBusinessTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueMainBusinessTypeDto, user: Auth) {
    const existingVenueMainBusiness =
      await this.prismaService.venueMainBusinessType.findUnique({
        where: { userId: user.id },
      });
    if (existingVenueMainBusiness) {
      throw new BadRequestException('Venue business type already added');
    }
    const venueMainBusinessType =
      await this.prismaService.venueMainBusinessType.create({
        data: {
          businessType: body.businessType,
          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business type added',
      venueMainBusinessType,
    );
  }

  async findMyVenueMainBusinessType(user: Auth) {
    const venueMainBusinessType =
      await this.prismaService.venueMainBusinessType.findUnique({
        where: { userId: user.id },
      });
    if (!venueMainBusinessType) {
      throw new NotFoundException('Venue main business type not found');
    }
    return new ApiSuccessResponse(
      true,
      'Venue main business type found',
      venueMainBusinessType,
    );
  }

  async update(user: Auth, body: UpdateVenuebusinesstypeDto) {
    const existingVenueMainBusinessType =
      await this.prismaService.venueMainBusinessType.findUnique({
        where: { userId: user.id },
      });
    if (!existingVenueMainBusinessType) {
      throw new NotFoundException('Venue main business type not found');
    }
    const updatedVenueMainBusinessType =
      await this.prismaService.venueMainBusinessType.update({
        where: { id: existingVenueMainBusinessType.id },
        data: {
          ...body,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business type updated',
      updatedVenueMainBusinessType,
    );
  }

  async remove(user: Auth) {
    const existingVenueMainBusinessType =
      await this.prismaService.venueMainBusinessType.findUnique({
        where: { userId: user.id },
      });
    if (!existingVenueMainBusinessType) {
      throw new NotFoundException('Venue main business type not found');
    }
    await this.prismaService.venueMainBusinessType.delete({
      where: { id: existingVenueMainBusinessType.id },
    });
    return new ApiSuccessResponse(
      true,
      'Venue main business type deleted',
      null,
    );
  }
}
