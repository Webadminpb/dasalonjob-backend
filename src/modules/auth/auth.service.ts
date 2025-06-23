import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActivityType,
  Auth,
  BusinessType,
  Certificate,
  HighestEducation,
  Prisma,
  VerificationStatus,
} from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import {
  generateRandomPassword,
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import {
  decodeAuthToken,
  generateAccessToken,
  generateAuthToken,
  generateRefreshToken,
  verifyAuthToken,
  verifyRefreshToken,
} from 'src/common/utils/jwt';
import { parseWithSchema } from 'src/common/utils/zod-parser';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAdminAuthDto,
  CreateAgencyTeamMemberDto,
} from './dto/admin-user.dto';
import { CreateApplicantDto } from './dto/applicant.profile';
import { PublicUserSchema } from './dto/auth.dto';
import { CreateChangePasswordDto } from './dto/change-password';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateDeletionReasonDto } from './dto/deletion-reason.dto';
import { CreateAuthFileDto } from './dto/file-dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { QueryAuthDto } from './dto/query-auth.dto';
import { UpdateAccountStatusDto } from './dto/status-auth';
import passport from 'passport';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(body: CreateAuthDto) {
    // const phoneVerificationCode = await generateSixDigitOTP();
    // const phoneVerificationCodeExpiry = new Date(
    //   Date.now() + 10 * 60 * 1000,
    // ).toISOString();
    // const emailVerificationCode = await generateSixDigitOTP();
    // const emailVerificationCodeExpiry = new Date(
    //   Date.now() + 10 * 60 * 1000,
    // ).toISOString();
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
        // phoneVerificationCodeExpiry: phoneVerificationCodeExpiry,
        // emailVerificationCodeExpiry: emailVerificationCodeExpiry,
      },
    });
    const updateUser = await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        // phoneVerificationCode,
        // emailVerificationCode,
        // phoneVerificationCodeExpiry: new Date(
        //   body.phoneVerificationCodeExpiry,
        // ).toISOString(),
        // emailVerificationCodeExpiry: new Date(
        //   body.emailVerificationCodeExpiry,
        // ).toISOString(),
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
    const payload: any = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const { token, expiry } = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    await this.prismaService.loginHistory.create({
      data: {
        userId: user.id,
      },
    });

    return new ApiSuccessResponse(true, 'User logged in successfully', {
      user: parseWithSchema(PublicUserSchema, user),
      accessToken: token,
      refreshToken,
      expiry: expiry,
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded: any = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedException('Token Invalid Or Expired');
    }
    const payload: any = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    const newAccessToken: any = await generateAccessToken(payload);
    return new ApiSuccessResponse(true, 'Access token refreshed', {
      accessToken: newAccessToken,
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
  async updateAdminProfile(
    body: { phone?: string; name?: string; phoneCode?: string },
    user: Auth,
  ) {
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
        profileImage: true,
        jobPreference: {
          include: {
            skills: true,
          },
        },
        courseDetails: true,
        experiences: {
          include: {
            profile: true,
          },
        },
        pastExperiences: true,
        PastWork: {
          include: {
            files: true,
          },
        },
        educations: true,
        certificates: {
          include: {
            file: true,
          },
        },
        languages: {
          include: {
            language: true,
          },
        },
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return new ApiSuccessResponse(true, 'User data', {
      existingUser,
      profileCompletion: this.calculateProfileCompletion(existingUser),
    });
  }

  private calculateProfileCompletion(user: any): number {
    let score = 0;

    // Basic Info
    console.log('score ', score);
    if (
      user.basicDetails?.firstName &&
      user.basicDetails?.lastName &&
      user.basicDetails?.dob &&
      user.basicDetails?.gender
    ) {
      score += 10;
      console.log('basic details score ', score);
    }

    // Contact Details
    if (
      user.contactDetails?.phoneCode &&
      user.contactDetails?.phoneNumber &&
      user.contactDetails?.city &&
      user.contactDetails?.state
    ) {
      score += 15;
      console.log('contact details score ', score);
    }

    // Profile Image
    if (user.profileImage?.url) {
      score += 10;
      console.log('profile image details score ', score);
    }

    // Job Preference
    if (
      user.jobPreference?.skills?.length &&
      user.jobPreference?.salary?.start &&
      user.jobPreference?.locations?.length
    ) {
      score += 10;
      console.log('job prefernce details score ', score);
    }

    // Experience
    if (user.experiences?.length) {
      score += 10;
      console.log('experience score ', score);
    }

    // Past Work
    // if (user.PastWork?.videoLink?.length || user.PastWork?.files?.length) {
    //   score += 10;
    //   console.log('pastworkd details score ', score);
    // }

    // Education
    if (user.educations?.length) {
      score += 10;
      console.log('education score ', score);
    }

    // Certificates
    if (
      user.certificates?.some((cert: any) => cert.file) ||
      user.certificates?.some((cert: Certificate) => cert.isNotCertificate)
    ) {
      score += 10;
      console.log('jcertificates score ', score);
    }

    // Languages
    if (user.languages?.some((lang: any) => lang.language)) {
      score += 10;
      console.log('languages score ', score);
    }

    // Verification
    if (user.isEmailVerified || user.isPhoneVerified) {
      score += 15;
      console.log('isEmailVerified score ', score);
    }

    // if (user.isPhoneVerified) {
    //   score += 15;
    //   console.log('isEmailVerified score ', score);
    // }
    return score;
  }

  async getMyPartnerProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profileImage: true,
        salonDetails: true,
        contactDetails: true,
        partnerSocialLinks: true,
        partnerPersonalData: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const { partnerPersonalData, ...userData } = existingUser;
    const responseData = {
      ...userData,
      basicDetails: partnerPersonalData || null,
    };

    const payload = {};
    return new ApiSuccessResponse(true, 'User data', {
      existingUser: responseData,
    });
  }

  async getMyAgencyProfile(user: Auth) {
    const existingUser = await this.prismaService.auth.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profileImage: true,
        agencyJobBasicInfo: true,
        agencyDetails: true,
        // basicDetails: true,
        contactDetails: true,
        partnerPersonalData: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const data = {
      basicDetails: existingUser.partnerPersonalData,

      ...existingUser,
    };
    return new ApiSuccessResponse(true, 'User data', { existingUser: data });
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
    if (body.status == 'ACTIVE') {
      let type: ActivityType;
      if (existingUser.role == 'ADMIN') {
        type = 'ACTIVATE_ADMIN';
      } else if (existingUser.role == 'USER') {
        type = 'ACTIVATE_APPLICANT';
      } else if (existingUser.role == 'PARTNER') {
        type = 'ACTIVATE_PARTNER';
      } else if (existingUser.role == 'AGENCY') {
        type = 'ACTIVATE_AGENCY';
      }

      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type,
        },
      });
    }
    if (body.status == 'INACTIVE') {
      let type: ActivityType;
      if (existingUser.role == 'ADMIN') {
        type = 'DEACTIVATE_ADMIN';
      } else if (existingUser.role == 'USER') {
        type = 'DEACTIVATE_APPLICANT';
      } else if (existingUser.role == 'PARTNER') {
        type = 'DEACTIVATE_PARTNER';
      } else if (existingUser.role == 'AGENCY') {
        type = 'DEACTIVATE_AGENCY';
      }

      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type,
        },
      });
    }

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
        verificationStatus: VerificationStatus.PENDING,
      },
    });
    return new ApiSuccessResponse(true, 'Account activated', updatedUser);
  }

  async getAllUsersForAdmin(query: QueryAuthDto) {
    const experienceOrder = [
      'FRESHER',
      'ONE_YEAR',
      'TWO_YEAR',
      'THREE_YEAR',
      'FOUR_YEAR',
      'FIVE_PLUS_YEAR',
    ] as const;

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
      const educationArray = query.education
        .split('_')
        .filter((e): e is HighestEducation =>
          Object.values(HighestEducation).includes(e as HighestEducation),
        );

      where.educations = {
        some: {
          education: { in: educationArray },
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

    if (query.skillIds) {
      where.jobPreference = {
        skillsIds: {
          hasSome: query?.skillIds?.split('_'),
        },
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
    const [users, total, active, inActive] = await Promise.all([
      this.prismaService.auth.findMany({
        where,
        include: {
          profileImage: {
            select: {
              url: true,
            },
          },
          _count: {
            select: {
              jobPost: true,
              partnerCourses: true,
            },
          },
          basicDetails: true,
          partnerVenues: {
            include: {
              venueBasicDetails: {
                include: {
                  files: true,
                },
              },
            },
          },
          contactDetails: true,
          educations: true,
          experiences: true,
          PastWork: {
            include: {
              files: true,
            },
          },
          jobPreference: {
            include: {
              skills: true,
            },
          },
          certificates: {
            include: {
              file: true,
            },
          },
          languages: {
            include: {
              language: {
                include: {
                  file: true,
                },
              },
            },
          },
          savedApplicants: true,
        },
        orderBy: {
          [sortBy]: orderBy,
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.auth.count({ where }),
      this.prismaService.auth.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      this.prismaService.auth.count({
        where: {
          status: 'INACTIVE',
        },
      }),
    ]);
    if (!users) {
      throw new BadRequestException('No users found');
    }

    return new ApiSuccessResponse(true, 'Users found', {
      users,
      total,
      active,
      inActive,
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
        profileImage: true,
        basicDetails: true,
        contactDetails: true,
        educations: true,
        pastExperiences: true,
        PastWork: true,
        jobPreference: {
          include: {
            skills: true,
          },
        },
        certificates: {
          include: {
            file: true,
          },
        },
        languages: {
          include: {
            language: {
              include: {
                file: true,
              },
            },
          },
        },
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

  async createUserByAdmin(body: CreateAdminAuthDto) {
    const userMap = new Map(body.users?.map((user) => [user.email, user]));

    const existingUsers = await this.prismaService.auth.findMany({
      where: { email: { in: Array.from(userMap.keys()) } },
      select: { email: true },
    });

    for (const { email } of existingUsers) {
      userMap.delete(email);
    }

    const newUsers = Array.from(userMap.values())?.map((user) => ({
      email: user.email,
      role: user.role,
      password: generateRandomPassword(),
      phone: user.phone,
      phoneCode: user.phoneCode,
    }));

    if (!newUsers.length) {
      throw new BadRequestException('All users already exist');
    }

    const users = await this.prismaService.auth.createMany({
      data: newUsers,
    });

    return new ApiSuccessResponse(true, 'User Created Successfully', { users });
  }

  async createAgencyTeamMember(body: CreateAgencyTeamMemberDto) {
    const existingTeamMember = await this.prismaService.auth.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingTeamMember) {
      throw new BadRequestException('User Already Existed');
    }
    // const password = generateRandomPassword();
    const newUser = await this.prismaService.auth.create({
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        phone: body.phone,
        // password: password,
        phoneCode: body.phoneCode,
        profileImageId: body.profileImageId,
      },
    });
    const token = await generateAuthToken(existingTeamMember);
    // http://dasalon.com/verify=token
    // sent to mail code

    return new ApiSuccessResponse(
      true,
      'Team Member Added Successfully',
      newUser,
    );
  }

  async authTokenVerify(body: { token: string; password: string }) {
    const isValid = verifyAuthToken(body.token);
    if (!isValid) {
      throw new BadRequestException('Invalid Or Token Expired');
    }
    const decodedData = (await decodeAuthToken(body.token)) as Auth;
    if (decodedData.id) {
      const user = await this.prismaService.auth.findUnique({
        where: { id: decodedData?.id },
      });
      if (!user) throw new NotFoundException('User Not Found');
      await this.prismaService.auth.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
          password: body.password,
        },
      });

      return new ApiSuccessResponse(true, 'Account Verify', null);
    } else {
      return new ApiSuccessResponse(false, 'Account Veification failed', null);
    }
  }

  async deleteAccount(body: CreateDeletionReasonDto, user: Auth) {
    const existingDeletionReason =
      await this.prismaService.accountDeletion.findUnique({
        where: {
          id: user.id,
        },
      });
    if (existingDeletionReason) {
      console.log('account is already deleted reson');
      throw new BadRequestException('Account Deletion Reason Already Existed');
    }
    const reason = await this.prismaService.accountDeletion.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
    const updatedUser = await this.prismaService.auth.update({
      where: {
        id: user.id,
      },
      data: {
        isDeleted: true,
        deletedAt: {
          set: new Date().toISOString(),
        },
      },
    });
    return new ApiSuccessResponse(true, 'Account Deleted Successfully', null);
  }

  async fetchAgencyPartnerTotal(user: Auth) {
    const [active, inActive] = await Promise.all([
      this.prismaService.auth.count({
        where: { role: 'PARTNER', status: 'ACTIVE' },
      }),
      this.prismaService.auth.count({
        where: {
          role: 'PARTNER',
          status: 'INACTIVE',
        },
      }),
    ]);

    return new ApiSuccessResponse(true, 'Partners Count', { active, inActive });
  }

  async fetchAgencyApplicantTotal(user: Auth) {
    const [active, inActive] = await Promise.all([
      this.prismaService.auth.count({ where: { role: 'USER' } }),
      this.prismaService.auth.count({ where: { role: 'USER' } }),
    ]);

    return new ApiSuccessResponse(true, 'Applicants Count', {
      active,
      inActive,
    });
  }
}
