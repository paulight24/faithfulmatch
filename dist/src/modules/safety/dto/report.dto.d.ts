export declare const REPORT_REASONS: readonly ["INAPPROPRIATE_PHOTOS", "FAKE_PROFILE", "HARASSMENT", "SPAM", "UNDERAGE", "HATE_SPEECH", "SCAM", "OTHER"];
export declare class CreateReportDto {
    reportedUserId: string;
    reason: string;
    details?: string;
    messageId?: string;
}
