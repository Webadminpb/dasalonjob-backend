import { Test, TestingModule } from '@nestjs/testing';
import { PartnerPersonalDataController } from './partner-personal-data.controller';
import { PartnerPersonalDataService } from './partner-personal-data.service';

describe('PartnerPersonalDataController', () => {
  let controller: PartnerPersonalDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerPersonalDataController],
      providers: [PartnerPersonalDataService],
    }).compile();

    controller = module.get<PartnerPersonalDataController>(PartnerPersonalDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
