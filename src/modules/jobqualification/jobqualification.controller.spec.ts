import { Test, TestingModule } from '@nestjs/testing';
import { JobqualificationController } from './jobqualification.controller';
import { JobqualificationService } from './jobqualification.service';

describe('JobqualificationController', () => {
  let controller: JobqualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobqualificationController],
      providers: [JobqualificationService],
    }).compile();

    controller = module.get<JobqualificationController>(JobqualificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
