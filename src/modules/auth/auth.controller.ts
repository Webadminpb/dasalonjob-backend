
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDocument, Role } from './auth.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CreateAuthDto } from './auth.dto';
import { ApiSuccessResponse } from 'src/api-response/api-success';
import { ApiErrorResponse } from 'src/api-response/api-error';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

    @Post('signup')
    async signup(@Body() body: CreateAuthDto): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.registerUser(body);
            return new ApiSuccessResponse(true, "User registered successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, "User registration failed", error);
        }
    }

    @Post('login')
    async login(@Body() body: CreateAuthDto): Promise<ApiSuccessResponse<{user: AuthDocument, token: string}>|ApiErrorResponse> {
        try {
            const user = await this.authService.loginUser(body);
            return new ApiSuccessResponse(true, "User logged in successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }

    @Post('verify-phone')
    async verifyPhone(@Body() body: {phone: string, otp: string}): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.verifyPhone(body.phone, body.otp);
            return new ApiSuccessResponse(true, "Phone verified successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }

    @Post('verify-email')
    async verifyEmail(@Body() body: {email: string, otp: string}): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.verifyEmail(body.email, body.otp);
            return new ApiSuccessResponse(true, "Email verified successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }

    @Post('send-phone-verification-code')
    async sendPhoneVerificationCode(@Body() body: {phone: string}): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.sendPhoneVerificationCode(body.phone);
            return new ApiSuccessResponse(true, "Phone verification code sent successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }

    @Post('send-email-verification-code')
    async sendEmailVerificationCode(@Body() body: {email: string}): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.sendEmailVerificationCode(body.email);
            return new ApiSuccessResponse(true, "Email verification code sent successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }

    @Get('my-profile')
    @UseGuards(AuthGuard('jwt'))
    async myProfile(@Req() req: any): Promise<ApiSuccessResponse<AuthDocument>|ApiErrorResponse> {
        try {
            const user = await this.authService.myProfile(req.user.userId);
            return new ApiSuccessResponse(true, "User profile fetched successfully", user);
        } catch (error) {
            return new ApiErrorResponse(false, error.message, error);
        }
    }
}