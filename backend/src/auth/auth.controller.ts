import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signIn() {
    return this.authService.signIn();
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
