import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const accessToken = req.cookies['access_token'];

        if (!accessToken) {
            throw new UnauthorizedException('Токен отсутствует');
        }

        try {
            this.jwtService.verify(accessToken);
            return true;
        } catch (error) {
            throw new UnauthorizedException('Неверный токен');
        }
    }
}
