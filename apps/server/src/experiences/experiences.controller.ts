import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any, @Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
        // SQLite Compatibility: Serialize images array
        const data = {
            ...body,
            images: Array.isArray(body.images) ? JSON.stringify(body.images) : body.images
        };
        return this.experiencesService.create(data);
    }

    @Get()
    findAll() {
        return this.experiencesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.experiencesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExperienceDto: Prisma.ExperienceUpdateInput) {
        return this.experiencesService.update(id, updateExperienceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.experiencesService.remove(id);
    }
}
