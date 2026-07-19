export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface EmailProvider {
    sendEmail(params: SendEmailParams): Promise<void>;
}
export declare const EMAIL_PROVIDER: unique symbol;
