export interface SendSmsParams {
    to: string;
    message: string;
}
export interface SmsProvider {
    sendSms(params: SendSmsParams): Promise<void>;
}
export declare const SMS_PROVIDER: unique symbol;
