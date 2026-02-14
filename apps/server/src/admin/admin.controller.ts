import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(private prisma: PrismaService) { }

    @Get('stats')
    async getStats() {
        const usersCount = await this.prisma.user.count();
        const restaurantsCount = await this.prisma.restaurant.count();
        const boatsCount = await this.prisma.boat.count();
        // Count pending reservations across platforms (Restaurants for now)
        const pendingReservations = await this.prisma.restaurantReservation.count({
            where: { status: 'PENDING_APPROVAL' },
        });

        // Mock revenue for now, or calculate if we had payments
        const revenue = 12500;

        return {
            usersCount,
            restaurantsCount,
            boatsCount,
            pendingReservations,
            revenue
        };
    }

    @Get('activity')
    async getActivity() {
        // Fetch last 5 reservations
        const reservations = await this.prisma.restaurantReservation.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, restaurant: true },
        });

        // Fetch last 5 new users
        const newUsers = await this.prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        });

        // Combine and normalize
        const activities = [
            ...reservations.map(r => ({
                id: r.id,
                type: 'RESERVATION',
                message: `Nueva reserva para ${r.restaurant.name}`,
                user: r.user.fullName || r.user.email,
                date: r.createdAt,
            })),
            ...newUsers.map(u => ({
                id: u.id,
                type: 'USER',
                message: 'Nuevo usuario registrado',
                user: u.fullName || u.email,
                date: u.createdAt,
            }))
        ];

        // Sort by date desc and take top 5
        return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
    }
}
