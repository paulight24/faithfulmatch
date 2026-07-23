import { ConfigService } from '@nestjs/config';
import { StorageProvider, UploadFileParams, UploadedFileResult } from './storage-provider.interface';
export declare class LocalStorageProvider implements StorageProvider {
    private readonly config;
    private readonly logger;
    private readonly uploadDir;
    private readonly apiUrl;
    constructor(config: ConfigService);
    private ensureUploadDir;
    uploadFile(params: UploadFileParams): Promise<UploadedFileResult>;
    deleteFile(storageKey: string): Promise<void>;
    getPublicUrl(storageKey: string): string;
    getFileBuffer(storageKey: string): Promise<Buffer>;
}
