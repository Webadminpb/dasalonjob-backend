
import { Injectable } from '@nestjs/common';
import { AuthDocument } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './auth.schema';
import { CreateAuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    ) {}

    async registerUser(body: CreateAuthDto) {
        const user = await this.authModel.create(body);
        const phoneVerificationCode = await this.generateSixDigitOTP();
        const phoneVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const emailVerificationCode = await this.generateSixDigitOTP();
        const emailVerificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.updateUser(user['_id'].toString(), { phoneVerificationCode, phoneVerificationCodeExpiry, emailVerificationCode, emailVerificationCodeExpiry });
        return user;
    }

    async comparePassword(password: string, user: AuthDocument) {
        return await bcrypt.compare(password, user.password);
    }

    async generateJwtToken(user: AuthDocument) {
        return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1y' });
    }

    async generateSixDigitOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async loginUser(body: CreateAuthDto) {
       try {
        const user = await this.authModel.findOne({ email: body.email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await this.comparePassword(body.password, user);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }
        const token = await this.generateJwtToken(user);
        return { user, token };
       } catch (error) {
        throw error;
       }
    }

    async updateUser(id: string, body: CreateAuthDto) {
        const user = await this.authModel.findByIdAndUpdate(id, body);
        return user;
    }

    async verifyPhone(phone: string, otp: string) {
        const user = await this.authModel.findOne({ phone });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.phoneVerificationCode !== otp) {
            throw new Error("Invalid OTP");
        }
        if (user.phoneVerificationCodeExpiry < new Date()) {
            throw new Error("OTP expired");
        }
        await this.updateUser(user['_id'].toString(), { isPhoneVerified: true });
        return user;
    }

    async verifyEmail(email: string, otp: string) {
        const user = await this.authModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.emailVerificationCode !== otp) {
            throw new Error("Invalid OTP");
        }
        if (user.emailVerificationCodeExpiry < new Date()) {
            throw new Error("OTP expired");
        }
        await this.updateUser(user['_id'].toString(), { isEmailVerified: true });
        return user;
    }

    async sendPhoneVerificationCode(phone: string) {
        const user = await this.authModel.findOne({ phone });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isPhoneVerified) {
            throw new Error("Phone already verified");
        }
        const otp = await this.generateSixDigitOTP();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.updateUser(user['_id'].toString(), { phoneVerificationCode: otp, phoneVerificationCodeExpiry: expiry });
        return user;
    }

    async sendEmailVerificationCode(email:string){
        const user = await this.authModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isEmailVerified) {
            throw new Error("Email already verified");
        }
        const otp = await this.generateSixDigitOTP();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        await this.updateUser(user['_id'].toString(), { emailVerificationCode: otp, emailVerificationCodeExpiry: expiry });
        return user;
    }

    async myProfile(id: string) {
        const user = await this.authModel.findById(id,{password:0,phoneVerificationCode:0,emailVerificationCode:0,phoneVerificationCodeExpiry:0,emailVerificationCodeExpiry:0});
        return user;
    }
}