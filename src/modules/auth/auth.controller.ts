import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { CreateApplicantDto } from './dto/applicant.profile';
import { ApiTags } from '@nestjs/swagger';
import { CreateChangePasswordDto } from './dto/change-password';
import { UpdateAccountStatusDto } from './dto/status-auth';
import { CreateAuthFileDto } from './dto/file-dto';
import { QueryAuthDto } from './dto/query-auth.dto';
import {
  CreateAdminAuthDto,
  CreateAgencyTeamMemberDto,
} from './dto/admin-user.dto';
import { CreateDeletionReasonDto } from './dto/deletion-reason.dto';

@ApiTags('users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Create Account Api
  @Post('signup')
  @HttpCode(201)
  registerUser(@Body() body: CreateAuthDto) {
    return this.authService.signup(body);
  }

  // Login Api
  @Post('login')
  @HttpCode(200)
  authenticateUser(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @HttpCode(200)
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }

  // Get Applicant Profile
  @Get('partner/profile')
  @HttpCode(200)
  @AllowAuthenticated('USER', 'PARTNER', 'AGENCY', 'ADMIN', 'SUPER_ADMIN')
  getAuthenticatedPartnerProfile(@GetUser() user: Auth) {
    return this.authService.getMyPartnerProfile(user);
  }

  // Get Agency Profile
  @Get('agency/profile')
  @HttpCode(200)
  @AllowAuthenticated('AGENCY')
  getAuthenticatedAgencyProfile(@GetUser() user: Auth) {
    return this.authService.getMyAgencyProfile(user);
  }

  // Get Applicant Profile
  @Get('applicant/profile')
  @HttpCode(200)
  @AllowAuthenticated('USER', 'ADMIN', 'SUPER_ADMIN')
  getAuthenticatedApplicantProfile(@GetUser() user: Auth) {
    return this.authService.myApplicantProfile(user);
  }

  // Update Admin Profile
  @Patch('admin/profile')
  @HttpCode(200)
  @AllowAuthenticated('USER', 'ADMIN', 'SUPER_ADMIN')
  modifyAuthenticatedAdminProfile(
    @GetUser() user: Auth,
    @Body() body: { phone?: string; name?: string; phoneCode?: string },
  ) {
    return this.authService.updateAdminProfile(body, user);
  }

  // Change Password For All Users
  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  updateUserPassword(
    @Body() body: CreateChangePasswordDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.changePassword(body, user);
  }

  // Update Applicant Profile
  @Put('applicant')
  @AllowAuthenticated('USER')
  modifyApplicantProfile(
    @Body() body: CreateApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateApplicantProfile(body, user);
  }

  // Upload Profile Image For Admin Applicant And Partner
  @Put('/profile-image')
  @AllowAuthenticated()
  uploadProfileImage(@Body() body: CreateAuthFileDto, @GetUser() user: Auth) {
    return this.authService.updateProfileImage(body, user);
  }

  // Upload Verification File
  @Put('/verification-file')
  @AllowAuthenticated()
  uploadVerificationDocument(
    @Body() body: CreateAuthFileDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateVerificationFile(body, user);
  }

  @Get('applicant/total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  fetchApplicantCount(@Query() query: QueryAuthDto) {
    return this.authService.getAllUsersForAdmin(query);
  }

  // Get All Users(Applicant Admin Partners)
  @Get('admin/all/users')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  fetchAllUsers(@Query() query: QueryAuthDto) {
    return this.authService.getAllUsersForAdmin(query);
  }

  @Get('agency/partner/total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  fetchAgencyPartnerTotal(@GetUser() user: Auth) {
    return this.authService.fetchAgencyPartnerTotal(user);
  }

  @Get('agency/applicant/total')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  fetchAgencyApplicantTotal(@GetUser() user: Auth) {
    return this.authService.fetchAgencyApplicantTotal(user);
  }

  // Update Account (Applicant, Partner, User) Status By Id
  @Patch('admin/user/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  changeUserStatusByAdmin(
    @Body() body: UpdateAccountStatusDto,
    @Param('id') id: string,
  ) {
    return this.authService.updateAccountStatusByAdmin(body, id);
  }

  // Find One Applicant By Id
  @Get('admin/applicant/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY', 'PARTNER')
  fetchApplicantDetails(@Param('id') id: string) {
    return this.authService.findOneApplicant(id);
  }

  @Get('admin/partner/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN', 'AGENCY')
  fetchPartnerDetails(@Param('id') id: string) {
    return this.authService.findOnePartner(id);
  }

  // Find One Admin By Id
  @Get('admin/admin/:id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  fetchAdminDetails(@Param('id') id: string) {
    return this.authService.findOneAdmin(id);
  }

  @Post('admin/add-user')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  createUserByAdmin(@Body() body: CreateAdminAuthDto) {
    return this.authService.createUserByAdmin(body);
  }

  @Post('agency/add-user')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  createUserByAgency(@Body() body: CreateAgencyTeamMemberDto) {
    return this.authService.createAgencyTeamMember(body);
  }

  // Update User Status
  @Patch('admin/status')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  modifyUserStatus(
    @Body() body: UpdateAccountStatusDto,
    @GetUser() user: Auth,
  ) {
    return this.authService.updateAccountStatus(body, user);
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  deletionReason(@Body() body: CreateDeletionReasonDto, @GetUser() user: Auth) {
    return this.authService.deleteAccount(body, user);
  }
}
