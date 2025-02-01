import { Test, TestingModule } from '@nestjs/testing';
import { JobdescriptionController } from './jobdescription.controller';
import { JobdescriptionService } from './jobdescription.service';

describe('JobdescriptionController', () => {
  let controller: JobdescriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobdescriptionController],
      providers: [JobdescriptionService],
    }).compile();

    controller = module.get<JobdescriptionController>(JobdescriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
