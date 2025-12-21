import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma/client';
import { SessionService } from 'src/session/session.service';
import { DataCredentials, DataToken } from 'src/types/auth.type';
import { PublicUser } from 'src/types/user.type';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { FIFTEEN_MINUTES, ONE_WEEK } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private userService: UsersService,
    private sessionService: SessionService,
  ) {}

  async initTokens(
    userId: User['id'],
    email: User['email'],
  ): Promise<DataToken> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.getOrThrow<string>('AT_JWT_SECRET'),
          expiresIn: FIFTEEN_MINUTES,
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.getOrThrow<string>('RT_JWT_SECRET'),
          expiresIn: ONE_WEEK,
        },
      ),
    ]);

    if (!access_token || !refresh_token)
      throw new ForbiddenException('Access denied');

    return { access_token, refresh_token };
  }

  async initTokensAndSession(user: PublicUser): Promise<DataToken> {
    const tokens = await this.initTokens(user.id, user.email);

    await this.sessionService.createUserSession(user.id, tokens.refresh_token);

    return tokens;
  }

  async signUp(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);

    return await this.initTokensAndSession(user);
  }

  async logIn(data: DataCredentials) {
    const user = await this.userService.getValidUser(data);
    //console.log('user', user);

    return await this.initTokensAndSession(user);
  }

  async logOut() {}
  async refreshTokens() {}
}
