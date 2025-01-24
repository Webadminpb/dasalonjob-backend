
import { Body, Controller, Get, Post } from "@nestjs/common";
import { EmailService, SnsServiceForIndia } from "../services";
import { SnsServiceForSingapore } from "../services";

@Controller('otp')
export class OtpController {
    constructor(private readonly emailService: EmailService,private readonly awsPinpointService: SnsServiceForSingapore,private readonly awsPinpointServiceForIndia: SnsServiceForIndia) {}

    @Post('send-email')
    async sendEmail(@Body() body: any) {
        return this.emailService.sendEmail("svikasswami03@gmail.com", "Test Email", "This is a test email");
    }

    @Get('send-sms')
    async sendSms() {
        return this.awsPinpointServiceForIndia.sendSMSToIndia("+919992492168", 
            "Your One-Time Password (OTP) for da Salon is 123456. Please use this code to verify your mobile number on platform");
    }
}   