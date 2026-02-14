import { Controller, Put, Body, UseGuards, Request, Get, Param, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req: any, @Body() data: { name: string }) {
        // We only allow updating name for now
        const updatedUser = await this.usersService.update(req.user.email, {
            fullName: data.name
        });

        const { password, ...result } = updatedUser;
        return {
            ...result,
            name: result.fullName // Return mapped for client
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any) {
        // Strict Role Check against DB
        const currentUser = await this.usersService.findOne(req.user.email);

        if (!currentUser || currentUser.role !== 'ADMIN') {
            throw new ForbiddenException("Acceso denegado. Se requieren permisos de Administrador.");
        }
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/role')
    async updateRole(@Request() req: any, @Body() body: { role: string }, @Param('id') id: string) {
        // Strict Role Check against DB
        const currentUser = await this.usersService.findOne(req.user.email);

        if (!currentUser || currentUser.role !== 'ADMIN') {
            throw new ForbiddenException("Acceso denegado. Se requieren permisos de Administrador.");
        }
        return this.usersService.updateById(id, { role: body.role });
    }
}
