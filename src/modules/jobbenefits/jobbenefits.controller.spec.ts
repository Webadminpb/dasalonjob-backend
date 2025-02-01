import { Test, TestingModule } from '@nestjs/testing';
import { JobbenefitsController } from './jobbenefits.controller';
import { JobbenefitsService } from './jobbenefits.service';

describe('JobbenefitsController', () => {
  let controller: JobbenefitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobbenefitsController],
      providers: [JobbenefitsService],
    }).compile();

    controller = module.get<JobbenefitsController>(JobbenefitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
