import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service'; // Import UsersService
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService // Inject UsersService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() signInDto: Record<string, any>) {
        const user = await this.authService.validateUser(signInDto.email, signInDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: Prisma.UserCreateInput) {
        console.log("REGISTRO API BODY:", createUserDto); // PASO 2: Debug Log

        // Ensure mapping if needed (though client does it mostly)
        // Check if name is present
        if (!createUserDto.email || !createUserDto.password) {
            throw new Error("Datos incompletos");
        }

        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req: any) {
        // Fetch full user data including fullName
        const user = await this.usersService.findOne(req.user.email);
        if (user) {
            const { password, ...result } = user;
            return {
                ...result,
                name: result.fullName || 'Usuario' // Map for frontend convenience
            };
        }
        return req.user;
    }
}
