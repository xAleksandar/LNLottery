import { Param, Get, Post, Body, Controller } from '@nestjs/common';
import { userRoutes } from '../routes/users.routes';
import { UsersService } from './users.service';
import { User } from '../models/User.model';

@Controller(userRoutes.main)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(userRoutes.createNewUser)
  async createNewUser(@Body('userData') userData: User) {
    const { username, email, password } = userData;
    return await this.usersService.createUser(username, email, password);
  }

  @Get(userRoutes.userId)
  async getUserById(@Param('id') userId: string): Promise<User> {
    return await this.usersService.getUserById(userId);
  }
}
