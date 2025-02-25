import { Test, TestingModule } from '@nestjs/testing';
import { CourseDetailsService } from './course-details.service';

describe('CourseDetailsService', () => {
  let service: CourseDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseDetailsService],
    }).compile();

    service = module.get<CourseDetailsService>(CourseDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
