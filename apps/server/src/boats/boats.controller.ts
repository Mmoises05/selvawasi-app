import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoatsService } from './boats.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming we'll create this or use AuthGuard('jwt')

@Controller('boats')
export class BoatsController {
    constructor(private readonly boatsService: BoatsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any, @Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
        // SQLite Compatibility: Serialize features
        const data = {
            ...body,
            features: typeof body.features === 'object' ? JSON.stringify(body.features) : body.features
        };
        return this.boatsService.create(data);
    }

    @Get()
    findAll() {
        return this.boatsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.boatsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBoatDto: Prisma.BoatUpdateInput) {
        return this.boatsService.update(id, updateBoatDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.boatsService.remove(id);
    }
}
