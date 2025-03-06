import { Test, TestingModule } from '@nestjs/testing';
import { CourseApplicationService } from './course-application.service';

describe('CourseApplicationService', () => {
  let service: CourseApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseApplicationService],
    }).compile();

    service = module.get<CourseApplicationService>(CourseApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
