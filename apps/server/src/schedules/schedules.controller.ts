import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Prisma } from '@prisma/client';

@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) { }

    @Post()
    create(@Body() createScheduleDto: Prisma.ScheduleCreateInput) {
        return this.schedulesService.create(createScheduleDto);
    }

    @Get()
    findAll() {
        return this.schedulesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.schedulesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateScheduleDto: Prisma.ScheduleUpdateInput) {
        return this.schedulesService.update(id, updateScheduleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.schedulesService.remove(id);
    }
}
