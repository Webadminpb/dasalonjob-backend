import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateVenueMainBusinessServicesDto } from './dto/create-venuebusinessservice.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateVenueMainBusinessServicesDto } from './dto/update-venuebusinessservice.dto';

@Injectable()
export class VenueMainBusinessServicesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueMainBusinessServicesDto, user: Auth) {
    const venueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.create({
        data: {
          services: body.services,
          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business services added',
      venueMainBusinessServices,
    );
  }

  async findVenueMainBusinessServices(id: string) {
    const venueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.findUnique({
        where: { id },
      });
    if (!venueMainBusinessServices) {
      throw new NotFoundException('Venue main business services not found');
    }
    return new ApiSuccessResponse(
      true,
      'Venue main business services found',
      venueMainBusinessServices,
    );
  }

  async findAllVenueMainBusinessServices(user: Auth) {
    const venueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.findMany({
        where: { userId: user.id },
      });
    if (!venueMainBusinessServices) {
      throw new NotFoundException('Venue main business services not found');
    }
    return new ApiSuccessResponse(true, 'Venue main business services found', {
      venueMainBusinessServices,
    });
  }

  async update(
    id: string,
    user: Auth,
    body: UpdateVenueMainBusinessServicesDto,
  ) {
    const existingVenueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingVenueMainBusinessServices) {
      throw new NotFoundException('Venue main business services not found');
    }
    const updatedVenueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.update({
        where: { id: existingVenueMainBusinessServices.id },
        data: {
          services: {
            set: [
              ...existingVenueMainBusinessServices.services,
              ...body.services,
            ],
          },
        },
      });
    return new ApiSuccessResponse(
      true,
      'Venue main business services updated',
      updatedVenueMainBusinessServices,
    );
  }

  async remove(id: string, user: Auth) {
    const existingVenueMainBusinessServices =
      await this.prismaService.venueMainBusinessServices.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingVenueMainBusinessServices) {
      throw new NotFoundException('Venue main business services not found');
    }
    await this.prismaService.venueMainBusinessServices.delete({
      where: { id: existingVenueMainBusinessServices.id },
    });
    return new ApiSuccessResponse(
      true,
      'Venue main business services deleted',
      null,
    );
  }
}
