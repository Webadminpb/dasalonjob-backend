import { Test, TestingModule } from '@nestjs/testing';
import { CourseApplicationController } from './course-application.controller';
import { CourseApplicationService } from './course-application.service';

describe('CourseApplicationController', () => {
  let controller: CourseApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseApplicationController],
      providers: [CourseApplicationService],
    }).compile();

    controller = module.get<CourseApplicationController>(CourseApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
