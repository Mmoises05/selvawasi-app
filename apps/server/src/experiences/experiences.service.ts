import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Experience } from '@prisma/client';

@Injectable()
export class ExperiencesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
        return this.prisma.experience.create({ data });
    }

    async findAll(): Promise<Experience[]> {
        return this.prisma.experience.findMany({ include: { operator: true } });
    }

    async findOne(id: string): Promise<Experience | null> {
        return this.prisma.experience.findUnique({
            where: { id },
            include: { operator: true }
        });
    }

    async update(id: string, data: Prisma.ExperienceUpdateInput): Promise<Experience> {
        return this.prisma.experience.update({ where: { id }, data });
    }

    async remove(id: string): Promise<Experience> {
        return this.prisma.experience.delete({ where: { id } });
    }
}
