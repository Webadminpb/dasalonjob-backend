import { Test, TestingModule } from '@nestjs/testing';
import { CourseAcademyService } from './course-academy.service';

describe('CourseAcademyService', () => {
  let service: CourseAcademyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseAcademyService],
    }).compile();

    service = module.get<CourseAcademyService>(CourseAcademyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
