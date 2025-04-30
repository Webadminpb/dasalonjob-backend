import { Test, TestingModule } from '@nestjs/testing';
import { SaveJobPostService } from './save-job-post.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Search } from '@nestjs/common';

const mockPrismaService = {
  saveJobPost: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SaveJobPostService', () => {
  let service: SaveJobPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveJobPostService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SaveJobPostService>(SaveJobPostService);
  });

  it('should be defiend', () => {
    expect(service).toBeDefined();
  });

  it('should create a save job post', async () => {
    const user: any = {
      id: 'UserId 1',
      email: 'User Email',
      role: 'User Role',
    };
    const createDto = {
      jobPostId: 'JobPostId 1',
    };
    const result = { id: '1', ...createDto };
    mockPrismaService.saveJobPost.create.mockResolvedValue(result);
    const response = await service.create(createDto, user);
    expect(response).toEqual(
      new ApiSuccessResponse(
        true,
        'Save Job Post Created Successfully',
        result,
      ),
    );
  });

  it('should return all save job post', async() =>{
    const query = {Search}
  });
});
