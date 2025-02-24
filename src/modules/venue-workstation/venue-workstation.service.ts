import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateVenueWorkStationDto } from './dto/create-venue-workstation.dto';
import { Auth } from '@prisma/client';
import { UpdateVenueWorkStationDto } from './dto/update-venue-workstation.dto';

@Injectable()
export class VenueWorkStationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueWorkStationDto, user: Auth) {
    const venueWorkStation = await this.prismaService.venueWorkStation.create({
      data: {
        name: body.name,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Work Station created successfully',
      venueWorkStation,
    );
  }

  async findAll(user: Auth) {
    const venueWorkStations =
      await this.prismaService.venueWorkStation.findMany({
        where: {
          userId: user.id,
        },
      });
    if (!venueWorkStations) {
      throw new BadRequestException('No Venue Work Stations found');
    }
    return new ApiSuccessResponse(true, 'Venue Work Stations found', {
      venueWorkStations,
    });
  }

  async findOne(id: string) {
    const venueWorkStation =
      await this.prismaService.venueWorkStation.findUnique({
        where: {
          id: id,
        },
      });
    if (!venueWorkStation) {
      throw new BadRequestException('Venue Work Station not found');
    }
    return new ApiSuccessResponse(
      true,
      'Venue Work Station found',
      venueWorkStation,
    );
  }

  async update(id: string, body: UpdateVenueWorkStationDto, user: Auth) {
    const existingVenueWorkStation =
      await this.prismaService.venueWorkStation.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingVenueWorkStation) {
      throw new BadRequestException('Venue Work Station not found');
    }
    const venueWorkStation = await this.prismaService.venueWorkStation.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Work Station updated successfully',
      venueWorkStation,
    );
  }

  async remove(id: string, user: Auth) {
    const existingVenueWorkStation =
      await this.prismaService.venueWorkStation.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingVenueWorkStation) {
      throw new BadRequestException('Venue Work Station not found');
    }
    const venueWorkStation = await this.prismaService.venueWorkStation.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Work Station deleted successfully',
      venueWorkStation,
    );
  }
}
