import { AiService } from './ai.service';
import { UpdateAiMemoryDto } from './dto/update-ai-memory.dto';
import { SuggestReplyDto } from './dto/suggest-reply.dto';
import { AnalyzePhotoDto } from './dto/analyze-photo.dto';
import { SuggestOpenerDto } from './dto/suggest-opener.dto';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    getMemory(user: {
        id: string;
    }): Promise<{
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
    updateMemory(user: {
        id: string;
    }, dto: UpdateAiMemoryDto): Promise<{
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
    suggestReply(user: {
        id: string;
    }, dto: SuggestReplyDto): Promise<Record<string, any>>;
    suggestOpener(user: {
        id: string;
    }, dto: SuggestOpenerDto): Promise<{
        openers: any;
    }>;
    analyzeProfile(user: {
        id: string;
    }): Promise<{
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
    getLatestProfileAnalysis(user: {
        id: string;
    }): Promise<{
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
    analyzePhoto(user: {
        id: string;
    }, dto: AnalyzePhotoDto): Promise<{
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
}
