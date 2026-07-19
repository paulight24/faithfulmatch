import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestDeletionDto } from './dto/request-deletion.dto';
import { FacebookLoginDto } from './dto/facebook-login.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refresh(dto: RefreshTokenDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    facebookLogin(dto: FacebookLoginDto, req: Request): Promise<{
        isNewUser: boolean;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    facebookDisconnect(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    socialProviders(user: {
        id: string;
    }): Promise<{
        createdAt: Date;
        provider: string;
    }[]>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    me(user: ReturnType<typeof CurrentUser>): ParameterDecorator;
    deleteAccount(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    requestOwnDeletion(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    requestDeletionByEmail(dto: RequestDeletionDto): Promise<{
        message: string;
    }>;
    deleteAccountPage(res: Response): void;
}
