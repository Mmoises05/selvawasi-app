import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Schedule } from '@prisma/client';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ScheduleCreateInput): Promise<Schedule> {
        return this.prisma.schedule.create({ data });
    }

    async findAll(): Promise<Schedule[]> {
        return this.prisma.schedule.findMany({
            include: { boat: true, route: true, prices: true }
        });
    }

    async findOne(id: string): Promise<Schedule | null> {
        return this.prisma.schedule.findUnique({
            where: { id },
            include: { boat: true, route: true, prices: true, bookings: true }
        });
    }

    async update(id: string, data: Prisma.ScheduleUpdateInput): Promise<Schedule> {
        return this.prisma.schedule.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Schedule> {
        return this.prisma.schedule.delete({ where: { id } });
    }
}
