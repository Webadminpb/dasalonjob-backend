import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationController } from './job-applications.controller';
import { JobApplicationService } from './job-applications.service';

describe('JobApplicationsController', () => {
  let controller: JobApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationController],
      providers: [JobApplicationService],
    }).compile();

    controller = module.get<JobApplicationController>(JobApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
