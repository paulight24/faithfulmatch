"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const email_provider_interface_1 = require("../../infrastructure/email/email-provider.interface");
const facebook_oauth_verifier_1 = require("./facebook-oauth.verifier");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, users, jwt, config, email, facebookVerifier) {
        this.prisma = prisma;
        this.users = users;
        this.jwt = jwt;
        this.config = config;
        this.email = email;
        this.facebookVerifier = facebookVerifier;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const email = dto.email.toLowerCase().trim();
        const existing = await this.users.findByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { email, passwordHash, status: client_1.UserStatus.PENDING_VERIFICATION },
            select: { id: true, email: true, status: true, createdAt: true },
        });
        const { plainToken, tokenHash } = this.generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.prisma.emailVerificationToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
        });
        await this.writeAuditLog(user.id, 'USER_REGISTERED');
        await this.sendVerificationEmail(email, plainToken);
        this.logger.log(`New user registered: ${email}`);
        return {
            message: 'Account created. Please check your email to verify your account.',
            email: user.email,
        };
    }
    async verifyEmail(token) {
        const tokenHash = this.hashToken(token);
        const record = await this.prisma.emailVerificationToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!record || record.consumedAt || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('This verification link is invalid or has expired.');
        }
        await this.prisma.$transaction([
            this.prisma.emailVerificationToken.update({
                where: { id: record.id },
                data: { consumedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: record.userId },
                data: { status: client_1.UserStatus.ACTIVE, emailVerifiedAt: new Date() },
            }),
        ]);
        await this.writeAuditLog(record.userId, 'EMAIL_VERIFIED');
        this.logger.log(`Email verified for user: ${record.user.email}`);
        return { message: 'Email verified successfully. You can now sign in.' };
    }
    async login(dto, ipAddress, userAgent) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.users.findByEmail(email);
        if (!user || !user.passwordHash) {
            await bcrypt.hash('dummy_to_prevent_timing_attack', 12);
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (user.status === client_1.UserStatus.PENDING_VERIFICATION) {
            throw new common_1.UnauthorizedException('Please verify your email address before signing in.');
        }
        if (user.status === client_1.UserStatus.SUSPENDED) {
            throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
        }
        if (user.status === client_1.UserStatus.DELETED) {
            throw new common_1.UnauthorizedException('This account no longer exists.');
        }
        const tokens = await this.issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
        await this.writeAuditLog(user.id, 'USER_LOGIN', { ipAddress });
        return tokens;
    }
    async refresh(dto, ipAddress, userAgent) {
        const tokenHash = this.hashToken(dto.refreshToken);
        const session = await this.prisma.userSession.findFirst({
            where: { refreshTokenHash: tokenHash, revokedAt: null },
            include: { user: { select: { id: true, email: true, role: true, status: true } } },
        });
        if (!session || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Session expired. Please sign in again.');
        }
        if (session.user.status === client_1.UserStatus.SUSPENDED ||
            session.user.status === client_1.UserStatus.DELETED) {
            throw new common_1.UnauthorizedException('Account access has been revoked.');
        }
        await this.prisma.userSession.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
        });
        const tokens = await this.issueTokens(session.user.id, session.user.email, session.user.role, ipAddress, userAgent);
        return tokens;
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prisma.userSession.updateMany({
            where: { refreshTokenHash: tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        return { message: 'Signed out successfully.' };
    }
    async facebookLogin(accessToken, ipAddress, userAgent) {
        const result = await this.facebookVerifier.verifyToken(accessToken);
        if (!result.email) {
            throw new common_1.BadRequestException('Please grant Facebook permission to share your email address, or sign up with email instead.');
        }
        const existingLink = await this.prisma.socialAccount.findUnique({
            where: { provider_providerAccountId: { provider: 'facebook', providerAccountId: result.providerAccountId } },
            include: { user: true },
        });
        if (existingLink) {
            const { user } = existingLink;
            if (user.status === client_1.UserStatus.SUSPENDED) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            if (user.status === client_1.UserStatus.DELETED) {
                throw new common_1.UnauthorizedException('This account no longer exists.');
            }
            const tokens = await this.issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
            await this.writeAuditLog(user.id, 'FACEBOOK_LOGIN', { ipAddress });
            return { ...tokens, isNewUser: false };
        }
        const email = result.email.toLowerCase().trim();
        const existingUser = await this.users.findByEmail(email);
        if (existingUser) {
            if (existingUser.status === client_1.UserStatus.SUSPENDED) {
                throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
            }
            if (existingUser.status === client_1.UserStatus.DELETED) {
                throw new common_1.UnauthorizedException('This account no longer exists.');
            }
            await this.prisma.socialAccount.create({
                data: { userId: existingUser.id, provider: 'facebook', providerAccountId: result.providerAccountId, email },
            });
            if (!existingUser.emailVerifiedAt) {
                await this.prisma.user.update({
                    where: { id: existingUser.id },
                    data: { status: client_1.UserStatus.ACTIVE, emailVerifiedAt: new Date() },
                });
            }
            const tokens = await this.issueTokens(existingUser.id, existingUser.email, existingUser.role, ipAddress, userAgent);
            await this.writeAuditLog(existingUser.id, 'FACEBOOK_ACCOUNT_LINKED', { ipAddress });
            return { ...tokens, isNewUser: false };
        }
        const firstName = result.name?.split(' ')[0];
        const user = await this.prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: { email, passwordHash: null, status: client_1.UserStatus.ACTIVE, emailVerifiedAt: new Date() },
            });
            await tx.socialAccount.create({
                data: { userId: created.id, provider: 'facebook', providerAccountId: result.providerAccountId, email },
            });
            await tx.profile.create({ data: { userId: created.id, firstName } });
            return created;
        });
        const tokens = await this.issueTokens(user.id, user.email, user.role, ipAddress, userAgent);
        await this.writeAuditLog(user.id, 'FACEBOOK_ACCOUNT_CREATED', { ipAddress });
        this.logger.log(`New user registered via Facebook: ${email}`);
        return { ...tokens, isNewUser: true };
    }
    async facebookDisconnect(userId) {
        const [user, link] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } }),
            this.prisma.socialAccount.findFirst({ where: { userId, provider: 'facebook' } }),
        ]);
        if (!link) {
            throw new common_1.BadRequestException('No Facebook account is connected.');
        }
        if (!user?.passwordHash) {
            throw new common_1.BadRequestException('Set a password first (use "Forgot password?") so you can still sign in after disconnecting Facebook.');
        }
        await this.prisma.socialAccount.delete({ where: { id: link.id } });
        await this.writeAuditLog(userId, 'FACEBOOK_DISCONNECTED');
        return { message: 'Facebook account disconnected.' };
    }
    async getSocialProviders(userId) {
        const links = await this.prisma.socialAccount.findMany({
            where: { userId },
            select: { provider: true, createdAt: true },
        });
        return links;
    }
    async forgotPassword(dto) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.users.findByEmail(email);
        const successMsg = {
            message: 'If an account with that email exists, a password reset link has been sent.',
        };
        if (!user || user.status === client_1.UserStatus.DELETED)
            return successMsg;
        const { plainToken, tokenHash } = this.generateToken();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
        });
        await this.writeAuditLog(user.id, 'PASSWORD_RESET_REQUESTED');
        await this.sendPasswordResetEmail(email, plainToken);
        return successMsg;
    }
    async resetPassword(dto) {
        const tokenHash = this.hashToken(dto.token);
        const record = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        });
        if (!record || record.consumedAt || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('This reset link is invalid or has expired.');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.$transaction([
            this.prisma.passwordResetToken.update({
                where: { id: record.id },
                data: { consumedAt: new Date() },
            }),
            this.prisma.user.update({
                where: { id: record.userId },
                data: { passwordHash },
            }),
            this.prisma.userSession.updateMany({
                where: { userId: record.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        await this.writeAuditLog(record.userId, 'PASSWORD_RESET_COMPLETED');
        return { message: 'Password updated successfully. Please sign in with your new password.' };
    }
    async issueTokens(userId, email, role, ipAddress, userAgent) {
        const accessToken = this.jwt.sign({ sub: userId, email, role }, {
            secret: this.config.get('jwt.accessSecret'),
            expiresIn: (this.config.get('jwt.accessExpiresIn') ?? '15m'),
        });
        const { plainToken: refreshToken, tokenHash: refreshTokenHash } = this.generateToken();
        const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn') ?? '7d';
        const expiresAt = new Date(Date.now() + this.parseDuration(refreshExpiresIn));
        await this.prisma.userSession.create({
            data: { userId, refreshTokenHash, ipAddress, userAgent, expiresAt },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 15 * 60,
        };
    }
    async deleteAccount(userId) {
        await this.prisma.$transaction(async (tx) => {
            await tx.userSession.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
            await tx.profile.updateMany({
                where: { userId },
                data: {
                    firstName: null,
                    displayName: 'Deleted User',
                    bio: null,
                    occupation: null,
                    city: null,
                    state: null,
                    country: null,
                    zip: null,
                    visibilityStatus: 'HIDDEN',
                },
            });
            await tx.user.update({
                where: { id: userId },
                data: {
                    status: client_1.UserStatus.DELETED,
                    email: `deleted_${userId}@faithfulmatch.love`,
                    passwordHash: null,
                },
            });
        });
        await this.writeAuditLog(userId, 'ACCOUNT_DELETED');
        return { message: 'Your account has been deleted.' };
    }
    async requestOwnAccountDeletion(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.status === client_1.UserStatus.DELETED) {
            return AuthService_1.DELETION_SUCCESS_MSG;
        }
        await this.recordDeletionRequest(user.id, user.email);
        return AuthService_1.DELETION_SUCCESS_MSG;
    }
    async requestAccountDeletionByEmail(dto) {
        const email = dto.email.toLowerCase().trim();
        const user = await this.users.findByEmail(email);
        if (!user || user.status === client_1.UserStatus.DELETED) {
            return AuthService_1.DELETION_SUCCESS_MSG;
        }
        await this.recordDeletionRequest(user.id, user.email);
        return AuthService_1.DELETION_SUCCESS_MSG;
    }
    async recordDeletionRequest(userId, email) {
        await this.writeAuditLog(userId, 'ACCOUNT_DELETION_REQUESTED');
        const supportEmail = this.config.get('supportEmail') ?? 'support@faithfulmatch.love';
        await this.email.sendEmail({
            to: supportEmail,
            subject: 'Account deletion request',
            html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
          <h2 style="color:#332E81;font-size:20px;">Deletion request received</h2>
          <p style="color:#667085;line-height:1.6;">
            User <strong>${email}</strong> (id: ${userId}) has requested their account and data be deleted.
            Please review for open reports, pending refunds, or safety flags, then process via the
            admin deletion tool within 30 days.
          </p>
        </div>
      `,
            text: `User ${email} (id: ${userId}) has requested account deletion. Review and process within 30 days.`,
        });
        await this.email.sendEmail({
            to: email,
            subject: "We've received your deletion request",
            html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
          <h2 style="color:#332E81;font-size:24px;margin-bottom:8px;">Deletion request received</h2>
          <p style="color:#667085;line-height:1.6;">
            We've received your request to delete your FaithfulMatch.love account and data.
            Our team will review and complete this within 30 days — you'll get a confirmation
            email once it's done.
          </p>
          <p style="color:#667085;line-height:1.6;">
            Changed your mind? Just reply to this email or contact
            <a href="mailto:${supportEmail}" style="color:#6D4AFF;">${supportEmail}</a> to cancel the request.
          </p>
        </div>
      `,
            text: `We've received your request to delete your FaithfulMatch.love account. `
                + `We'll process it within 30 days. Contact ${supportEmail} to cancel.`,
        });
    }
    generateToken() {
        const plainToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(plainToken);
        return { plainToken, tokenHash };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    parseDuration(duration) {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match)
            return 7 * 24 * 60 * 60 * 1000;
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return value * (multipliers[unit] ?? 1000);
    }
    async writeAuditLog(userId, action, metadata) {
        try {
            await this.prisma.auditLog.create({
                data: { userId, action, metadata: metadata },
            });
        }
        catch {
            this.logger.warn(`Failed to write audit log: ${action}`);
        }
    }
    async sendVerificationEmail(email, token) {
        const appUrl = this.config.get('appUrl') ?? 'http://localhost:4200';
        const verifyUrl = `${appUrl}/auth/verify-email?token=${token}`;
        await this.email.sendEmail({
            to: email,
            subject: 'Verify your FaithfulMatch.love account',
            html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
          <h2 style="color:#332E81;font-size:24px;margin-bottom:8px;">Welcome to FaithfulMatch.love</h2>
          <p style="color:#667085;line-height:1.6;">
            Thank you for joining. Please verify your email address to activate your account.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;margin:24px 0;padding:16px 32px;background:linear-gradient(135deg,#332E81,#6D4AFF);
                    color:#fff;text-decoration:none;border-radius:24px;font-weight:600;">
            Verify Email Address
          </a>
          <p style="color:#667085;font-size:14px;">
            This link expires in 24 hours. If you did not create an account, please ignore this email.
          </p>
        </div>
      `,
            text: `Verify your FaithfulMatch.love account: ${verifyUrl}\n\nThis link expires in 24 hours.`,
        });
    }
    async sendPasswordResetEmail(email, token) {
        const appUrl = this.config.get('appUrl') ?? 'http://localhost:4200';
        const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
        await this.email.sendEmail({
            to: email,
            subject: 'Reset your FaithfulMatch.love password',
            html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;">
          <h2 style="color:#332E81;font-size:24px;margin-bottom:8px;">Password Reset</h2>
          <p style="color:#667085;line-height:1.6;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;margin:24px 0;padding:16px 32px;background:linear-gradient(135deg,#332E81,#6D4AFF);
                    color:#fff;text-decoration:none;border-radius:24px;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#667085;font-size:14px;">
            This link expires in 1 hour. If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `,
            text: `Reset your FaithfulMatch.love password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        });
    }
};
exports.AuthService = AuthService;
AuthService.DELETION_SUCCESS_MSG = {
    message: "If an account with that email exists, we've received your deletion request. " +
        "We'll process it within 30 days and email you once it's complete.",
};
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(email_provider_interface_1.EMAIL_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService, Object, facebook_oauth_verifier_1.FacebookOAuthVerifier])
], AuthService);
//# sourceMappingURL=auth.service.js.map