import { Test, TestingModule } from '@nestjs/testing';
import { CourseAcademyController } from './course-academy.controller';
import { CourseAcademyService } from './course-academy.service';

describe('CourseAcademyController', () => {
  let controller: CourseAcademyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAcademyController],
      providers: [CourseAcademyService],
    }).compile();

    controller = module.get<CourseAcademyController>(CourseAcademyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
