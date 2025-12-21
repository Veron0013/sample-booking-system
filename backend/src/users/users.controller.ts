import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@UseGuards(AuthGuard)
  //@Get('me')
  //getMe(@Req() req) {
  //  return this.usersService.getPublicUser(req.user.sub);
  //}

  //@Post()
  //create(@Body() createUserDto: CreateUserDto) {
  //  return this.usersService.createUser(createUserDto);
  //}

  @Get()
  findAll(@Param('id') id: string, @Query() query: QueryUserDto) {
    return this.usersService.findAll(id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
