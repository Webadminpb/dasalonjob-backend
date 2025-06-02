import { Module } from "@nestjs/common";
import { FeaturedController } from "./featured-course.controller";
import { FeaturedCourseService } from "./featured-course.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[],
    controllers:[FeaturedController],
    providers:[FeaturedCourseService, PrismaService, JwtService]
})
export class FeaturedCourseModule {}