import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { AuthService } from '../services/auth.service';
import { Session, SessionModel } from '../schemas/session.schema';
import { User, UserModel } from '../schemas/user.schema';
import { TokenService } from '../services/TokenService';
import { AuthController } from '../controllers/auth.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot('MONGODB_CONNECTION_STRING'),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    TokenService,
    {
      provide: getModelToken(User.name),
      useValue: UserModel,
    },
    {
      provide: getModelToken(Session.name),
      useValue: SessionModel,
    },
  ],
})
export class AuthModule {}
