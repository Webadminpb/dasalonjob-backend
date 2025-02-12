import { PartialType } from '@nestjs/mapped-types';
import { CreateAgencyPartnerSalonDto } from './create-agency-partner-salon.dto';

export class UpdateAgencyPartnerSalonDto extends PartialType(CreateAgencyPartnerSalonDto) {}
