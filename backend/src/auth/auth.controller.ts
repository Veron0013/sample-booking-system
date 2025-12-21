import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: CreateUserDto) {
    const { access_token, refresh_token } = await this.authService.signUp(dto);

    if (!access_token || !refresh_token)
      throw new ForbiddenException('Access denied');

    //cookies magic
  }

  @Post('/login')
  logIn() {
    return this.authService.logIn();
  }

  @Post('/logout')
  logOut() {
    return this.authService.logOut();
  }

  @Post('/refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
