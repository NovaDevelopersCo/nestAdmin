import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Ваш секретный ключ для подписи токенов
    });
  }

  async validate(payload: any) {
    // В этом методе можно провести дополнительные проверки, например, проверку в базе данных
    return { userId: payload.sub, username: payload.username };
  }
}
