import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
declare const safeUserSelect: {
    readonly id: true;
    readonly email: true;
    readonly passwordHash: false;
    readonly phoneNumberEncrypted: false;
    readonly role: true;
    readonly status: true;
    readonly emailVerifiedAt: true;
    readonly phoneVerifiedAt: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type SafeUser = Prisma.UserGetPayload<{
    select: typeof safeUserSelect;
}>;
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<SafeUser | null>;
    findByIdWithHash(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailSafe(email: string): Promise<SafeUser | null>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<SafeUser>;
}
export {};
