import { Test, TestingModule } from '@nestjs/testing';
import { AgencyJobDescriptionController } from './agency-job-description.controller';
import { AgencyJobDescriptionService } from './agency-job-description.service';

describe('AgencyJobDescriptionController', () => {
  let controller: AgencyJobDescriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgencyJobDescriptionController],
      providers: [AgencyJobDescriptionService],
    }).compile();

    controller = module.get<AgencyJobDescriptionController>(AgencyJobDescriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
