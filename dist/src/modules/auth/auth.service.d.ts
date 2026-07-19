import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailProvider } from '../../infrastructure/email/email-provider.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestDeletionDto } from './dto/request-deletion.dto';
import { FacebookOAuthVerifier } from './facebook-oauth.verifier';
export declare class AuthService {
    private readonly prisma;
    private readonly users;
    private readonly jwt;
    private readonly config;
    private readonly email;
    private readonly facebookVerifier;
    private readonly logger;
    constructor(prisma: PrismaService, users: UsersService, jwt: JwtService, config: ConfigService, email: EmailProvider, facebookVerifier: FacebookOAuthVerifier);
    register(dto: RegisterDto): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    refresh(dto: RefreshTokenDto, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    facebookLogin(accessToken: string, ipAddress?: string, userAgent?: string): Promise<{
        isNewUser: boolean;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    facebookDisconnect(userId: string): Promise<{
        message: string;
    }>;
    getSocialProviders(userId: string): Promise<{
        createdAt: Date;
        provider: string;
    }[]>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private issueTokens;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    private static readonly DELETION_SUCCESS_MSG;
    requestOwnAccountDeletion(userId: string): Promise<{
        message: string;
    }>;
    requestAccountDeletionByEmail(dto: RequestDeletionDto): Promise<{
        message: string;
    }>;
    private recordDeletionRequest;
    private generateToken;
    private hashToken;
    private parseDuration;
    private writeAuditLog;
    private sendVerificationEmail;
    private sendPasswordResetEmail;
}
