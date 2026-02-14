import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Prisma } from '@prisma/client';

@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Post()
    create(@Body() createRouteDto: Prisma.RouteCreateInput) {
        return this.routesService.create(createRouteDto);
    }

    @Get()
    findAll() {
        return this.routesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.routesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRouteDto: Prisma.RouteUpdateInput) {
        return this.routesService.update(id, updateRouteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.routesService.remove(id);
    }
}
