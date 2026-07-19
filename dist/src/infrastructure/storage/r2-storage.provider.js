"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var R2StorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2StorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const path = require("path");
let R2StorageProvider = R2StorageProvider_1 = class R2StorageProvider {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(R2StorageProvider_1.name);
        this.bucket = this.config.getOrThrow('r2.bucket');
        this.publicUrl = this.config.get('r2.publicUrl') ?? '';
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: this.config.getOrThrow('r2.endpoint'),
            credentials: {
                accessKeyId: this.config.getOrThrow('r2.accessKeyId'),
                secretAccessKey: this.config.getOrThrow('r2.secretAccessKey'),
            },
        });
        this.logger.log(`R2 storage configured — bucket: ${this.bucket}`);
    }
    async uploadFile(params) {
        const { userId, file } = params;
        const ext = path.extname(file.originalname).toLowerCase();
        const storageKey = `profiles/${userId}/${(0, uuid_1.v4)()}${ext}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: storageKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        this.logger.log(`Uploaded to R2: ${storageKey}`);
        return {
            storageKey,
            publicUrl: this.getPublicUrl(storageKey),
            mimeType: file.mimetype,
            sizeBytes: file.size,
        };
    }
    async deleteFile(storageKey) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: storageKey,
        }));
        this.logger.log(`Deleted from R2: ${storageKey}`);
    }
    getPublicUrl(storageKey) {
        if (this.publicUrl) {
            return `${this.publicUrl}/${storageKey}`;
        }
        return `/api/v1/uploads/${storageKey}`;
    }
    async getFileBuffer(storageKey) {
        const response = await this.s3.send(new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: storageKey,
        }));
        return Buffer.from(await response.Body.transformToByteArray());
    }
};
exports.R2StorageProvider = R2StorageProvider;
exports.R2StorageProvider = R2StorageProvider = R2StorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], R2StorageProvider);
//# sourceMappingURL=r2-storage.provider.js.map