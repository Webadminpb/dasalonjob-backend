import { PartialType } from '@nestjs/swagger';
import { CreateJobApplicationMessageDto } from './create-job-application-message.dto';

export class UpdateJobApplicationMessageDto extends PartialType(CreateJobApplicationMessageDto) {}
