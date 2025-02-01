import { Test, TestingModule } from '@nestjs/testing';
import { JobbasicinfoController } from './jobbasicinfo.controller';
import { JobbasicinfoService } from './jobbasicinfo.service';

describe('JobbasicinfoController', () => {
  let controller: JobbasicinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobbasicinfoController],
      providers: [JobbasicinfoService],
    }).compile();

    controller = module.get<JobbasicinfoController>(JobbasicinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
