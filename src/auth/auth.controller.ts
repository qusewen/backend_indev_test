import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './login.dto';
import {UserService} from "../user/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user || !(await this.userService.validatePassword(loginDto.password, user.password))) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const accessToken = this.authService.generateAccessToken(user);
        const refreshToken = this.authService.generateRefreshToken(user);

        return { accessToken, refreshToken };
    }
    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
        if (!newAccessToken) {
            throw new UnauthorizedException('Не валидный refresh токер');
        }
        return { accessToken: newAccessToken };
    }
}
