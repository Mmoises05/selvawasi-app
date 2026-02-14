import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Route } from '@prisma/client';

@Injectable()
export class RoutesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.RouteCreateInput): Promise<Route> {
        return this.prisma.route.create({ data });
    }

    async findAll(): Promise<Route[]> {
        return this.prisma.route.findMany({
            include: {
                schedules: {
                    include: {
                        boat: {
                            include: {
                                operator: true
                            }
                        },
                        prices: true
                    }
                }
            }
        });
    }

    async findOne(id: string): Promise<Route | null> {
        return this.prisma.route.findUnique({ where: { id }, include: { schedules: true } });
    }

    async update(id: string, data: Prisma.RouteUpdateInput): Promise<Route> {
        return this.prisma.route.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Route> {
        return this.prisma.route.delete({ where: { id } });
    }
}
