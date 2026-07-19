import { PrismaService } from '../../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';
import { CreateBlockDto } from './dto/block.dto';
export declare class SafetyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createReport(reporterUserId: string, dto: CreateReportDto): Promise<{
        message: string;
    }>;
    blockUser(blockerUserId: string, dto: CreateBlockDto): Promise<{
        message: string;
    }>;
    unblockUser(blockerUserId: string, blockedUserId: string): Promise<{
        message: string;
    }>;
    getMyBlocks(userId: string): Promise<{
        blockedUserId: string;
        blockedAt: Date;
        reason: string;
        firstName: string;
        displayName: string;
    }[]>;
}
