import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createReservationDto: CreateReservationDto) {
        const { restaurantId, pax, requestedDate, operatorNote } = createReservationDto;

        // Check if restaurant exists
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
        });

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with ID ${restaurantId} not found`);
        }

        // Create reservation with PENDING_APPROVAL status
        return this.prisma.restaurantReservation.create({
            data: {
                userId,
                restaurantId,
                pax,
                requestedDate: new Date(requestedDate),
                operatorNote,
                status: 'PENDING_APPROVAL',
            },
        });
    }

    async findAll(restaurantId?: string) {
        // If restaurantId is provided (e.g., for specific operator dashboard)
        if (restaurantId) {
            return this.prisma.restaurantReservation.findMany({
                where: { restaurantId },
                include: { user: true, restaurant: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        // Admin view (all)
        return this.prisma.restaurantReservation.findMany({
            include: { user: true, restaurant: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, status: 'CONFIRMED' | 'REJECTED') {
        const reservation = await this.prisma.restaurantReservation.findUnique({
            where: { id },
        });

        if (!reservation) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }

        return this.prisma.restaurantReservation.update({
            where: { id },
            data: { status },
        });
    }
}
