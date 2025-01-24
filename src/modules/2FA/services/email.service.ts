import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";
import { Injectable, Logger } from "@nestjs/common";


@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private pinpointClient: PinpointClient;
    constructor() {
        this.pinpointClient = new PinpointClient({
            region: process.env.AWS_REGION_INDIA,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        }); 
    }

    async sendEmail(email: string, subject: string, body: string): Promise<void> {
        const command = new SendMessagesCommand({
            ApplicationId: process.env.AWS_PINPOINT_APPLICATION_ID,
            MessageRequest: {
                Addresses: { [email]: { ChannelType: "EMAIL" } },
                MessageConfiguration: {
                    EmailMessage: {
                        Body:body,
                        FromAddress: "no-reply@dasalon.com",
                        ReplyToAddresses: ["no-reply@dasalon.com"],
                        SimpleEmail: {
                            Subject: {
                                Data: subject,
                            },
                            HtmlPart: {
                                Data: body,
                            },
                            TextPart: {
                                Data: body,
                            },
                        },
                    },
                },
            },
        });
        const response = await this.pinpointClient.send(command);
        this.logger.log(`Email sent successfully: ${JSON.stringify(response)}`);
    }
}