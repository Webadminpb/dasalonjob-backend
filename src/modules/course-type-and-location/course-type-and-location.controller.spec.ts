import { Test, TestingModule } from '@nestjs/testing';
import { CourseTypeAndLocationController } from './course-type-and-location.controller';
import { CourseTypeAndLocationService } from './course-type-and-location.service';

describe('CourseTypeAndLocationController', () => {
  let controller: CourseTypeAndLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseTypeAndLocationController],
      providers: [CourseTypeAndLocationService],
    }).compile();

    controller = module.get<CourseTypeAndLocationController>(CourseTypeAndLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
