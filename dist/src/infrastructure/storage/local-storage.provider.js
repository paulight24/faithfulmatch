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
var LocalStorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let LocalStorageProvider = LocalStorageProvider_1 = class LocalStorageProvider {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(LocalStorageProvider_1.name);
        this.uploadDir = path.resolve(this.config.get('storage.uploadDir') ?? 'uploads');
        this.apiUrl = this.config.get('apiUrl') ?? '';
        this.ensureUploadDir();
    }
    ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Created upload directory: ${this.uploadDir}`);
        }
    }
    async uploadFile(params) {
        const { userId, file } = params;
        const ext = path.extname(file.originalname).toLowerCase();
        const storageKey = `profiles/${userId}/${(0, uuid_1.v4)()}${ext}`;
        const destPath = path.join(this.uploadDir, storageKey);
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(destPath, file.buffer);
        this.logger.log(`Stored file: ${storageKey}`);
        return {
            storageKey,
            publicUrl: this.getPublicUrl(storageKey),
            mimeType: file.mimetype,
            sizeBytes: file.size,
        };
    }
    async deleteFile(storageKey) {
        const filePath = path.join(this.uploadDir, storageKey);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            this.logger.log(`Deleted file: ${storageKey}`);
        }
    }
    getPublicUrl(storageKey) {
        return `${this.apiUrl}/uploads/${storageKey}`;
    }
    async getFileBuffer(storageKey) {
        const filePath = path.join(this.uploadDir, storageKey);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${storageKey}`);
        }
        return fs.readFileSync(filePath);
    }
};
exports.LocalStorageProvider = LocalStorageProvider;
exports.LocalStorageProvider = LocalStorageProvider = LocalStorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageProvider);
//# sourceMappingURL=local-storage.provider.js.map