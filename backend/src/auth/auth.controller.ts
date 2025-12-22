import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { DataCredentials } from 'src/types/auth.type';
import { User } from 'generated/prisma/client';
import { RtGuard } from './guards';
import { GetCurrentUser, Public } from 'src/common/decorators';

interface refreshToken {
  refresh_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateUserDto) {
    await this.authService.signUp(dto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  logIn(@Body() dataCredentials: DataCredentials) {
    return this.authService.logIn(dataCredentials);
  }

  //@UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUser('userId') userId: User['id']) {
    if (!userId) throw new UnauthorizedException('Auth failed');
    return this.authService.logOut(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('userId') userId: User['id'],
    @Body() refreshToken: refreshToken,
  ) {
    if (!userId || !refreshToken.refresh_token)
      throw new UnauthorizedException('Auth failed');
    return this.authService.refreshTokens(userId, refreshToken.refresh_token);
  }
}
