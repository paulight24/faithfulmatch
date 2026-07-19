import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { RsvpEventDto } from './dto/rsvp-event.dto';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    list(user: {
        id: string;
    }): Promise<{
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
    getMyEvents(user: {
        id: string;
    }): Promise<{
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
    getById(user: {
        id: string;
    }, id: string): Promise<{
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
    create(user: {
        id: string;
    }, dto: CreateEventDto): Promise<{
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
    cancel(user: {
        id: string;
    }, id: string): Promise<{
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
    rsvp(user: {
        id: string;
    }, id: string, dto: RsvpEventDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RsvpStatus;
        createdAt: Date;
        userId: string;
        eventId: string;
    }>;
    cancelRsvp(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
