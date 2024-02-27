import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // Дополнительная проверка срока действия токена
    const tokenPayload = this.jwtService.decode(info.accessToken);
    if (!tokenPayload || tokenPayload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token has expired');
    }

    return user;
  }
}
