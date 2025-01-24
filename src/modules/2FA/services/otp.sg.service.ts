import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';



@Injectable()
export class SnsServiceForSingapore {
  private readonly logger = new Logger(SnsServiceForSingapore.name);
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION_SINGAPORE,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  async sendSMSToSingapore(phoneNumber: string, message: string, senderId?: string): Promise<void> {
    try {

      const params: PublishCommandInput = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: process.env.AWS_SENDER_ID_SINGAPORE
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
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



