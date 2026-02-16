import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            // Do not throw, allow app to start for diagnostics
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
