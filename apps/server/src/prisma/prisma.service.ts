import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // Attempt connection asynchronously to avoid blocking startup
        this.$connect()
            .then(() => console.log('Database connected successfully'))
            .catch((error) => console.error('Failed to connect to database:', error));
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
