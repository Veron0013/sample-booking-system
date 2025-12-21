import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtData, JwtPayload } from 'src/types/auth.type';

@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('AT_JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtData {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
