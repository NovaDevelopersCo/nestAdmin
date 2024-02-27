import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../schemas/user.schema';
import { Session, SessionDocument } from '../schemas/session.schema';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  generateTokens(user: UserDto) {
    const accessToken = this.jwtService.sign(user, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(user, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(token: string): Promise<string | null> {
    try {
      const { user } = this.jwtService.verify(token) as { user: UserDto };
      return user._id;
    } catch (e) {
      throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateRefreshToken(token: string): Promise<string | null> {
    try {
      const { user } = this.jwtService.verify(token) as { user: UserDto };
      return user._id;
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async saveToken(refreshToken: string, userId: string) {
    try {
      const session = await this.sessionModel.findOne({ user: userId });

      if (session) {
        session.refreshToken = refreshToken;
        return session.save();
      }

      const newSession = new this.sessionModel({
        user: userId,
        refreshToken,
      });

      return newSession.save();
    } catch (e) {
      throw new HttpException(
        'Error saving token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(token: string) {
    try {
      const userId = await this.validateRefreshToken(token);
      const tokenFromDb = await this.sessionModel.findOne({ refreshToken: token });

      if (!userId || !tokenFromDb) {
        throw new HttpException(
          'Invalid user or token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userDto = new UserDto(user);

      const tokens = this.generateTokens(userDto);

      await this.saveToken(tokens.refreshToken, user._id);

      return { tokens, user: userDto };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
