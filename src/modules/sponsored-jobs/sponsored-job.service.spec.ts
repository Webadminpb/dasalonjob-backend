import { Test, TestingModule } from '@nestjs/testing';
import { SponsoredJobService } from './sponsored-job-service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// describe('SponsoredJobService', () => {
//   let service: SponsoredJobService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         SponsoredJobService,
//         {
//           provide: PrismaService,
//           useValue: {
//             sponsoredJob: {
//               create: jest.fn(),
//               findUnique: jest.fn(),
//               update: jest.fn(),
//               findMany: jest.fn(),
//               delete: jest.fn(),
//             },
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<SponsoredJobService>(Spon)
//   });
// });
