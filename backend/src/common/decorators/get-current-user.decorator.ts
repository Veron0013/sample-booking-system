import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtData } from 'src/types/auth.type';

export const GetCurrentUser = createParamDecorator(
  (key: keyof JwtData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtData }>();

    return key ? request.user[key] : request.user;
  },
);
