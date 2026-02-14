import { Module } from '@nestjs/common';
import { BoatsService } from './boats.service';
import { BoatsController } from './boats.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BoatsController],
    providers: [BoatsService],
    exports: [BoatsService],
})
export class BoatsModule { }
