import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { RsvpEventDto } from './dto/rsvp-event.dto';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        city: string;
        state: string;
        isOnline: boolean;
        startsAt: Date;
        endsAt: Date;
        imageUrl: string;
        status: import(".prisma/client").$Enums.EventStatus;
        isExternal: boolean;
        externalUrl: string;
        source: string;
        organizer: {
            userId: string;
            firstName: string;
        };
        goingCount: number;
        myRsvpStatus: string;
        isOrganizer: boolean;
    }[]>;
    getById(userId: string, eventId: string): Promise<{
        attendees: {
            userId: string;
            firstName: string;
            primaryPhotoUrl: string;
        }[];
        id: string;
        title: string;
        description: string;
        city: string;
        state: string;
        isOnline: boolean;
        startsAt: Date;
        endsAt: Date;
        imageUrl: string;
        status: import(".prisma/client").$Enums.EventStatus;
        isExternal: boolean;
        externalUrl: string;
        source: string;
        organizer: {
            userId: string;
            firstName: string;
        };
        goingCount: number;
        myRsvpStatus: string;
        isOrganizer: boolean;
    }>;
    create(userId: string, dto: CreateEventDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        state: string | null;
        description: string;
        title: string;
        isOnline: boolean;
        startsAt: Date;
        endsAt: Date | null;
        imageUrl: string | null;
        isExternal: boolean;
        externalUrl: string | null;
        source: string | null;
        organizerUserId: string;
    }>;
    cancel(userId: string, eventId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.EventStatus;
        createdAt: Date;
        updatedAt: Date;
        city: string | null;
        state: string | null;
        description: string;
        title: string;
        isOnline: boolean;
        startsAt: Date;
        endsAt: Date | null;
        imageUrl: string | null;
        isExternal: boolean;
        externalUrl: string | null;
        source: string | null;
        organizerUserId: string;
    }>;
    rsvp(userId: string, eventId: string, dto: RsvpEventDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RsvpStatus;
        createdAt: Date;
        userId: string;
        eventId: string;
    }>;
    cancelRsvp(userId: string, eventId: string): Promise<{
        message: string;
    }>;
    getMyEvents(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        city: string;
        state: string;
        isOnline: boolean;
        startsAt: Date;
        endsAt: Date;
        imageUrl: string;
        status: import(".prisma/client").$Enums.EventStatus;
        isExternal: boolean;
        externalUrl: string;
        source: string;
        organizer: {
            userId: string;
            firstName: string;
        };
        goingCount: number;
        myRsvpStatus: string;
        isOrganizer: boolean;
    }[]>;
    private serialize;
}
