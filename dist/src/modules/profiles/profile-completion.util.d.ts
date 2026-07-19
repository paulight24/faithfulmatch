import { Profile } from '@prisma/client';
export interface CompletionResult {
    percent: number;
    missing: string[];
}
export declare function calculateProfileCompletion(profile: Partial<Profile>, approvedPhotoCount: number): CompletionResult;
export declare const DISCOVERABLE_COMPLETION_THRESHOLD = 80;
