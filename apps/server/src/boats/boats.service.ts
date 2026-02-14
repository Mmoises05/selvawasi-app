import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Boat } from '@prisma/client';

@Injectable()
export class BoatsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.BoatCreateInput): Promise<Boat> {
        return this.prisma.boat.create({ data });
    }

    async findAll(): Promise<Boat[]> {
        return this.prisma.boat.findMany({ include: { operator: true } });
    }

    async findOne(id: string): Promise<Boat | null> {
        return this.prisma.boat.findUnique({
            where: { id },
            include: {
                operator: true,
                schedules: {
                    include: {
                        route: true,
                        prices: true
                    }
                }
            }
        });
    }

    async update(id: string, data: Prisma.BoatUpdateInput): Promise<Boat> {
        return this.prisma.boat.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Boat> {
        return this.prisma.boat.delete({ where: { id } });
    }
}
