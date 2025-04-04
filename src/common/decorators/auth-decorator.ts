import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Auth, Role } from '@prisma/client';
import { AuthGaurd } from '../gaurds/auth-gaurd';

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGaurd));

export const GetUser = createParamDecorator<any>(
  async (data: unknown, context: ExecutionContext): Promise<any> => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as Auth;

    return user;
  },
);
