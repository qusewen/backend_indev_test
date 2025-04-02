import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    generateAccessToken(payload: { id: number; email: string }): string {
        return this.jwtService.sign({
            id: payload.id,
            email: payload.email,
        });
    }



    generateRefreshToken(user: Partial<User>): string {
        return this.jwtService.sign(
            { id: user.id, email: user.email, name: user.name },
            { expiresIn: '1d' },
        );
    }
    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_SECRET });
            const newAccessToken = this.generateAccessToken({ id: payload.id, email: payload.email });
            const newRefreshToken = this.generateRefreshToken({ id: payload.id, email: payload.email });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            console.error('Invalid refresh token:', error.message);
            return null;
        }
    }

}
