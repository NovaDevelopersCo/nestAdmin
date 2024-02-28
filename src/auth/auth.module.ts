import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../models/user.model';
import { Session } from '../models/session.model'; // Assuming the path is correct

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User, Session]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '30s', // Adjust as needed
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAuthGuard],
})
export class AuthModule {}
