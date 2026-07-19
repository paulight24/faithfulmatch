import { ReportStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateReportDto, ModerationActionDto, RejectPhotoDto } from './dto/moderation.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listReports(status?: ReportStatus, page?: number, limit?: number): Promise<{
        reports: ({
            reported: {
                id: string;
                email: string;
                status: import(".prisma/client").$Enums.UserStatus;
                profile: {
                    firstName: string;
                };
            };
            reporter: {
                id: string;
                email: string;
                profile: {
                    firstName: string;
                };
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ReportStatus;
            createdAt: Date;
            messageId: string | null;
            reason: string;
            details: string | null;
            reviewedAt: Date | null;
            reportedUserId: string;
            reporterUserId: string;
        })[];
        total: number;
        page: number;
        pages: number;
    }>;
    updateReport(adminId: string, reportId: string, dto: UpdateReportDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        messageId: string | null;
        reason: string;
        details: string | null;
        reviewedAt: Date | null;
        reportedUserId: string;
        reporterUserId: string;
    }>;
    applyModerationAction(adminId: string, dto: ModerationActionDto): Promise<{
        message: string;
        newStatus: import(".prisma/client").$Enums.UserStatus;
        suspendedUntil: Date;
    }>;
    listUsers(search?: string, status?: UserStatus, page?: number, limit?: number): Promise<{
        users: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            profile: {
                firstName: string;
                profileCompletionPercent: number;
                visibilityStatus: import(".prisma/client").$Enums.ProfileVisibilityStatus;
            };
        }[];
        total: number;
        page: number;
        pages: number;
    }>;
    getPendingPhotos(page?: number, limit?: number): Promise<{
        photos: ({
            user: {
                id: string;
                email: string;
                profile: {
                    firstName: string;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            url: string;
            storageKey: string;
            storageProvider: string;
            mimeType: string | null;
            sizeBytes: number | null;
            sortOrder: number;
            isPrimary: boolean;
            moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
            rejectionReason: string | null;
        })[];
        total: number;
        page: number;
        pages: number;
    }>;
    approvePhoto(adminId: string, photoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        url: string;
        storageKey: string;
        storageProvider: string;
        mimeType: string | null;
        sizeBytes: number | null;
        sortOrder: number;
        isPrimary: boolean;
        moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
        rejectionReason: string | null;
    }>;
    rejectPhoto(adminId: string, photoId: string, dto: RejectPhotoDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        url: string;
        storageKey: string;
        storageProvider: string;
        mimeType: string | null;
        sizeBytes: number | null;
        sortOrder: number;
        isPrimary: boolean;
        moderationStatus: import(".prisma/client").$Enums.PhotoModerationStatus;
        rejectionReason: string | null;
    }>;
    getDashboardStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        pendingReports: number;
        pendingPhotos: number;
        totalMatches: number;
    }>;
    private refreshProfileCompletion;
}
