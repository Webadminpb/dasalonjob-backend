import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationMessageController } from './job-application-message.controller';
import { JobApplicationMessageService } from './job-application-message.service';

describe('JobApplicationMessageController', () => {
  let controller: JobApplicationMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationMessageController],
      providers: [JobApplicationMessageService],
    }).compile();

    controller = module.get<JobApplicationMessageController>(JobApplicationMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
