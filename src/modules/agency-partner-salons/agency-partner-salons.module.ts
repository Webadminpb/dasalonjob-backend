import { Module } from '@nestjs/common';
import { AgencyPartnerSalonsService } from './agency-partner-salons.service';
import { AgencyPartnerSalonsController } from './agency-partner-salons.controller';

@Module({
  controllers: [AgencyPartnerSalonsController],
  providers: [AgencyPartnerSalonsService],
})
export class AgencyPartnerSalonsModule {}
