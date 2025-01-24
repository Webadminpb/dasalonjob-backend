import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';



@Injectable()
export class SnsServiceForIndia {
  private readonly logger = new Logger(SnsServiceForIndia.name);
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION_INDIA,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  async sendSMSToIndia(phoneNumber: string, message: string): Promise<void> {
    try {

      const params: PublishCommandInput = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: process.env.AWS_SENDER_ID_INDIA
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
          },
          'EntityId': { // Custom attribute without reserved prefix
            DataType: 'String',
            StringValue: "1201159264949937981",
          },
          'TemplateId': { // Custom attribute without reserved prefix
            DataType: 'String',
            StringValue: "1707170314233686817",
          },
        },
      };

      const command = new PublishCommand(params);
      const response = await this.snsClient.send(command);

      this.logger.log(`SMS sent successfully: ${JSON.stringify(response)}`);
    } catch (error) {
      this.logger.error('Failed to send SMS:', error);
      throw error;
    }
  }
}



