import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Catch,
  ArgumentsHost,
  HttpException,
  UseFilters, Get
} from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Catch(HttpException)
export class ApiExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.getResponse() as string;

    response.status(status).json({ message });
  }
}

@Controller('auth')
@UseFilters(ApiExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  async login(
    @Body() { login, password }: { login: string; password: string },
    @Res() res: Response,
  ) {
    if (!login || !password) {
      throw new BadRequestException('Пожалуйста, заполните все поля');
    }

    const { tokens, user } = await this.authService.login(login, password);

    this.setCookies(res, tokens);

    return res.json({ ...user });
  }

  @Post('registration')
  async registration(
    @Body() { login, password }: { login: string; password: string },
    @Res() res: Response,
  ) {
    if (!login || !password) {
      throw new BadRequestException('Пожалуйста, заполните все поля');
    }

    const { tokens, user } = await this.authService.registration(
      login,
      password,
    );

    this.setCookies(res, tokens);

    return res.json({ ...user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    const refreshToken = this.getRefreshToken(res);

    const result = await this.authService.logout(refreshToken);

    this.clearCookies(res);

    return res.json({ message: result });
  }

  @Post('refresh')
  async refresh(@Res() res: Response) {
    const refreshToken = this.getRefreshToken(res);

    const result = await this.tokenService.refresh(refreshToken);

    if (!result) {
      this.clearCookies(res);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Вы не авторизованы' });
    }

    this.setCookies(res, result.tokens);

    return res.json({ ...result.user });
  }

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, { maxAge: 1000 * 60 * 15 });
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken').clearCookie('refreshToken');
  }

  private getRefreshToken(res: Response): string {
    return res.locals.user?.refreshToken;
  }
  @Get('users')
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.authService.getAllUsers();
      return res.json(users);
    } catch (error) {
      throw new ApiExceptionFilter();
    }
  }
}
