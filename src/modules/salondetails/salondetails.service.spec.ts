import { Test, TestingModule } from '@nestjs/testing';
import { SalondetailsService } from './salondetails.service';

describe('SalondetailsService', () => {
  let service: SalondetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalondetailsService],
    }).compile();

    service = module.get<SalondetailsService>(SalondetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
