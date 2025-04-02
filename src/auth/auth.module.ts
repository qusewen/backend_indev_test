import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import {AuthController} from "./auth.controller";
import 'dotenv/config';
import {JwtAuthGuard} from "./JwtAuthGuard";
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy} from "./jwt.strategy";
console.log('JWT_SECRET:', process.env.JWT_SECRET);
@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30m' },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthController],
    exports:[JwtAuthGuard]
})
export class AuthModule {}
