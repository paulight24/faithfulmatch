export interface RequestUser {
    id: string;
    email: string;
    role: string;
    status: string;
    emailVerifiedAt: Date | null;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
