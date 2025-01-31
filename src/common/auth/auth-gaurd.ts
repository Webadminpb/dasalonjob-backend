import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import * as dotenv from 'dotenv';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    await this.authenticateUser(req);
    return await this.authorizeUser(req, context);
  }

  private async authenticateUser(req: any): Promise<void> {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No Token Provided.');
    }

    try {
      const user = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = user;
    } catch (error) {
      console.error('Token validation error: ', error);
    }

    if (!req.user) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private async authorizeUser(
    req: any,
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.getMetadata<Role[]>('roles', context);
    const userRole: Role = req.user.role || 'USER';
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (userRole === 'USER') {
      const user = await this.prisma.auth.findFirst({
        where: {
          id: req.user.id,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid Client id.');
      }
      if (user.role != 'USER') {
        throw new UnauthorizedException('Inavlid client role');
      }
      req.user = user;
    }

    if (userRole === 'ADMIN') {
      const admin = await this.prisma.auth.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!admin) {
        throw new UnauthorizedException('Invalid Admin id.');
      }
      if (admin.role != 'ADMIN') {
        throw new UnauthorizedException('Inavlid admin role');
      }
      req.admin = admin;
    }

    if (userRole === 'SUPER_ADMIN') {
      const superAdmin = await this.prisma.auth.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!superAdmin) {
        throw new UnauthorizedException('Invalid SuperAdmin id.');
      }
      if (superAdmin.role != 'SUPER_ADMIN') {
        throw new UnauthorizedException('Inavlid superAdmin role');
      }
      req.superAdmin = superAdmin;
    }

    if (userRole === 'AGENCY') {
      const agency = await this.prisma.auth.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!agency) {
        throw new UnauthorizedException('Invalid Agency id.');
      }
      if (agency.role != 'AGENCY') {
        throw new UnauthorizedException('Inavlid agency role');
      }
      req.agency = agency;
    }

    if (userRole === 'PARTNER') {
      const partner = await this.prisma.auth.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (!partner) {
        throw new UnauthorizedException('Invalid Partner id.');
      }
      if (partner.role != 'PARTNER') {
        throw new UnauthorizedException('Inavlid partner role');
      }
      req.partner = partner;
    }
    return requiredRoles.includes(userRole);
  }

  private getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
