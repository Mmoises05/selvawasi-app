import { Controller, Post, Body, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req: any, @Body() createReservationDto: CreateReservationDto) {
        const userId = req.user.userId;
        return this.reservationsService.create(userId, createReservationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.reservationsService.findAll();
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: 'CONFIRMED' | 'REJECTED'
    ) {
        return this.reservationsService.updateStatus(id, status);
    }
    @UseGuards(JwtAuthGuard)
    @Get('my-reservations')
    findMyReservations(@Request() req: any) {
        return this.reservationsService.findAllByUser(req.user.userId);
    }
}
