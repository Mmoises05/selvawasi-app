import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Get()
    findAll() {
        return this.restaurantsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createRestaurantDto: Prisma.RestaurantCreateInput, @Request() req: any) {
        if (req.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }
        return this.restaurantsService.create(createRestaurantDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.restaurantsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRestaurantDto: Prisma.RestaurantUpdateInput) {
        return this.restaurantsService.update(id, updateRestaurantDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.restaurantsService.remove(id);
    }
}
