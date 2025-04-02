import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return false; // Без токена доступ запрещён
        }

        try {
            const decodedToken = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = decodedToken; // Добавляем пользователя в запрос
            return true; // Авторизация прошла успешно
        } catch (error) {
            return false; // Токен невалиден
        }
    }
}
