import { ReportStatus, UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { UpdateReportDto, ModerationActionDto, RejectPhotoDto } from './dto/moderation.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    stats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        pendingReports: number;
        pendingPhotos: number;
        totalMatches: number;
    }>;
    listReports(status?: ReportStatus, page?: number): Promise<{
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
    updateReport(user: RequestUser, reportId: string, dto: UpdateReportDto): Promise<{
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
    applyAction(user: RequestUser, dto: ModerationActionDto): Promise<{
        message: string;
        newStatus: import(".prisma/client").$Enums.UserStatus;
        suspendedUntil: Date;
    }>;
    listUsers(search?: string, status?: UserStatus, page?: number): Promise<{
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
    pendingPhotos(page?: number): Promise<{
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
    approvePhoto(user: RequestUser, photoId: string): Promise<{
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
    rejectPhoto(user: RequestUser, photoId: string, dto: RejectPhotoDto): Promise<{
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
}
