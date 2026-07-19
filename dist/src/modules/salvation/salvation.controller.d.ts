import { SalvationService } from './salvation.service';
export declare class SalvationController {
    private readonly salvation;
    constructor(salvation: SalvationService);
    getProgress(user: {
        id: string;
    }): Promise<{
        steps: import("./salvation-steps").SalvationStep[];
        completedSteps: string[];
        startedAt: Date;
        completedAt: Date;
    }>;
    completeStep(user: {
        id: string;
    }, stepId: string): Promise<{
        completedSteps: import("@prisma/client/runtime/library").JsonValue;
        completedAt: Date;
    }>;
}
