import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Session) private readonly sessionModel: typeof Session,
  ) {}

  generateTokens(user: UserDto) {
    const accessToken = this.jwtService.sign(user, { expiresIn: '30s' });
    const refreshToken = this.jwtService.sign(user, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async validateAccessToken(token: string): Promise<string | null> {
    try {
      const { user } = this.jwtService.verify(token) as { user: UserDto };
      return user.id.toString(); // Convert ID to string
    } catch (e) {
      throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateRefreshToken(token: string): Promise<string | null> {
    try {
      const { user } = this.jwtService.verify(token) as { user: UserDto };
      return user.id.toString(); // Convert ID to string
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async saveToken(refreshToken: string, userId: string) {
    try {
      const session = await this.sessionModel.findOne({ where: { userId } });

      if (session) {
        session.refreshToken = refreshToken;
        return session.save();
      }

      const newSession = await this.sessionModel.create({
        userId: +userId, // Преобразуем строку в число
        refreshToken,
      });

      return newSession;
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
      const tokenFromDb = await this.sessionModel.findOne({
        where: { refreshToken: token },
      });

      if (!userId || !tokenFromDb) {
        throw new HttpException(
          'Invalid user or token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.userModel.findByPk(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userDto = new UserDto(user);

      const tokens = this.generateTokens(userDto);

      await this.saveToken(tokens.refreshToken, userId);

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
