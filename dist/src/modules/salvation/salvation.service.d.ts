import { PrismaService } from '../../prisma/prisma.service';
export declare class SalvationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProgress(userId: string): Promise<{
        steps: import("./salvation-steps").SalvationStep[];
        completedSteps: string[];
        startedAt: Date;
        completedAt: Date;
    }>;
    completeStep(userId: string, stepId: string): Promise<{
        completedSteps: import("@prisma/client/runtime/library").JsonValue;
        completedAt: Date;
    }>;
}
