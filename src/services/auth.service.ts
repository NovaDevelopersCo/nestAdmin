import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { Session, SessionDocument } from '../schemas/session.schema';
import { TokenService } from './TokenService';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.userModel.findOne({ login });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const userDto = new UserDto(user);

    const tokens = this.tokenService.generateTokens(userDto);

    await this.tokenService.saveToken(tokens.refreshToken, user._id);

    return { tokens, user: userDto };
  }

  async registration(login: string, password: string) {
    const usersCount = await this.userModel.countDocuments();

    if (usersCount > 0) {
      throw new ConflictException(`Can't register more users`);
    }

    const hashPassword = await bcrypt.hash(password, 7);

    const newUser = new this.userModel({ login, password: hashPassword });

    await newUser.save();

    const userDto = new UserDto(newUser);

    const tokens = this.tokenService.generateTokens(userDto);

    await this.tokenService.saveToken(tokens.refreshToken, newUser._id);

    return { tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    const result = await this.sessionModel.deleteOne({ refreshToken });
    return result.deletedCount > 0;
  }
}
