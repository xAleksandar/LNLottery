import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User.model';
import { Model } from 'mongoose';
import { Messages } from '../messages';
import { MONGO_ID_LENGTH } from 'src/constants';
import { MongoModels } from 'src/models/models.enum';
import { encryptPassword } from 'src/helpers/password.helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      throw new BadRequestException(Messages.commonUserExistsByEmail(email));
    }

    const userByUsername = await this.userModel.findOne({ username }).exec();
    if (userByUsername) {
      throw new BadRequestException(
        Messages.commonUserExistsByUsername(username),
      );
    }

    const hashedPassowrd = await encryptPassword(password);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassowrd,
    });

    const result = await newUser.save();
    return result.id as string;
  }

  async getUserById(userId: string): Promise<User> {
    if (userId.length !== MONGO_ID_LENGTH) {
      throw new BadRequestException(
        Messages.commonUserIdLengthError(MONGO_ID_LENGTH),
      );
    }
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(Messages.commonUserNotFoundById(userId));
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(Messages.commonUserNotFoundByEmail(email));
    }
    return user;
  }
}
