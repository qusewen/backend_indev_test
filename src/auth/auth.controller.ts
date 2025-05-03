import {Controller, Post, Body, UnauthorizedException, Res, Req} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './login.dto';
import {UserService} from "../user/user.service";
import { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !(await this.userService.validatePassword(loginDto.password, user.password))) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const accessToken = this.authService.generateAccessToken(user);
        const refreshToken = this.authService.generateRefreshToken(user);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/auth/refresh'
        });

        res.json({ accessToken, refreshToken });
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token отсутствует');
        }

        const newTokens = await this.authService.refreshAccessToken(refreshToken);
        if (!newTokens) {
            throw new UnauthorizedException('Не валидный refresh токен');
        }

        res.cookie('access_token', newTokens.accessToken, { httpOnly: true, secure: true });
        res.cookie('refresh_token', newTokens.refreshToken, { httpOnly: true, secure: true, path: '/auth/refresh' });
        res.json(newTokens);
    }


}
