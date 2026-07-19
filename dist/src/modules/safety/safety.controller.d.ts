import { SafetyService } from './safety.service';
import { CreateReportDto } from './dto/report.dto';
import { CreateBlockDto } from './dto/block.dto';
import { RequestUser } from '../../common/decorators/current-user.decorator';
export declare class SafetyController {
    private readonly safety;
    constructor(safety: SafetyService);
    report(user: RequestUser, dto: CreateReportDto): Promise<{
        message: string;
    }>;
    block(user: RequestUser, dto: CreateBlockDto): Promise<{
        message: string;
    }>;
    unblock(user: RequestUser, blockedUserId: string): Promise<{
        message: string;
    }>;
    myBlocks(user: RequestUser): Promise<{
        blockedUserId: string;
        blockedAt: Date;
        reason: string;
        firstName: string;
        displayName: string;
    }[]>;
}
