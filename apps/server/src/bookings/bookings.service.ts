import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.BookingCreateInput): Promise<Booking> {
        console.log("BookingService.create called with:", JSON.stringify(data, null, 2));

        const scheduleId = data.schedule?.connect?.id;
        const experienceId = data.experience?.connect?.id;

        if (!scheduleId && !experienceId) {
            throw new Error("Schedule ID or Experience ID is required");
        }

        let assignedSeat = undefined;

        // Logic for BOAT Schedules
        if (scheduleId) {
            const schedule = await this.prisma.schedule.findUnique({
                where: { id: scheduleId },
                include: { boat: true, bookings: true }
            });

            if (!schedule) throw new Error("Horario no encontrado");

            const occupiedSeats = schedule.bookings.filter(b => b.status === 'CONFIRMED').length;
            if (occupiedSeats >= schedule.boat.capacity) {
                throw new Error("Esta salida ya no tiene asientos disponibles.");
            }
            assignedSeat = `${occupiedSeats + 1}`;
        }

        // Logic for EXPERIENCES (Capacity check skipped for now, or could check Experience limit)
        if (experienceId) {
            const experience = await this.prisma.experience.findUnique({ where: { id: experienceId } });
            if (!experience) throw new Error("Experiencia no encontrada");
            // No seat numbering for experiences yet
        }

        return this.prisma.booking.create({
            data: {
                schedule: scheduleId ? data.schedule : undefined,
                experience: experienceId ? data.experience : undefined,
                user: data.user,
                totalPrice: data.totalPrice,
                status: 'CONFIRMED',
                seatNumber: assignedSeat,
                passengerName: data.passengerName,
                passengerDocType: data.passengerDocType,
                passengerDocNumber: data.passengerDocNumber
            }
        });
    }

    async findAll(): Promise<Booking[]> {
        return this.prisma.booking.findMany({
            include: {
                user: true,
                schedule: {
                    include: {
                        boat: true,
                        route: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string): Promise<Booking | null> {
        return this.prisma.booking.findUnique({
            where: { id },
            include: { user: true, schedule: true }
        });
    }

    async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
        return this.prisma.booking.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Booking> {
        return this.prisma.booking.delete({ where: { id } });
    }
}
