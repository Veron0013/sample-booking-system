import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtData, JwtPayload } from 'src/types/auth.type';

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: configService.getOrThrow<string>('RT_JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtData {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
