export interface UploadFileParams {
    userId: string;
    file: Express.Multer.File;
}
export interface UploadedFileResult {
    storageKey: string;
    publicUrl: string;
    mimeType: string;
    sizeBytes: number;
}
export interface StorageProvider {
    uploadFile(params: UploadFileParams): Promise<UploadedFileResult>;
    deleteFile(storageKey: string): Promise<void>;
    getPublicUrl(storageKey: string): string;
    getFileBuffer(storageKey: string): Promise<Buffer>;
}
export declare const STORAGE_PROVIDER: unique symbol;
