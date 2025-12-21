import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtJwtStrategy } from './strategies/at-strategy';
import { RtJwtStrategy } from './strategies/rt-strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtJwtStrategy, RtJwtStrategy],
})
export class AuthModule {}
