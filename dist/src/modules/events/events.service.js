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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(userId) {
        const events = await this.prisma.event.findMany({
            where: { status: client_1.EventStatus.UPCOMING, startsAt: { gte: new Date() } },
            orderBy: { startsAt: 'asc' },
            include: {
                organizer: { select: { id: true, profile: { select: { firstName: true } } } },
                rsvps: { select: { userId: true, status: true } },
            },
        });
        return events.map((e) => this.serialize(e, userId));
    }
    async getById(userId, eventId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                organizer: { select: { id: true, profile: { select: { firstName: true } } } },
                rsvps: {
                    where: { status: 'GOING' },
                    select: {
                        userId: true,
                        status: true,
                        user: { select: { profile: { select: { firstName: true } }, profilePhotos: { where: { isPrimary: true }, take: 1, select: { url: true } } } },
                    },
                },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found.');
        return {
            ...this.serialize(event, userId),
            attendees: event.rsvps.map((r) => ({
                userId: r.userId,
                firstName: r.user.profile?.firstName ?? null,
                primaryPhotoUrl: r.user.profilePhotos[0]?.url ?? null,
            })),
        };
    }
    async create(userId, dto) {
        const event = await this.prisma.event.create({
            data: {
                title: dto.title,
                description: dto.description,
                organizerUserId: userId,
                city: dto.city,
                state: dto.state,
                isOnline: dto.isOnline ?? false,
                startsAt: new Date(dto.startsAt),
                endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
                imageUrl: dto.imageUrl,
            },
        });
        await this.prisma.eventRSVP.create({
            data: { eventId: event.id, userId, status: 'GOING' },
        });
        return event;
    }
    async cancel(userId, eventId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Event not found.');
        if (event.organizerUserId !== userId)
            throw new common_1.ForbiddenException('Only the organizer can cancel this event.');
        return this.prisma.event.update({
            where: { id: eventId },
            data: { status: client_1.EventStatus.CANCELLED },
        });
    }
    async rsvp(userId, eventId, dto) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Event not found.');
        if (event.isExternal) {
            throw new common_1.ForbiddenException('This event is hosted externally — RSVP on the original listing.');
        }
        return this.prisma.eventRSVP.upsert({
            where: { eventId_userId: { eventId, userId } },
            update: { status: dto.status },
            create: { eventId, userId, status: dto.status },
        });
    }
    async cancelRsvp(userId, eventId) {
        await this.prisma.eventRSVP.deleteMany({ where: { eventId, userId } });
        return { message: 'RSVP cancelled.' };
    }
    async getMyEvents(userId) {
        const rsvps = await this.prisma.eventRSVP.findMany({
            where: { userId, status: { in: ['GOING', 'INTERESTED'] } },
            include: {
                event: {
                    include: {
                        organizer: { select: { id: true, profile: { select: { firstName: true } } } },
                        rsvps: { select: { userId: true, status: true } },
                    },
                },
            },
            orderBy: { event: { startsAt: 'asc' } },
        });
        return rsvps
            .filter((r) => r.event.status === client_1.EventStatus.UPCOMING)
            .map((r) => this.serialize(r.event, userId));
    }
    serialize(event, userId) {
        const goingCount = event.rsvps.filter((r) => r.status === 'GOING').length;
        const myRsvp = event.rsvps.find((r) => r.userId === userId);
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            city: event.city,
            state: event.state,
            isOnline: event.isOnline,
            startsAt: event.startsAt,
            endsAt: event.endsAt,
            imageUrl: event.imageUrl,
            status: event.status,
            isExternal: event.isExternal,
            externalUrl: event.externalUrl,
            source: event.source,
            organizer: {
                userId: event.organizer.id,
                firstName: event.organizer.profile?.firstName ?? null,
            },
            goingCount,
            myRsvpStatus: myRsvp?.status ?? null,
            isOrganizer: event.organizerUserId === userId,
        };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map