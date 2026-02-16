
import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('debug')
export class DebugController {
    private readonly logger = new Logger(DebugController.name);

    constructor(private prisma: PrismaService) { }

    @Get('seed')
    async seed() {
        this.logger.log('Starting execution of CENTRALIZED seed...');
        try {
            // 1. Clean Database (Remove duplication/zombies)
            await cleanDatabase(this.prisma);

            // 2. Seed Database (Fresh start)
            await seedDatabase(this.prisma);

            return { success: true, message: 'Database cleaned and seeded successfully (Single Source of Truth)' };
        } catch (error) {
            this.logger.error(error);
            return { success: false, error: error.message };
        }
    }
}
