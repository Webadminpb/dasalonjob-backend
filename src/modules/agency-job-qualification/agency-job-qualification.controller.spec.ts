import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobQualificationController } from './agency-job-qualification.controller';
import { AgencyJobQualificationService } from './agency-job-qualification.service';

describe('AgencyJobQualificationController', () => {
  let controller: AgencyJobQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyJobQualificationController],
      providers: [AgencyJobQualificationService],
    }).compile();

    controller = module.get<AgencyJobQualificationController>(AgencyJobQualificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
