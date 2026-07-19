import { ConfigService } from '@nestjs/config';
import { StorageProvider, UploadFileParams, UploadedFileResult } from './storage-provider.interface';
export declare class R2StorageProvider implements StorageProvider {
    private readonly config;
    private readonly logger;
    private readonly s3;
    private readonly bucket;
    private readonly publicUrl;
    constructor(config: ConfigService);
    uploadFile(params: UploadFileParams): Promise<UploadedFileResult>;
    deleteFile(storageKey: string): Promise<void>;
    getPublicUrl(storageKey: string): string;
    getFileBuffer(storageKey: string): Promise<Buffer>;
}
