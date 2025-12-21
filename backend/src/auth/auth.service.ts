import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  DataCredentials,
  DataTokens,
  PublicUser,
} from 'src/types/user-list.type';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    //private prisma: PrismaService,
    private userService: UsersService,
    private sessionService: SessionService,
  ) {}

  async signUp(dto: CreateUserDto): Promise<DataTokens> {
    const user = await this.userService.createUser(dto);

    const token = (await this.createUserSession(user.id)) as string;

    return { access_token: '', refresh_token: token };
  }

  async logIn(data: DataCredentials) {
    const user = await this.userService.findOne(data.email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
  async logOut() {}
  async refreshTokens() {}
}
