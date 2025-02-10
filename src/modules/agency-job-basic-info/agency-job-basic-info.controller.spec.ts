import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobBasicInfoController } from './agency-job-basic-info.controller';
import { AgencyJobBasicInfoService } from './agency-job-basic-info.service';

describe('AgencyJobBasicInfoController', () => {
  let controller: AgencyJobBasicInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyJobBasicInfoController],
      providers: [AgencyJobBasicInfoService],
    }).compile();

    controller = module.get<AgencyJobBasicInfoController>(AgencyJobBasicInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
