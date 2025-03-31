import { createZodDto } from 'nestjs-zod';
import { AgencyTeamMemberSchema } from './create-agency-team-member.dto';

export class UpdateAgencyTeamMemberDto extends createZodDto(
  AgencyTeamMemberSchema.partial(),
) {}
