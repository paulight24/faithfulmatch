import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AiChatClient } from './ai-client.interface';
import { StorageProvider } from '../../infrastructure/storage/storage-provider.interface';
import { UpdateAiMemoryDto } from './dto/update-ai-memory.dto';
export declare class AiService {
    private readonly prisma;
    private readonly ai;
    private readonly config;
    private readonly storage;
    private readonly logger;
    constructor(prisma: PrismaService, ai: AiChatClient, config: ConfigService, storage: StorageProvider);
    private assertEnabled;
    getMemory(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        communicationStyle: string | null;
        preferredTone: string | null;
        relationshipGoal: string | null;
        preferredMatchTraits: import("@prisma/client/runtime/library").JsonValue | null;
        avoidPatterns: import("@prisma/client/runtime/library").JsonValue | null;
        successfulPatterns: import("@prisma/client/runtime/library").JsonValue | null;
        coachNotes: string | null;
        isEnabled: boolean;
    } | {
        userId: string;
        communicationStyle: any;
        preferredTone: any;
        relationshipGoal: any;
        preferredMatchTraits: any[];
        avoidPatterns: any[];
        successfulPatterns: any[];
        coachNotes: any;
        isEnabled: true;
    }>;
    updateMemory(userId: string, dto: UpdateAiMemoryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        communicationStyle: string | null;
        preferredTone: string | null;
        relationshipGoal: string | null;
        preferredMatchTraits: import("@prisma/client/runtime/library").JsonValue | null;
        avoidPatterns: import("@prisma/client/runtime/library").JsonValue | null;
        successfulPatterns: import("@prisma/client/runtime/library").JsonValue | null;
        coachNotes: string | null;
        isEnabled: boolean;
    }>;
    suggestReply(userId: string, conversationId: string): Promise<Record<string, any>>;
    analyzeProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        profileScore: number;
        matchReadinessScore: number;
        strengths: import("@prisma/client/runtime/library").JsonValue;
        weaknesses: import("@prisma/client/runtime/library").JsonValue;
        suggestedBioNatural: string | null;
        suggestedBioPlayful: string | null;
        suggestedBioFaithBased: string | null;
        suggestedBioMarriageFocused: string | null;
    }>;
    getLatestProfileAnalysis(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        profileScore: number;
        matchReadinessScore: number;
        strengths: import("@prisma/client/runtime/library").JsonValue;
        weaknesses: import("@prisma/client/runtime/library").JsonValue;
        suggestedBioNatural: string | null;
        suggestedBioPlayful: string | null;
        suggestedBioFaithBased: string | null;
        suggestedBioMarriageFocused: string | null;
    }>;
    suggestOpener(userId: string, targetUserId: string): Promise<{
        openers: any;
    }>;
    analyzePhoto(userId: string, photoId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        strengths: import("@prisma/client/runtime/library").JsonValue;
        weaknesses: import("@prisma/client/runtime/library").JsonValue;
        photoId: string;
        overallScore: number;
        shouldUse: boolean;
        bestUse: string | null;
        improvementTips: import("@prisma/client/runtime/library").JsonValue;
    }>;
    moderatePhotoSafety(storageKey: string): Promise<{
        flagged: boolean;
        reason: string | null;
    }>;
    private describeProfile;
    private describeMemory;
    private isNonEmptyArray;
    private readPhotoAsDataUri;
    private parseJson;
    private clampScore;
    private logUsage;
}
