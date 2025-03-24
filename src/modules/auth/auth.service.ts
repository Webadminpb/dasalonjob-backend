import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { generateJwtToken } from 'src/common/auth/auth-common';
import {
  generateSixDigitOTP,
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateApplicantDto } from './dto/applicant.profile';
import { Auth, BusinessType, Prisma } from '@prisma/client';
import { CreateChangePasswordDto } from './dto/change-password';
import { UpdateAccountStatusDto } from './dto/status-auth';
import { CreateAuthFileDto } from './dto/file-dto';
import { QueryAuthDto } from './dto/query-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(body: CreateAuthDto) {
    const phoneVerificationCode = await generateSixDigitOTP();
    const phoneVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const emailVerificationCode = await generateSixDigitOTP();
    const emailVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await this.prismaService.auth.create({
      data: {
        email: body.email,
        password: body.password,
        role: body.role,
        phone: body.phone,
        countryId: body.countryId,
        isPhoneVerified: body.isPhoneVerified,
        isEmailVerified: body.isEmailVerified,
        phoneVerificationCode: body.phoneVerificationCode,
        emailVerificationCode: body.emailVerificationCode,
        phoneVerificationCodeExpiry: new Date(
          body.phoneVerificationCodeExpiry,
        ).toISOString(),
        emailVerificationCodeExpiry: new Date(
          body.emailVerificationCodeExpiry,
        ).toISOString(),
      },
    });
    const updateUser = await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        phoneVerificationCode,
        emailVerificationCode,
        phoneVerificationCodeExpiry: new Date(
          body.phoneVerificationCodeExpiry,
        ).toISOString(),
        emailVerificationCodeExpiry: new Date(
          body.emailVerificationCodeExpiry,
        ).toISOString(),
      },
    });
    return new ApiSuccessResponse(
      true,
      'User created successfully',
      updateUser,
    );
  }

  async login(body: LoginAuthDto) {
    const user = await this.prismaService.auth.findUnique({
      where: { email: body.email },
      include: {
        profileImage: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== body.password) {
      throw new BadRequestException('Invalid password');
    }
    const token = await generateJwtToken(user);
    await this.prismaService.loginHistory.create({
      data: {
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'User logged in successfully', {
      user,
      token,
    });
  }

  async updateApplicantProfile(body: CreateApplicantDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'user updated', updatedUser);
  }

  async myApplicantProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        basicDetails: true,
        contactDetails: true,
        jobPreference: true,
        pastExperiences: true,
        PastWork: true,
        educations: true,
        certificates: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }

  async getMyPartnerProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profileImage: true,
        salonDetails: true,
        venueDetails: true,
        venueMainBusinessDays: true,
        venueMainBusinessServices: true,
        partnerSocialLinks: true,
        partnerPersonalData: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }
  async getMyApplicantProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        basicDetails: true,
        languages: true,
        contactDetails: true,
        jobPreference: true,
        pastExperiences: true,
        PastWork: true,
        educations: true,
        certificates: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', existingUser);
  }

  async changePassword(body: CreateChangePasswordDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (existingUser.password !== body.current_password) {
      throw new BadRequestException('Invalid old password');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: body.new_password,
      },
    });
    return new ApiSuccessResponse(true, 'Password updated', updatedUser);
  }

  async deactiveAccount(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });
    return new ApiSuccessResponse(true, 'Account deactivated', updatedUser);
  }

  async updateAccountStatus(body: UpdateAccountStatusDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        status: body.status,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }
  async updateProfileImage(body: CreateAuthFileDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        profileImageId: body.profileImageId,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }
  async updateVerificationFile(body: CreateAuthFileDto, user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        verificationFileId: body.verificationFileId,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }

  async getAllUsersForAdmin(query: QueryAuthDto) {
    const where: Prisma.AuthWhereInput = {};
    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.countryId) {
      where.countryId = query.countryId;
    }
    if (query.education) {
      where.educations = {
        some: {
          education: query.education,
        },
      };
    }

    if (query.locations) {
      where.OR = [
        {
          contactDetails: {
            city: { contains: query.locations, mode: 'insensitive' },
          },
        },
        {
          contactDetails: {
            state: { contains: query.locations, mode: 'insensitive' },
          },
        },
        {
          contactDetails: {
            streetAddress: { contains: query.locations, mode: 'insensitive' },
          },
        },
        {
          partnerVenues: {
            some: {
              venueBasicDetails: {
                city: { contains: query.locations, mode: 'insensitive' },
              },
            },
          },
        },
        {
          partnerVenues: {
            some: {
              venueBasicDetails: {
                state: { contains: query.locations, mode: 'insensitive' },
              },
            },
          },
        },
        {
          partnerVenues: {
            some: {
              venueBasicDetails: {
                streetAddress: {
                  contains: query.locations,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ];
    }

    if (query.search) {
      where.email = {
        contains: query.search,
        mode: 'insensitive',
      };
    }
    if (query.date) {
      where.createdAt = {
        gte: new Date(query.date).toISOString(),
      };
    }
    if (query.year) {
      where.createdAt = {
        gte: new Date(query.year).toISOString(),
      };
    }

    if (query.businessType) {
      where.partnerVenues = {
        some: {
          venueBasicDetails: {
            businessType: {
              hasSome: [query.businessType as BusinessType],
            },
          },
        },
      };
    }

    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);
    const [users, total] = await Promise.all([
      this.prismaService.auth.findMany({
        where,
        include: {
          basicDetails: true,
          partnerVenues: {
            include: {
              venueBasicDetails: true,
            },
          },
          contactDetails: true,
          educations: true,
          pastExperiences: true,
          PastWork: true,
          jobPreference: true,
          certificates: true,
          languages: true,
        },
        orderBy: {
          [orderBy]: sortBy,
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.auth.count({ where }),
    ]);
    if (!users) {
      throw new BadRequestException('No users found');
    }
    return new ApiSuccessResponse(true, 'Users found', {
      users,
      total,
    });
  }

  async updateAccountStatusByAdmin(body: UpdateAccountStatusDto, id: string) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: existingUser.id,
      },
      data: {
        status: body.status,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Account Status Changed Successfully',
      updatedUser,
    );
  }

  async findOneApplicant(id: string) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        id,
      },
      include: {
        basicDetails: true,
        contactDetails: true,
        educations: true,
        pastExperiences: true,
        PastWork: true,
        jobPreference: true,
        certificates: true,
        languages: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User found', user);
  }

  async findOnePartner(id: string) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        id,
      },
      include: {
        profileImage: true,
        partnerSocialLinks: true,
        partnerPersonalData: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Partner not found');
    }
    return new ApiSuccessResponse(true, 'Partner found', user);
  }

  async findOneAdmin(id: string) {
    const user = await this.prismaService.auth.findUnique({
      where: {
        id,
      },
      include: {
        profileImage: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Admin not found');
    }
    return new ApiSuccessResponse(true, 'Admin found', user);
  }
}
