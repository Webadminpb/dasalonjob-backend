import { Test, TestingModule } from '@nestjs/testing';
import { BasicdetailsService } from './basicdetails.service';

describe('BasicdetailsService', () => {
  let service: BasicdetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicdetailsService],
    }).compile();

    service = module.get<BasicdetailsService>(BasicdetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
