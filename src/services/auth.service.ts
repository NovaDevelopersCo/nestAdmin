import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';
import { TokenService } from './token.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Session) private readonly sessionModel: typeof Session,
    private readonly tokenService: TokenService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.userModel.findOne({ where: { login } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens(userDto);

    await this.tokenService.saveToken(tokens.refreshToken, user.id.toString());

    return { tokens, user: userDto };
  }

  async registration(login: string, password: string) {
    const existingUsersCount = await this.userModel.count();

    if (existingUsersCount > 0) {
      throw new ConflictException(`Can't register more users`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      login,
      password: hashPassword,
    });

    const userDto = new UserDto(newUser);
    const tokens = this.tokenService.generateTokens(userDto);

    await this.tokenService.saveToken(
      tokens.refreshToken,
      newUser.id.toString(),
    );

    return { tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    const result = await this.sessionModel.destroy({ where: { refreshToken } });
    return result > 0;
  }
}
