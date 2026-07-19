import { ConfigService } from '@nestjs/config';
import { EmailProvider, SendEmailParams } from './email-provider.interface';
export declare class NodemailerEmailProvider implements EmailProvider {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private getTransporter;
    sendEmail(params: SendEmailParams): Promise<void>;
}
