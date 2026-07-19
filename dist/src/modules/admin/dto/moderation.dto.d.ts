import { ReportStatus } from '@prisma/client';
export declare const MODERATION_ACTIONS: readonly ["WARN", "SUSPEND_7D", "SUSPEND_30D", "BAN", "CLEAR"];
export declare class UpdateReportDto {
    status: ReportStatus;
    notes?: string;
}
export declare class ModerationActionDto {
    targetUserId: string;
    action: string;
    reason?: string;
    reportId?: string;
}
export declare class RejectPhotoDto {
    reason: string;
}
