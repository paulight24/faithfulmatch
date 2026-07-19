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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const path = require("path");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_client_interface_1 = require("./ai-client.interface");
const storage_provider_interface_1 = require("../../infrastructure/storage/storage-provider.interface");
const MESSAGE_HISTORY_LIMIT = 50;
let AiService = AiService_1 = class AiService {
    constructor(prisma, ai, config, storage) {
        this.prisma = prisma;
        this.ai = ai;
        this.config = config;
        this.storage = storage;
        this.logger = new common_1.Logger(AiService_1.name);
    }
    assertEnabled() {
        if (!this.ai.isEnabled()) {
            throw new common_1.ServiceUnavailableException('AI features are currently disabled.');
        }
    }
    async getMemory(userId) {
        const memory = await this.prisma.userAIMemory.findUnique({ where: { userId } });
        return (memory ?? {
            userId,
            communicationStyle: null,
            preferredTone: null,
            relationshipGoal: null,
            preferredMatchTraits: [],
            avoidPatterns: [],
            successfulPatterns: [],
            coachNotes: null,
            isEnabled: true,
        });
    }
    async updateMemory(userId, dto) {
        return this.prisma.userAIMemory.upsert({
            where: { userId },
            update: { ...dto },
            create: { userId, ...dto },
        });
    }
    async suggestReply(userId, conversationId) {
        this.assertEnabled();
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                match: {
                    select: {
                        userAId: true,
                        userBId: true,
                        status: true,
                        userA: { select: { profile: true } },
                        userB: { select: { profile: true } },
                    },
                },
            },
        });
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found.');
        const { userAId, userBId, status, userA, userB } = conversation.match;
        if (userId !== userAId && userId !== userBId) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        if (status !== client_1.MatchStatus.ACTIVE) {
            throw new common_1.BadRequestException('This conversation is no longer active.');
        }
        const myProfile = userId === userAId ? userA.profile : userB.profile;
        const matchProfile = userId === userAId ? userB.profile : userA.profile;
        const messages = await this.prisma.message.findMany({
            where: { conversationId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: MESSAGE_HISTORY_LIMIT,
            select: { senderUserId: true, content: true },
        });
        const history = messages
            .reverse()
            .map((m) => `${m.senderUserId === userId ? 'Me' : 'Match'}: ${m.content}`)
            .join('\n');
        const memory = await this.prisma.userAIMemory.findUnique({ where: { userId } });
        const systemPrompt = 'You are a respectful, faith-centered dating coach for a Christian dating app called FaithfulMatch. ' +
            'You help users write kind, genuine, non-manipulative messages. Never suggest anything sexual, ' +
            'deceptive, or pressuring. Read the full profiles and the entire conversation below carefully — ' +
            'reference specific things each person said or shared, rather than generic advice. ' +
            'Respond ONLY with valid JSON matching this shape: ' +
            '{"recommendedReply": string, "playfulReply": string, "faithWarmReply": string, ' +
            '"deeperQuestionReply": string, "whatTheyMayBeThinking": string, "nextBestMove": string, ' +
            '"conversationHealthScore": number (0-100), "warnings": string[]}.';
        const userPrompt = [
            `MY PROFILE:\n${this.describeProfile(myProfile)}`,
            `MATCH'S PROFILE:\n${this.describeProfile(matchProfile)}`,
            memory ? `WHAT I'VE LEARNED ABOUT MYSELF SO FAR:\n${this.describeMemory(memory)}` : '',
            `FULL CONVERSATION (oldest first, ${messages.length} messages):`,
            history || '(no messages yet — this will be the opening message)',
            'Study both profiles and the whole conversation above, then suggest my next message ' +
                'and analyze how the conversation is going.',
        ]
            .filter(Boolean)
            .join('\n\n');
        const result = await this.ai.completeText(systemPrompt, userPrompt);
        const parsed = this.parseJson(result.content);
        await this.logUsage(userId, 'reply_suggestion', result.tokensUsed);
        return parsed;
    }
    async analyzeProfile(userId) {
        this.assertEnabled();
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.NotFoundException('Complete your profile first.');
        const systemPrompt = 'You are a warm, encouraging Christian dating profile coach. Give constructive, specific feedback. ' +
            'Never body-shame or use harsh language. Respond ONLY with valid JSON matching this shape: ' +
            '{"profileScore": number (0-100), "matchReadinessScore": number (0-100), "strengths": string[], ' +
            '"weaknesses": string[], "suggestedBioNatural": string, "suggestedBioPlayful": string, ' +
            '"suggestedBioFaithBased": string, "suggestedBioMarriageFocused": string}. ' +
            'Each suggested bio should be under 300 characters.';
        const userPrompt = [
            `Name: ${profile.firstName ?? 'unknown'}`,
            `Denomination: ${profile.denomination ?? 'unspecified'}`,
            `Church involvement: ${profile.churchInvolvement ?? 'unspecified'}`,
            `Faith level: ${profile.faithLevel ?? 'unspecified'}`,
            `Marriage intent: ${profile.marriageIntent ?? 'unspecified'}`,
            `Occupation: ${profile.occupation ?? 'unspecified'}`,
            `Current bio: ${profile.bio ?? '(empty)'}`,
            'Review this dating profile and suggest improved bios in four styles.',
        ].join('\n');
        const result = await this.ai.completeText(systemPrompt, userPrompt);
        const parsed = this.parseJson(result.content);
        await this.logUsage(userId, 'profile_review', result.tokensUsed);
        const saved = await this.prisma.profileAnalysis.create({
            data: {
                userId,
                profileScore: this.clampScore(parsed.profileScore),
                matchReadinessScore: this.clampScore(parsed.matchReadinessScore),
                strengths: parsed.strengths ?? [],
                weaknesses: parsed.weaknesses ?? [],
                suggestedBioNatural: parsed.suggestedBioNatural ?? null,
                suggestedBioPlayful: parsed.suggestedBioPlayful ?? null,
                suggestedBioFaithBased: parsed.suggestedBioFaithBased ?? null,
                suggestedBioMarriageFocused: parsed.suggestedBioMarriageFocused ?? null,
            },
        });
        return saved;
    }
    async getLatestProfileAnalysis(userId) {
        return this.prisma.profileAnalysis.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async suggestOpener(userId, targetUserId) {
        this.assertEnabled();
        const [myProfile, targetProfile] = await Promise.all([
            this.prisma.profile.findUnique({ where: { userId } }),
            this.prisma.profile.findUnique({ where: { userId: targetUserId } }),
        ]);
        if (!myProfile)
            throw new common_1.NotFoundException('Complete your profile first.');
        if (!targetProfile)
            throw new common_1.NotFoundException('Target profile not found.');
        const memory = await this.prisma.userAIMemory.findUnique({ where: { userId } });
        const systemPrompt = 'You are a warm, faith-centered dating coach for FaithfulMatch, a Christian dating app. ' +
            'Suggest three short, genuine opening messages (under 200 chars each) that reference something ' +
            'specific from the match\'s profile. Never suggest anything sexual, manipulative, or generic. ' +
            'Be warm, creative, and faith-aware. ' +
            'Respond ONLY with valid JSON: {"openers": [string, string, string]}.';
        const userPrompt = [
            `MY PROFILE:\n${this.describeProfile(myProfile)}`,
            `THEIR PROFILE:\n${this.describeProfile(targetProfile)}`,
            memory ? `MY COMMUNICATION STYLE:\n${this.describeMemory(memory)}` : '',
            'Suggest three opening messages I could send to start a conversation with this person.',
        ]
            .filter(Boolean)
            .join('\n\n');
        const result = await this.ai.completeText(systemPrompt, userPrompt);
        const parsed = this.parseJson(result.content);
        await this.logUsage(userId, 'opener_suggestion', result.tokensUsed);
        return { openers: parsed.openers ?? [] };
    }
    async analyzePhoto(userId, photoId) {
        this.assertEnabled();
        const photo = await this.prisma.profilePhoto.findUnique({ where: { id: photoId } });
        if (!photo)
            throw new common_1.NotFoundException('Photo not found.');
        if (photo.userId !== userId)
            throw new common_1.ForbiddenException('Access denied.');
        const dataUri = await this.readPhotoAsDataUri(photo.storageKey);
        const systemPrompt = 'You are a photography coach for a Christian dating app. Assess how well this photo works as a ' +
            'dating profile photo: is the face clearly visible, is lighting good, does it feel warm and approachable. ' +
            'Never comment on body shape or attractiveness in a demeaning way; focus on photo quality and presentation. ' +
            'Respond ONLY with valid JSON matching this shape: {"overallScore": number (0-100), "shouldUse": boolean, ' +
            '"bestUse": string, "strengths": string[], "weaknesses": string[], "improvementTips": string[]}.';
        const result = await this.ai.completeVision(systemPrompt, 'Analyze this dating profile photo.', dataUri);
        const parsed = this.parseJson(result.content);
        await this.logUsage(userId, 'photo_review', result.tokensUsed);
        const saved = await this.prisma.photoAnalysis.create({
            data: {
                userId,
                photoId,
                overallScore: this.clampScore(parsed.overallScore),
                shouldUse: parsed.shouldUse ?? true,
                bestUse: parsed.bestUse ?? null,
                strengths: parsed.strengths ?? [],
                weaknesses: parsed.weaknesses ?? [],
                improvementTips: parsed.improvementTips ?? [],
            },
        });
        return saved;
    }
    async moderatePhotoSafety(storageKey) {
        if (!this.ai.isEnabled())
            return { flagged: false, reason: null };
        try {
            const dataUri = await this.readPhotoAsDataUri(storageKey);
            const systemPrompt = 'You are a content-safety filter for a dating app profile photo upload. Look ONLY for: nudity, ' +
                'sexually explicit content, graphic violence, or a photo that does not contain a real, visible person ' +
                '(e.g. pure text, a screenshot, a blank/corrupt image). Do not judge attractiveness, photo quality, or ' +
                'anything else. Respond ONLY with valid JSON: {"flagged": boolean, "reason": string | null} — reason ' +
                'should be a short, specific explanation only when flagged is true.';
            const result = await this.ai.completeVision(systemPrompt, 'Check this photo for the safety issues above.', dataUri);
            const parsed = this.parseJson(result.content);
            return { flagged: !!parsed.flagged, reason: parsed.reason ?? null };
        }
        catch (err) {
            this.logger.warn(`Photo safety pre-screen failed, defaulting to not-flagged: ${err.message}`);
            return { flagged: false, reason: null };
        }
    }
    describeProfile(profile) {
        if (!profile)
            return 'unknown';
        const age = profile.birthday
            ? Math.floor((Date.now() - profile.birthday.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
            : null;
        return [
            `Name: ${profile.firstName ?? 'unknown'}${age ? ` (${age})` : ''}`,
            `Location: ${[profile.city, profile.state].filter(Boolean).join(', ') || 'unspecified'}`,
            `Denomination: ${profile.denomination ?? 'unspecified'}`,
            `Church involvement: ${profile.churchInvolvement ?? 'unspecified'}`,
            `Faith level: ${profile.faithLevel ?? 'unspecified'}`,
            `Marriage intent: ${profile.marriageIntent ?? 'unspecified'}`,
            `Occupation: ${profile.occupation ?? 'unspecified'}`,
            `Bio: ${profile.bio ?? '(none written)'}`,
        ].join('\n');
    }
    describeMemory(memory) {
        const lines = [];
        if (memory.preferredTone)
            lines.push(`Preferred tone: ${memory.preferredTone}`);
        if (memory.communicationStyle)
            lines.push(`Communication style: ${memory.communicationStyle}`);
        if (memory.relationshipGoal)
            lines.push(`Relationship goal: ${memory.relationshipGoal}`);
        if (this.isNonEmptyArray(memory.preferredMatchTraits)) {
            lines.push(`Traits I've responded well to: ${memory.preferredMatchTraits.join(', ')}`);
        }
        if (this.isNonEmptyArray(memory.successfulPatterns)) {
            lines.push(`What has worked before: ${memory.successfulPatterns.join('; ')}`);
        }
        if (this.isNonEmptyArray(memory.avoidPatterns)) {
            lines.push(`What to avoid: ${memory.avoidPatterns.join('; ')}`);
        }
        if (memory.coachNotes)
            lines.push(`Coach notes: ${memory.coachNotes}`);
        return lines.join('\n') || '(no learned preferences yet)';
    }
    isNonEmptyArray(value) {
        return Array.isArray(value) && value.length > 0;
    }
    async readPhotoAsDataUri(storageKey) {
        const buffer = await this.storage.getFileBuffer(storageKey);
        const ext = path.extname(storageKey).replace('.', '').toLowerCase();
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        return `data:${mime};base64,${buffer.toString('base64')}`;
    }
    parseJson(content) {
        try {
            return JSON.parse(content);
        }
        catch {
            this.logger.error(`Unparseable AI response (${content.length} chars): ${content.slice(0, 1000)}`);
            throw new common_1.ServiceUnavailableException('AI provider returned an unparseable response.');
        }
    }
    clampScore(value) {
        const n = typeof value === 'number' ? value : parseInt(String(value), 10);
        if (Number.isNaN(n))
            return 0;
        return Math.max(0, Math.min(100, Math.round(n)));
    }
    async logUsage(userId, feature, tokensUsed) {
        await this.prisma.aICopilotUsage.create({
            data: { userId, feature, tokensUsed: tokensUsed ?? undefined },
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(ai_client_interface_1.AI_CHAT_CLIENT)),
    __param(3, (0, common_1.Inject)(storage_provider_interface_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, config_1.ConfigService, Object])
], AiService);
//# sourceMappingURL=ai.service.js.map