import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Добавьте здесь свою логику проверки, если необходимо

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Вы можете добавить собственную обработку результатов аутентификации здесь
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
