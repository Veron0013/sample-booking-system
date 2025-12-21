import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtJwtStrategy } from './strategies/at-strategy';
import { RtJwtStrategy } from './strategies/rt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService, AtJwtStrategy, RtJwtStrategy],
})
export class AuthModule {}
