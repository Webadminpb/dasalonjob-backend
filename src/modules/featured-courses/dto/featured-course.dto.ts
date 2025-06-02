import { createZodDto } from "nestjs-zod";
import {z} from "zod";

export const featuredCourseSchema = z.object({
    courseId:z.string(),
    startDate:z.string().datetime(),
    endDate:z.string().datetime(),
    priority:z.number().int().min(1).max(10).optional(),
    isActive:z.boolean().optional()
})

export class CreateFeaturedCourseDto extends createZodDto(featuredCourseSchema){}
export class UpdateFeaturedCourseDto extends createZodDto(featuredCourseSchema.partial()){}