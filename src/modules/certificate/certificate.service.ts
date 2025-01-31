import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(private prismaService: PrismaService) {}

  // Create a new certificate
  async create(body: CreateCertificateDto, user: Auth) {
    const certificate = await this.prismaService.certificate.create({
      data: {
        userId: user.id,
        certificateName: body.certificateName,
        certificateId: body.certificateId,
        instituationName: body.instituationName,
        isProfessional: body.isProfessional,
      },
    });
    return new ApiSuccessResponse(true, 'certificate added ', certificate);
  }

  // Get all certificates
  async findMyAllCertificates(user: Auth) {
    const certificates = await this.prismaService.certificate.findMany({
      where: { userId: user.id },
    });
    if (!certificates) {
      throw new NotFoundException('certificates not found');
    }
    return new ApiSuccessResponse(true, 'certificates data', { certificates });
  }

  // Get a certificate by ID
  async findOne(id: string) {
    const certificate = await this.prismaService.certificate.findUnique({
      where: { id },
    });
    if (!certificate) {
      throw new NotFoundException(`certificate not found`);
    }
    return certificate;
  }

  // Update a certificate by ID
  async update(id: string, body: UpdateCertificateDto, user: Auth) {
    const certificate = await this.prismaService.certificate.findUnique({
      where: { id, userId: user.id },
    });
    if (!certificate) {
      throw new NotFoundException(`certificate not found`);
    }
    const updatedCertificate = await this.prismaService.certificate.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'certificate updated',
      updatedCertificate,
    );
  }

  // Delete a certificate by ID
  async remove(id: string, user: Auth) {
    const certificate = await this.prismaService.certificate.findUnique({
      where: { id, userId: user.id },
    });
    if (!certificate) {
      throw new NotFoundException(`certificate not found`);
    }
    await this.prismaService.certificate.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'certificate deleted', null);
  }
}
