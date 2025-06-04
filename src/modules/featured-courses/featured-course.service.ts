import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFeaturedCourseDto, UpdateFeaturedCourseDto } from "./dto/featured-course.dto";
import { ApiSuccessResponse } from "src/common/api-response/api-success";
import { QueryFeaturedCourseDto } from "./dto/query-course.dto";
import { Auth, Prisma } from "@prisma/client";
import { getPaginationSkip, getPaginationTake } from "src/common/utils/common";

@Injectable()
export class FeaturedCourseService
{
    constructor(private readonly prismaService:PrismaService){}

    async create(body:CreateFeaturedCourseDto){
        const isExistingCourse = await this.prismaService.featuredCourse.findMany({
            where:{
                courseId:body.courseId
            }
        });
        console.log("existing course ", isExistingCourse);
        if(isExistingCourse.length > 0) throw new NotFoundException("Featured Course Already Exists!");
        const featuredCourse = await this.prismaService.featuredCourse.create({
            data:{
                courseId:body.courseId,
                endDate:body.endDate,
                startDate:body.startDate,
                priority:body.priority || 1,
                isActive:body.isActive
            },
            include:{
                course:true
            }
        })

        return new ApiSuccessResponse(
            true,
            "Course successfully featured",
            featuredCourse
        )

    }

    async findOne(id:string){
        const isExistingCourse = await this.prismaService.featuredCourse.findUnique({
            where:{
                id:id
            },
            include:{
                course:true
            }
        });
        if(!isExistingCourse) throw new NotFoundException("Featured Course Not Found!");

        return new ApiSuccessResponse(true, "Featured course retrieved", isExistingCourse)

    }

    async update(id:string, body:UpdateFeaturedCourseDto){
        const existingCourse = await this.prismaService.featuredCourse.findUnique({
            where:{
                id
            }
        });
        if(!existingCourse) throw new NotFoundException("Featured Course Not Found");

        const updatedFeaturedCourse = await this.prismaService.featuredCourse.update({
            where:{
                id
            },
            data:{
                ...body,
                endDate:body.endDate ? body.endDate : undefined,
            },
            include:{
                course:true
            }
        });

        return new ApiSuccessResponse(
            true,
            "Featured Course Updated",
            updatedFeaturedCourse
        );

    }

    async remove(id:string){
        const existingCourse = await this.prismaService.featuredCourse.findUnique({
            where:{
                id
            }
        });
        if(!existingCourse) throw new NotFoundException("Featured Course Not Found");

        await this.prismaService.featuredCourse.delete({
            where:{
                id
            }
        });

        return new ApiSuccessResponse(
            true,
            "Featured Course Updated",
            null
        )
    }

    private buildFeaturedCourseWhereClause(
        query: QueryFeaturedCourseDto,
      ): Prisma.FeaturedCourseWhereInput {
        const where: Prisma.FeaturedCourseWhereInput = {};
    
        if (query.isActive !== undefined) {
          where.isActive = query.isActive;
        }
    
        if (query.courseId) {
          where.courseId = query.courseId;
        }
    
        if (query.isActive === true) {
          const now = new Date().toISOString();
          where.isActive = true;
          where.startDate = { lte: now } as Prisma.DateTimeFilter;
          where.endDate = { gte: now } as Prisma.DateTimeFilter;
        }
    
        return where;
      }
    
    private builderFeaturedCourseOrderBy(
        sort?: string,
      ): Prisma.FeaturedCourseOrderByWithRelationInput {
        if (!sort) return { priority: 'desc' };
    
        const [field, order] = sort.split(':');
        const validFields = [
          'priority',
          'createdAt',
          'endDate',
          'impressions',
          'clicks',
        ];
        const validOrders = ['asc', 'desc'];
    
        if (validFields.includes(field) && validOrders.includes(order)) {
          return {
            [field]: order as 'asc' | 'desc',
          };
        }
    
        return { priority: 'desc' };
      }
    

    async findAll(query:QueryFeaturedCourseDto, user?:Auth){
        const where = this.buildFeaturedCourseWhereClause(query);
        const [featuredCourse, total] = await Promise.all([
                this.prismaService.featuredCourse.findMany({
                    where,
                    include: {
                      course: {
                        include: {
                          courseDetails:{
                            include:{
                                file:true
                            }
                          },
                          courseAcademy:{
                            include:{
                                provider:{
                                    include:{
                                        venueBasicDetails:true,
                                        logo:true
                                    }
                                }
                            }
                          },
                          courseTypeAndLocation:true,
                          courseApplications:{
                            where:{
                                userId:user?.id
                            }
                          },
                          saveCourses:{
                            where:{
                                userId:user?.id
                            }
                          }
                    
                          },

                        },
                      },
                      skip: getPaginationSkip(query.page, query.limit),
                      take: getPaginationTake(query.limit),
                      orderBy: this.builderFeaturedCourseOrderBy(query.sort),
                }),
                this.prismaService.featuredCourse.count({ where }),
        ]);

        return new ApiSuccessResponse(true, 'Featured course retrieved', {
              featuredCourse,
              total,
        });
    }
}
    


    
