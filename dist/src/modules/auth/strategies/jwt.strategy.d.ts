import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    status: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly users;
    constructor(config: ConfigService, users: UsersService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: "ACTIVE" | "PENDING_VERIFICATION";
        emailVerifiedAt: Date;
    }>;
}
export {};
