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

  it('should return all save job post', async () => {
    // const query = { search: '', page: 1, limit: 10 };
    const user: any = {
      id: 'UserId 1',
      email: 'User Email',
      role: 'User Role',
    };
    const saveJobsPosts = [
      {
        id: '1',
        jobPostId: 'Job Post Id 1',
        userId: 'User Id 1',
      },
    ];
    const total = 1;
    mockPrismaService.saveJobPost.findMany.mockResolvedValue(saveJobsPosts);
    mockPrismaService.saveJobPost.count.mockResolvedValue(total);

    const response = await service.findAll(user);
    expect(response).toEqual(
      new ApiSuccessResponse(true, 'Saved Job Post Data', {
        saveJobsPosts,
        total,
      }),
    );
  });

  it('should update save job post', async () => {
    const id: string = 'save job post id';
    const user: any = {
      id: 'UserId 1',
      email: 'User Email',
      role: 'User Role',
    };
    const updateDto: any = {
      jobPostId: 'JobPostId 1',
    };

    mockPrismaService.saveJobPost.findUnique.mockResolvedValue(id);
    mockPrismaService.saveJobPost.update.mockResolvedValue(updateDto);
    const response = await service.update(id, updateDto, user);

    expect(response).toEqual(
      new ApiSuccessResponse(
        true,
        'Save Job Post Updated Successfully',
        updateDto,
      ),
    );
  });

  it('should delete saved job post', async () => {
    const id: string = 'job post id 1';
    const user: any = {
      id: 'User Id 1',
      role: 'ADMIN',
      email: 'user email',
    };
    const deleteDto = {
      id: 'Save Job Post 1',
      jobPostId: 'Job Post Id 1',
      userId: 'User Id 1',
    };

    mockPrismaService.saveJobPost.findUnique.mockResolvedValue(id);
    mockPrismaService.saveJobPost.delete.mockResolvedValue(id);
    const response = await service.remove(id, user);
    expect(response).toEqual(
      new ApiSuccessResponse(true, 'Save Job Post Deleted Successfully', null),
    );
  });
});
